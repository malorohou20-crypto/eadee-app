// ── Template demande financement BPI France ───────────────────────────

export function buildCourrierBpiContent(plan) {
  const name = plan.nom_business || plan.name || '[Nom du projet]';
  const porteur = plan.porteur_projet || {};
  const financier = plan.plan_investissement || {};

  return {
    title: `Demande de financement BPI France — ${name}`,
    sections: [
      {
        type: 'header',
        content: {
          expediteur: porteur.nom || '[Votre Nom Prénom]',
          adresse: porteur.adresse || '[Adresse]',
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          destinataire: 'BPI France — Direction régionale',
          objet: `Demande de Prêt Création — ${name}`,
        },
      },
      {
        type: 'section',
        titre: '1. Présentation du porteur',
        content: `Nom : ${porteur.nom || '[Nom]'}
Formation : ${porteur.formation || '[Formation et diplômes]'}
Expérience professionnelle : ${porteur.experience || '[Années d\'expérience dans le secteur]'}
Motivations : ${porteur.motivations || '[Votre motivation principale]'}`,
      },
      {
        type: 'section',
        titre: '2. Description du projet',
        content: plan.presentation_projet?.description || plan.resume_executif?.texte || '[Description complète du projet — activité, marché cible, zone géographique, date de lancement envisagée]',
      },
      {
        type: 'section',
        titre: '3. Marché et positionnement',
        content: `Secteur : ${plan.etude_marche?.secteur || '[Secteur]'}
Marché cible : ${plan.etude_marche?.marche_cible || '[Description du marché]'}
Taille du marché : ${plan.etude_marche?.taille_marche || '[Taille estimée avec source]'}
Différenciation : ${plan.proposition_valeur?.usp || '[Votre avantage concurrentiel]'}`,
      },
      {
        type: 'section',
        titre: '4. Plan de financement',
        content: `Besoins totaux : ${financier.investissement_total || '[Montant]'}€
Apport personnel : ${financier.apport_personnel || '[Apport]'}€
Prêt bancaire en cours de négociation : ${financier.pret_bancaire || '[Montant]'}€
Prêt BPI sollicité : ${financier.pret_bpi || '[Montant souhaité]'}€
Aides obtenues ou en cours : ${plan.aides_subventions?.aides_obtenues || '[ACRE, ARCE, aides régionales...]'}`,
      },
      {
        type: 'section',
        titre: '5. Projections financières clés',
        content: `CA an 1 : ${plan.compte_resultat_3ans?.ca_an1 || '[CA]'}€
CA an 2 : ${plan.compte_resultat_3ans?.ca_an2 || '[CA]'}€
CA an 3 : ${plan.compte_resultat_3ans?.ca_an3 || '[CA]'}€
Point mort prévu : ${plan.seuil_rentabilite?.mois_break_even || '[X mois]'}
Résultat net an 1 : ${plan.compte_resultat_3ans?.resultat_net_an1 || '[Résultat]'}€`,
      },
      {
        type: 'section',
        titre: '6. Documents joints',
        content: `- Business plan complet
- Compte de résultat prévisionnel 3 ans
- Plan de trésorerie 12 mois
- CV du porteur
- Justificatifs d'apport personnel
- Devis des investissements principaux
- Lettre(s) d'intention de clients (si disponibles)`,
      },
      {
        type: 'signature',
        content: `Je reste à votre entière disposition pour tout complément d'information.

${porteur.nom || '[Nom Prénom]'}
${porteur.email || '[email]'}
${porteur.telephone || '[téléphone]'}`,
      },
    ],
  };
}
