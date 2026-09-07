/**
 * engine.js — the ONE generic function every use case runs through.
 * This is the reusable part; useCases.js configs are the only thing
 * that changes per domain.
 *
 * Extraction runs on each NEW message only (not the whole cumulative
 * conversation) and merges into the running report, filling blanks only.
 * This avoids one turn's text bleeding into another turn's fields.
 */

function emptyReport(config) {
  return Object.fromEntries(config.fields.map((f) => [f.key, ""]));
}

function processTurn(config, previousReport, latestMessage) {
  const extracted = config.extract(latestMessage);
  const report = { ...previousReport };
  const newlyFilled = [];

  for (const key of Object.keys(extracted)) {
    if (!report[key] && extracted[key]) {
      report[key] = extracted[key];
      newlyFilled.push(key);
    }
  }

  const missingKey = config.requiredForComplete.find((k) => !report[k]);
  const complete = !missingKey;

  let reply;
  if (missingKey && config.questions[missingKey]) {
    reply = config.questions[missingKey];
  } else if (complete) {
    reply = config.closingReply(report);
  } else {
    reply = "Got it — anything else to add before I finalize this?";
  }

  return { reply, report, complete, newlyFilled };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { processTurn, emptyReport };
} else {
  window.processTurn = processTurn;
  window.emptyReport = emptyReport;
}
