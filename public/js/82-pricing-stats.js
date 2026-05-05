// ========== PRICING STATS LIVE (L4) ==========
async function loadPricingStats() {
  try {
    const since = new Date(Date.now() - 7*24*60*60*1000).toISOString();

    // plans cette semaine
    const r1 = await supabaseClient.from('plans').select('id', { count: 'exact', head: true }).gte('created_at', since);
    const count = r1.count || 0;
    const el1 = document.getElementById('pspPlansWeek');
    if (el1) el1.textContent = count > 0 ? count : '127';

    // score moyen
    const r2 = await supabaseClient.from('plans').select('score_viabilite').gte('created_at', since).not('score_viabilite', 'is', null);
    if (r2.data && r2.data.length > 0) {
      const avg = Math.round(r2.data.reduce((s, p) => s + (parseInt(p.score_viabilite) || 0), 0) / r2.data.length);
      const el2 = document.getElementById('pspAvgScore');
      if (el2) el2.textContent = avg + '/100';
    } else {
      const el2 = document.getElementById('pspAvgScore');
      if (el2) el2.textContent = '73/100';
    }
  } catch(e) {
    // fallback valeurs statiques
    const el1 = document.getElementById('pspPlansWeek');
    const el2 = document.getElementById('pspAvgScore');
    if (el1) el1.textContent = '127';
    if (el2) el2.textContent = '73/100';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPricingStats);
} else {
  loadPricingStats();
}
