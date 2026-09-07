# Use case overview

Thirteen business use cases, one shared engine. Every config below plugs into the same `processTurn()` function in `engine.js` — the only thing that changes per domain is the field list, extraction rules, and questions in `useCases.js`.

This is the "reusable pattern" argument made concrete: the interaction shape (*unstructured conversation in, structured record out, one clarifying question at a time*) generalizes across every function in the business.

---

## Field Service — Report-drafting assistant
*(the original build — see root `index.html`)*

**Problem:** Technicians spend 30–45 minutes after every job manually writing service reports.
**Value:** Cuts report time to under 5 minutes; improves data quality feeding Finance's billing and Engineering's root-cause tracking.

## Sales — Quote drafting assistant
**Problem:** Reps spend hours manually assembling quote outlines from scratch for every deal.
**Value:** Standardizes what gets included in every quote and cuts turnaround from days to hours.

## Sales — Call notes → CRM structuring
**Problem:** CRM data quality is poor because reps log calls in free text, if at all.
**Value:** Improves CRM data quality — the most common complaint about any CRM rollout — without adding data-entry work for reps.

## Engineering — Spec → checklist converter
**Problem:** Requirements buried in spec documents get missed during design review.
**Value:** Reduces missed requirements by turning prose specs into trackable checklist items.

## Engineering — Change request drafting assistant
**Problem:** Change requests take too long to document formally, so changes happen informally and get lost.
**Value:** Speeds up change management without adding administrative burden on engineers.

## Manufacturing — Shift handover assistant
**Problem:** Information gets lost between shifts when handover is verbal or informal.
**Value:** Prevents the classic "nobody told the next shift" failure mode.

## Manufacturing — Downtime incident logging
**Problem:** Downtime causes are logged inconsistently, weakening root-cause and OEE analysis.
**Value:** Improves the accuracy of the data used to reduce future downtime.

## Project Management — Status update aggregator
**Problem:** PMs spend hours every week manually compiling status updates from scattered sources.
**Value:** Saves compilation time and standardizes how "on track / at risk / blocked" gets reported.

## Project Management — Meeting notes → action items
**Problem:** Decisions and owners discussed in meetings often don't make it into a trackable action log.
**Value:** Ensures action items have a clear owner and deadline instead of getting lost.

## Finance — Expense description parser
**Problem:** Incomplete expense submissions cause back-and-forth between staff and Finance.
**Value:** Reduces approval friction by structuring submissions correctly the first time.

## Finance — Budget variance commentary assistant
**Problem:** Variance commentary quality varies wildly analyst to analyst in the monthly report.
**Value:** Standardizes commentary quality and format across the finance team.

## Procurement — Goods receipt assistant
**Problem:** Warehouse staff log deliveries inconsistently, causing reconciliation issues.
**Value:** Structures receiving data at the point of capture — directly reuses the Field Service pattern.

## Procurement — Supplier issue triage assistant
**Problem:** Supplier issues get reported informally and don't reach the right severity/escalation path quickly.
**Value:** Speeds up supplier issue resolution by structuring and prioritizing the report immediately.

---

## Verified example conversations

Every example below was run through the actual code (`node test-all.js`) — this is real, reproducible output, not illustrative text.

### Sales — Quote drafting assistant
1. **You:** "Customer is Acme Manufacturing, needs a 3-month rollout of the new monitoring dashboard across 4 sites"
   **Assistant:** "Is this quote ready to send, or still a draft?"
2. **You:** "Enterprise tier, mark it ready to send"
   **Assistant:** "Quote drafted for Acme Manufacturing — status: Ready."

### Sales — Call notes → CRM structuring
1. **You:** "Had a call with Meridian Health, they're evaluating vendors, main concern is pricing"
   **Assistant:** "What's the agreed next step?"
2. **You:** "Agreed to send a proposal by Friday, they seemed pretty interested overall"
   **Assistant:** "CRM entry drafted — Evaluating, next step: send a proposal by Friday."

### Engineering — Spec → checklist converter
1. **You:** "Spec ref ENG-4471 requires the enclosure to pass IP65 ingress testing, verified by lab test"
   **Assistant:** "What's the current status — passed, failed, or pending?"
2. **You:** "Still pending, assigned to Priya"
   **Assistant:** "Checklist item logged for ENG-4471 — status: Pending."

### Engineering — Change request drafting assistant
1. **You:** "Need to change the bracket design on the mounting assembly because of a fatigue failure found in testing"
   **Assistant:** "Does this need formal approval, or is it already signed off?"
2. **You:** "Yes it needs approval, could affect overall weight too"
   **Assistant:** "Change request drafted — approval required: Yes."

### Manufacturing — Shift handover assistant
1. **You:** "Line 3 ran fine most of the shift, but the conveyor motor started overheating near the end"
   **Assistant:** "What does the next shift need to do about it?"
2. **You:** "Next shift needs to check the bearing, it's high priority"
   **Assistant:** "Handover note drafted for Line 3 — action for next shift: check the bearing."

### Manufacturing — Downtime incident logging
1. **You:** "Line 2 stopped for 40 minutes because the feeder jammed"
   **Assistant:** "Is it back up and running, or still down?"
2. **You:** "Cleared it and restarted, running fine now"
   **Assistant:** "Downtime incident logged for Line 2 — status: Resolved."

### Project Management — Status update aggregator
1. **You:** "Workstream is API integration, we're blocked on getting API keys from the vendor"
   **Assistant:** "Status logged for API integration: Blocked."

### Project Management — Meeting notes → action items
1. **You:** "We decided to push the launch date, John will update the roadmap by Wednesday"
   **Assistant:** "Action item logged: John — update the roadmap by Wednesday."

### Finance — Expense description parser
1. **You:** "Client dinner in Chicago for the Meridian deal, cost center is Sales, amount was $340"
   **Assistant:** "Expense drafted — Meals & Entertainment, $340, charged to Sales."

### Finance — Budget variance commentary assistant
1. **You:** "Marketing budget line came in over because of an unplanned conference sponsorship, one-time cost"
   **Assistant:** "Variance commentary drafted for Marketing — Over Budget."

### Procurement — Goods receipt assistant
1. **You:** "PO number 88213 arrived today, 40 units, 2 were damaged in transit"
   **Assistant:** "Goods receipt logged for PO 88213 — condition: Damaged."

### Procurement — Supplier issue triage assistant
1. **You:** "Supplier is Meridian Components, they're 2 weeks late on the order, this is affecting production, high severity"
   **Assistant:** "Escalation note drafted for Meridian Components — severity: High."

## How to verify this yourself

```bash
node test-all.js
```
This runs every use case above through the real code and prints the actual output.
