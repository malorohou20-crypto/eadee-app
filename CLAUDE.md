# EADEE — Contexte projet pour Claude

## Architecture
- **Shell HTML** : `eadee-app-v2.html` (~2317 lignes, HTML uniquement — plus de CSS/JS inline)
- **CSS** : `public/css/` — 17 fichiers (voir carte ci-dessous)
- **JS** : `public/js/` — 20 fichiers (voir carte ci-dessous)
- Sync obligatoire avant commit : `cp eadee-app-v2.html index.html`
- Déploiement : git push → GitHub → Vercel (auto)
- Pas de build, pas de node_modules, pur HTML/CSS/JS
- API serverless Edge : `api/` (fetch natif, pas de SDK npm)
- Backup pre-refactor : `eadee-app-v2.backup.html` (7841 lignes)

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

## Carte des fichiers CSS (`public/css/`)

| Fichier | Contenu | Modifier pour... |
|---------|---------|-----------------|
| `00-base.css` | `:root` variables, reset, body, `.hidden`, `.page` | Changer couleurs globales |
| `01-nav.css` | Nav sticky, logo, plan badges, nav-btn | Modifier la navigation |
| `02-auth.css` | Page login/signup, formulaire auth clair | Modifier l'auth |
| `03-components.css` | Plan blocks, toast, success page, animations, mobile nav | Composants réutilisables |
| `10-landing-hero.css` | Hero, marquee ticker, pricing section, preview modal | Landing page hero + tarifs |
| `11-landing-sections.css` | Features TR sections, stats band, responsive landing | Sections features |
| `13-landing-footer.css` | Footer, bandeau cookies, modaux légaux, how-it-works, testimonials, FAQ, CTA | Footer + légal |
| `20-dashboard.css` | Layout dashboard, sidebar, credits widget | Structure app |
| `21-generator.css` | Vue générateur, form-group/input dark theme, gen-btn | Formulaire génération |
| `22-plan.css` | Result panel, loading anim, history view | Affichage du plan généré |
| `23-history.css` | Historique des plans | Vue historique |
| `24-billing.css` | Vue paiement, options plan, stripe form, order summary | Vue billing |
| `25-chat.css` | Chat drawer, chat messages, typing indicator, quick actions | Conseiller Eadee |
| `26-dossier.css` | Modal dossier création | Dossier création |
| `27-modals.css` | Plan preview modal (historique), nouvelles sections | Modales |
| `90-overrides.css` | Dark mode overrides, fixes spécifiques | Corrections de style |
| `99-responsive.css` | Tous les `@media` principaux (768px, 1024px, 400px) | Responsive mobile |

## Carte des fichiers JS (`public/js/`)

| Fichier | Fonctions clés | Modifier pour... |
|---------|---------------|-----------------|
| `00-state.js` | Variables globales : `user`, `currentPlan`, `userCredits`, `currentResult`, `plansHistory`, `chatState`, `IS_DEMO`, `liveFeedPool`, `IDEA_PROMPTS`, `legalContent`... | Ajouter une variable globale |
| `01-utils.js` | `toast(msg, type)`, `scrollToPricing()` | Notifications, utilitaires |
| `02-router.js` | `showPage()`, `updateNav()`, `showView()` | Navigation entre pages/vues |
| `10-supabase.js` | `initSupabase()`, `loadCurrentUser()` | Auth Supabase, chargement session |
| `11-auth.js` | `handleAuth()`, `handleGoogleAuth()`, `logout()`, `showAuth()`, `switchAuthTab()` | Login / signup |
| `20-generator.js` | `generateDashPlan()`, `fillPlan()`, `drawRevenueChart()`, `updateUsage()`, `esc()` | Génération et affichage du plan |
| `21-preview.js` | `setPreviewState('A'|'B'|'C')`, `startGenSectionsAnim()` | États du panneau droit générateur |
| `22-live-feed.js` | `startLiveFeed()`, `stopLiveFeed()`, `_lfTick()` | Live feed communauté (état A) |
| `23-draft.js` | `onIdeaInput()`, `saveDraft()`, `checkDraft()`, `prefillIdea()`, `checkOnboarding()` | Brouillons, onboarding, tips |
| `27-plan-preview.js` | `showPlanPreview()`, `closePlanPreview()`, `initChat()`, `setMobActive()` | Preview plan depuis historique |
| `30-history.js` | `renderHistory()`, `openFromHistory()`, `selectPlan()` | Vue historique |
| `40-chat.js` | `openChatFullscreen()`, `openChatDrawer()`, `sendChatMessage(mode)`, `renderChatMessages()`, `sendQuickAction()` | Conseiller Eadee (chat) |
| `50-billing.js` | `selectPayPlan()`, `processPayment()`, `formatCard()`, `formatExp()` | Paiement Stripe |
| `51-settings.js` | `saveSettings()`, `exportMyData()`, `confirmDeleteAccount()` | Paramètres + RGPD |
| `60-dossier.js` | `generateDossier()`, `renderDossier()`, `switchDossierTab()` | Dossier création |
| `70-cookies.js` | `initCookieBanner()`, `setCookieConsent()` | Bandeau CNIL |
| `71-legal.js` | `legalContent` (objet), `openLegal()`, `closeLegal()` | Modaux légaux (CGV, mentions, RGPD) |
| `80-hero.js` | Effet tilt 3D sur le mock app (mousemove) | Animation landing |
| `81-misc.js` | `toggleNavDropdown()`, `copyPlan()`, `savePlan()`, `toggleFaq()`, `toggleSidebar()` | Actions diverses |
| `main.js` | IIFE mode démo (`?preview=eadee2024`), init globale | Init au chargement |

## JS — Variables globales clés
```js
user            // { name, email } ou null
currentPlan     // 'starter' | 'builder' | 'empire'
userCredits     // nombre de crédits restants
currentResult   // objet plan généré (null si pas encore)
plansHistory    // tableau des plans générés (localStorage)
chatState       // état du conseiller Eadee { conversations, activePlanId, activeMode }
selectedPayPlan // pack sélectionné sur billing { name, price, credits }
IS_DEMO         // true si ?preview=eadee2024 (mode démo)
```

## JS — Fonctions importantes
```js
showPage('landing'|'auth'|'dashboard')
showView('generator'|'history'|'chat'|'billing'|'settings'|...)
openChatFullscreen(planId)       // ouvre vue chat plein écran
openChatDrawer(planId, question) // ouvre drawer latéral
closeChatDrawer()
sendChatMessage(mode)            // envoie message à /api/coach (streaming)
setPreviewState('A'|'B'|'C')    // A=idle(roadmap+feed), B=tips, C=génération
generateDashPlan()
toast(msg, type)
updateUsage()
updateNav()
```

## API endpoints (Vercel Edge)
- `POST /api/proxy`            → génère business plan (non-streaming, via Anthropic)
- `POST /api/coach`            → Conseiller Eadee, streaming via fetch natif Anthropic
  - Corps : `{ messages, plan, userId }`
  - Utilise `fetch` natif vers `api.anthropic.com` — PAS le SDK npm
- `GET  /api/config`           → expose SUPABASE_URL + SUPABASE_ANON_KEY au front
- `POST /api/stripe-checkout`  → crée une session Stripe Checkout
- `POST /api/stripe-webhook`   → reçoit paiement confirmé → crédite Supabase
- `POST /api/delete-user`      → supprime compte auth Supabase (service_role)

## Variables d'environnement Vercel (toutes configurées sauf mention)
- `ANTHROPIC_API_KEY`          → déjà configurée
- `NEXT_PUBLIC_SUPABASE_URL`   → déjà configurée
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → déjà configurée
- `STRIPE_SECRET_KEY`          → à ajouter après création compte Stripe
- `STRIPE_WEBHOOK_SECRET`      → à ajouter après config webhook Stripe
- `SUPABASE_SERVICE_KEY`       → à ajouter (clé service_role Supabase)

## Vue générateur — panneau droit
- **État A (idle)** : Roadmap "Ta route vers le lancement" (7 étapes) + Live feed communauté
- **État B (frappe)** : Tips qualité du brief
- **État C (génération)** : Animation sections en cours

## Workflow de modification (APRÈS refactoring Phase 2)

### Modifier du CSS
1. Trouver le bon fichier dans `public/css/` (voir carte ci-dessus)
2. Éditer le fichier
3. `git add public/css/FICHIER.css && git commit -m "..."`
4. `git push`

### Modifier du JS
1. Trouver le bon fichier dans `public/js/` (voir carte ci-dessus)
2. Éditer le fichier
3. `git add public/js/FICHIER.js && git commit -m "..."`
4. `git push`

### Modifier le HTML (structure, textes)
1. Éditer `eadee-app-v2.html`
2. `cp eadee-app-v2.html index.html`
3. `git add eadee-app-v2.html index.html && git commit -m "..."`
4. `git push`

### Ajouter une nouvelle fonctionnalité
- CSS → créer ou éditer dans `public/css/`
- JS → créer ou éditer dans `public/js/`, ajouter `<script src="...">` dans `eadee-app-v2.html`
- HTML → dans `eadee-app-v2.html` uniquement (pas de nouveau fichier HTML)

## À ne jamais faire
- Restreindre une feature à un pack (Empire, Builder, etc.) — **tous les packs ont les mêmes fonctionnalités**
- Mettre "réservé à Empire" ou upsell de plan
- Utiliser `isPaid`, `currentPlan === 'builder'` pour conditionner du contenu
- Mettre du lime-green (#b5e800, #a8e000)
- Mettre des emojis couleur
- Utiliser Bebas Neue pour les titres de sections (réservé aux gros chiffres)
- Créer un nouveau fichier HTML (le shell reste `eadee-app-v2.html`)
- Push sans sync index.html (pour les modifications HTML uniquement)
- Utiliser le SDK `@anthropic-ai/sdk` dans les Edge functions (incompatible Edge runtime)
- Écrire "l'IA", "Coach IA" → toujours "Eadee" ou "Conseiller Eadee"
- Mettre du CSS ou JS inline dans `eadee-app-v2.html` (tout va dans `public/`)
