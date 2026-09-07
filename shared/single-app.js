/**
 * single-app.js — drives ONE use case page. The page sets
 * window.USE_CASE_ID before loading this script; everything else
 * (fields, questions, extraction) comes from useCases.js.
 */
(function () {
  const config = window.useCases.find((uc) => uc.id === window.USE_CASE_ID);

  if (!config) {
    document.body.innerHTML =
      "<p style='color:#e7ecf2;padding:40px;font-family:sans-serif'>Use case not found.</p>";
    return;
  }

  document.title = `${config.title} — ${config.domain}`;
  document.getElementById("eyebrow").textContent = config.domain;
  document.getElementById("pageTitle").textContent = config.title;
  document.getElementById("pageSubtitle").textContent = config.subtitle;
  const whyProblemEl = document.getElementById("whyProblem");
  const whyValueEl = document.getElementById("whyValue");
  if (whyProblemEl) whyProblemEl.textContent = config.problem || "";
  if (whyValueEl) whyValueEl.textContent = config.value || "";

  let report = window.emptyReport(config);
  let fieldSources = {};
  let messages = [{ role: "assistant", text: config.greeting }];

  const messagesEl = document.getElementById("messages");
  const inputEl = document.getElementById("input");
  const sendBtn = document.getElementById("sendBtn");
  const resetBtn = document.getElementById("resetBtn");
  const reportFieldsEl = document.getElementById("reportFields");
  const reportBadgeEl = document.getElementById("reportBadge");
  const suggestionsEl = document.getElementById("suggestions");
  const exportJsonBtn = document.getElementById("exportJsonBtn");
  const exportCsvBtn = document.getElementById("exportCsvBtn");

  inputEl.placeholder = config.placeholder;

  function renderSuggestions() {
    if (!suggestionsEl) return;
    suggestionsEl.innerHTML = "";
    (config.promptSuggestions || []).forEach((text) => {
      const chip = document.createElement("button");
      chip.className = "suggestion-chip";
      chip.textContent = text.length > 70 ? text.slice(0, 67) + "…" : text;
      chip.title = text;
      chip.addEventListener("click", () => {
        inputEl.value = text;
        sendMessage();
      });
      suggestionsEl.appendChild(chip);
    });
  }

  function renderMessages(thinking) {
    messagesEl.innerHTML = "";
    for (const m of messages) {
      const div = document.createElement("div");
      div.className = `message ${m.role}`;
      div.textContent = m.text;
      messagesEl.appendChild(div);
    }
    if (thinking) {
      const div = document.createElement("div");
      div.className = "message status";
      div.textContent = "Assistant is thinking…";
      messagesEl.appendChild(div);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function commitFieldEdit(key, el) {
    const newValue = el.textContent.trim();
    report[key] = newValue;
    if (newValue) {
      fieldSources[key] = "Manually edited";
    } else {
      delete fieldSources[key];
    }
    renderReport();
  }

  function renderReport() {
    reportFieldsEl.innerHTML = "";
    let filledCount = 0;
    for (const field of config.fields) {
      const value = report[field.key];
      if (value) filledCount++;

      const wrapper = document.createElement("div");
      const labelEl = document.createElement("div");
      labelEl.className = "field-label";
      labelEl.textContent = field.label;

      const valueEl = document.createElement("div");
      valueEl.className = "field-value" + (value ? " filled" : "");
      valueEl.textContent = value || "—";
      valueEl.contentEditable = "true";
      valueEl.spellcheck = false;
      if (fieldSources[field.key]) {
        valueEl.title = `Extracted from: "${fieldSources[field.key]}"\n(Click to edit)`;
      } else {
        valueEl.title = "Click to edit";
      }
      valueEl.addEventListener("focus", () => {
        if (valueEl.textContent === "—") valueEl.textContent = "";
      });
      valueEl.addEventListener("blur", () => commitFieldEdit(field.key, valueEl));
      valueEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          valueEl.blur();
        }
      });

      wrapper.appendChild(labelEl);
      wrapper.appendChild(valueEl);
      reportFieldsEl.appendChild(wrapper);
    }

    const total = config.fields.length;
    const complete = config.requiredForComplete.every((k) => report[k]);
    reportBadgeEl.textContent = complete ? "Ready to submit" : `${filledCount}/${total} fields`;
    reportBadgeEl.className = "badge" + (complete ? " complete" : "");
  }

  function downloadBlob(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    downloadBlob(`${config.id}-report.json`, JSON.stringify(report, null, 2), "application/json");
  }

  function exportCsv() {
    const rows = [["Field", "Value"]];
    config.fields.forEach((f) => rows.push([f.label, report[f.key] || ""]));
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadBlob(`${config.id}-report.csv`, csv, "text/csv");
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    messages.push({ role: "user", text });
    inputEl.value = "";
    sendBtn.disabled = true;
    renderMessages(true);

    setTimeout(() => {
      const result = window.processTurn(config, report, text);
      report = result.report;
      (result.newlyFilled || []).forEach((key) => {
        fieldSources[key] = text.length > 70 ? text.slice(0, 67) + "…" : text;
      });
      messages.push({ role: "assistant", text: result.reply });

      sendBtn.disabled = false;
      renderMessages(false);
      renderReport();
    }, 400);
  }

  function resetConversation() {
    report = window.emptyReport(config);
    fieldSources = {};
    messages = [{ role: "assistant", text: config.greeting }];
    renderMessages(false);
    renderReport();
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  resetBtn.addEventListener("click", resetConversation);
  if (exportJsonBtn) exportJsonBtn.addEventListener("click", exportJson);
  if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportCsv);

  renderSuggestions();
  renderMessages(false);
  renderReport();
})();
