// ── Template plan de trésorerie 12 mois (Excel) ──────────────────────

export function buildTresorerieData(plan) {
  const name = plan.nom_business || plan.name || 'Mon projet';
  const tresorerie = plan.plan_tresorerie_12mois;
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  // Essayer d'extraire les données du plan ou utiliser des valeurs par défaut
  const rows = [];

  // Lignes ENTRÉES
  rows.push({ type: 'header', label: 'ENTRÉES' });
  rows.push({ type: 'row', label: 'Ventes / Prestations', key: 'ca_mensuel', values: extractMonthly(tresorerie, 'ca', 12) });
  rows.push({ type: 'row', label: 'Apport personnel', key: 'apport', values: [extractValue(plan, 'apport_personnel'), ...Array(11).fill(0)] });
  rows.push({ type: 'row', label: 'Prêt bancaire', key: 'pret', values: [extractValue(plan, 'pret_bancaire'), ...Array(11).fill(0)] });
  rows.push({ type: 'row', label: 'Aides / Subventions', key: 'aides', values: extractMonthly(tresorerie, 'aides', 12) });
  rows.push({ type: 'total', label: 'TOTAL ENTRÉES' });

  // Lignes SORTIES
  rows.push({ type: 'header', label: 'SORTIES' });
  rows.push({ type: 'row', label: 'Loyer / Hébergement', key: 'loyer', values: Array(12).fill(extractValue(plan, 'loyer_mensuel', 0)) });
  rows.push({ type: 'row', label: 'Salaires / Rémunération', key: 'salaires', values: Array(12).fill(extractValue(plan, 'remuneration_mensuelle', 0)) });
  rows.push({ type: 'row', label: 'Charges sociales', key: 'charges_sociales', values: Array(12).fill(0) });
  rows.push({ type: 'row', label: 'Marketing / Publicité', key: 'marketing', values: extractMonthly(tresorerie, 'marketing', 12) });
  rows.push({ type: 'row', label: 'Fournisseurs / Matières premières', key: 'fournisseurs', values: Array(12).fill(0) });
  rows.push({ type: 'row', label: 'Expert-comptable', key: 'comptable', values: distributeAnnual(extractValue(plan, 'cout_comptable', 0), 12) });
  rows.push({ type: 'row', label: 'Assurances', key: 'assurances', values: distributeAnnual(extractValue(plan, 'cout_assurances', 0), 12) });
  rows.push({ type: 'row', label: 'Abonnements & outils', key: 'outils', values: Array(12).fill(0) });
  rows.push({ type: 'row', label: 'Remboursement prêt', key: 'rembt_pret', values: Array(12).fill(0) });
  rows.push({ type: 'row', label: 'Investissements', key: 'investissements', values: extractMonthly(tresorerie, 'investissements', 12) });
  rows.push({ type: 'row', label: 'Divers', key: 'divers', values: Array(12).fill(0) });
  rows.push({ type: 'total', label: 'TOTAL SORTIES' });

  // SOLDE
  rows.push({ type: 'solde', label: 'SOLDE MENSUEL' });
  rows.push({ type: 'cumul', label: 'TRÉSORERIE CUMULÉE' });

  return { name, months, rows };
}

function extractMonthly(data, key, count) {
  if (!data || typeof data !== 'object') return Array(count).fill(0);
  // Essayer différentes clés
  const keys = [key, key + '_mensuel', key + 's'];
  for (const k of keys) {
    if (Array.isArray(data[k]) && data[k].length >= count) return data[k].slice(0, count);
  }
  const val = extractValue(data, key, 0);
  return Array(count).fill(val);
}

function extractValue(obj, key, defaultVal = 0) {
  if (!obj) return defaultVal;
  const keys = [key, key + '_mensuel', key + '_annuel'];
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) {
      const n = parseFloat(String(obj[k]).replace(/[^\d.-]/g, ''));
      if (!isNaN(n)) return n;
    }
  }
  return defaultVal;
}

function distributeAnnual(annual, months) {
  const monthly = Math.round(annual / months);
  return Array(months).fill(monthly);
}
