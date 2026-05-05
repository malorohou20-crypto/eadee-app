// ========== SUPABASE ==========
let supabaseClient = null;

const IS_DEMO = new URLSearchParams(window.location.search).get('preview') === 'eadee2024';

async function initSupabase() {
  if (IS_DEMO) return; // mode démo — pas besoin de Supabase
  try {
    const res = await fetch('/api/config');
    const cfg = await res.json();
    if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
      supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
      supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') loadCurrentUser();
        if (event === 'SIGNED_OUT') { user = null; userCredits = 0; currentPlan = 'free'; updateNav(); }
      });
      await loadCurrentUser();
    }
  } catch(e) {
    console.warn('Supabase init failed:', e);
  }
}

window.addEventListener('DOMContentLoaded', initSupabase);

// ========== STATE ==========
let user = null;
let currentPlan = 'free';
let plansHistory = (function() {
  try {
    return JSON.parse(localStorage.getItem('eadee_history') || '[]').map(p => ({ ...p, date: new Date(p.date) }));
  } catch(e) {
    console.warn('eadee_history corrompue, réinitialisation.', e);
    localStorage.removeItem('eadee_history');
    return [];
  }
})();
let selectedPayPlan = { name: 'Pro', price: 29.99, credits: 3 };
let userCredits = 0;
let currentResult = null;

