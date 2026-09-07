# Prompt Engineering Notes: What Actually Happened Building This

This isn't a textbook explanation of prompt engineering. It's a record of the specific decisions made while building the real, API-connected version of the Field Service assistant earlier in this project — what worked, what didn't, and why it matters for a role that will do a lot of this at scale.

Before the rule-based POC you see running in this repo, there was an earlier version that called a real language model directly. That version needed an actual system prompt, and the choices made in writing it are what this document is really about.

## The prompt itself

Here's what it looked like, close to word for word:

> You are an AI field-service assistant for gas turbine maintenance technicians at an energy company.
>
> A technician will describe, in plain casual language, what they found and did on a job. Your job is TWO things at once:
> 1. Ask short, specific clarifying questions — like an experienced senior engineer would — until you have enough to complete a service report. Don't ask more than one question at a time.
> 2. Continuously build a structured service report from what the technician has told you so far.
>
> Respond ONLY with raw JSON, no markdown fences, no preamble, in this exact shape: `{"reply": "...", "report": {...}, "complete": false}`
>
> Keep "reply" under 30 words.

Every sentence in there earns its place, and most of them exist because an earlier, worse version of the prompt didn't work as well. Here's what changed and why.

## Decision 1: one call doing two jobs, not two calls doing one job each

The obvious way to build this is two separate model calls — one that has a normal conversation with the technician, and a second call afterward that reads the conversation and extracts structured fields from it. That's a completely reasonable design, and it's wrong for this use case, specifically because of cost and speed at scale.

Every model call has a fixed overhead: the full system prompt gets sent again, the model has to re-establish context, and you pay for input tokens twice for information that's mostly the same. If a technician sends 5 messages before a report is complete, a two-call design means 10 model calls just for one job. At the scale this role talks about — deploying across Sales, Engineering, Manufacturing, PM, Field Service, Finance, and Procurement — that difference compounds fast. Ten calls per interaction times thousands of employees times multiple times a week is a real budget line, not a rounding error.

The fix was making one call return both things at once: a conversational reply and a structured JSON extraction, in the same response. That's why the prompt explicitly defines the exact JSON shape it wants back — `{"reply": ..., "report": ..., "complete": ...}` — instead of just asking for a normal chat reply. One call, two outputs.

## Decision 2: forcing raw JSON, and saying so explicitly

The first version of this prompt didn't specify "no markdown fences, no preamble." The model would sometimes reply with something like:

> Sure! Here's the extracted report: \`\`\`json { ... } \`\`\`

That's a completely reasonable, helpful-sounding reply — and it broke the code every time, because the parsing step expected pure JSON and got a sentence and a code fence around it instead. The fix wasn't in the code. It was adding one blunt line to the prompt: *"Respond ONLY with raw JSON, no markdown fences, no preamble."* Being that explicit feels almost rude to write, but it's the difference between a parser that works every time and one that silently fails whenever the model feels like being polite.

This matters beyond just avoiding bugs: every failed parse in production means either a retried call (double the tokens for that turn) or a broken user experience. A more precisely worded prompt is a direct, measurable cost and reliability lever, not just a style choice.

## Decision 3: "one question at a time," learned the hard way

An earlier version of the prompt just said "ask for whatever information is missing." In testing, that produced replies like:

> "What's the fault code, what parts did you use, and is this resolved or still open?"

Technically correct, and a genuinely bad conversational experience — it reads like a form, not a colleague. The fix was one sentence added to the prompt: *"Don't ask more than one question at a time."* This is a good example of something that's obvious once you see it fail, but easy to miss when writing a prompt from a blank page. The only way to catch it was to actually run the conversation and watch it feel wrong.

## Decision 4: capping the reply length on purpose

"Keep 'reply' under 30 words" isn't there for style — it's a direct token-budget decision. The conversational reply doesn't need to be long to be useful; a short, clear question does the job better than a paragraph, and it costs less to generate every single time. Across many thousands of interactions, this kind of small constraint is one of the cheapest, easiest wins available — it costs nothing to add and pays back on every single call.

## Decision 5: letting the model judge completion, not a rule

The prompt says to set `"complete": true` "only once you have enough information for [specific fields]" — it doesn't say "once every field is non-empty." That distinction matters. A technician could give a one-word non-answer that technically fills a field with junk. Asking the model to judge *genuine sufficiency* rather than mechanical field-presence is a small prompt choice that prevents a report from being marked "ready" when it isn't actually ready. This is a case where trusting the model's judgment, inside a tightly defined structure, beats trying to hard-code every rule yourself.

## How this connects to the Copilot Studio side of this project

See [`docs/copilot-studio-implementation-guide.md`](copilot-studio-implementation-guide.md) for the platform-specific build steps. What's worth calling out here is that the same prompt-engineering thinking applies directly, just in different fields of the Copilot Studio interface:

- The **agent-level instructions** field is exactly a system prompt — the same "one question at a time, keep it short, ask like an experienced colleague" thinking applies word for word.
- Each **topic description** ("Use this when a sales rep describes a deal...") is itself a small, targeted prompt — the same clarity and specificity that made the JSON shape reliable is what makes generative orchestration correctly route a message to the right topic instead of the wrong one.
- **Output variables** are Copilot Studio's version of the structured JSON shape — you're still telling the model exactly what shape of answer you need, just through a form field instead of a JSON schema in a system prompt.

The 12 use cases in this repo (see [`shared/useCases.js`](../shared/useCases.js)) average 4.6 fields each. Every one of those field lists is really a miniature output schema — the same discipline that shaped the Field Service prompt (be explicit, be structured, keep it short) is what made it possible to design 12 of these quickly instead of laboring over each one individually.

See [`docs/prompt-library.md`](prompt-library.md) for the complete, full-length system prompt for all 13 use cases, written out in full rather than described in the abstract.

## Why this matters for this specific role

The job description asks for "practical experience in prompt engineering" as its own line item — not as a nice-to-have buried in a longer list. Here's the concrete case for why it's worth taking seriously rather than treating it as a checkbox:

**Cost scales with careless prompting, not with prompt engineering.** A poorly designed prompt that needs two calls instead of one, or that fails to parse and needs a retry, isn't a one-time cost — it's a cost that repeats on every single interaction, forever, across however many employees end up using the tool. Getting the prompt right once is cheap. Getting it wrong is a recurring tax nobody notices until the bill arrives.

**Reliability upstream means less cleanup downstream.** A structured, consistently-shaped output is what makes it possible to wire a Power Automate flow that writes straight into Dataverse or SharePoint without a human checking the data first. Sloppy prompting produces sloppy structured output, which quietly reintroduces the exact manual cleanup work these tools are supposed to remove.

**A well-designed prompt template is reusable — which is the whole point of this repo.** The same five decisions above didn't just make one prompt work. They're the reason the instructions template in the Copilot Studio guide could be reused, with small wording changes, across Sales, Engineering, Manufacturing, PM, Finance, and Procurement. Prompt engineering done well isn't a one-off craft skill applied per-project — it's a pattern, the same way the `engine.js` architecture in this repo is a pattern. That's the "identify and surface reusable patterns" line from the job description, expressed at the prompt level instead of the code level.

## A short checklist, for next time

Things worth checking on any new prompt, based on what actually broke or worked here:

- Can two calls become one call by asking for both outputs in the same response?
- Have I told the model exactly what format I want back, including what *not* to include (fences, preambles, extra commentary)?
- Am I asking for one thing at a time where a real conversation would?
- Is there a length constraint on anything that doesn't need to be long?
- Am I asking the model to judge genuine sufficiency, or just checking whether a field happens to be non-empty?
