// ========== HERO IMMERSIF — IDLE ANIMATIONS ==========
function initHeroIdleAnimations() {
  loadHeroStats();

  // Checklist : checker les items non-done progressivement
  const items = document.querySelectorAll('#heroChecklist .mfc-item:not(.done)');
  let idx = 0;
  if (items.length > 0) {
    setInterval(() => {
      if (idx < items.length) { items[idx].classList.add('done-animated'); idx++; }
    }, 9000);
  }

  // Démarches admin : cycler les statuts
  document.querySelectorAll('.admin-status').forEach((el, i) => {
    const states = (el.dataset.states || '').split(',');
    if (states.length < 2) return;
    let si = 0;
    setInterval(() => {
      si = (si + 1) % states.length;
      const s = states[si].trim();
      el.textContent = s;
      el.className = 'mfc-tag admin-status';
      if (s === 'Généré')   { el.classList.add('done'); }
      else if (s === 'En cours') { el.classList.add('pending'); el.dataset.state = 'gold'; }
      else { el.dataset.state = 'muted'; }
    }, 11000 + i * 2500);
  });
}

async function loadHeroStats() {
  try {
    if (!window.supabaseClient) return;
    const [r1, r2] = await Promise.all([
      supabaseClient.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseClient.from('plans').select('score_viabilite').not('score_viabilite', 'is', null)
    ]);
    const cnt = r1.count || 0;
    const disp = cnt > 9999 ? Math.floor(cnt/1000)+'K+' : cnt > 999 ? Math.floor(cnt/100)*100+'+' : '1 000+';
    document.querySelectorAll('[data-stat="users-count"]').forEach(el => el.textContent = disp);
    if (r2.data && r2.data.length > 0) {
      const avg = Math.round(r2.data.reduce((s,p) => s+(parseInt(p.score_viabilite)||0), 0) / r2.data.length);
      document.querySelectorAll('[data-stat="avg-score"]').forEach(el => el.textContent = avg);
    }
  } catch(e) { /* fallback statique déjà en HTML */ }
}

function scrollToNextSection() {
  const hero = document.querySelector('.hero-immersive');
  const next = hero ? hero.nextElementSibling : null;
  if (next) next.scrollIntoView({ behavior: 'smooth' });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroIdleAnimations);
} else {
  initHeroIdleAnimations();
}

// ========== HERO MOCK 3D TILT (mousemove) ==========
(function() {
  function initMockTilt() {
    const wrap = document.querySelector('.hero-mock-wrap');
    const mock = document.querySelector('.hero-mock-app');
    if (!wrap || !mock) return;

    let rafId = null;
    let isHovering = false;

    wrap.addEventListener('mousemove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);   // -1 à +1
        const dy = (e.clientY - cy) / (rect.height / 2);  // -1 à +1
        const rotY = dx * 12;
        const rotX = -dy * 7;
        mock.style.animation = 'none';
        mock.style.transform = `perspective(1600px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.02)`;
        mock.style.boxShadow = `${-rotY * 3}px 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)`;
        mock.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease';
      });
    });

    wrap.addEventListener('mouseleave', () => {
      mock.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
      mock.style.transform = '';
      mock.style.boxShadow = '';
      setTimeout(() => {
        mock.style.animation = '';
        mock.style.transition = '';
      }, 600);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMockTilt);
  } else {
    initMockTilt();
  }
})();

