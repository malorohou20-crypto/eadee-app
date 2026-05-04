// ── Template compte de résultat prévisionnel 3 ans (Excel) ───────────

export function buildCompteResultatData(plan) {
  const name = plan.nom_business || plan.name || 'Mon projet';
  const cr = plan.compte_resultat_3ans || {};

  // Extraction des données du plan avec fallbacks
  const an1_ca = extractNum(cr, ['ca_an1', 'chiffre_affaires_an1', 'revenus_an1']) || 0;
  const an2_ca = extractNum(cr, ['ca_an2', 'chiffre_affaires_an2']) || Math.round(an1_ca * 1.3);
  const an3_ca = extractNum(cr, ['ca_an3', 'chiffre_affaires_an3']) || Math.round(an1_ca * 1.7);

  const charges_ratio = 0.65; // hypothèse par défaut

  return {
    name,
    hypotheses: [
      'Taux de charges : estimé à 65% du CA (à ajuster selon ton modèle)',
      'Croissance : +30% an 2, +30% an 3 (hypothèse conservatrice)',
      'TVA non applicable en micro-entreprise / franchise de base',
      'Rémunération porteur incluse dans charges an 1',
    ],
    sections: [
      {
        label: 'PRODUITS (REVENUS)',
        rows: [
          { label: 'Chiffre d\'affaires HT', an1: an1_ca, an2: an2_ca, an3: an3_ca, isMain: true },
          { label: 'Autres produits', an1: 0, an2: 0, an3: 0 },
          { label: 'TOTAL PRODUITS', an1: an1_ca, an2: an2_ca, an3: an3_ca, isTotal: true },
        ],
      },
      {
        label: 'CHARGES D\'EXPLOITATION',
        rows: [
          { label: 'Achats marchandises / matières', an1: cr.achats_an1 || 0, an2: 0, an3: 0 },
          { label: 'Loyer et charges locatives', an1: cr.loyer_an1 || 0, an2: 0, an3: 0 },
          { label: 'Salaires et traitements', an1: cr.salaires_an1 || 0, an2: 0, an3: 0 },
          { label: 'Charges sociales patronales', an1: cr.charges_sociales_an1 || 0, an2: 0, an3: 0 },
          { label: 'Marketing / Communication', an1: cr.marketing_an1 || 0, an2: 0, an3: 0 },
          { label: 'Honoraires (comptable, avocat)', an1: cr.honoraires_an1 || 0, an2: 0, an3: 0 },
          { label: 'Assurances', an1: cr.assurances_an1 || 0, an2: 0, an3: 0 },
          { label: 'Amortissements', an1: cr.amortissements_an1 || 0, an2: 0, an3: 0 },
          { label: 'Divers charges', an1: 0, an2: 0, an3: 0 },
          { label: 'TOTAL CHARGES', an1: Math.round(an1_ca * charges_ratio), an2: Math.round(an2_ca * charges_ratio), an3: Math.round(an3_ca * charges_ratio), isTotal: true },
        ],
      },
      {
        label: 'RÉSULTAT',
        rows: [
          { label: 'Résultat d\'exploitation (REX)', an1: Math.round(an1_ca * (1 - charges_ratio)), an2: Math.round(an2_ca * (1 - charges_ratio)), an3: Math.round(an3_ca * (1 - charges_ratio)), isResult: true },
          { label: 'Impôt sur les bénéfices (estimé)', an1: 0, an2: Math.round(an2_ca * (1 - charges_ratio) * 0.15), an3: Math.round(an3_ca * (1 - charges_ratio) * 0.25) },
          { label: 'RÉSULTAT NET', an1: Math.round(an1_ca * (1 - charges_ratio)), an2: Math.round(an2_ca * (1 - charges_ratio) * 0.85), an3: Math.round(an3_ca * (1 - charges_ratio) * 0.75), isTotal: true },
        ],
      },
    ],
  };
}

function extractNum(obj, keys) {
  if (!obj) return null;
  for (const k of keys) {
    if (obj[k] !== undefined) {
      const n = parseFloat(String(obj[k]).replace(/[^\d.-]/g, ''));
      if (!isNaN(n) && n > 0) return n;
    }
  }
  return null;
}
