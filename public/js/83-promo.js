// ========== SYSTÈME PROMO LANCEMENT (L5) ==========
const PROMO = {
  active: true,
  label: 'OFFRE LANCEMENT -30%',
  endDate: '2026-06-30',
  discountPercent: 30
};

const BASE_PRICES = {
  solo:   { original: 18.55, current: 12.99, credits: 1 },
  pro:    { original: 42.84, current: 29.99, credits: 3 },
  empire: { original: 85.70, current: 59.99, credits: 8 },
};

function applyPromo() {
  if (!PROMO.active) return;

  // Afficher la bannière promo si elle existe
  const banner = document.getElementById('promoBanner');
  if (banner) banner.style.display = 'flex';

  // Afficher le compte à rebours
  updatePromoCountdown();
  setInterval(updatePromoCountdown, 60000);

  // Afficher les prix barrés sur les cartes
  document.querySelectorAll('[data-promo-original]').forEach(el => {
    el.style.display = '';
  });
}

function updatePromoCountdown() {
  const end = new Date(PROMO.endDate + 'T23:59:59');
  const now = new Date();
  const diff = end - now;
  if (diff <= 0) return;
  const days = Math.floor(diff / (1000*60*60*24));
  const el = document.getElementById('promoCountdown');
  if (el) el.textContent = `Offre valable encore ${days} jour${days > 1 ? 's' : ''}`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyPromo);
} else {
  applyPromo();
}
