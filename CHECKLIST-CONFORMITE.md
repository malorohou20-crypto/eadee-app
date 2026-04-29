# CHECKLIST CONFORMITÉ LÉGALE — EADEE

## 1. PLACEHOLDERS À REMPLIR DANS LES MODALES LÉGALES

Ouvre `eadee-app-v2.html` et recherche chaque placeholder ci-dessous.

### Mentions légales
- `[NOM_ENTREPRISE]` → Ex : "Eadee" ou le nom de ton auto-entreprise
- `[FORME_JURIDIQUE]` → "Auto-entrepreneur" / "SASU" / "EURL"
- `[ADRESSE_SIEGE]` → Ton adresse complète
- `[SIREN]` → Ton SIREN à 9 chiffres (obtenu après inscription URSSAF)
- `[SIRET]` → Ton SIRET à 14 chiffres
- `[CODE_APE]` → Ex : 6202A (développement logiciel), 7022Z (conseil aux entreprises)
- `[TVA_INTRA]` → Ton n° TVA ou "Non applicable — franchise en base de TVA"
- `[NOM_DIRECTEUR]` → Ton nom complet
- `[EMAIL_CONTACT]` → Ton email pro (remplace contact@eadee.fr si différent)
- `[TELEPHONE]` → Optionnel mais recommandé
- `[VILLE_TRIBUNAL]` → Ta ville pour la juridiction compétente

### Politique de confidentialité
- `[DATE_MAJ]` → Date du jour au format JJ/MM/AAAA
- `[EMAIL_RGPD]` → Ton email pour les demandes RGPD

### CGV
- `[EMAIL_SAV]` → Ton email service client
- `[NOM_MEDIATEUR]` → Nom de ton médiateur de la consommation
  → Recommandé : Centre de médiation de la consommation (CM2C) — cm2c.net
- `[VILLE_TRIBUNAL]` → Ta ville

---

## 2. ÉTAPES ADMINISTRATIVES À RÉALISER TOI-MÊME

### Créer ton statut juridique
- [ ] Inscription auto-entrepreneur : https://www.autoentrepreneur.urssaf.fr
  - Durée : 15 min en ligne
  - Résultat : SIREN/SIRET sous 1-3 semaines
- [ ] Si société (SASU/EURL) : passer par Infogreffe ou un expert-comptable
  - Coût : ~250€ + rédaction statuts (~500-1500€ avec avocat ou LegalPlace)

### Acheter tes textes juridiques professionnels
- [ ] CGV : https://www.legalplace.fr/contrats/conditions-generales-de-vente/
- [ ] Politique de confidentialité RGPD : https://www.legalplace.fr
- [ ] Mentions légales : incluses souvent dans les packs LegalPlace
- Budget estimé : 50-200€ selon les documents

### CNIL — Registre des traitements
- [ ] Créer ton registre des activités de traitement (obligatoire RGPD)
  → Outil CNIL : https://www.cnil.fr/fr/le-registre-des-activites-de-traitement
- [ ] Déclaration à la CNIL si données sensibles (non obligatoire pour Eadee)

### Médiateur de la consommation (obligatoire en B2C)
- [ ] S'inscrire auprès d'un médiateur agréé
  → CM2C (gratuit pour professionnels) : https://www.cm2c.net
  → Médiation e-commerce : https://www.mediateur-fevad.com
- [ ] Mettre le nom + lien du médiateur dans les CGV

---

## 3. VARIABLES D'ENVIRONNEMENT À AJOUTER SUR VERCEL

Va sur https://vercel.com → ton projet → Settings → Environment Variables

| Variable | Valeur | Usage |
|----------|--------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Paiements Stripe |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Vérification webhooks |
| `SUPABASE_SERVICE_KEY` | Clé `service_role` Supabase | Suppression compte + webhook Stripe |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de ton projet Supabase | Auth + DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé `anon` Supabase | Auth côté client |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Génération plans + conseiller |

> ⚠️ `SUPABASE_SERVICE_KEY` est la clé `service_role` (Settings → API dans Supabase). Elle a accès total à la DB — ne jamais l'exposer côté client.

---

## 4. ÉTAPES SUPABASE

- [ ] Exécuter `supabase/schema.sql` dans SQL Editor ✅ (déjà fait)
- [ ] Exécuter `supabase/compliance.sql` dans SQL Editor (nouvelles tables RGPD)
- [ ] Activer l'auth email dans Supabase : Authentication → Providers → Email
- [ ] Configurer l'URL de redirection : Authentication → URL Configuration → `https://eadee-app.vercel.app`

---

## 5. CONFIGURATION STRIPE

- [ ] Créer compte Stripe : https://stripe.com/fr
- [ ] Ajouter endpoint webhook : Dashboard → Développeurs → Webhooks
  - URL : `https://eadee-app.vercel.app/api/stripe-webhook`
  - Événement : `checkout.session.completed`
- [ ] Récupérer le Webhook Secret (`whsec_...`) → Vercel env `STRIPE_WEBHOOK_SECRET`
- [ ] Activer les paiements en mode live (après vérification identité Stripe)

---

## 6. LIENS UTILES

| Ressource | URL |
|-----------|-----|
| URSSAF auto-entrepreneur | https://www.autoentrepreneur.urssaf.fr |
| Guichet entreprises (immatriculation) | https://www.guichet-entreprises.fr |
| INPI (marques, brevets) | https://www.inpi.fr |
| LegalPlace (textes juridiques) | https://www.legalplace.fr |
| CNIL registre des traitements | https://www.cnil.fr/fr/le-registre-des-activites-de-traitement |
| Médiateur CM2C | https://www.cm2c.net |
| AI Act (règlement UE) | https://artificialintelligenceact.eu |
| Supabase dashboard | https://app.supabase.com |
| Vercel dashboard | https://vercel.com |

---

## 7. PRIORITÉS AVANT LANCEMENT

1. **URGENT** — Exécuter `compliance.sql` dans Supabase
2. **URGENT** — Remplir les placeholders mentions légales (SIREN obligatoire LCEN)
3. **IMPORTANT** — Acheter CGV + politique de confidentialité sur LegalPlace
4. **IMPORTANT** — S'inscrire à un médiateur de la consommation
5. **RECOMMANDÉ** — Créer le registre CNIL des traitements
6. **OPTIONNEL** — Faire relire par un avocat spécialisé RGPD

---

*Checklist générée automatiquement — à compléter avant mise en production commerciale.*
