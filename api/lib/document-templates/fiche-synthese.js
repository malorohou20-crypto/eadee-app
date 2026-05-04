// ── Template fiche synthèse 1 page (PDF) ─────────────────────────────

export function buildFicheSyntheseContent(plan) {
  const name = plan.nom_business || plan.name || 'Mon projet';
  const resume = plan.resume_executif || {};
  const marche = plan.etude_marche || {};
  const financier = plan.compte_resultat_3ans || {};
  const seuil = plan.seuil_rentabilite || {};
  const porteur = plan.porteur_projet || {};

  return {
    title: name,
    subtitle: plan.proposition_valeur?.tagline || plan.presentation_projet?.tagline || '',
    date: new Date().toLocaleDateString('fr-FR'),
    blocks: [
      {
        label: 'Résumé du projet',
        content: resume.texte || resume.synthese || plan.presentation_projet?.description || '',
        type: 'text',
      },
      {
        label: 'Marché',
        items: [
          { key: 'Secteur', value: marche.secteur || plan.etude_marche?.intitule || '' },
          { key: 'Taille marché', value: marche.taille_marche || '' },
          { key: 'Cible principale', value: marche.cible || plan.plan_acquisition?.cible_principale || '' },
          { key: 'Zone géographique', value: plan.aspects_organisationnels?.localisation || '' },
        ],
        type: 'kv',
      },
      {
        label: 'Projections financières',
        items: [
          { key: 'CA An 1', value: fmt(financier.ca_an1) },
          { key: 'CA An 2', value: fmt(financier.ca_an2) },
          { key: 'CA An 3', value: fmt(financier.ca_an3) },
          { key: 'Point mort', value: seuil.mois_break_even || seuil.break_even || '' },
          { key: 'Investissement', value: fmt(plan.plan_investissement?.investissement_total) },
        ],
        type: 'kv',
      },
      {
        label: 'Avantage concurrentiel',
        content: plan.proposition_valeur?.usp || plan.proposition_valeur?.texte || '',
        type: 'text',
      },
      {
        label: 'Porteur de projet',
        items: [
          { key: 'Nom', value: porteur.nom || '' },
          { key: 'Expérience', value: porteur.experience || '' },
          { key: 'Statut juridique', value: plan.aspects_juridiques?.statut_recommande || '' },
        ],
        type: 'kv',
      },
      {
        label: 'Besoins de financement',
        items: [
          { key: 'Apport personnel', value: fmt(plan.plan_investissement?.apport_personnel) },
          { key: 'Financement externe', value: fmt(plan.plan_investissement?.financement_externe) },
          { key: 'Aides identifiées', value: plan.aides_subventions?.total_aides || 'Voir détail' },
        ],
        type: 'kv',
      },
    ],
    footer: `Document généré par Eadee — ${new Date().toLocaleDateString('fr-FR')} — À valider par un expert-comptable avant envoi`,
  };
}

function fmt(val) {
  if (!val) return '';
  const n = parseFloat(String(val).replace(/[^\d.-]/g, ''));
  if (isNaN(n)) return String(val);
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}
