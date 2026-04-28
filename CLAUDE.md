# EADEE — Contexte projet pour Claude

## Architecture
- **Un seul fichier source** : `eadee-app-v2.html` (~7500 lignes)
- Sync obligatoire avant commit : `cp eadee-app-v2.html index.html`
- Déploiement : git push → GitHub → Vercel (auto)
- Pas de build, pas de node_modules, pur HTML/CSS/JS
- API serverless Edge : `api/coach.js` (streaming Anthropic via fetch natif)

## ⚠️ RÈGLES ABSOLUES — NE JAMAIS OUBLIER

### Packs — tous identiques en fonctionnalités
**Starter, Builder et Empire ont EXACTEMENT les mêmes fonctionnalités.**
La SEULE différence est le nombre de crédits :
- Starter : 1 crédit — 2.99€
- Builder : 3 crédits — 7.99€ (2.66€/génération)
- Empire : 8 crédits — 19.99€ (2.50€/génération)

**NE JAMAIS restreindre une fonctionnalité à un pack.**
**NE JAMAIS afficher un upsell "réservé à Empire" ou similaire.**
**NE JAMAIS conditionner du contenu sur `currentPlan === 'empire'` sauf pour l'affichage du badge/nom du plan.**

### Branding
- Pas de "IA", "Coach IA", "Intelligence Artificielle" → toujours **"Eadee"** ou **"Conseiller Eadee"**
- Tutoiement partout
- Zéro emoji couleur — SVG inline uniquement

### Crédits
- 1 crédit = 1 génération, **non modifiable** après génération
- Pas de "rechargeable à volonté" (on rachète un pack)

## Design system

### Couleurs CSS variables
```
--paper: #13141a        (fond principal)
--cream: #1a1d26        (fond secondaire)
--acid:  #6b8fef        (bleu principal)
--rust:  #a78bfa        (violet accent)
--gold:  #fbbf24        (jaune)
--text:  #ecedf2        (texte principal)
--muted: #7a7f9a        (texte secondaire)
--ink:   #0d0e14        (très sombre)
--green: #34d399        (succès)
```

### Couleurs directes fréquentes
- Bleu clair : `#9db8f8` (valeurs, chiffres)
- Violet clair : `#c4b5fd` (titres risques)
- Pink : `#f472b6`

### Polices
- `Fraunces` — display serif (titres hero, noms business)
- `Geist` — body sans (texte courant, labels)
- `DM Mono` — mono (labels uppercase, codes, petites données)
- `Bebas Neue` — grands chiffres uniquement (KPIs, scores, revenus)

## Structure HTML principale

```
<body>
  #toast
  #page-landing         ← landing publique
  #page-auth            ← login/signup
  #page-dashboard       ← app connectée
    .dash-sidebar
    main
      #view-generator   ← formulaire + panneau droit (roadmap + live feed)
      #view-history
      #view-chat        ← Conseiller Eadee (tous packs)
      #view-billing     ← achat de crédits
      #view-settings
      #view-inspiration
      #view-referral
      #view-help
  .mobile-nav
  #chatDrawer           ← drawer latéral conseiller
  #chatBackdrop
  #planPreviewModal
  #dossierModal
</body>
```

## JS — Variables globales clés
```js
user            // { name, email } ou null
currentPlan     // 'starter' | 'builder' | 'empire'
userCredits     // nombre de crédits restants
currentResult   // objet plan généré (null si pas encore)
plansHistory    // tableau des plans générés (localStorage)
chatState       // état du conseiller Eadee { conversations, activePlanId, activeMode }
selectedPayPlan // pack sélectionné sur billing { name, price, credits }
```

## JS — Fonctions importantes
```js
showPage('landing'|'auth'|'dashboard')
showView('generator'|'history'|'chat'|'billing'|'settings'|...)
openChatFullscreen(planId)     // ouvre vue chat plein écran
openChatDrawer(planId, question) // ouvre drawer latéral
closeChatDrawer()
sendChatMessage(mode)          // envoie message à /api/coach (streaming)
setPreviewState('A'|'B'|'C')   // A=idle(roadmap+feed), B=tips, C=génération
generatePlan()
toast(msg, type)
updateUsage()
updateNav()
```

## API endpoints (Vercel Edge)
- `POST /api/generate`  → génère business plan (streaming)
- `POST /api/coach`     → Conseiller Eadee, streaming via fetch natif Anthropic
  - Corps : `{ messages, plan, userId }`
  - Utilise `fetch` natif vers `api.anthropic.com` — PAS le SDK npm
  - Variable env Vercel : `ANTHROPIC_API_KEY` (déjà configurée)

## Vue générateur — panneau droit
- **État A (idle)** : Roadmap "Ta route vers le lancement" (7 étapes) + Live feed communauté
- **État B (frappe)** : Tips qualité du brief
- **État C (génération)** : Animation sections en cours

## Workflow de modification
1. Éditer `eadee-app-v2.html`
2. `cp eadee-app-v2.html index.html`
3. `git add eadee-app-v2.html index.html && git commit -m "..."`
4. `git push`

## À ne jamais faire
- Restreindre une feature à un pack (Empire, Builder, etc.)
- Mettre "réservé à Empire" ou upsell de plan
- Mettre du lime-green (#b5e800, #a8e000)
- Mettre des emojis couleur
- Utiliser Bebas Neue pour les titres de sections (réservé aux gros chiffres)
- Créer un nouveau fichier HTML (tout dans eadee-app-v2.html)
- Push sans sync index.html
- Utiliser le SDK `@anthropic-ai/sdk` dans les Edge functions (incompatible)
- Écrire "l'IA", "Coach IA" → toujours "Eadee" ou "Conseiller Eadee"
