/**
 * useCases.js — one config per business use case. Every config plugs into
 * the SAME generic engine (see engine.js) — this file is the only thing
 * that changes from domain to domain. That's the reusable-pattern story.
 */

const H = typeof module !== "undefined" ? require("./helpers.js") : window.Helpers;

const COMPONENTS = [
  "circuit board", "mounting", "bracket", "assembly", "housing",
  "frame", "enclosure", "gearbox", "actuator", "sensor", "pump", "valve",
];

const useCases = [
  // ---------------- SALES ----------------
  {
    id: "sales-quote",
    promptSuggestions: [
      "Customer is Acme Manufacturing, needs a 3-month rollout of the new monitoring dashboard across 4 sites",
      "Enterprise tier, mark it ready to send",
    ],
    domain: "Sales",
    title: "Quote drafting assistant",
    subtitle: "Rep describes what the customer needs. Assistant drafts the quote outline.",
    problem: "Reps spend hours manually assembling quote outlines from scratch for every deal.",
    value: "Cuts quote turnaround from days to hours.",
    placeholder: "e.g. Customer is Acme Manufacturing, needs a 3-month rollout of the new monitoring dashboard across 4 sites",
    greeting: "Tell me about the deal and I'll start drafting the quote outline.",
    fields: [
      { key: "customer", label: "Customer" },
      { key: "scope", label: "Scope" },
      { key: "timeline", label: "Timeline" },
      { key: "pricingTier", label: "Pricing Tier" },
      { key: "status", label: "Status" },
    ],
    requiredForComplete: ["customer", "scope", "timeline", "status"],
    extract(text) {
      return {
        customer: H.extractPhrase(text, ["customer is", "customer", "client is", "client"], 40),
        scope: H.extractPhrase(text, ["needs a", "needs", "scope is"], 90),
        timeline: H.extractDuration(text),
        pricingTier: H.extractFirstMatch(text, [
          ["enterprise", "Enterprise"], ["premium", "Premium"], ["standard", "Standard"], ["basic", "Basic"],
        ]),
        status: H.extractFirstMatch(text, [
          ["ready to send", "Ready"], ["mark it ready", "Ready"], ["draft", "Draft"],
        ]),
      };
    },
    questions: {
      customer: "Which customer or client is this quote for?",
      scope: "What exactly are they asking for — what's the scope?",
      timeline: "What's the timeline they're expecting?",
      status: "Is this quote ready to send, or still a draft?",
    },
    closingReply: (r) => `Quote drafted for ${r.customer} — status: ${r.status}.`,
  },
  {
    id: "sales-callnotes",
    promptSuggestions: [
      "Had a call with Meridian Health, they're evaluating vendors, main concern is pricing",
      "Agreed to send a proposal by Friday, they seemed pretty interested overall",
    ],
    domain: "Sales",
    title: "Call notes → CRM structuring",
    subtitle: "Rep pastes rough call notes. Assistant structures it into CRM-ready fields.",
    problem: "CRM data quality is poor because reps log calls in free text, if at all.",
    value: "Improves CRM data quality without adding data-entry work for reps.",
    placeholder: "e.g. Had a call with Meridian Health, they're evaluating vendors, main concern is pricing",
    greeting: "Tell me how the call went and I'll structure it for the CRM.",
    fields: [
      { key: "account", label: "Account" },
      { key: "dealStage", label: "Deal Stage" },
      { key: "objection", label: "Objection Raised" },
      { key: "nextStep", label: "Next Step" },
      { key: "sentiment", label: "Sentiment" },
    ],
    requiredForComplete: ["account", "dealStage", "nextStep"],
    extract(text) {
      return {
        account: H.extractPhrase(text, ["call with", "account is", "talked to"], 40),
        dealStage: H.extractFirstMatch(text, [
          ["closed won", "Closed Won"], ["closed lost", "Closed Lost"], ["negotiation", "Negotiation"],
          ["discovery", "Discovery"], ["evaluating", "Evaluating"], ["proposal", "Proposal Sent"],
        ]),
        objection: H.extractFirstMatch(text, [
          ["pricing", "Pricing"], ["budget", "Budget"], ["timeline", "Timeline"],
          ["integration", "Integration"], ["security", "Security"],
        ]),
        nextStep: H.extractPhrase(text, ["agreed to", "next step is", "will"], 60),
        sentiment: H.extractFirstMatch(text, [
          ["excited", "Positive"], ["interested", "Positive"], ["concerned", "Cautious"],
          ["frustrated", "Negative"], ["skeptical", "Cautious"],
        ]),
      };
    },
    questions: {
      account: "Which account or company was this call with?",
      dealStage: "What stage is this deal at?",
      nextStep: "What's the agreed next step?",
    },
    closingReply: (r) => `CRM entry drafted — ${r.dealStage}, next step: ${r.nextStep}.`,
  },

  // ---------------- ENGINEERING ----------------
  {
    id: "eng-checklist",
    promptSuggestions: [
      "Spec ref ENG-4471 requires the enclosure to pass IP65 ingress testing, verified by lab test",
      "Still pending, assigned to Priya",
    ],
    domain: "Engineering",
    title: "Spec → checklist converter",
    subtitle: "Engineer describes a requirement. Assistant drafts a checklist item.",
    problem: "Requirements buried in spec documents get missed during design review.",
    value: "Reduces missed requirements by turning prose specs into trackable checklist items.",
    placeholder: "e.g. Spec ref ENG-4471 requires the enclosure to pass IP65 ingress testing, verified by lab test",
    greeting: "Describe the requirement and I'll draft the checklist item.",
    fields: [
      { key: "specRef", label: "Spec Reference" },
      { key: "requirementType", label: "Requirement Type" },
      { key: "testMethod", label: "Test Method" },
      { key: "owner", label: "Owner" },
      { key: "status", label: "Status" },
    ],
    requiredForComplete: ["specRef", "requirementType", "testMethod", "status"],
    extract(text) {
      return {
        specRef: H.extractCode(text, ["spec ref", "spec", "reference"]),
        requirementType: H.extractFirstMatch(text, [
          ["ip65", "IP Rating"], ["ingress", "IP Rating"], ["thermal", "Thermal"],
          ["vibration", "Vibration"], ["emc", "EMC"], ["load", "Load/Structural"], ["pressure", "Pressure"],
        ]),
        testMethod: H.extractFirstMatch(text, [
          ["lab test", "Lab Test"], ["field test", "Field Test"], ["simulation", "Simulation"],
          ["inspection", "Visual Inspection"], ["analysis", "Engineering Analysis"],
        ]),
        owner: H.extractPhrase(text, ["owner is", "assigned to", "owned by"], 30),
        status: H.extractFirstMatch(text, [
          ["passed", "Passed"], ["failed", "Failed"], ["in progress", "In Progress"], ["pending", "Pending"],
        ]),
      };
    },
    questions: {
      specRef: "What's the spec reference number?",
      requirementType: "What type of requirement is this?",
      testMethod: "How will this be verified?",
      status: "What's the current status — passed, failed, or pending?",
    },
    closingReply: (r) => `Checklist item logged for ${r.specRef} — status: ${r.status}.`,
  },
  {
    id: "eng-changerequest",
    promptSuggestions: [
      "Need to change the bracket design on the mounting assembly because of a fatigue failure found in testing",
      "Yes it needs approval, could affect overall weight too",
    ],
    domain: "Engineering",
    title: "Change request drafting assistant",
    subtitle: "Engineer describes a change informally. Assistant drafts the change request.",
    problem: "Change requests take too long to document formally, so changes happen informally and get lost.",
    value: "Speeds up change management without adding administrative burden on engineers.",
    placeholder: "e.g. Need to change the bracket design on the mounting assembly because of a fatigue failure found in testing",
    greeting: "Tell me about the change and I'll draft the change request.",
    fields: [
      { key: "system", label: "Affected Component(s)" },
      { key: "changeType", label: "Change Type" },
      { key: "reason", label: "Reason" },
      { key: "impact", label: "Impact" },
      { key: "approvalNeeded", label: "Approval Needed" },
    ],
    requiredForComplete: ["system", "changeType", "reason", "approvalNeeded"],
    extract(text) {
      return {
        system: H.extractKeywordList(text, COMPONENTS).join(", "),
        changeType: H.extractFirstMatch(text, [
          ["redesign", "Redesign"], ["material", "Material Change"], ["dimension", "Dimensional Change"],
          ["tolerance", "Tolerance Change"], ["change the", "Design Change"], ["change to", "Design Change"],
        ]),
        reason: H.extractPhrase(text, ["because of", "due to", "because"], 60),
        impact: H.extractFirstMatch(text, [
          ["cost", "Cost Impact"], ["schedule", "Schedule Impact"], ["safety", "Safety Impact"],
          ["performance", "Performance Impact"], ["weight", "Weight Impact"],
        ]),
        approvalNeeded: H.extractFirstMatch(text, [
          ["needs approval", "Yes"], ["needs sign off", "Yes"],
          ["already approved", "No"], ["no approval needed", "No"], ["pre-approved", "No"],
        ]),
      };
    },
    questions: {
      system: "Which component or assembly does this affect?",
      changeType: "What kind of change is this?",
      reason: "What's driving the change?",
      approvalNeeded: "Does this need formal approval, or is it already signed off?",
    },
    closingReply: (r) => `Change request drafted — approval required: ${r.approvalNeeded}.`,
  },

  // ---------------- MANUFACTURING ----------------
  {
    id: "mfg-handover",
    promptSuggestions: [
      "Line 3 ran fine most of the shift, but the conveyor motor started overheating near the end",
      "Next shift needs to check the bearing, it's high priority",
    ],
    domain: "Manufacturing",
    title: "Shift handover assistant",
    subtitle: "Outgoing shift lead describes the shift. Assistant drafts the handover note.",
    problem: "Information gets lost between shifts when handover is verbal or informal.",
    value: "Prevents the classic \"nobody told the next shift\" failure mode.",
    placeholder: "e.g. Line 3 ran fine most of the shift, but the conveyor motor started overheating near the end",
    greeting: "Tell me how the shift went and I'll draft the handover note.",
    fields: [
      { key: "line", label: "Line" },
      { key: "equipmentStatus", label: "Equipment Status" },
      { key: "openIssue", label: "Open Issue" },
      { key: "actionForNextShift", label: "Action for Next Shift" },
      { key: "priority", label: "Priority" },
    ],
    requiredForComplete: ["line", "equipmentStatus", "actionForNextShift"],
    extract(text) {
      const lineMatch = text.match(/\bline\s+(\d+)\b/i);
      return {
        line: lineMatch ? `Line ${lineMatch[1]}` : "",
        equipmentStatus: H.extractFirstMatch(text, [
          ["overheating", "Overheating"], ["down", "Down"], ["jammed", "Jammed"],
          ["ran fine", "Normal"], ["running fine", "Normal"], ["normal", "Normal"],
        ]),
        openIssue: H.extractPhrase(text, ["but the", "issue is", "problem is"], 60),
        actionForNextShift: H.extractPhrase(text, ["next shift needs to", "next shift should", "needs to"], 50),
        priority: H.extractFirstMatch(text, [
          ["urgent", "High"], ["asap", "High"], ["high priority", "High"],
          ["low priority", "Low"], ["whenever", "Low"],
        ]),
      };
    },
    questions: {
      line: "Which line was this?",
      equipmentStatus: "How did the equipment run overall?",
      actionForNextShift: "What does the next shift need to do about it?",
    },
    closingReply: (r) => `Handover note drafted for ${r.line} — action for next shift: ${r.actionForNextShift}.`,
  },
  {
    id: "mfg-downtime",
    promptSuggestions: [
      "Line 2 stopped for 40 minutes because the feeder jammed",
      "Cleared it and restarted, running fine now",
    ],
    domain: "Manufacturing",
    title: "Downtime incident logging",
    subtitle: "Operator describes a stoppage. Assistant drafts the downtime record.",
    problem: "Downtime causes are logged inconsistently, weakening root-cause and OEE analysis.",
    value: "Improves the accuracy of the data used to reduce future downtime.",
    placeholder: "e.g. Line 2 stopped for 40 minutes because the feeder jammed, cleared it and restarted",
    greeting: "Tell me what happened and I'll log the downtime incident.",
    fields: [
      { key: "line", label: "Line" },
      { key: "duration", label: "Duration" },
      { key: "cause", label: "Cause" },
      { key: "resolution", label: "Resolution" },
      { key: "status", label: "Status" },
    ],
    requiredForComplete: ["line", "duration", "cause", "status"],
    extract(text) {
      const lineMatch = text.match(/\bline\s+(\d+)\b/i);
      const durationMatch = text.match(/\b(\d+)\s*(minute|minutes|hour|hours|min|mins)\b/i);
      return {
        line: lineMatch ? `Line ${lineMatch[1]}` : "",
        duration: durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : "",
        cause: H.extractPhrase(text, ["because the", "because", "due to"], 50),
        resolution: H.extractPhrase(text, ["cleared it and", "fixed by", "resolved by"], 50),
        status: H.extractFirstMatch(text, [
          ["restarted", "Resolved"], ["running again", "Resolved"], ["still down", "Open"], ["ongoing", "Open"],
        ]),
      };
    },
    questions: {
      line: "Which line stopped?",
      duration: "How long was it down for?",
      cause: "What caused the stoppage?",
      status: "Is it back up and running, or still down?",
    },
    closingReply: (r) => `Downtime incident logged for ${r.line} — status: ${r.status}.`,
  },

  // ---------------- PROJECT MANAGEMENT ----------------
  {
    id: "pm-status",
    promptSuggestions: [
      "Workstream is API integration, we're blocked on getting API keys from the vendor",
    ],
    domain: "Project Management",
    title: "Status update aggregator",
    subtitle: "PM pastes an informal update. Assistant structures it for the weekly report.",
    problem: "PMs spend hours every week manually compiling status updates from scattered sources.",
    value: "Saves compilation time and standardizes how \"on track / at risk / blocked\" gets reported.",
    placeholder: "e.g. Workstream is API integration, we're on track, blocked on getting API keys from the vendor",
    greeting: "Give me the update and I'll structure it for the status report.",
    fields: [
      { key: "workstream", label: "Workstream" },
      { key: "health", label: "Health" },
      { key: "blocker", label: "Blocker" },
      { key: "owner", label: "Owner" },
    ],
    requiredForComplete: ["workstream", "health"],
    extract(text) {
      return {
        workstream: H.extractPhrase(text, ["workstream is", "workstream", "team is working on"], 40),
        health: H.extractFirstMatch(text, [
          ["blocked", "Blocked"], ["at risk", "At Risk"], ["on track", "On Track"], ["ahead", "On Track"],
        ]),
        blocker: H.extractPhrase(text, ["blocked on", "waiting on", "blocker is"], 60),
        owner: H.extractPhrase(text, ["owner is", "owned by"], 30),
      };
    },
    questions: {
      workstream: "Which workstream is this update for?",
      health: "Is it on track, at risk, or blocked?",
    },
    closingReply: (r) => `Status logged for ${r.workstream}: ${r.health}.`,
  },
  {
    id: "pm-actionitems",
    promptSuggestions: [
      "We decided to push the launch date, John will update the roadmap by Wednesday",
    ],
    domain: "Project Management",
    title: "Meeting notes → action items",
    subtitle: "Paste rough meeting notes. Assistant extracts owners and deadlines.",
    problem: "Decisions and owners discussed in meetings often don't make it into a trackable action log.",
    value: "Ensures action items have a clear owner and deadline instead of getting lost.",
    placeholder: "e.g. We decided to push the launch date, John will update the roadmap by Wednesday",
    greeting: "Paste your meeting notes and I'll pull out the action items.",
    fields: [
      { key: "decision", label: "Decision Made" },
      { key: "actionOwner", label: "Action Owner" },
      { key: "actionItem", label: "Action Item" },
      { key: "deadline", label: "Deadline" },
    ],
    requiredForComplete: ["actionOwner", "actionItem"],
    extract(text) {
      const deadlineMatch = text.match(/\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|[a-z]+\s+\d{1,2})\b/i);
      const ownerMatch = text.match(/\b([A-Z][a-z]+)\s+will\b/);
      const rawAction = H.extractPhrase(text, ["will"], 50);
      const actionItem = rawAction
        .replace(/\s+by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday).*$/i, "")
        .trim();
      return {
        decision: H.extractPhrase(text, ["we decided to", "decided to", "agreed to"], 50),
        actionOwner: ownerMatch ? ownerMatch[1] : "",
        actionItem,
        deadline: deadlineMatch ? cap(deadlineMatch[1]) : "",
      };
    },
    questions: {
      actionOwner: "Who owns the follow-up action?",
      actionItem: "What exactly do they need to do?",
    },
    closingReply: (r) => `Action item logged: ${r.actionOwner} — ${r.actionItem}${r.deadline ? " by " + r.deadline : ""}.`,
  },

  // ---------------- FINANCE ----------------
  {
    id: "fin-expense",
    promptSuggestions: [
      "Client dinner in Chicago for the Meridian deal, cost center is Sales, amount was $340",
    ],
    domain: "Finance",
    title: "Expense description parser",
    subtitle: "Paste a messy expense description. Assistant structures it for approval.",
    problem: "Incomplete expense submissions cause back-and-forth between staff and Finance.",
    value: "Reduces approval friction by structuring submissions correctly the first time.",
    placeholder: "e.g. Client dinner in Chicago for the Meridian deal, cost center is Sales, amount was $340",
    greeting: "Describe the expense and I'll structure it for approval routing.",
    fields: [
      { key: "category", label: "Category" },
      { key: "costCenter", label: "Cost Center" },
      { key: "amount", label: "Amount" },
      { key: "justification", label: "Justification" },
    ],
    requiredForComplete: ["category", "costCenter", "amount"],
    extract(text) {
      const amountMatch = text.match(/\$\s?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/);
      return {
        category: H.extractFirstMatch(text, [
          ["dinner", "Meals & Entertainment"], ["meal", "Meals & Entertainment"], ["flight", "Travel"],
          ["hotel", "Travel"], ["taxi", "Travel"], ["uber", "Travel"], ["software", "Software/Subscriptions"],
          ["supplies", "Office Supplies"],
        ]),
        costCenter: H.extractPhrase(text, ["cost center is", "cost centre is", "cost center"], 30),
        amount: amountMatch ? `$${amountMatch[1]}` : "",
        justification: H.extractPhrase(text, ["for the", "related to"], 50),
      };
    },
    questions: {
      category: "What type of expense is this?",
      costCenter: "Which cost center should this go against?",
      amount: "What was the amount?",
    },
    closingReply: (r) => `Expense drafted — ${r.category}, ${r.amount}, charged to ${r.costCenter}.`,
  },
  {
    id: "fin-variance",
    promptSuggestions: [
      "Marketing budget line came in over because of an unplanned conference sponsorship, one-time cost",
    ],
    domain: "Finance",
    title: "Budget variance commentary assistant",
    subtitle: "Analyst explains a variance informally. Assistant drafts the report commentary.",
    problem: "Variance commentary quality varies wildly analyst to analyst in the monthly report.",
    value: "Standardizes commentary quality and format across the finance team.",
    placeholder: "e.g. Marketing budget line came in over because of an unplanned conference sponsorship, one-time cost",
    greeting: "Explain the variance and I'll draft the commentary.",
    fields: [
      { key: "budgetLine", label: "Budget Line" },
      { key: "direction", label: "Direction" },
      { key: "reason", label: "Reason" },
      { key: "recurring", label: "Recurring?" },
    ],
    requiredForComplete: ["budgetLine", "direction", "reason"],
    extract(text) {
      const lineMatch = text.match(/([A-Za-z][A-Za-z\s]{1,30}?)\s+(?:budget line|line item)/i);
      return {
        budgetLine: lineMatch ? lineMatch[1].trim() : "",
        direction: H.extractFirstMatch(text, [
          ["came in over", "Over Budget"], ["over budget", "Over Budget"],
          ["came in under", "Under Budget"], ["under budget", "Under Budget"],
        ]),
        reason: H.extractPhrase(text, ["because of", "due to"], 60),
        recurring: H.extractFirstMatch(text, [
          ["one-time", "No"], ["one time", "No"], ["recurring", "Yes"], ["ongoing", "Yes"],
        ]),
      };
    },
    questions: {
      budgetLine: "Which budget line is this about?",
      direction: "Did it come in over or under budget?",
      reason: "What drove the variance?",
    },
    closingReply: (r) => `Variance commentary drafted for ${r.budgetLine} — ${r.direction}.`,
  },

  // ---------------- PROCUREMENT ----------------
  {
    id: "proc-receipt",
    promptSuggestions: [
      "PO number 88213 arrived today, 40 units, 2 were damaged in transit",
    ],
    domain: "Procurement",
    title: "Goods receipt assistant",
    subtitle: "Warehouse staff describes a delivery. Assistant drafts the receipt record.",
    problem: "Warehouse staff log deliveries inconsistently, causing reconciliation issues.",
    value: "Structures receiving data at the point of capture, before details get forgotten.",
    placeholder: "e.g. PO number 88213 arrived today, 40 units, 2 were damaged in transit",
    greeting: "Tell me about the delivery and I'll draft the receipt record.",
    fields: [
      { key: "poNumber", label: "PO Number" },
      { key: "quantityReceived", label: "Quantity Received" },
      { key: "condition", label: "Condition" },
      { key: "discrepancy", label: "Discrepancy" },
      { key: "status", label: "Status" },
    ],
    requiredForComplete: ["poNumber", "quantityReceived", "condition"],
    extract(text) {
      const qtyMatch = text.match(/\b(\d+)\s*units?\b/i);
      return {
        poNumber: H.extractCode(text, ["po number", "po#", "po"]),
        quantityReceived: qtyMatch ? `${qtyMatch[1]} units` : "",
        condition: H.extractFirstMatch(text, [
          ["damaged", "Damaged"], ["good condition", "Good"], ["intact", "Good"],
        ]),
        discrepancy: H.extractFirstMatch(text, [
          ["damaged in transit", "Damage in transit"], ["short shipped", "Short shipment"],
          ["wrong item", "Wrong item"], ["missing", "Missing items"],
        ]),
        status: H.extractFirstMatch(text, [
          ["escalate", "Escalated"], ["accepted", "Accepted"], ["reject", "Rejected"],
        ]),
      };
    },
    questions: {
      poNumber: "What's the PO number for this delivery?",
      quantityReceived: "How many units arrived?",
      condition: "What condition did it arrive in — good, or damaged?",
    },
    closingReply: (r) => `Goods receipt logged for PO ${r.poNumber} — condition: ${r.condition}.`,
  },
  {
    id: "proc-supplier",
    promptSuggestions: [
      "Supplier is Meridian Components, they're 2 weeks late on the order, this is affecting production, high severity",
    ],
    domain: "Procurement",
    title: "Supplier issue triage assistant",
    subtitle: "Staff describes a supplier problem. Assistant drafts the escalation note.",
    problem: "Supplier issues get reported informally and don't reach the right severity/escalation path quickly.",
    value: "Speeds up supplier issue resolution by structuring and prioritizing the report immediately.",
    placeholder: "e.g. Supplier is Meridian Components, they're 2 weeks late on the order, this is affecting production",
    greeting: "Describe the supplier issue and I'll draft the escalation note.",
    fields: [
      { key: "supplier", label: "Supplier" },
      { key: "issueType", label: "Issue Type" },
      { key: "businessImpact", label: "Business Impact" },
      { key: "severity", label: "Severity" },
    ],
    requiredForComplete: ["supplier", "issueType", "severity"],
    extract(text) {
      return {
        supplier: H.extractPhrase(text, ["supplier is", "vendor is"], 40),
        issueType: H.extractFirstMatch(text, [
          ["late", "Late Delivery"], ["quality", "Quality Issue"], ["wrong", "Wrong Item"],
          ["price increase", "Pricing Issue"], ["shortage", "Supply Shortage"],
        ]),
        businessImpact: H.extractPhrase(text, ["affecting", "impacting", "causing"], 50),
        severity: H.extractFirstMatch(text, [
          ["critical", "Critical"], ["affecting production", "High"], ["high", "High"], ["minor", "Low"],
        ]),
      };
    },
    questions: {
      supplier: "Which supplier is this about?",
      issueType: "What's the nature of the issue?",
      severity: "How severe is this — critical, high, or low?",
    },
    closingReply: (r) => `Escalation note drafted for ${r.supplier} — severity: ${r.severity}.`,
  },
];

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { useCases };
} else {
  window.useCases = useCases;
}
