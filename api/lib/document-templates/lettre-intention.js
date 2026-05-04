// ── Template lettre d'intention de client ────────────────────────────

export function buildLettreIntentionContent(plan) {
  const name = plan.nom_business || plan.name || '[Nom du projet]';
  const offre = plan.modele_economique?.offres?.[0] || plan.proposition_valeur || {};
  const prixRef = offre.prix || offre.tarif || '[MONTANT]';
  const prestation = offre.nom || offre.description || plan.presentation_projet?.description || '[description de la prestation]';

  return {
    title: `Lettre d\'intention d\'achat — ${name}`,
    note: 'Ce document est un template. Le futur client doit le compléter et le signer sur papier à en-tête.',
    sections: [
      {
        type: 'client_header',
        content: {
          nom_client: '[Nom / Raison sociale du client]',
          adresse: '[Adresse du client]',
          representant: '[Prénom Nom du signataire]',
          qualite: '[Directeur, Gérant, etc.]',
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          destinataire: name,
        },
      },
      {
        type: 'objet',
        content: `Objet : Lettre d'intention d'achat de [PRESTATION/PRODUIT]`,
      },
      {
        type: 'corps',
        content: `Madame, Monsieur,

Par la présente, nous vous confirmons notre intérêt pour vos services et notre intention d'engager votre entreprise ${name} pour la prestation suivante :

PRESTATION : ${prestation}
VOLUME / FRÉQUENCE : [Ex. : 10 heures/mois / livraison mensuelle / forfait annuel]
MONTANT ESTIMÉ : ${prixRef}€ [HT/TTC] par [heure / mois / prestation]
DURÉE ENVISAGÉE : [Ex. : 12 mois à partir du lancement]
DATE DE DÉBUT SOUHAITÉE : [Date envisagée]

Cette lettre d'intention ne constitue pas un contrat ferme mais témoigne de notre sérieux dans notre démarche et de notre volonté de collaborer avec vous sous réserve des conditions définitives à négocier.

Nous restons disponibles pour un échange complémentaire si nécessaire.

Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`,
      },
      {
        type: 'signature_client',
        content: `[Ville], le [Date]

Signature et tampon :

_______________________________
[Prénom Nom]
[Qualité]
[Entreprise / Particulier]`,
      },
      {
        type: 'note_utilisation',
        content: `INSTRUCTIONS D'UTILISATION DE CE TEMPLATE :
1. Remplir tous les champs entre crochets [ ]
2. Faire signer par le futur client
3. Joindre ce document à votre dossier bancaire ou BPI
4. Plus vous avez de lettres d'intention, plus votre dossier est solide
5. Idéalement obtenir 2-3 lettres avant de soumettre votre dossier`,
      },
    ],
  };
}
