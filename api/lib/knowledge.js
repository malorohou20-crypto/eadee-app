// =====================================================================
// KNOWLEDGE BASE EADEE — Données vérifiées, à mettre à jour 1x/an
// =====================================================================

export const KNOWLEDGE_BASE = {

  // ── STATUTS JURIDIQUES ────────────────────────────────────────────
  statuts: {
    'micro-entreprise': {
      name: 'Micro-entreprise (auto-entrepreneur)',
      cout_creation: 0,
      cout_annuel: 0,
      plafond_ca: { service: 77700, vente: 188700 },
      regime_fiscal: 'IR avec abattement forfaitaire',
      cotisations: '21,2% services BNC / 12,3% vente / 6% libéral réglementé',
      best_for: 'Tester une idée, activité secondaire, freelance débutant, faibles charges',
      limits: 'Pas de TVA en franchise de base, plafond CA, pas d\'associés, pas de déduction charges réelles',
      sources: ['URSSAF 2025', 'autoentrepreneur.urssaf.fr'],
    },
    'eurl': {
      name: 'EURL (Entreprise Unipersonnelle à Responsabilité Limitée)',
      cout_creation: 250,
      cout_annuel: 1500,
      regime_fiscal: 'IR par défaut (option IS possible)',
      cotisations: 'TNS : environ 45% du bénéfice',
      best_for: 'Artisans, commerçants souhaitant protéger leur patrimoine',
      limits: 'Comptabilité obligatoire, TNS peut coûter cher en cotisations sur petit bénéfice',
    },
    'sasu': {
      name: 'SASU (Société par Actions Simplifiée Unipersonnelle)',
      cout_creation: 250,
      cout_annuel: 2000,
      regime_fiscal: 'IS (option IR 5 premières années)',
      cotisations: 'Assimilé salarié sur rémunération (env. 80% de charges patronales)',
      best_for: 'Ambition croissance, levée de fonds, image pro, futurs salariés',
      limits: 'Expert-comptable quasi obligatoire, charges élevées sur rémunération',
    },
    'sas': {
      name: 'SAS (multi-associés)',
      cout_creation: 500,
      cout_annuel: 3000,
      regime_fiscal: 'IS',
      cotisations: 'Assimilé salarié pour le président',
      best_for: 'Projet avec associés, investisseurs, croissance forte',
      limits: 'Coût comptable élevé, gouvernance à rédiger avec soin',
    },
  },

  // ── BANQUES PRO ───────────────────────────────────────────────────
  banques_pro: [
    { name: 'Qonto', cout_mois: 9, virements_inclus: 30, cb: true, note: '100% en ligne, populaire startups & freelances, ouverture en 24h' },
    { name: 'Shine', cout_mois: 7.9, virements_inclus: 30, cb: true, note: 'Filiale Société Générale, simple, bon service client' },
    { name: 'Blank', cout_mois: 6, virements_inclus: 20, cb: true, note: 'Bonne option entrée de gamme' },
    { name: 'BNP Paribas Pro', cout_mois: 25, virements_inclus: 'illimité', cb: true, note: 'Banque traditionnelle, conseiller dédié, prêts facilités' },
    { name: 'Crédit Agricole Pro', cout_mois: 20, virements_inclus: 'illimité', cb: true, note: 'Bonne couverture régionale, idéal secteurs agri/artisanat' },
    { name: 'LCL Pro', cout_mois: 22, virements_inclus: 'illimité', cb: true, note: 'Offres dédiées aux créateurs' },
  ],

  // ── AIDES & SUBVENTIONS ───────────────────────────────────────────
  aides: {
    acre: {
      name: 'ACRE — Aide à la création et à la reprise d\'entreprise',
      montant: 'Exonération partielle cotisations sociales 1ère année (50% pour micro)',
      conditions: 'Demandeurs d\'emploi, jeunes 18-25 ans (ou 29 ans RQTH), bénéficiaires RSA/ASS, créateurs en ZFU',
      demarche: 'Demande via formulaire ACRE auprès de l\'URSSAF au moment de la création',
      url: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F11677',
    },
    arce: {
      name: 'ARCE — Aide à la reprise ou à la création d\'entreprise (Pôle Emploi)',
      montant: '60% des allocations chômage restantes versé en 2 fois',
      conditions: 'Inscrit à France Travail, bénéficiaire ARE, ACRE obtenu',
      demarche: 'Demande à France Travail après obtention ACRE',
      url: 'https://www.francetravail.fr/candidat/aides-et-services/aide-creation-reprise-entreprise.html',
    },
    pret_honneur: {
      name: 'Prêt d\'honneur Initiative France',
      montant: '5 000 à 50 000€ à taux 0, sans garantie',
      conditions: 'Présentation devant comité local Initiative France, projet validé',
      demarche: 'Contacter réseau Initiative France local ou BGE',
      url: 'https://www.initiative-france.fr',
    },
    bpi_creation: {
      name: 'Prêt BPI France Création',
      montant: '2 000 à 50 000€ sans garantie personnelle',
      conditions: 'Création récente (moins de 3 ans), accompagnement par banque classique',
      url: 'https://www.bpifrance.fr/catalogue-offres/soutien-a-lacces-aux-financements/pret-creation',
    },
    nacre: {
      name: 'NACRE — Accompagnement des créateurs',
      montant: 'Aide non financière + prêt 0% de 1 000 à 10 000€ selon profil',
      conditions: 'Demandeurs emploi longue durée, bénéficiaires minima sociaux',
      url: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F13836',
    },
    region: {
      name: 'Aides régionales (variables)',
      montant: '1 000 à 20 000€ selon région et secteur',
      conditions: 'Varient fortement selon la région. Se renseigner auprès de la CCI ou BGE locale.',
      url: 'https://les-aides.fr',
    },
  },

  // ── ASSURANCES ────────────────────────────────────────────────────
  assurances: {
    rc_pro: {
      label: 'Responsabilité Civile Professionnelle',
      fourchette_annee: '150 à 600€',
      obligatoire_pour: ['professions réglementées', 'consulting', 'santé', 'bâtiment', 'informatique'],
      note: 'Fortement recommandée pour tous les prestataires de service',
    },
    multirisque_pro: {
      label: 'Multirisque Professionnelle',
      fourchette_annee: '300 à 1 200€',
      obligatoire_pour: ['commerce avec locaux', 'artisans avec atelier'],
    },
    decennale: {
      label: 'Garantie décennale',
      fourchette_annee: '1 500 à 5 000€',
      obligatoire_pour: ['bâtiment', 'construction', 'installation'],
    },
  },

  // ── COÛTS COMPTABLES ─────────────────────────────────────────────
  cout_comptable: {
    'micro-entreprise': '0 à 500€/an (souvent inutile sauf volume)',
    eurl: '1 200 à 2 500€/an',
    sasu: '1 500 à 3 000€/an',
    'sas (5 salariés)': '3 000 à 7 000€/an',
  },

  // ── CHIFFRES CLÉS CRÉATION EN FRANCE ────────────────────────────
  stats_creation: {
    taux_survie_5ans: '52%',
    taux_survie_3ans: '67%',
    delai_moyen_rentabilite: '18 à 36 mois selon secteur',
    nb_creations_2024: '1 051 000 entreprises créées en France',
    source: 'INSEE, 2024',
  },
};

/**
 * Retourne la knowledge base formatée pour injection dans un prompt Claude
 */
export function getKnowledgeContext() {
  return JSON.stringify(KNOWLEDGE_BASE, null, 2);
}

/**
 * Retourne uniquement les aides applicables à un secteur donné
 */
export function getAidesForSector(sector) {
  const s = (sector || '').toLowerCase();
  const allAides = Object.values(KNOWLEDGE_BASE.aides);
  // Toutes les aides sont potentiellement applicables — on retourne tout
  return allAides;
}
