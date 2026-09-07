# AI Consultant Toolkit — Use Case Suite

Thirteen business use cases — Sales, Engineering, Manufacturing, Project Management, Finance, and Procurement — all running through **one shared engine**.

**Runs entirely in your browser. No install, no API key, no server, no cost.**

[Live demo — hub page](https://lalithprabu.github.io/ai-consultant-use-case-suite/)

## Why this exists

The Field Service assistant (a related project — [`field-service-ai-assistant`](https://github.com/Lalithprabu/field-service-ai-assistant)) proved one pattern: *unstructured conversation in, structured record out, one clarifying question at a time.* This suite proves that pattern isn't specific to Field Service — it's a reusable shape that fits Sales, Engineering, Manufacturing, PM, Finance, and Procurement equally well.

Every use case below is a **configuration**, not a rewrite. See `useCases.js` — each entry defines fields, extraction rules, and questions; `engine.js` (the actual logic that runs the conversation) never changes.

## Try it

Every use case has its own page and its own link:

| Domain | Use case | Live link |
|---|---|---|
| Sales | Quote drafting assistant | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/sales-quote/) |
| Sales | Call notes → CRM structuring | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/sales-callnotes/) |
| Engineering | Spec → checklist converter | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/eng-checklist/) |
| Engineering | Change request drafting assistant | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/eng-changerequest/) |
| Manufacturing | Shift handover assistant | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/mfg-handover/) |
| Manufacturing | Downtime incident logging | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/mfg-downtime/) |
| Project Management | Status update aggregator | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/pm-status/) |
| Project Management | Meeting notes → action items | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/pm-actionitems/) |
| Finance | Expense description parser | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/fin-expense/) |
| Finance | Budget variance commentary assistant | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/fin-variance/) |
| Procurement | Goods receipt assistant | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/proc-receipt/) |
| Procurement | Supplier issue triage assistant | [Try it](https://lalithprabu.github.io/ai-consultant-use-case-suite/proc-supplier/) |

Or see [the full hub page](https://lalithprabu.github.io/ai-consultant-use-case-suite/) with all of them as cards, or [everything in one page with a dropdown](https://lalithprabu.github.io/ai-consultant-use-case-suite/all-in-one/).

See [`docs/use-cases-overview.md`](docs/use-cases-overview.md) for the exact, verified conversation for every single use case.

## Features

Every use case includes:
- **"Why this exists" box** — the real business problem it solves and the time/quality benefit, shown before you even start typing
- **Prompt suggestion chips** — click a realistic example message to send it instantly, no typing required
- **Editable report fields** — click any extracted value to correct it by hand; a real user should always be able to override an AI-drafted field
- **Export to JSON or CSV** — download the current structured report
- **"Extracted from" tooltips** — hover a filled field to see which message it came from (or "Manually edited" if you corrected it yourself)

These four are implemented once in `shared/single-app.js` and `shared/engine.js` and apply to all 13 use cases automatically — a direct demonstration of the config-driven architecture actually paying off.

See [`docs/future-gui-directions.md`](docs/future-gui-directions.md) for input methods designed for each use case (photo upload, transcript upload, voice-to-text, etc.) but not built, to keep this POC focused.

## Architecture

```
index.html            → hub page, links to every individual use case
hub.js                → renders the hub's cards from the config metadata
shared/
  helpers.js          → generic extraction primitives (labeled values, keyword lists, etc.)
  useCases.js         → 13 configs — the ONLY thing that changes per domain
  engine.js           → the ONE function every use case runs through
  single-app.js        → drives any individual use-case page
  styles.css          → shared visual design
<use-case-id>/index.html  → one tiny page per use case (12 folders)
all-in-one/           → the original single-page, dropdown-driven version
test-all.js           → verifies all 12 use cases from the command line
generate-pages.js     → regenerates every individual page from useCases.js
```

Run `node test-all.js` to see every use case's real output for yourself, no browser needed.

If you add or edit a use case in `shared/useCases.js`, run `node generate-pages.js` to regenerate the individual pages — they're built from the config, not hand-written, so they can never drift out of sync with the actual logic.

## Important: how this demo works

Like the Field Service assistant, this uses a **rule-based simulation engine**, not a live language model call — deliberately, so it runs instantly with zero setup. The part worth taking seriously is the **architecture**: one config-driven engine serving thirteen domains. Swapping the rule-based `extract()` function for a real LLM call is a domain-by-domain, drop-in change — the engine, UI, and report structure don't need to change at all.

## Stack

- Plain HTML, CSS, and JavaScript — no build step, no dependencies, no framework.

## Deploying it for free (GitHub Pages)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — GitHub gives you a live URL in about a minute, e.g. `https://yourusername.github.io/ai-consultant-use-case-suite/`.
5. Put that link in this README and on your CV/LinkedIn.
