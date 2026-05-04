// ========== PREVIEW STATES ==========
const GEN_SECTIONS = [
  '01 — Résumé Exécutif','02 — Marché & Opportunité','03 — Modèle Économique',
  '04 — Analyse Concurrentielle','05 — Projections Financières','06 — Acquisition Client',
  '07 — Plan d\'Action 90 Jours','08 — Investissement & Charges','09 — Risques & Mitigation',
  '10 — Ressources & Outils','11 — KPIs','12 — Pitch 30s','13 — Persona Client'
];
let _genSectionTimer = null;

function setPreviewState(state) {
  ['A','B','C'].forEach(s => {
    const el = document.getElementById('preview-state-' + s);
    if (el) el.style.display = 'none';
  });
  if (state === 'A' || state === 'B' || state === 'C') {
    const el = document.getElementById('preview-state-' + state);
    if (el) el.style.display = 'flex';
  }
  if (state === 'C') startGenSectionsAnim();
  if (state === 'A') { setTimeout(startLiveFeed, 100); }
  else { stopLiveFeed(); }
}

function startGenSectionsAnim() {
  const list = document.getElementById('gen-sections-list');
  const bar = document.getElementById('gen-progress-bar');
  const statusEl = document.getElementById('genStatusText');
  if (!list) return;
  list.innerHTML = GEN_SECTIONS.map((s,i) =>
    `<div class="gen-section-row" id="gsrow-${i}"><span class="gsrow-icon" id="gsicon-${i}">·</span>${s}</div>`
  ).join('');
  let idx = 0;
  let elapsed = 0;
  if (_genSectionTimer) clearInterval(_genSectionTimer);
  _genSectionTimer = setInterval(() => {
    elapsed += 3;
    if (statusEl) statusEl.textContent = `Génération en cours… ${elapsed}s`;
    if (idx > 0) {
      const prev = document.getElementById('gsrow-' + (idx-1));
      const prevIcon = document.getElementById('gsicon-' + (idx-1));
      if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
      if (prevIcon) prevIcon.textContent = '✓';
    }
    if (idx < GEN_SECTIONS.length) {
      const row = document.getElementById('gsrow-' + idx);
      const icon = document.getElementById('gsicon-' + idx);
      if (row) row.classList.add('active');
      if (icon) icon.textContent = '⟳';
      if (bar) bar.style.width = Math.min(((idx+1)/GEN_SECTIONS.length*100), 95) + '%';
    }
    idx++;
    if (idx > GEN_SECTIONS.length) clearInterval(_genSectionTimer);
  }, 3000);
}

function stopGenSectionsAnim() {
  if (_genSectionTimer) clearInterval(_genSectionTimer);
  const bar = document.getElementById('gen-progress-bar');
  if (bar) bar.style.width = '100%';
}

