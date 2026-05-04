
// ========== TOAST ==========
function toast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ========== UTILS ==========
function scrollToPricing() {
  document.getElementById('pricingSection').scrollIntoView({ behavior: 'smooth' });
}

