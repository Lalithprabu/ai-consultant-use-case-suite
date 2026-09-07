/**
 * helpers.js — shared, generic extraction primitives used by every use case.
 *
 * These are intentionally simple (regex/keyword based), not a language model.
 * See docs/use-cases-overview.md for what a real LLM swap would look like.
 */

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Captures a code-like token right after a label — for identifiers with
 * no spaces (e.g. "Spec ref ENG-4471", "PO number 88213", "Line 3").
 */
function extractCode(text, labelWords) {
  const pattern = new RegExp(
    `(?:${labelWords.join("|")})\\s*(?:is|:|=|-)?\\s*([A-Za-z0-9][A-Za-z0-9-]{0,20})`,
    "i"
  );
  const m = text.match(pattern);
  return m ? m[1].toUpperCase() : "";
}

/**
 * Captures a short human-readable phrase after a label, stopping at the
 * first comma/period or end of string (e.g. "Customer is Acme Corp,").
 */
function extractPhrase(text, labelWords, maxLen = 50) {
  const pattern = new RegExp(
    `(?:${labelWords.join("|")})\\s*(?:is|:|=|-)?\\s+([A-Za-z0-9][^,.;\\n]{1,${maxLen}})`,
    "i"
  );
  const m = text.match(pattern);
  return m ? m[1].trim() : "";
}

/** Returns every item from `list` that appears in the text, capitalized. */
function extractKeywordList(text, list) {
  const lower = text.toLowerCase();
  return list.filter((w) => lower.includes(w)).map(cap);
}

/** Checks a mapping of [keyword, label] pairs in priority order, returns first hit. */
function extractFirstMatch(text, mapping) {
  const lower = text.toLowerCase();
  for (const [keyword, label] of mapping) {
    if (lower.includes(keyword)) return label;
  }
  return "";
}

/** Extracts a duration like "3 months", "2 weeks". */
function extractDuration(text) {
  const m = text.match(/\b(\d+)[\s-]*(day|days|week|weeks|month|months|year|years)\b/i);
  return m ? `${m[1]} ${m[2].toLowerCase()}` : "";
}

/** Generic "any further action needed?" detector, reused across domains. */
function extractFollowUp(text) {
  const lower = text.toLowerCase();
  if (/(no follow.?up|nothing further|no further action|all set|closed out|none needed)/.test(lower)) {
    return "None";
  }
  if (/(follow.?up|check back|revisit|circle back|needs review)/.test(lower)) {
    return "Needs follow-up";
  }
  return "";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    cap,
    extractCode,
    extractPhrase,
    extractKeywordList,
    extractFirstMatch,
    extractDuration,
    extractFollowUp,
  };
} else {
  window.Helpers = {
    cap,
    extractCode,
    extractPhrase,
    extractKeywordList,
    extractFirstMatch,
    extractDuration,
    extractFollowUp,
  };
}
