// ========== GENERATE PLAN — V2 ULTRA DÉTAILLÉ ==========
const genStatuses = [
  'Analyse de ton idée en profondeur...',
  'Recherche du marché et des chiffres réels...',
  'Identification des concurrents...',
  'Modélisation financière mois par mois...',
  'Construction du plan d\'action 90 jours...',
  'Calcul du score de viabilité...',
  'Finalisation du business plan complet...'
];

async function generateDashPlan() {
  if (!user) { showAuth('signup'); return; }

  const idea = document.getElementById('dashIdea').value.trim();
  if (!idea || idea.length < 8) {
    document.getElementById('dashIdea').style.borderColor = 'var(--rust)';
    setTimeout(() => document.getElementById('dashIdea').style.borderColor = '', 1500);
    toast('Décris ton idée d\'abord', 'error'); return;
  }

  if (userCredits <= 0) {
    toast('Plus de crédits — recharge un pack pour continuer', 'error');
    setTimeout(() => showView('billing'), 1000); return;
  }

  const budget = document.getElementById('dashBudget').value;
  const profile = document.getElementById('dashProfile').value;
  const sector = document.getElementById('dashSector').value;
  const time = document.getElementById('dashTime').value;

  // UI state
  document.getElementById('dashGenBtn').disabled = true;
  document.getElementById('dashEmptyState').style.display = 'none';
  document.getElementById('dashResult').style.display = 'none';
  setPreviewState('C');

  let si = 0;
  const statusInterval = setInterval(() => {
    if (si < genStatuses.length - 1) document.getElementById('genStatusText').textContent = genStatuses[++si];
  }, 1800);


  const prompt = `Tu es EADEE, le meilleur consultant business au monde. Génère un business plan EXCEPTIONNEL, ultra-complet et 100% actionnable pour un entrepreneur français.

PROJET:
- Idée: ${idea}
- Budget: ${budget}
- Profil: ${profile}
- Secteur: ${sector}
- Disponibilité: ${time}
- Marché: France, Avril 2026

RÈGLES ABSOLUES:
- Chiffres de marché RÉELS (cite Xerfi, INSEE, Statista, BPI)
- Concurrents RÉELS avec leurs vrais prix actuels
- Projections RÉALISTES basées sur des hypothèses expliquées
- Actions ULTRA CONCRÈTES (qui fait quoi, combien, avec quel outil, quel résultat attendu)
- Templates d'emails PRÊTS À ENVOYER (personnalisés pour ce secteur)
- Démarches administratives PRÉCISES pour la France en 2026

Réponds UNIQUEMENT avec un JSON valide (sans markdown ni backticks):

{
  "nom_business": "Nom court, percutant, mémorable",
  "tagline": "Slogan accrocheur en 6-8 mots",
  "score_viabilite": 82,
  "pitch_30s": "Pitch de 30 secondes prêt à l'emploi: commence par le problème, présente la solution, le marché, le modèle économique et l'appel à l'action. 4-5 phrases percutantes.",

  "resume_executif": "5-6 phrases: problème précis résolu, solution différenciante, marché cible chiffré, modèle économique, avantage concurrentiel durable, ambition 3 ans.",

  "persona": {
    "nom": "Prénom fictif représentatif",
    "age": "30-45 ans",
    "situation": "Description précise: profession, revenus, situation familiale",
    "douleurs": "3 problèmes principaux qu'il/elle rencontre en lien avec ton offre",
    "motivations": "Ce qui le/la pousse à chercher une solution",
    "ou_le_trouver": "Où il/elle se trouve en ligne et en physique"
  },

  "marche_taille": "X Mds€ ou M€",
  "marche_croissance": "+X%/an",
  "marche_part_cible": "0,0X%",
  "marche_clients_potentiels": "XX 000",
  "marche_analyse": "5-6 phrases: taille exacte du marché avec source, tendances 2024-2026, opportunité spécifique non exploitée, segment cible précis, timing favorable.",

  "modele_economique": "4-5 phrases détaillées: flux de revenus, pricing strategy justifiée, récurrence, upsell possible, LTV client estimée.",
  "offres": [
    {"nom": "Nom offre 1", "description": "Contenu précis, à qui elle s'adresse, ce qu'elle résout", "prix": "X€"},
    {"nom": "Nom offre 2", "description": "Contenu précis avec inclus/exclus", "prix": "X€/mois"},
    {"nom": "Nom offre 3", "description": "Offre premium avec tout inclus", "prix": "X€"}
  ],

  "concurrence_intro": "3 phrases: état du marché concurrentiel, où se situe l'opportunité, ton positionnement différenciant.",
  "concurrents": [
    {"nom": "Concurrent réel 1", "description": "Ce qu'ils font exactement + prix réels + leurs points faibles", "menace": "haute"},
    {"nom": "Concurrent réel 2", "description": "Détails + prix + failles exploitables", "menace": "moyenne"},
    {"nom": "Concurrent réel 3", "description": "Détails + prix + différences", "menace": "faible"},
    {"nom": "Concurrent réel 4", "description": "Détails + prix + opportunité de différenciation", "menace": "moyenne"}
  ],

  "rev_m1": "X€",
  "rev_m3": "X €",
  "rev_m6": "X €",
  "rev_m12": "X €",
  "rev_mensuel": [200, 600, 1200, 1800, 2500, 3200, 3800, 4400, 5000, 5700, 6500, 7500],
  "finances_detail": [
    {"label": "CA annuel estimé (an 1)", "valeur": "XX XXX€"},
    {"label": "Charges fixes mensuelles", "valeur": "X XXX€"},
    {"label": "Charges variables (% CA)", "valeur": "XX%"},
    {"label": "Marge brute", "valeur": "XX%"},
    {"label": "Point mort mensuel", "valeur": "X XXX€/mois"},
    {"label": "Break-even atteint", "valeur": "Mois X"},
    {"label": "ROI investissement initial", "valeur": "XXX% sur 12 mois"}
  ],

  "acquisition": [
    {"canal": "Canal principal", "description": "Stratégie détaillée: volume quotidien, message type, taux conversion visé, budget, outils utilisés", "cac": "CAC estimé: XX€"},
    {"canal": "Canal secondaire", "description": "Actions précises, fréquence, KPI à suivre, coût estimé", "cac": "CAC estimé: XX€"},
    {"canal": "Canal tertaire", "description": "Partenariats ou référencement: qui contacter, comment, modèle", "cac": "CAC estimé: XX€"}
  ],

  "actions": [
    {"phase": "Sem 1", "titre": "Action concrète", "detail": "Détail précis avec chiffres, outils, objectif mesurable"},
    {"phase": "Sem 2", "titre": "Action concrète", "detail": "Détail précis"},
    {"phase": "Sem 3-4", "titre": "Action concrète", "detail": "Détail précis avec KPI"},
    {"phase": "Mois 2", "titre": "Action concrète", "detail": "Détail précis"},
    {"phase": "Mois 2", "titre": "Action concrète", "detail": "Détail précis avec objectif CA"},
    {"phase": "Mois 3", "titre": "Action concrète", "detail": "Détail précis"},
    {"phase": "Mois 3", "titre": "Action concrète", "detail": "Objectif chiffré clair"}
  ],

  "investissements": [
    {"label": "Poste précis 1", "montant": "XXX€"},
    {"label": "Poste précis 2", "montant": "XXX€"},
    {"label": "Poste précis 3", "montant": "XXX€"},
    {"label": "Poste précis 4", "montant": "XXX€"},
    {"label": "Poste précis 5", "montant": "XXX€"},
    {"label": "TOTAL investissement", "montant": "X XXX€", "total": true}
  ],

  "risques": [
    {"titre": "Risque business précis", "niveau": "élevé", "solution": "Plan d'action concret: indicateurs d'alerte + actions correctives"},
    {"titre": "Risque marché précis", "niveau": "moyen", "solution": "Comment le détecter tôt et y répondre"},
    {"titre": "Risque opérationnel", "niveau": "faible", "solution": "Mesures préventives concrètes"},
    {"titre": "Risque financier", "niveau": "moyen", "solution": "Seuils d'alerte et plan B chiffré"}
  ],

  "kpis": [
    {"nom": "KPI 1 essentiel", "cible": "Valeur cible précise", "frequence": "Hebdomadaire"},
    {"nom": "KPI 2 essentiel", "cible": "Valeur cible", "frequence": "Mensuel"},
    {"nom": "KPI 3 essentiel", "cible": "Valeur cible", "frequence": "Mensuel"},
    {"nom": "KPI 4 essentiel", "cible": "Valeur cible", "frequence": "Trimestriel"}
  ],

  "outils": [
    {"nom": "Outil réel 1", "usage": "Usage précis dans ce projet", "prix": "X€/mois"},
    {"nom": "Outil réel 2", "usage": "Usage précis", "prix": "Gratuit"},
    {"nom": "Outil réel 3", "usage": "Usage précis", "prix": "X€/mois"},
    {"nom": "Outil réel 4", "usage": "Usage précis", "prix": "Gratuit"},
    {"nom": "Outil réel 5", "usage": "Usage précis", "prix": "X€/mois"},
    {"nom": "Outil réel 6", "usage": "Usage précis", "prix": "X€/mois"}
  ],

  "demarches_admin": [
    {"etape": "1. Choisir le statut juridique", "detail": "Pour ce projet, recommande le statut optimal (SASU, EURL, micro-entreprise...) avec justification précise selon CA projeté et fiscalité", "delai": "Jour 1-3", "cout": "0-500€", "lien": "infogreffe.fr ou guichet-entreprises.fr"},
    {"etape": "2. Immatriculation", "detail": "Démarche précise sur guichet-entreprises.fr, documents nécessaires, SIRET obtenu sous 3-5 jours", "delai": "Semaine 1", "cout": "0€ (micro) à 250€ (société)", "lien": "guichet-entreprises.fr"},
    {"etape": "3. Ouverture compte pro", "detail": "Banques recommandées pour ce secteur avec comparatif tarifaire", "delai": "Semaine 1-2", "cout": "0-30€/mois", "lien": "shine.fr ou qonto.com"},
    {"etape": "4. Inscription URSSAF", "detail": "Automatique pour micro, sinon déclaration DSN. Cotisations estimées pour ce projet.", "delai": "Automatique à l'immatriculation", "cout": "Cotisations: 22-45% du CA", "lien": "urssaf.fr"},
    {"etape": "5. Assurance professionnelle", "detail": "RC Pro obligatoire ou recommandée pour ce secteur. Assureurs spécialisés.", "delai": "Avant premier client", "cout": "200-800€/an selon secteur", "lien": "hiscox.fr ou axa.fr"},
    {"etape": "6. Obligations sectorielles", "detail": "Licences, certifications ou autorisations spécifiques à ce secteur en France", "delai": "Variable", "cout": "Variable", "lien": "service-public.fr"}
  ],

  "email_fournisseur": {
    "sujet": "Objet de l'email de contact fournisseur adapté au secteur",
    "corps": "Email complet et professionnel prêt à envoyer. Présentation de la société, du projet, volume estimé, demande de tarifs/catalogue, coordonnées. Ton professionnel mais direct. 150-200 mots."
  },

  "email_prospection": {
    "sujet": "Objet accrocheur et personnalisé pour les prospects cibles",
    "corps": "Email de prospection froid efficace: accroche sur un problème précis du prospect, présentation de la solution en 2 lignes, preuve sociale ou résultat concret, appel à l'action clair (RDV 15 min). 120-150 mots. Ton direct et valeur immédiate."
  },

  "email_relance": {
    "sujet": "Objet de relance J+7",
    "corps": "Email de relance court et percutant pour prospects qui n'ont pas répondu. Apporte une valeur supplémentaire (conseil, stat, question). 60-80 mots max."
  }
}`;

  try {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(`API error ${res.status}: ${errData.error?.message || res.statusText}`);
    }

    const data = await res.json();

    if (!data.content || !data.content.length) {
      throw new Error('Réponse vide de l\'API');
    }

    const text = data.content.map(i => i.text || '').join('');

    // JSON already cleaned server-side by proxy
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Réponse invalide — réessaie');
    const plan = JSON.parse(jsonMatch[0]);

    clearInterval(statusInterval);
    fillPlan(plan);

    currentResult = { ...plan, idea, date: new Date(), id: Date.now() };
    plansHistory.unshift(currentResult);
    localStorage.setItem('eadee_history', JSON.stringify(plansHistory));
    userCredits = Math.max(0, userCredits - 1);
    updateUsage();
    // Persister les crédits (demo = localStorage, users réels = Supabase)
    if (IS_DEMO) {
      localStorage.setItem('eadee_demo_credits', String(userCredits));
    } else if (supabaseClient && user) {
      supabaseClient.from('profiles').update({ credits: userCredits }).eq('id', (await supabaseClient.auth.getUser()).data.user?.id).then(() => {});
    }

    stopGenSectionsAnim();
    setPreviewState(null);
    document.getElementById('dashGenerating').style.display = 'none';
    document.getElementById('dashResult').style.display = 'flex';
    toast('Business plan complet généré ✓', 'success');

  } catch(err) {
    clearInterval(statusInterval);
    stopGenSectionsAnim();
    setPreviewState('A');
    console.error('Erreur génération:', err);
    document.getElementById('dashGenerating').style.display = 'none';
    document.getElementById('dashEmptyState').style.display = 'none';
    const errStateEl = document.getElementById('dashEmptyState');
    errStateEl.innerHTML = `
      <div style="font-size:11px;font-family:'DM Mono',monospace;letter-spacing:0.15em;color:rgba(255,255,255,0.25);margin-bottom:12px">ERREUR</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.5);max-width:260px;line-height:1.6;text-align:center">
        <strong style="color:rgba(255,255,255,0.7)">Erreur :</strong><br><span id="dashErrMsg"></span>
      </div>
      <button onclick="resetGenerator()" style="margin-top:16px;padding:8px 20px;background:var(--acid);color:var(--ink);border:none;border-radius:4px;font-family:\'Bebas Neue\',sans-serif;font-size:16px;letter-spacing:0.1em;cursor:pointer;">Réessayer</button>
    `;
    document.getElementById('dashErrMsg').textContent = err.message || 'Problème de connexion. Réessaie.';
    toast('Erreur — voir le détail dans le panneau', 'error');
  }

  document.getElementById('dashGenBtn').disabled = false;
}

function resetGenerator() {
  setPreviewState('A');
  document.getElementById('dashEmptyState').style.display = 'none';
  document.getElementById('dashResult').style.display = 'none';
}

// Sanitize helper — échappe les caractères HTML pour éviter les injections XSS
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fillPlan(plan) {
  // Header
  document.getElementById('dBizName').textContent = plan.nom_business || '—';
  document.getElementById('dBizTagline').textContent = plan.tagline || '';
  const badge = document.getElementById('dPlanBadge');
  if (badge) {
    const labels = { empire: 'Empire ✦', builder: 'Builder', starter: 'Starter' };
    badge.textContent = labels[currentPlan] || 'Starter';
    if (currentPlan === 'empire') { badge.style.background = 'rgba(167,139,250,0.15)'; badge.style.borderColor = 'rgba(167,139,250,0.3)'; badge.style.color = '#a78bfa'; }
    else if (currentPlan === 'builder') { badge.style.background = 'rgba(107,143,239,0.12)'; badge.style.borderColor = 'rgba(107,143,239,0.25)'; badge.style.color = '#9db8f8'; }
    else { badge.style.background = 'rgba(255,255,255,0.05)'; badge.style.borderColor = 'rgba(255,255,255,0.1)'; badge.style.color = '#7a7f9a'; }
  }
  const score = plan.score_viabilite || 72;
  document.getElementById('dScore').textContent = score + '/100';
  setTimeout(() => { document.getElementById('dScoreBar').style.width = score + '%'; }, 200);

  // 1. Résumé exécutif
  document.getElementById('dResume').textContent = plan.resume_executif || '';

  // 2. Marché
  document.getElementById('dMktSize').textContent = plan.marche_taille || '—';
  document.getElementById('dMktGrowth').textContent = plan.marche_croissance || '—';
  document.getElementById('dMktShare').textContent = plan.marche_part_cible || '—';
  document.getElementById('dMktClients').textContent = plan.marche_clients_potentiels || '—';
  document.getElementById('dMarche').textContent = plan.marche_analyse || '';

  // 3. Modèle économique
  document.getElementById('dModele').textContent = plan.modele_economique || '';
  const offresEl = document.getElementById('dOffresBlock');
  offresEl.innerHTML = (plan.offres || []).map(o => `
    <div class="offre-card">
      <div><div class="offre-name">${esc(o.nom)}</div><div class="offre-desc">${esc(o.description)}</div></div>
      <div class="offre-price">${esc(o.prix)}</div>
    </div>`).join('');

  // 4. Concurrents
  document.getElementById('dConcurrenceIntro').textContent = plan.concurrence_intro || '';
  document.getElementById('dConcurrents').innerHTML = (plan.concurrents || []).map(c => `
    <div class="concurrent-card">
      <div class="cc-name">${esc(c.nom)}</div>
      <div class="cc-desc">${esc(c.description)}</div>
      <div class="cc-threat threat-${c.menace === 'haute' ? 'high' : c.menace === 'moyenne' ? 'med' : 'low'}">${esc(c.menace)}</div>
    </div>`).join('');

  // 5. Finances
  document.getElementById('dRev1').textContent = plan.rev_m1 || '—';
  document.getElementById('dRev3').textContent = plan.rev_m3 || '—';
  document.getElementById('dRev6').textContent = plan.rev_m6 || '—';
  document.getElementById('dRev12').textContent = plan.rev_m12 || '—';

  // Draw revenue chart
  drawRevenueChart(plan.rev_mensuel || []);

  document.getElementById('dFinancesDetail').innerHTML = (plan.finances_detail || []).map(f => `
    <div class="stat-mini"><div class="stat-mini-label">${esc(f.label)}</div><div class="stat-mini-val">${esc(f.valeur)}</div></div>`).join('');

  // 6. Acquisition
  document.getElementById('dAcquisition').innerHTML = (plan.acquisition || []).map(a => `
    <div class="acq-card">
      <div class="acq-canal">${esc(a.canal)}</div>
      <div class="acq-desc">${esc(a.description)}</div>
      <div class="acq-cac">${esc(a.cac)}</div>
    </div>`).join('');

  // 7. Actions 90j
  document.getElementById('dActions').innerHTML = (plan.actions || []).map(a => `
    <div class="action-row">
      <div class="action-phase">${esc(a.phase)}</div>
      <div class="action-content">
        <div class="action-title">${esc(a.titre)}</div>
        <div class="action-detail">${esc(a.detail)}</div>
      </div>
    </div>`).join('');

  // 8. Investissements
  document.getElementById('dInvestissement').innerHTML = (plan.investissements || []).map(i => `
    <div class="invest-row${i.total ? ' total' : ''}">
      <span class="invest-label">${esc(i.label)}</span>
      <span class="invest-amount">${esc(i.montant)}</span>
    </div>`).join('');

  // 9. Risques
  document.getElementById('dRisques').innerHTML = (plan.risques || []).map(r => `
    <div class="risk-card">
      <div class="risk-title">${esc(r.titre)}</div>
      <div class="risk-solution"><strong>Solution :</strong> ${esc(r.solution)}</div>
    </div>`).join('');

  // 10. Outils
  document.getElementById('dOutils').innerHTML = (plan.outils || []).map(o => `
    <div class="outil-card">
      <div class="outil-name">${esc(o.nom)}</div>
      <div class="outil-usage">${esc(o.usage)}</div>
      <div class="outil-prix">${esc(o.prix)}</div>
    </div>`).join('');

  // 11. KPIs
  document.getElementById('dKpis').innerHTML = (plan.kpis || []).map(k => `
    <div class="stat-mini">
      <div class="stat-mini-label">${esc(k.nom)}</div>
      <div class="stat-mini-val" style="font-size:18px">${esc(k.cible)}</div>
      <div style="font-family:'DM Mono',monospace;font-size:9px;color:rgba(255,255,255,0.3);margin-top:4px">${esc(k.frequence)}</div>
    </div>`).join('');

  // 12. Pitch 30s
  document.getElementById('dPitch').textContent = plan.pitch_30s || '';

  // 13. Persona
  const p = plan.persona;
  document.getElementById('dPersona').innerHTML = p ? `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="stat-mini"><div class="stat-mini-label">Prénom / Âge</div><div style="font-size:15px;font-weight:700;color:#fff;margin-top:4px">${esc(p.nom)}, ${esc(p.age)}</div></div>
      <div class="stat-mini"><div class="stat-mini-label">Situation</div><div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;line-height:1.5">${esc(p.situation)}</div></div>
      <div class="stat-mini" style="grid-column:span 2"><div class="stat-mini-label">Douleurs principales</div><div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;line-height:1.6">${esc(p.douleurs)}</div></div>
      <div class="stat-mini"><div class="stat-mini-label">Motivations</div><div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;line-height:1.5">${esc(p.motivations)}</div></div>
      <div class="stat-mini"><div class="stat-mini-label">Où le trouver</div><div style="font-size:13px;color:var(--acid);margin-top:4px;line-height:1.5">${esc(p.ou_le_trouver)}</div></div>
    </div>` : '';


  // 14. Démarches admin (Builder/Empire seulement)
  if (plan.demarches_admin) {
    document.getElementById('dDemarchesBlock').style.display = 'block';
    document.getElementById('dDemarches').innerHTML = (plan.demarches_admin || []).map(d => `
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:8px;padding:14px 16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700;font-size:13px;color:#fff">${esc(d.etape)}</div>
          <div style="display:flex;gap:8px">
            <span style="font-family:'DM Mono',monospace;font-size:10px;background:rgba(107,143,239,0.1);color:var(--acid);padding:2px 8px;border-radius:20px">${esc(d.delai)}</span>
            <span style="font-family:'DM Mono',monospace;font-size:10px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.5);padding:2px 8px;border-radius:20px">${esc(d.cout)}</span>
          </div>
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.65;margin-bottom:6px">${esc(d.detail)}</div>
        <a href="https://${esc(d.lien)}" target="_blank" rel="noopener noreferrer" style="font-family:'DM Mono',monospace;font-size:11px;color:var(--acid);text-decoration:none;opacity:0.7">→ ${esc(d.lien)}</a>
      </div>`).join('');

  // 15. Emails (Builder/Empire seulement)
  if (plan.email_fournisseur || plan.email_prospection) {
    document.getElementById('dEmailsBlock').style.display = 'block';
    const emails = [];
    if (plan.email_fournisseur) emails.push({ label: 'Email Fournisseur', data: plan.email_fournisseur });
    if (plan.email_prospection) emails.push({ label: 'Email Prospection Client', data: plan.email_prospection });
    if (plan.email_relance) emails.push({ label: 'Email Relance (J+7)', data: plan.email_relance });

    document.getElementById('dEmails').innerHTML = emails.map(e => `
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between">
          <div style="font-weight:700;font-size:14px;color:#fff">${esc(e.label)}</div>
          <button onclick="copyEmail(this)" data-text="${encodeURIComponent('Objet: ' + e.data.sujet + '\n\n' + e.data.corps)}"
            style="font-family:'DM Mono',monospace;font-size:11px;background:rgba(107,143,239,0.1);color:var(--acid);border:1px solid rgba(107,143,239,0.2);border-radius:20px;padding:4px 12px;cursor:pointer">
            Copier
          </button>
        </div>
        <div style="padding:14px 16px">
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:rgba(255,255,255,0.35);margin-bottom:6px">OBJET</div>
          <div style="font-size:13px;color:var(--acid);font-weight:600;margin-bottom:12px">${esc(e.data.sujet)}</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:rgba(255,255,255,0.35);margin-bottom:6px">CORPS DU MESSAGE</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.75;white-space:pre-wrap">${esc(e.data.corps)}</div>
        </div>
      </div>`).join('');
  }

  // 16. Documents annexes (Livrable 5)
  fillDocumentsAnnexes(plan);

  // 17. Checklist bancabilité (Livrable 6)
  fillBancabilite(plan);

  // Livrable 7 — indicateurs fiabilité : remplace [VERIFIE]/[ESTIMATION]/[HYPOTHESE]
  const scrollBody = document.getElementById('planScrollBody');
  if (scrollBody) applyReliabilityIndicators(scrollBody);
}

function copyEmail(btn) {
  const text = decodeURIComponent(btn.dataset.text);
  navigator.clipboard.writeText(text).then(() => toast('Email copié ✓', 'success'));
}

function drawRevenueChart(monthlyData) {
  const canvas = document.getElementById('revenueChart');
  if (!canvas || !monthlyData.length) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.parentElement.offsetWidth || 500;
  const H = 160;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const max = Math.max(...monthlyData, 1);
  const pad = { l: 52, r: 16, t: 16, b: 32 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const step = cw / (monthlyData.length - 1);

  // Grid lines + Y labels
  const gridSteps = 4;
  ctx.textAlign = 'right';
  ctx.font = '10px DM Mono, monospace';
  for (let i = 0; i <= gridSteps; i++) {
    const y = pad.t + ch - (i / gridSteps) * ch;
    const val = Math.round((i / gridSteps) * max);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    const label = val >= 1000 ? (val/1000).toFixed(0)+'k€' : val+'€';
    ctx.fillText(label, pad.l - 6, y + 4);
  }

  // Smooth curve points
  const pts = monthlyData.map((v, i) => ({
    x: pad.l + i * step,
    y: pad.t + ch - (v / max) * ch
  }));

  // Gradient fill under curve
  const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
  grad.addColorStop(0, 'rgba(107,143,239,0.2)');
  grad.addColorStop(1, 'rgba(107,143,239,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i-1].x + pts[i].x) / 2;
    ctx.bezierCurveTo(cpx, pts[i-1].y, cpx, pts[i].y, pts[i].x, pts[i].y);
  }
  ctx.lineTo(pts[pts.length-1].x, H - pad.b);
  ctx.lineTo(pts[0].x, H - pad.b);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Smooth line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i-1].x + pts[i].x) / 2;
    ctx.bezierCurveTo(cpx, pts[i-1].y, cpx, pts[i].y, pts[i].x, pts[i].y);
  }
  ctx.strokeStyle = '#9db8f8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Data points + values for key months
  [0, 2, 5, 8, 11].forEach(i => {
    if (!pts[i]) return;
    const {x, y} = pts[i];
    // Dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI*2);
    ctx.fillStyle = '#9db8f8';
    ctx.fill();
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Value label above dot
    const val = monthlyData[i];
    const label = val >= 1000 ? (val/1000).toFixed(1)+'k€' : val+'€';
    ctx.fillStyle = '#9db8f8';
    ctx.font = 'bold 10px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 9);
    // Month label below
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '10px DM Mono, monospace';
    ctx.fillText('M'+(i+1), x, H - pad.b + 18);
  });
}



function updateUsage() {
  const maxCredits = currentPlan === 'empire' ? 8 : currentPlan === 'builder' ? 3 : 1;
  const pct = Math.min((userCredits / maxCredits) * 100, 100);
  document.getElementById('usageFill').style.width = pct + '%';
  // Widget sidebar : affiche juste le chiffre (Bebas Neue grand format)
  document.getElementById('usageCount').textContent = userCredits <= 0 ? '0' : String(userCredits);
  // Amélioration 1 — bouton désactivé si 0 crédit
  const btn = document.getElementById('dashGenBtn');
  const banner = document.getElementById('noCredit-banner');
  if (btn) {
    if (userCredits <= 0) {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
      if (banner) banner.style.display = 'flex';
    } else {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = '';
      if (banner) banner.style.display = 'none';
    }
  }
  // Amélioration 2 — sidebar CTA
  const scBuy = document.getElementById('sc-buy-btn');
  const scRecharge = document.getElementById('sc-recharge-btn');
  if (scBuy && scRecharge) {
    if (userCredits <= 0) {
      scBuy.style.display = 'block';
      scRecharge.style.display = 'none';
    } else {
      scBuy.style.display = 'none';
      scRecharge.style.display = 'block';
    }
  }
}

