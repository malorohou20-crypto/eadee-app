// ========== NAV DROPDOWN ==========
function toggleNavDropdown() {
  const dd = document.getElementById('nav-dropdown');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}
function closeNavDropdown() {
  const dd = document.getElementById('nav-dropdown');
  if (dd) dd.style.display = 'none';
}
function toggleNotifDropdown() {
  toast('Aucune nouvelle notification', '');
}
document.addEventListener('click', (e) => {
  const dd = document.getElementById('nav-dropdown');
  if (dd && dd.style.display !== 'none') {
    if (!e.target.closest('#nav-dropdown') && !e.target.closest('.nav-btn')) {
      dd.style.display = 'none';
    }
  }
});

function copyPlan() {
  if (!currentResult) return;
  const r = currentResult;
  const text = [
    `BUSINESS PLAN — ${r.nom_business}`,
    `${r.tagline}`,
    `Score de viabilité: ${r.score_viabilite}/100`,
    ``,
    `RÉSUMÉ EXÉCUTIF`,
    r.resume_executif,
    ``,
    `MARCHÉ`,
    `Taille: ${r.marche_taille} | Croissance: ${r.marche_croissance}`,
    r.marche_analyse,
    ``,
    `PROJECTIONS FINANCIÈRES`,
    `M1: ${r.rev_m1} | M3: ${r.rev_m3} | M6: ${r.rev_m6} | An3: ${r.rev_an3}`,
    ``,
    `CONCURRENTS`,
    (r.concurrents||[]).map(c => `- ${c.nom}: ${c.description}`).join('\n'),
    ``,
    `PLAN D'ACTION 90 JOURS`,
    (r.actions||[]).map(a => `[${a.phase}] ${a.titre} — ${a.detail}`).join('\n'),
    ``,
    `RISQUES & SOLUTIONS`,
    (r.risques||[]).map(ri => `${ri.titre}\n→ Solution : ${ri.solution}`).join('\n\n'),
  ].join('\n');
  navigator.clipboard.writeText(text).then(() => toast('Copié dans le presse-papiers ✓', 'success'));
}

function savePlan() {
  if (!currentResult) return;
  // Le plan est déjà ajouté à plansHistory et persisté dans generateDashPlan.
  // On s'assure juste que la version courante est bien sauvegardée.
  if (!plansHistory.includes(currentResult)) {
    plansHistory.unshift(currentResult);
  }
  localStorage.setItem('eadee_history', JSON.stringify(plansHistory));
  toast('Plan sauvegardé ✓', 'success');
}

// ========== FAQ ACCORDÉON ==========
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ========== FADE-UP OBSERVER ==========
(function() {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }});
  }, { threshold: 0.1 });
  function initFadeUp() {
    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFadeUp);
  } else {
    initFadeUp();
  }
})();

