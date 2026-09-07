(function () {
  const grid = document.getElementById("hubGrid");

  // Field Service lives in a separate repo/page — shown first as a static card.
  const fieldServiceSection = document.createElement("div");
  fieldServiceSection.innerHTML = `
    <h2>Field Service</h2>
    <div class="card-row">
      <a class="usecase-card external" href="https://github.com/Lalithprabu/field-service-ai-assistant" target="_blank" rel="noopener">
        <div class="card-title">Report-drafting assistant</div>
        <div class="card-desc">Technician describes the job in plain language; assistant drafts a structured service report live.</div>
        <span class="card-tag">Separate repo ↗</span>
      </a>
    </div>
  `;
  grid.appendChild(fieldServiceSection);

  const groups = {};
  window.useCases.forEach((uc) => {
    if (!groups[uc.domain]) groups[uc.domain] = [];
    groups[uc.domain].push(uc);
  });

  Object.keys(groups).forEach((domain) => {
    const section = document.createElement("div");
    const h = document.createElement("h2");
    h.textContent = domain;
    section.appendChild(h);

    const row = document.createElement("div");
    row.className = "card-row";

    groups[domain].forEach((uc) => {
      const a = document.createElement("a");
      a.className = "usecase-card";
      a.href = `./${uc.id}/index.html`;
      a.innerHTML = `
        <div class="card-title">${uc.title}</div>
        <div class="card-desc">${uc.subtitle}</div>
        ${uc.value ? `<div class="card-value">${uc.value}</div>` : ""}
      `;
      row.appendChild(a);
    });

    section.appendChild(row);
    grid.appendChild(section);
  });
})();
