# Building These 13 Assistants in Microsoft Copilot Studio

Everything in this repo runs on simple, rule-based JavaScript so it works instantly in a browser, for free, with nothing to sign up for. That was a deliberate choice for a portfolio project — but it's not how you'd actually ship one of these to real employees. In a real organization, you'd build it in Microsoft Copilot Studio, let a real language model handle the conversation, and publish it somewhere people already work, like Microsoft Teams.

This guide walks you through doing exactly that, for any of the 13 use cases in this repo. You don't need to know Copilot Studio already. You do need about 30–45 minutes per assistant once you're set up, and a little patience for the account setup, which — fair warning — can be the most annoying part.

## Before you start: getting an account that actually works

This is worth reading before you touch Copilot Studio, because it can save you a genuinely frustrating hour.

Copilot Studio only accepts a **work or school account** — technically called a Microsoft Entra ID account. A personal Gmail or Outlook.com account will not work, full stop; you'll get an error saying so if you try.

If you have a work or school email already tied to an organization that uses Microsoft 365, try that first. Go to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com) and sign in. If it lets you through to a trial, you're done with this section — skip ahead to "How Copilot Studio Works."

Two things commonly go wrong here, and both have fixes:

**Your organization has disabled self-service sign-up.** Some companies and universities turn this off deliberately. You'll see a message like "your organization doesn't currently allow its users to purchase Microsoft Copilot Studio." This isn't something you can fix from your side — it's an IT policy decision made above you.

**Your email exists as two different kinds of account at once.** Occasionally an email address ends up registered as both a personal Microsoft account and an organizational one, and Microsoft's login system gets confused about which one you mean. You'll see an error mentioning "personal Microsoft account" even though you're using a school email. If this happens, it's a known quirk, not something you did wrong.

If either of these blocks you, here's the path that reliably works:

1. **Check if you qualify for the GitHub Student Developer Pack**, if you're a student. It's free and includes a Visual Studio subscription.
2. **A Visual Studio subscription is currently the thing that unlocks a free Microsoft 365 Developer Program sandbox** — a personal, fully-isolated Microsoft 365 environment where you're the administrator and no organization's policies apply to you. Claim the Visual Studio benefit from the Student Pack first.
3. Once that's active, go to `developer.microsoft.com/microsoft-365/dev-program`, join the program, and set up your sandbox. This gives you a new login like `you@something.onmicrosoft.com`.
4. Sign into Copilot Studio with *that* new account. Since it's a clean, freshly created work account with no history, none of the conflicts above will apply.

If you're not a student or don't have access to any of this, the honest fallback is asking whether your workplace can grant you a trial, or simply documenting your build plan (like this guide does) without a live account — that's still legitimate, useful work to show someone.

## How Copilot Studio actually works

A quick primer, since the terminology matters for the steps ahead.

You start by creating an **agent** — the overall assistant. Every agent has top-level **instructions**, written in plain English, that shape its personality and general behavior across everything it does.

Inside an agent, you build **topics**. A topic is one specific thing the agent knows how to do — in our case, one topic per use case, like "draft a quote" or "log a downtime incident." Each topic has a **trigger**, which decides when it activates. The modern way to do this — and the way we'll use throughout this guide — is a trigger called "the agent chooses." Instead of writing exact phrases you expect people to type, you just describe in a sentence or two *when* this topic should kick in, and the AI figures out if an incoming message matches.

The clever part is **output variables**. You tell Copilot Studio which pieces of information the topic needs to collect — say, a customer name, a timeline, and a status. You don't have to write out the questions yourself. Copilot Studio automatically asks the user for whatever's still missing, one thing at a time, the same way a person would. This is really the whole trick: you're not scripting a conversation, you're describing an outcome, and the AI handles the back-and-forth to get there.

Once a topic works the way you want, you can **publish** the agent — most realistically to Microsoft Teams, since that's where employees already are.

## The general recipe

Every one of the 13 assistants below follows the exact same five steps. Once you've done this once, the rest go quickly. Here's the short version, followed by an exact click-by-click walkthrough using one real example.

1. Create the topic and give it a clear name.
2. Set its trigger to "the agent chooses," and paste in the description provided below.
3. Add the output variables listed — most are plain text, a few are multiple-choice, which is called a "Choice" type in Copilot Studio.
4. Open the test chat panel on the right side of the screen and try the example message provided. Watch it ask a sensible follow-up question.
5. If something feels off, tweak the topic description or add a sentence to the agent's top-level instructions, then test again.

Here's the agent-level instruction template to start every agent with — just fill in the brackets for whichever use case you're building:

> You are an AI assistant for [describe the role — e.g. "field service technicians" or "sales representatives"]. Help them turn a plain-language description into a structured [report/record — e.g. "service report" or "CRM entry"]. Ask one clarifying question at a time, the way an experienced colleague would, until you have enough information. Keep your questions short and practical. Once you have enough, summarize what you've drafted and confirm it's ready.

### A full worked example, click by click

This walks through building the **Quote drafting assistant** from a completely blank agent, using the actual current Copilot Studio interface. Every other use case in this guide follows these exact same clicks — only the name, description, and variables change.

**Create the agent**
1. Go to `copilotstudio.microsoft.com` and sign in.
2. On the home page, find the box that says "Describe your agent to create it." Type something like: *"An assistant that helps sales reps draft quote outlines from a description of the deal."*
3. Copilot Studio will generate a starting name and instructions for you automatically. Review what it wrote — you can edit both right away, or come back to them later.
4. Give it a clearer name if you'd like, such as "Sales Assistant," then continue past the setup screen into the main workspace.

**Set the agent's instructions**
5. In the left-hand navigation, find the agent's **Overview** or **Instructions** section (this is the top-level personality/behavior area, separate from any one topic).
6. Paste in the instructions template from earlier in this guide, filled in for Sales: *"You are an AI assistant for sales representatives. Help them turn a plain-language description into a structured quote outline. Ask one clarifying question at a time, the way an experienced colleague would, until you have enough information. Keep your questions short and practical. Once you have enough, summarize what you've drafted and confirm it's ready."*
7. Save.

**Create the topic**
8. In the left-hand navigation, go to **Topics**. (If your version of Copilot Studio shows **Skills** instead of **Topics**, that's a newer interface using the same underlying idea — the steps below still apply conceptually, just look for "Add a skill" instead of "Add a topic.")
9. Select **Add a topic**, then **From blank**. A blank authoring canvas appears with a single Trigger node on it.
10. Hover over the Trigger node and select the **Change trigger** icon (it looks like a small pencil or edit icon on the node).
11. Choose **"The agent chooses"** as the trigger type.
12. In the description field that appears, paste: *"Use this when a sales rep describes a deal and wants help drafting a quote outline."*
13. Rename the topic itself to "Draft Quote" — there's usually a topic name field near the top of the canvas or in a side panel.

**Add the output variables**
14. Look for a **Details** or **Variables** panel for the topic — this is usually a side panel or a tab near the topic canvas, and it's where you define what information this topic needs to collect.
15. Add a new variable named `Customer`, type **Text**.
16. Repeat for `Scope` (Text), `Timeline` (Text), `PricingTier` (Choice — you'll be able to type in the options Basic, Standard, Premium, Enterprise), and `Status` (Choice — Draft, Ready).
17. Save the topic.

**Test it**
18. On the right-hand side of the screen, there should be a **Test** panel (sometimes you need to click a "Test" button to open it if it's not already visible).
19. Type exactly: *"Customer is Acme Manufacturing, needs a 3-month rollout of the new monitoring dashboard across 4 sites"*
20. Watch what happens. The agent should recognize this matches your "Draft Quote" topic, pull out what it can (likely Customer, Scope, and Timeline), and ask you something sensible about whatever's still missing — most likely the pricing tier or status.
21. Keep replying naturally and watch it fill in the rest. If a question feels awkward or it asks for something oddly, go back to your topic description or variable names and make them clearer, then test again.

**Publish it**
22. Once you're happy with how it behaves, find the **Publish** button, usually top-right of the screen.
23. After publishing, go to the **Channels** section to connect it somewhere people can actually use it — Microsoft Teams is the most realistic choice for something like this.

That's the whole process. For every other use case below, repeat steps 8 through 21 as a **new topic inside the same agent** (or a new agent entirely, if you'd rather keep them separate) — just swap in that use case's topic name, description, and variables.

**For a visual walkthrough of these same steps**, Microsoft's own "Create your first agent in Copilot Studio" video (findable by that exact title on Microsoft Learn's site or YouTube) covers this end-to-end, including the parts about instructions, publishing, and analytics that this guide doesn't go into detail on.

Now, the 13 use cases. For each one, repeat the same clicks above — just swap in the topic name, description, and variables given.

---

## Sales

### Quote drafting assistant

Reps spend hours manually assembling quote outlines from scratch for every deal. This assistant lets them just describe the deal and get a structured outline back, cutting the turnaround from days to hours.

**Topic name:** Draft Quote

**Topic description** (paste this into the trigger):
> Use this when a sales rep describes a deal and wants help drafting a quote outline.

**Variables to add:**

| Variable | Type |
|---|---|
| Customer | Text |
| Scope | Text |
| Timeline | Text |
| Pricing Tier | Choice: Basic / Standard / Premium / Enterprise |
| Status | Choice: Draft / Ready |

**Try testing it with:** "Customer is Acme Manufacturing, needs a 3-month rollout of the new monitoring dashboard across 4 sites"

**Worth adding later:** a Power Automate step that turns the finished variables into an actual PDF quote document.

### Call notes → CRM structuring

CRM data quality is usually poor simply because reps log calls in free text, if they log them at all. This assistant takes what a rep says right after a call and turns it into fields a CRM can actually use, without asking the rep to do any extra data entry.

**Topic name:** Structure Call Notes

**Topic description:**
> Use this when a rep describes how a sales call went and wants it structured for the CRM.

**Variables to add:**

| Variable | Type |
|---|---|
| Account | Text |
| Deal Stage | Choice: Discovery / Evaluating / Negotiation / Proposal Sent / Closed Won / Closed Lost |
| Objection Raised | Text |
| Next Step | Text |
| Sentiment | Choice: Positive / Cautious / Negative |

**Try testing it with:** "Had a call with Meridian Health, they're evaluating vendors, main concern is pricing"

**Worth adding later:** connect the finished output straight into Dynamics 365 or Salesforce with a Power Automate connector, so nothing needs re-typing.

---

## Engineering

### Spec → checklist converter

Requirements buried inside long spec documents are exactly the kind of thing that gets missed during design review. This assistant turns a spoken or typed requirement into a trackable checklist item.

**Topic name:** Draft Checklist Item

**Topic description:**
> Use this when an engineer describes a requirement from a spec and wants a checklist item drafted.

**Variables to add:**

| Variable | Type |
|---|---|
| Spec Reference | Text |
| Requirement Type | Text |
| Test Method | Text |
| Owner | Text |
| Status | Choice: Passed / Failed / In Progress / Pending |

**Try testing it with:** "Spec ref ENG-4471 requires the enclosure to pass IP65 ingress testing, verified by lab test"

**Worth adding later:** upload the actual spec document as a knowledge source. Copilot Studio can read PDFs and Word documents directly, so the agent could ground its answers in the real spec instead of relying only on what the engineer types.

### Change request drafting assistant

Change requests often take so long to document properly that changes end up happening informally instead — and then nobody has a clear record of what changed or why. This speeds up the paperwork without adding to an engineer's workload.

**Topic name:** Draft Change Request

**Topic description:**
> Use this when an engineer describes a design change and wants a change request drafted.

**Variables to add:**

| Variable | Type |
|---|---|
| Affected Component(s) | Text |
| Change Type | Choice: Redesign / Material Change / Dimensional Change / Tolerance Change |
| Reason | Text |
| Impact | Choice: Cost / Schedule / Safety / Performance / Weight |
| Approval Needed | Choice: Yes / No |

**Try testing it with:** "Need to change the bracket design on the mounting assembly because of a fatigue failure found in testing"

---

## Manufacturing

### Shift handover assistant

When handover between shifts happens verbally or gets skipped entirely, information falls through the cracks — that's the "nobody told the next shift" problem this fixes.

**Topic name:** Draft Shift Handover

**Topic description:**
> Use this when an outgoing shift lead describes the shift and wants a handover note drafted.

**Variables to add:**

| Variable | Type |
|---|---|
| Line | Text |
| Equipment Status | Choice: Normal / Overheating / Down / Jammed |
| Open Issue | Text |
| Action for Next Shift | Text |
| Priority | Choice: High / Low |

**Try testing it with:** "Line 3 ran fine most of the shift, but the conveyor motor started overheating near the end"

### Downtime incident logging

Downtime causes tend to get logged inconsistently, which quietly wrecks the accuracy of any root-cause or OEE analysis done later. This just makes sure the record is consistent every time.

**Topic name:** Log Downtime Incident

**Topic description:**
> Use this when an operator describes an equipment stoppage and wants it logged.

**Variables to add:**

| Variable | Type |
|---|---|
| Line | Text |
| Duration | Text |
| Cause | Text |
| Resolution | Text |
| Status | Choice: Open / Resolved |

**Try testing it with:** "Line 2 stopped for 40 minutes because the feeder jammed"

**Worth adding later:** a Power Automate step writing straight into a shared OEE tracking list in SharePoint or Dataverse, so the data's already where the analysis happens.

---

## Project Management

### Status update aggregator

PMs routinely spend hours every week just compiling scattered updates into one status report. This standardizes the format as the update is given, not after.

**Topic name:** Log Status Update

**Topic description:**
> Use this when someone gives an informal project update and wants it structured for the status report.

**Variables to add:**

| Variable | Type |
|---|---|
| Workstream | Text |
| Health | Choice: On Track / At Risk / Blocked |
| Blocker | Text |
| Owner | Text |

**Try testing it with:** "Workstream is API integration, we're blocked on getting API keys from the vendor"

### Meeting notes → action items

Decisions and owners discussed out loud in a meeting have a habit of never making it into any kind of trackable list afterward. This pulls them out as they're mentioned.

**Topic name:** Extract Action Items

**Topic description:**
> Use this when someone pastes rough meeting notes and wants action items extracted.

**Variables to add:**

| Variable | Type |
|---|---|
| Decision Made | Text |
| Action Owner | Text |
| Action Item | Text |
| Deadline | Text |

**Try testing it with:** "We decided to push the launch date, John will update the roadmap by Wednesday"

**Worth adding later:** this is a genuinely good fit for Teams meeting transcripts specifically — Copilot Studio can be connected to a meeting's transcript directly, which is a more realistic input than someone retyping notes from memory.

---

## Finance

### Expense description parser

Incomplete expense submissions are one of the most common causes of slow, annoying back-and-forth between staff and Finance. Getting it structured correctly the first time removes most of that friction.

**Topic name:** Draft Expense Entry

**Topic description:**
> Use this when someone describes an expense and wants it structured for approval.

**Variables to add:**

| Variable | Type |
|---|---|
| Category | Choice: Meals & Entertainment / Travel / Software / Office Supplies |
| Cost Center | Text |
| Amount | Text |
| Justification | Text |

**Try testing it with:** "Client dinner in Chicago for the Meridian deal, cost center is Sales, amount was $340"

**Worth adding later:** let people upload a photo of the receipt instead of typing anything. Copilot Studio can understand images directly, so it could pull the amount and vendor straight off the photo.

### Budget variance commentary assistant

Commentary quality on budget variances tends to swing wildly from one analyst to the next in the monthly report. This keeps the format and tone consistent no matter who's writing it.

**Topic name:** Draft Variance Commentary

**Topic description:**
> Use this when an analyst explains a budget variance and wants report commentary drafted.

**Variables to add:**

| Variable | Type |
|---|---|
| Budget Line | Text |
| Direction | Choice: Over Budget / Under Budget |
| Reason | Text |
| Recurring? | Choice: Yes / No |

**Try testing it with:** "Marketing budget line came in over because of an unplanned conference sponsorship, one-time cost"

---

## Procurement

### Goods receipt assistant

Warehouse staff often log deliveries inconsistently, which causes real headaches later during reconciliation. Capturing it properly the moment it arrives avoids that entirely.

**Topic name:** Log Goods Receipt

**Topic description:**
> Use this when warehouse staff describe a delivery and want a receipt record drafted.

**Variables to add:**

| Variable | Type |
|---|---|
| PO Number | Text |
| Quantity Received | Text |
| Condition | Choice: Good / Damaged |
| Discrepancy | Text |
| Status | Choice: Accepted / Rejected / Escalated |

**Try testing it with:** "PO number 88213 arrived today, 40 units, 2 were damaged in transit"

**Worth adding later:** the same photo-upload idea as the expense assistant above — a picture of the delivered goods, rather than a typed description.

### Supplier issue triage assistant

Supplier problems often get reported informally and don't reach the right person or escalation path quickly enough. This structures and prioritizes the report the moment it's raised.

**Topic name:** Triage Supplier Issue

**Topic description:**
> Use this when staff describe a supplier problem and want it triaged and escalated.

**Variables to add:**

| Variable | Type |
|---|---|
| Supplier | Text |
| Issue Type | Choice: Late Delivery / Quality Issue / Wrong Item / Pricing Issue / Supply Shortage |
| Business Impact | Text |
| Severity | Choice: Critical / High / Low |

**Try testing it with:** "Supplier is Meridian Components, they're 2 weeks late on the order, this is affecting production, high severity"

**Worth adding later:** a Power Automate step that automatically posts an alert into a Teams channel whenever severity comes back Critical or High, so nothing urgent sits unnoticed.

---

## What all 13 have in common

If you've built even two or three of these, you've probably noticed they're really the same pattern wearing different clothes: describe the topic, list the variables you need, let the AI ask for whatever's missing, and optionally wire the result somewhere useful once it's complete. That repetition isn't an accident — it's the actual point. The hard thinking (what fields matter, what's required, what problem this solves) was already done once, in this repo's code, and every one of these Copilot Studio builds is just that same thinking expressed in a different tool.

If you build one of these and get stuck on something that doesn't match what's described here, that's worth noting rather than fighting — Copilot Studio's interface changes fairly often, and the exact button names or screen layout may have shifted since this was written.
