# Future GUI directions (designed, not built)

The 4 features in the main README (prompt chips, editable fields, export, source tooltips) are built and working across all 13 use cases. Beyond that, each use case would ideally get an input method matching how that data *actually* arrives in the real job — not just a text box. These weren't built, to keep the POC focused, but the design decisions are below.

| Use case | Best-fit input method | Why this one |
|---|---|---|
| Field Service | Photo upload of the fault/part | Technicians photograph a fault before describing it in words |
| Sales — Quote | Prompt chips (built) + PDF export | Reps want a fast start and a shareable end artifact |
| Sales — Call notes | Upload a call transcript (.txt) | Real call notes come from a recording tool, not retyping |
| Engineering — Checklist | Upload the spec document (PDF) | The real trigger is a spec file, not typed prose |
| Engineering — Change request | Image upload (CAD screenshot/photo) | Visual context is how engineers actually flag design issues |
| Manufacturing — Handover | Voice-to-text input | Shift floor workers have their hands full |
| Manufacturing — Downtime | Photo/video upload of the fault | This is the real evidence used in RCA meetings |
| PM — Status aggregator | Paste multiple updates at once, auto-split by person | PMs compile from scattered Slack/email threads |
| PM — Action items | Upload a meeting transcript (Teams/Zoom export) | This is literally where action items come from today |
| Finance — Expense | Receipt image upload with OCR-style extraction | The natural trigger is a photographed receipt |
| Finance — Variance | Upload a small CSV/spreadsheet | Variance is inherently a numbers table |
| Procurement — Receipt | Photo upload of delivered goods | Same visual-evidence-first workflow as Field Service |
| Procurement — Supplier issue | Severity slider instead of typing it | Faster and more decisive than typing "high severity" |

In a real build, each of these would still funnel into the same `report` shape and the same `processTurn()` engine — only the *capture* method changes, not the underlying architecture.
