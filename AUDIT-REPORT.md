# AUDIT REPORT — eadee-app-v2.html
> Généré le 2026-05-04 | Fichier : 7841 lignes | Lecture seule — aucune modification

---

## 1.1 Carte actuelle du fichier

| Lignes | Contenu |
|--------|---------|
| 1–17 | `<head>` : meta SEO, Open Graph, fonts Google, Supabase CDN |
| 18–40 | CSS `:root` variables + reset global + `body` |
| 41–103 | CSS utils, pages, nav, logo, plan badges, nav-btn |
| 104–189 | CSS landing (hero orbs, grille, layout) |
| 190–211 | CSS marquee (ticker défilant) |
| 212–293 | CSS pricing section |
| 294–330 | CSS preview modal |
| 331–455 | CSS auth page |
| 456–546 | CSS dashboard layout global |
| 547–552 | CSS compat-alias (IDs legacy) |
| 553–565 | CSS main content + views |
| 566–655 | CSS generator view (form, panels, textarea) |
| 656–730 | CSS result panel (plan affiché) |
| 731–750 | CSS loading animation |
| 751–764 | CSS history view |
| 765–810 | CSS payment / billing view |
| 811–867 | CSS Stripe form (formulaire CB) |
| 868–907 | CSS order summary |
| 908–964 | CSS plan document blocks |
| 965–981 | CSS toast notification |
| 982–992 | CSS success page |
| 993–996 | CSS animations keyframes |
| 997–1013 | CSS mobile bottom nav |
| 1014–1128 | CSS responsive (media queries 1024/768/400px) |
| 1129–1222 | CSS responsive mobile étendu (hero, features, pricing, sidebar, footer) |
| 1223–1231 | CSS AI Act disclaimer |
| 1232–1327 | CSS dossier création |
| 1328–1398 | CSS dark mode / overrides / fixes |
| 1399–1476 | CSS hero avancé (orbs animés, dot grid) |
| 1477–1563 | CSS hero responsive et marquee |
| 1564–1804 | CSS hero — mock app, badge, heading, CTA, social proof, stats |
| 1805–1900 | CSS hero responsive (1024/768) |
| 1901–2106 | CSS features (tr-section, bullets, comment-section, how-grid, comp-table) |
| 2107–2149 | CSS @print + dashboard dark sidebar |
| 2150–2219 | CSS how-section, comparison table |
| 2220–2309 | CSS footer enrichi (footer2-*) |
| 2310–2396 | CSS footer2 complémentaire, testimonials, plan preview modal |
| 2397–2530 | CSS plan preview (header, scores, sections, emails, checklist) |
| 2531–2686 | CSS chat (chat-wrap, messages, input, drawer, conversations col) |
| 2687 | `</style>` + `</head>` |
| 2688–2704 | `<body>` + Toast + Nav |
| 2706–3864 | Landing page complète (hero, features, pricing, footer, FAQ, testimonials...) |
| 3864–3880 | Bandeau cookies CNIL |
| 3881–3890 | Modale légale (container) |
| 3892–3937 | Page auth (login/signup) |
| 3939–4845 | Dashboard complet (sidebar + 8 views) |
| 4847–4880 | Plan Preview Modal + Dossier Modal |
| 4882–7773 | `<script>` principal (toutes les fonctions JS) |
| 7774–7819 | Chat Drawer HTML + Inspire Modal |
| 7820–7841 | Sidebar backdrop + JSON-LD schema.org + `</body>` |

---

## 1.2 Inventaire CSS

### Namespaces CSS détectés (637 classes au total)

| Namespace | Préfixe | Zone | Lignes approx |
|-----------|---------|------|---------------|
| Navigation | `nav-`, `logo-` | nav | 48–103 |
| Plan badges | `plan-free`, `plan-builder`, `plan-empire` | nav | 86–88 |
| Auth | `auth-*` | auth | 331–455 |
| Dashboard | `dash-*` | dashboard | 456–546 |
| Generator | `gen-*` | generator | 566–655 |
| Forms | `form-*` | réutilisable | 381–410 |
| Result | `res-*`, `result-*` | plan affiché | 656–730 |
| History | `history-*` | history view | 751–764 |
| Payment | `payment-*`, `pay-*` | billing | 765–910 |
| Plan document | `plan-block`, `plan-block-*` | plan doc | 908–964 |
| Toast | `toast` | global | 965–981 |
| Mobile nav | `mob-*`, `mobile-nav` | mobile | 997–1013 |
| Hero | `hero-*`, `mock-*`, `badge-*` | landing | 1399–1804 |
| Features | `tr-*`, `how-*`, `comp-*` | landing | 1901–2106 |
| Footer | `footer2-*`, `legal-footer-*` | landing | 2220–2309 |
| Testimonials | `testi-*` | landing | 2310+ |
| Plan Preview | `preview-modal-*` | modal | 2396–2530 |
| Chat | `chat-*`, `chat-drawer`, `chat-backdrop` | chat | 2531–2686 |
| Dossier | `dossier-*` | modal | 1232–1327 |
| AI Disclaimer | `ai-disclaimer` | plan | 1223–1231 |
| Cookies | `cookie-*` | CNIL | inline/global |
| Legal modal | `legal-modal-*` | modal | inline |
| Utils | `hidden`, `page` | global | 41–47 |

### Classes mortes (définies, jamais utilisées dans le HTML)

| Classe | Ligne | Raison probable |
|--------|-------|-----------------|
| `.plan-starter` | ~87 | Plan "starter" n'a pas de badge distinct dans le nav |
| `.result-panel` | ~658 | Remplacée par `#dashResult` + `#dashGenerating` |
| `.btn-dark` | ~100 | Utilisée une seule fois dans le nav dropdown, peut être inline |
| `.sc-label`, `.sc-count`, `.sc-bar`, `.sc-fill`, `.sc-sub` | ~547 | Aliases compat — vérifier si utilisés |
| `.legal-link`, `.legal-sep`, `.legal-footer-*` | ~2004 | Footer légal inférieur (ancienne version) — remplacé par footer2 |
| `.chat-upsell`, `.chat-upsell-*` | 2672+ | Upsell Empire supprimé mais CSS reste |

### Doublons CSS confirmés

| Doublon | Lignes | Notes |
|---------|--------|-------|
| `.form-group` | 381 et 589 | Définition identique dans 2 endroits |
| `.form-label` | 383 et 590 | Idem |
| `.form-input` | 390 et 627 | Légèrement différentes (context) |
| `.form-input::placeholder` | 609, 638, 1347 | Défini 3 fois dont une avec `!important` |
| Media query `max-width:768px` | 1029, 1133, 1143, 1158, 1165, 1197, 1207, 1213, 1218 | Dispersées — 9 blocs séparés pour 768px seul |

### Conflits CSS

| Classe | Conflit |
|--------|---------|
| `.form-input` | Définie à la fois dans la section générale (l.390) et dans la section generator (l.627) avec des valeurs qui s'overrident |
| `.form-input::placeholder` | Ligne 1347 : `!important` overwrite les lignes 609 et 638 |

### Media queries — état actuel

**39 media queries au total**, réparties sur ~20 endroits différents dans le CSS. Principales dispersions :
- 9 blocs `@media (max-width: 768px)` séparés
- 3 blocs `@media (max-width: 1024px)` séparés
- Mélangées avec le CSS de chaque composant → difficile à maintenir

---

## 1.3 Inventaire JS

### Fonctions définies (86 au total)

| Fonction | Ligne | Appels détectés | Statut |
|----------|-------|-----------------|--------|
| `initSupabase` | 4888 | 1 (DOMContentLoaded) | ✅ Actif |
| `loadCurrentUser` | 4925 | 2 | ✅ Actif |
| `showPage` | 4959 | ~12 | ✅ Actif |
| `updateNav` | 4966 | ~8 | ✅ Actif |
| `showAuth` | 4999 | ~5 | ✅ Actif |
| `switchAuthTab` | 5005 | 2 | ✅ Actif |
| `handleAuth` | 5015 | 1 (onclick) | ✅ Actif |
| `showAuthError` | 5062 | 2 | ✅ Actif |
| `traduireErreurAuth` | 5075 | 1 | ✅ Actif |
| `handleGoogleAuth` | 5083 | 1 (onclick) | ✅ Actif |
| `logout` | 5087 | 1 | ✅ Actif |
| `showView` | 5095 | ~20 | ✅ Actif |
| `generateDashPlan` | 5126 | 1 (onclick) | ✅ Actif |
| `resetGenerator` | 5377 | 1 | ✅ Actif |
| `esc` | 5384 | ~15 (dans fillPlan) | ✅ Actif |
| `fillPlan` | 5394 | 3 | ✅ Actif |
| `copyEmail` | 5574 | 2 (onclick) | ✅ Actif |
| `drawRevenueChart` | 5579 | 1 (dans fillPlan) | ✅ Actif |
| `updateUsage` | 5674 | ~6 | ✅ Actif |
| `setPreviewState` | 5719 | ~8 | ✅ Actif |
| `startGenSectionsAnim` | 5733 | 1 | ✅ Actif |
| `stopGenSectionsAnim` | 5765 | 2 | ✅ Actif |
| `_lfFormatTime` | 5807 | 1 | ✅ Actif |
| `_lfBuildEvent` | 5814 | 1 | ✅ Actif |
| `_lfUpdateTimestamps` | 5832 | 1 | ✅ Actif |
| `_lfTick` | 5844 | 1 | ✅ Actif |
| `startLiveFeed` | 5864 | 1 | ✅ Actif |
| `stopLiveFeed` | 5883 | 1 | ✅ Actif |
| `prefillIdea` | 5901 | 13 (onclick) | ✅ Actif |
| `checkOnboarding` | 5911 | 1 | ✅ Actif |
| `dismissOnboarding` | 5922 | 1 (onclick) | ✅ Actif |
| `updateDashHeader` | 5929 | 2 | ✅ Actif |
| `onIdeaInput` | 5950 | 1 (oninput) | ✅ Actif |
| `updateTips` | 5970 | 1 | ✅ Actif |
| `saveDraft` | 5980 | 1 | ✅ Actif |
| `showDraftIndicator` | 5996 | 1 | ✅ Actif |
| `checkDraft` | 6005 | 1 | ✅ Actif |
| `resumeDraft` | 6021 | 1 (onclick) | ✅ Actif |
| `discardDraft` | 6035 | 1 (onclick) | ✅ Actif |
| `openInspireModal` | 6042 | 1 (onclick) | ✅ Actif |
| `closeInspireModal` | 6045 | 1 (onclick) | ✅ Actif |
| `pickInspire` | 6048 | ~6 (onclick) | ✅ Actif |
| `toggleNavDropdown` | 6055 | 1 (onclick) | ✅ Actif |
| `closeNavDropdown` | 6059 | ~5 (onclick) | ✅ Actif |
| `toggleNotifDropdown` | 6063 | 1 (onclick) | ✅ Actif |
| `copyPlan` | 6075 | 1 (onclick) | ✅ Actif |
| `savePlan` | 6105 | 1 (onclick) | ✅ Actif |
| `toggleFaq` | 6117 | ~6 (onclick) | ✅ Actif |
| `renderHistory` | 6140 | 1 | ✅ Actif |
| `openFromHistory` | 6180 | dynamique | ✅ Actif |
| `selectPlan` | 6193 | dynamique | ✅ Actif |
| `selectPayPlan` | 6204 | 3 (onclick) | ✅ Actif |
| `formatCard` | 6220 | 1 (oninput) | ✅ Actif |
| `formatExp` | 6225 | 1 (oninput) | ✅ Actif |
| `processPayment` | 6231 | 1 (onclick) | ✅ Actif |
| `saveSettings` | 6278 | 1 (onclick) | ✅ Actif |
| `toast` | 6289 | ~25 | ✅ Actif |
| `scrollToPricing` | 6297 | ~3 (onclick) | ✅ Actif |
| `testAPIConnection` | 6321 | 1 | ⚠️ Appelée 1 fois dans `showView` — à vérifier |
| `showPlanPreview` | 6330 | dynamique (dans renderHistory) | ✅ Actif |
| `closePlanPreview` | 6578 | 1 (onclick) | ✅ Actif |
| `initChat` | 6585 | 1 (dans showPage) | ✅ Actif |
| `setMobActive` | 6592 | ~6 (onclick) | ✅ Actif |
| **`openChat`** | **6598** | **0 — jamais appelée** | **🔴 MORTE** |
| **`sendQuickAction(btn, text)`** | **6653** | **0** | **🔴 MORTE (ancienne signature)** |
| **`addChatBubble`** | **6659** | **0** | **🔴 MORTE** |
| **`applyPlanModifications`** | **6675** | **0** | **🔴 MORTE** |
| **`sendChatMessage()` (sans arg)** | **6690** | **0** | **🔴 MORTE (remplacée par sendChatMessage(mode))** |
| `closeDossier` | 6738 | 1 (onclick) | ✅ Actif |
| `switchDossierTab` | 6742 | dynamique | ✅ Actif |
| `generateDossier` | 6747 | 1 (onclick) | ✅ Actif |
| `renderDossier` | 6914 | 1 | ✅ Actif |
| `initCookieBanner` | 7108 | 1 (DOMContentLoaded) | ✅ Actif |
| `setCookieConsent` | 7116 | 2 (onclick) | ✅ Actif |
| `exportMyData` | 7137 | 1 (onclick) | ✅ Actif |
| `requestRectification` | 7171 | 1 (onclick) | ✅ Actif |
| `confirmDeleteAccount` | 7177 | 1 (onclick) | ✅ Actif |
| `openLegal` | 7397 | ~8 (onclick) | ✅ Actif |
| `closeLegal` | 7406 | 2 (onclick + Escape) | ✅ Actif |
| `getChatPlansList` | 7489 | 1 | ✅ Actif |
| `openChatFullscreen` | 7500 | ~3 | ✅ Actif |
| `openChatDrawer` | 7515 | ~5 | ✅ Actif |
| `closeChatDrawer` | 7529 | 2 (onclick) | ✅ Actif |
| `selectChatPlan` | 7536 | 2 (onchange) | ✅ Actif |
| `renderChatMessages` | 7564 | ~3 | ✅ Actif |
| `renderChatMsg` | 7574 | dynamique | ✅ Actif |
| `renderMarkdown` | 7585 | 1 | ✅ Actif |
| `escHtml` | 7599 | ~3 | ✅ Actif |
| `showTypingIndicator` | 7603 | 1 | ✅ Actif |
| `hideTypingIndicator` | 7614 | 1 | ✅ Actif |
| `renderChatQuickActions` | 7620 | 1 | ✅ Actif |
| `sendQuickAction(text, mode)` | 7628 | dynamique | ✅ Actif (nouvelle signature) |
| `sendChatMessage(mode)` | 7635 | ~5 | ✅ Actif (nouvelle version) |
| `chatKeyDown` | 7705 | 2 (onkeydown) | ✅ Actif |
| `autoGrow` | 7712 | 2 (oninput) | ✅ Actif |
| `populateChatPlanSelect` | 7717 | 1 | ✅ Actif |
| `renderChatConvsList` | 7725 | ~3 | ✅ Actif |
| `startNewChatConv` | 7750 | 1 (onclick) | ✅ Actif |
| `openChatDrawerFromPlan` | 7756 | 1 (onclick) | ✅ Actif |
| `toggleSidebar` | 7767 | 2 (onclick) | ✅ Actif |

### ⚠️ Bloc de code mort — Ancien système de chat (lignes 6582–6737)

Ce bloc entier est l'**ancienne implémentation du chat** remplacée par le système Expert Eadee (lignes 7459+). Il contient :
- `const chatHistory = []` — variable orpheline
- `openChat()` — jamais appelée
- `sendQuickAction(btn, text)` — ancienne signature, remplacée
- `addChatBubble()` — jamais appelée
- `applyPlanModifications()` — jamais appelée  
- `sendChatMessage()` sans paramètre — remplacée par `sendChatMessage(mode)`

Ces fonctions référencent des IDs HTML inexistants : `chat-messages`, `chat-input`, `chat-send-btn`, `chat-chips` — **ces éléments n'existent pas dans le HTML**. Bloc entièrement mort.

**Estimation : ~155 lignes de code mort.**

### Variables globales (pollution namespace)

```js
supabaseClient, IS_DEMO, user, currentPlan, plansHistory, selectedPayPlan,
userCredits, currentResult, authMode, genStatuses, GEN_SECTIONS, _genSectionTimer,
liveFeedInterval, _lfTimestampInterval, _lfDisplayed, _lfPoolIdx, liveFeedPool,
_lfGradients, IDEA_PROMPTS, _draftTimer, _draftIndicatorTimer,
chatHistory (MORTE), legalContent, CHAT_QUICK_ACTIONS, SECTION_QUESTIONS, chatState
```
**Total : ~26 variables globales**

### Event listeners

| Listener | Ligne | Évènement |
|----------|-------|-----------|
| `initSupabase` | 4906 | DOMContentLoaded |
| `initCookieBanner` | 7073 | DOMContentLoaded |
| `setPreviewState('A')` | 7074 | DOMContentLoaded |
| `closeLegal` | 7403 | keydown (Escape) |
| Mock 3D tilt | 7415+ | mousemove / mouseleave |
| Fade-up observer | ~6124 | IntersectionObserver |

---

## 1.4 Inventaire HTML

### Structure des pages

| Élément | Count |
|---------|-------|
| `.page` (pages principales) | 3 (landing, auth, dashboard) |
| `nav` | 1 |
| `<section>` | ~12 (landing) |
| `<div class="dash-view">` | 8 views (generator, history, chat, billing, settings, inspiration, referral, help) |
| `<aside>` | 1 (chat drawer) |
| Modales | 4 (legal, dossier, planPreview, inspire) |
| `id` unique | 161 IDs — **aucun doublon détecté** ✅ |

### Structures HTML répétées

- **Plan blocks** (`<div class="plan-block">`) : 17 répétitions quasi-identiques dans `#dashResult` — candidats à un template JS
- **Pay plan options** (`<div class="pay-plan-option">`) : 3 répétitions dans billing
- **Stat mini cards** (`<div class="stat-mini">`) : ~8 répétitions
- **Feature bullets** dans la landing : pattern répété ~20 fois

### Inline styles lourds

Le HTML contient beaucoup de `style="..."` directs, notamment :
- Toute la section `#dashResult` (plan affiché) : styles inline massivement utilisés
- Le chat drawer : `style="display:none"` systématique
- Les sections settings RGPD nouvellement ajoutées : tout en inline

---

## 1.5 Bugs et incohérences

### 🔴 IDs référencés dans le JS mais absents du HTML

| ID | Référencé ligne JS | Statut |
|----|-------------------|--------|
| `chat-messages` | 6600, 6660 | ❌ N'existe pas (ancien chat mort) |
| `chat-input` | 6691, 6655 | ❌ N'existe pas (ancien chat mort) |
| `chat-send-btn` | 6699 | ❌ N'existe pas (ancien chat mort) |
| `chat-chips` | 6641, 6654 | ❌ N'existe pas (ancien chat mort) |

### ⚠️ Doublons de fonction

| Doublon | Lignes | Note |
|---------|--------|------|
| `sendChatMessage()` | 6690 vs 7635 | L'une sans arg (morte), l'autre avec `mode` (active) |
| `sendQuickAction(btn, text)` | 6653 vs `sendQuickAction(text, mode)` 7628 | Signatures différentes — ancienne est morte |

### ⚠️ `isPaid` — logique plan conditionnelle résiduelle

Ligne 5157 : `const isPaid = currentPlan === 'builder' || currentPlan === 'empire';`  
Cette variable est calculée mais **jamais utilisée** dans la logique actuelle de génération (vestige d'une ancienne restriction). Violait la règle CLAUDE.md.

### ⚠️ Formulaire CB toujours présent dans la billing view

Le formulaire avec champs `cardName`, `cardNum`, `cardExp`, `cardCvc` est toujours dans le HTML (lignes ~4537–4560) alors que `processPayment()` redirige vers Stripe Checkout. Ces champs ne sont plus utilisés.

### ⚠️ `testAPIConnection` appelée dans `showView`

Ligne ~5114 : `showView` appelle `testAPIConnection()` — fonction de debug qui fait un fetch vers l'API à chaque changement de vue. À supprimer.

### CSS — Placeholders définis 3 fois

`.form-input::placeholder` défini lignes 609, 638, **1347 avec `!important`** — redondant.

### Pas de `console.log` oubliés

Seuls des `console.warn` et `console.error` légitimes — ✅ OK.

---

## 1.6 Recommandations de découpage

### Structure cible proposée

```
/
├── index.html                    # Shell HTML uniquement (sans CSS/JS inline)
├── eadee-app-v2.backup.html      # Backup pre-refactor
│
├── public/
│   ├── css/
│   │   ├── 00-base.css           # :root variables, reset, body, .page, .hidden
│   │   ├── 01-nav.css            # nav, logo, nav-plan, nav-btn, dropdown
│   │   ├── 02-auth.css           # page auth, tabs, auth-form
│   │   ├── 03-components.css     # form-*, toast, gen-panel, badges, boutons réutilisables
│   │   ├── 10-landing-hero.css   # hero-*, mock-*, orbs, dot grid, badge, heading, CTA
│   │   ├── 11-landing-sections.css # tr-*, how-*, comp-*, marquee, stats, social proof
│   │   ├── 12-landing-pricing.css  # pricing section
│   │   ├── 13-landing-footer.css   # footer2-*, cookie-*, legal-*
│   │   ├── 20-dashboard.css      # dash-*, sidebar, sc-*, mobile-nav
│   │   ├── 21-generator.css      # gen-*, preview states A/B/C, loading anim
│   │   ├── 22-plan.css           # plan-block-*, result panel, ai-disclaimer
│   │   ├── 23-history.css        # history-*
│   │   ├── 24-billing.css        # payment-*, pay-*, stripe form, order summary
│   │   ├── 25-chat.css           # chat-*, drawer, conversations col
│   │   ├── 26-dossier.css        # dossier-*
│   │   ├── 27-modals.css         # preview-modal-*, legal-modal-*, inspire modal
│   │   ├── 90-animations.css     # @keyframes uniquement
│   │   └── 99-responsive.css     # TOUS les @media (centralisés, 39 → organisés)
│   │
│   └── js/
│       ├── 00-state.js           # Variables globales dans des objets (user, plan, chat, credits)
│       ├── 01-utils.js           # toast, esc, escHtml, scrollToPricing, formatCard, formatExp
│       ├── 02-router.js          # showPage, showView, setMobActive, updateNav, updateUsage
│       ├── 10-supabase.js        # initSupabase, loadCurrentUser
│       ├── 11-auth.js            # showAuth, switchAuthTab, handleAuth, handleGoogleAuth, logout
│       ├── 20-generator.js       # generateDashPlan, fillPlan, resetGenerator, drawRevenueChart
│       ├── 21-preview.js         # setPreviewState, startGenSectionsAnim, stopGenSectionsAnim
│       ├── 22-live-feed.js       # startLiveFeed, stopLiveFeed, _lfTick, liveFeedPool
│       ├── 23-draft.js           # onIdeaInput, updateTips, saveDraft, checkDraft, resumeDraft, discardDraft
│       ├── 30-history.js         # renderHistory, openFromHistory, selectPlan, showPlanPreview, closePlanPreview
│       ├── 31-plan-actions.js    # copyPlan, savePlan, copyEmail
│       ├── 40-chat.js            # Tout le système Expert Eadee (openChatFullscreen, openChatDrawer, sendChatMessage, ...)
│       ├── 50-billing.js         # selectPayPlan, processPayment + handleStripeReturn
│       ├── 51-settings.js        # saveSettings, exportMyData, requestRectification, confirmDeleteAccount
│       ├── 60-dossier.js         # generateDossier, renderDossier, switchDossierTab, closeDossier
│       ├── 70-cookies.js         # initCookieBanner, setCookieConsent
│       ├── 71-legal.js           # legalContent, openLegal, closeLegal
│       ├── 80-onboarding.js      # checkOnboarding, dismissOnboarding, updateDashHeader
│       ├── 81-misc.js            # toggleNavDropdown, toggleNotifDropdown, toggleFaq, toggleSidebar, prefillIdea, openInspireModal, initChat
│       └── main.js               # DOMContentLoaded listeners + init
│
└── api/                          # Inchangé
    ├── coach.js
    ├── config.js
    ├── delete-user.js
    ├── proxy.js
    ├── stripe-checkout.js
    └── stripe-webhook.js
```

### Code mort à supprimer lors du refactor

| Éléments | Lignes estimées |
|----------|-----------------|
| Bloc ancien chat (6582–6737) | ~155 lignes |
| Formulaire CB inutilisé (billing) | ~30 lignes |
| Variable `isPaid` résiduelle | 1 ligne |
| CSS `.chat-upsell-*` | ~20 lignes |
| CSS `.legal-footer-*` (ancien footer) | ~18 lignes |
| Placeholders CSS triplés | ~5 lignes |
| **Total estimé** | **~230 lignes** |

---

## Bugs à corriger après refactor (ne pas corriger pendant)

1. **Formulaire CB** dans billing — les champs `cardName`, `cardNum`, `cardExp`, `cardCvc` n'ont plus d'utilité depuis l'intégration Stripe Checkout → à retirer du HTML
2. **`testAPIConnection`** appelée dans `showView` → à supprimer (appel API inutile à chaque navigation)
3. **`isPaid`** ligne 5157 → variable calculée jamais utilisée, vestige de restriction par plan → à supprimer
4. **Formulaire "Mot de passe"** dans Settings → `onclick="toast('Mot de passe mis à jour','success')"` sans vraie implémentation Supabase → fonctionnalité factice

---

*Rapport d'audit Phase 1 — eadee-app-v2.html*
*Fichier : 7841 lignes | Classes CSS : 637 | Fonctions JS : 86 (dont 5 mortes) | IDs : 161 (aucun doublon) | Media queries : 39 (dispersées)*
