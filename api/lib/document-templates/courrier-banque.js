// ── Template courrier de présentation à la banque ─────────────────────

export function buildCourrierBanqueContent(plan) {
  const name = plan.nom_business || plan.name || '[Nom du projet]';
  const porteur = plan.porteur_projet || {};
  const resume = plan.resume_executif || {};
  const financier = plan.plan_investissement || plan.compte_resultat_3ans || {};

  const investissement = financier.investissement_total || financier.besoins_total || '[MONTANT]';
  const apport = financier.apport_personnel || '[APPORT]';
  const pret = financier.pret_demande || financier.besoin_financement_externe || '[MONTANT PRÊT]';

  return {
    title: `Demande de financement — ${name}`,
    sections: [
      {
        type: 'header',
        content: {
          expediteur: porteur.nom || '[Votre Nom Prénom]',
          adresse: porteur.adresse || '[Votre adresse]',
          ville: porteur.ville || '[Ville]',
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          destinataire: 'Madame, Monsieur le Directeur d\'agence',
          banque: '[Nom de votre banque]',
        },
      },
      {
        type: 'objet',
        content: `Objet : Demande de financement pour la création de ${name}`,
      },
      {
        type: 'paragraphe',
        titre: 'Présentation du projet',
        content: `J'ai l'honneur de vous soumettre ma demande de financement pour la création de ${name}.

${resume.texte || resume.synthese || `Mon projet consiste à ${plan.presentation_projet?.description || '[description du projet]'}. Après une étude de marché approfondie, j'ai identifié une opportunité réelle sur le marché ${plan.etude_marche?.secteur || '[secteur]'} dans la région ${plan.aspects_organisationnels?.localisation || '[zone géographique]'}.`}`,
      },
      {
        type: 'paragraphe',
        titre: 'Structure du financement',
        content: `Le plan de financement de mon projet s'établit comme suit :

- Investissement total nécessaire : ${investissement}€
- Apport personnel : ${apport}€
- Financement bancaire sollicité : ${pret}€

Mon apport personnel représente ${typeof apport === 'number' && typeof investissement === 'number' ? Math.round(apport / investissement * 100) : '[X]'}% du financement total, témoignant de mon engagement dans ce projet.`,
      },
      {
        type: 'paragraphe',
        titre: 'Viabilité du projet',
        content: `Les projections financières montrent :
- Chiffre d'affaires prévisionnel an 1 : ${plan.compte_resultat_3ans?.ca_an1 || '[CA]'}€
- Point mort prévu : ${plan.seuil_rentabilite?.mois_break_even || '[X mois]'} après lancement
- Retour sur investissement : ${plan.compte_resultat_3ans?.annee_rentabilite || 'an 2'}

Ces projections reposent sur des hypothèses conservatrices détaillées dans le business plan joint.`,
      },
      {
        type: 'paragraphe',
        titre: 'Documents joints',
        content: `- Business plan complet (${new Date().getFullYear()})
- Compte de résultat prévisionnel sur 3 ans
- Plan de trésorerie mensuel sur 12 mois
- CV du porteur de projet
- Justificatifs d'apport personnel`,
      },
      {
        type: 'signature',
        content: `Dans l'attente de votre réponse, je reste à votre disposition pour tout renseignement complémentaire et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${porteur.nom || '[Votre Nom Prénom]'}
${porteur.email || '[votre@email.fr]'}
${porteur.telephone || '[Téléphone]'}`,
      },
    ],
  };
}
