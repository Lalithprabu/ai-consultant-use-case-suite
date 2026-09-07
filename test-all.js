const { processTurn, emptyReport } = require("./shared/engine.js");
const { useCases } = require("./shared/useCases.js");

const scripts = {
  "sales-quote": [
    "Customer is Acme Manufacturing, needs a 3-month rollout of the new monitoring dashboard across 4 sites",
    "Enterprise tier, mark it ready to send",
  ],
  "sales-callnotes": [
    "Had a call with Meridian Health, they're evaluating vendors, main concern is pricing",
    "Agreed to send a proposal by Friday, they seemed pretty interested overall",
  ],
  "eng-checklist": [
    "Spec ref ENG-4471 requires the enclosure to pass IP65 ingress testing, verified by lab test",
    "Still pending, assigned to Priya",
  ],
  "eng-changerequest": [
    "Need to change the bracket design on the mounting assembly because of a fatigue failure found in testing",
    "Yes it needs approval, could affect overall weight too",
  ],
  "mfg-handover": [
    "Line 3 ran fine most of the shift, but the conveyor motor started overheating near the end",
    "Next shift needs to check the bearing, it's high priority",
  ],
  "mfg-downtime": [
    "Line 2 stopped for 40 minutes because the feeder jammed",
    "Cleared it and restarted, running fine now",
  ],
  "pm-status": [
    "Workstream is API integration, we're blocked on getting API keys from the vendor",
  ],
  "pm-actionitems": [
    "We decided to push the launch date, John will update the roadmap by Wednesday",
  ],
  "fin-expense": [
    "Client dinner in Chicago for the Meridian deal, cost center is Sales, amount was $340",
  ],
  "fin-variance": [
    "Marketing budget line came in over because of an unplanned conference sponsorship, one-time cost",
  ],
  "proc-receipt": [
    "PO number 88213 arrived today, 40 units, 2 were damaged in transit",
  ],
  "proc-supplier": [
    "Supplier is Meridian Components, they're 2 weeks late on the order, this is affecting production, high severity",
  ],
};

for (const config of useCases) {
  console.log(`\n========== ${config.id} (${config.domain}) ==========`);
  const turns = scripts[config.id];
  if (!turns) {
    console.log("  NO TEST SCRIPT DEFINED");
    continue;
  }
  let report = emptyReport(config);
  turns.forEach((t, i) => {
    const result = processTurn(config, report, t);
    report = result.report;
    console.log(`--- Turn ${i + 1}: "${t}"`);
    console.log("  Reply:", result.reply);
    console.log("  Report:", JSON.stringify(result.report));
    console.log("  Complete:", result.complete);
  });
}
