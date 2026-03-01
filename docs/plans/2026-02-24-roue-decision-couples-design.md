# Design Document — Roue de décision pour couples

**Date:** 2026-02-24
**Status:** Approved

---

## 1. Concept

Web app statique (HTML/CSS/JS pur) permettant aux couples de prendre des décisions du quotidien via une roue de fortune animée. Sans compte, sans backend, déployable directement sur Hostinger.

---

## 2. Architecture

### Fichiers

```
/
├── index.html          # Page principale (roue)
├── about.html          # Page À propos
├── faq.html            # Page FAQ
├── css/
│   └── styles.css      # Design system complet + responsive
├── js/
│   ├── app.js          # Logique roue, catégories, localStorage
│   └── i18n.js         # Traductions FR/EN
└── assets/
    └── favicon.svg     # Favicon cœur/roue
```

### Principes
- Aucun framework JS, aucun bundler
- CSS pur (pas de Tailwind CDN)
- Une seule dépendance externe: Google Fonts (Plus Jakarta Sans)
- Total < 50kb HTML+CSS+JS

---

## 3. Design System (extrait du projet Stitch "Couple - Roue de décision")

### Couleurs
```css
--primary: #E11D48;           /* rose vif — CTA, accents */
--primary-glow: #F43F5E;      /* hover/glow */
--secondary: #EC4899;         /* rose doux — secondaire */
--accent-purple: #A855F7;     /* violet — segments roue */
--accent-teal: #2DD4BF;       /* teal — segments roue */

--bg-light: #f8f9fc;
--bg-dark: #0F172A;
--surface-light: #ffffff;
--surface-dark: #1E293B;
--surface-dark-2: #334155;
--text-light: #1e293b;
--text-dark: #F8FAFC;
--text-muted-light: #64748b;
--text-muted-dark: #94A3B8;
--border-light: #e2e8f0;
--border-dark: #334155;
```

### Palette segments roue (cyclique)
```js
['#E11D48','#A855F7','#2DD4BF','#F97316','#4338CA','#10B981','#EC4899','#EAB308']
```

### Typographie
- Famille: **Plus Jakarta Sans**, sans-serif (Google Fonts)
- H1: 2.5rem / 700
- H2: 1.75rem / 700
- H3: 1.25rem / 600
- Body: 1rem / 400, line-height 1.6
- Small/muted: 0.875rem / 400

### Border radius
- Pill (boutons principaux): `9999px`
- Cards: `0.75rem`
- Inputs: `0.5rem`
- Small elements: `0.25rem`

### Shadows & effets
- Neon glow bouton Spin: `0 0 15px rgba(225,29,72,0.4), 0 0 30px rgba(225,29,72,0.2)`
- Neon glow roue: `0 0 20px rgba(168,85,247,0.4)`
- Card shadow light: `0 4px 6px rgba(0,0,0,0.07)`
- Card shadow dark: `0 4px 6px rgba(0,0,0,0.3)`

---

## 4. Pages & Composants

### index.html — Page principale

**Header**
- Logo "CoupleDecide" (icône + texte)
- Toggle FR/EN
- Toggle dark mode (icône lune/soleil)

**Emplacements publicitaires**
```html
<div id="ad-top-banner"><!-- AdSense top banner --></div>
<div id="ad-side-banner"><!-- AdSense side banner --></div>
<div id="ad-bottom-banner"><!-- AdSense bottom banner --></div>
```

**Layout desktop (2 colonnes)**
- Gauche (60%): Roue Canvas + dropdown catégorie + bouton "TOURNER LA ROUE"
- Droite (40%): Panneau options (liste + add + reset + ad-side-banner)

**Layout mobile (1 colonne)**
- Roue → Catégorie → Bouton → Options → Texte SEO

**Modal résultat**
- Overlay semi-transparent
- Carte centrée avec animation
- Nom de l'option sélectionnée (grand, gras)
- Bouton "Retourner" (re-spin) + bouton "Fermer"

**Section SEO (après la roue)**
- H1: "Roue de décision pour couples"
- Texte 600-800 mots (FR) avec mots-clés naturels
- H2: "Comment utiliser la roue ?", "Idées de catégories", "Personnalisez vos décisions"
- Mini-FAQ LLM conversationnelle (3-4 Q/A)

**Footer**
- Liens: À propos | FAQ | Confidentialité
- Copyright © 2026 CoupleDecide

### about.html — À propos

- Header identique
- Hero avec gradient rose→violet, titre FR+EN
- 4 cartes cas d'usage avec icônes SVG inline
- Texte concept + bénéfices
- CTA "Essayer la roue"
- Footer identique

### faq.html — FAQ

- Header identique
- H1 + intro
- 7 accordéons CSS (details/summary — pas de JS)
- Section mini-FAQ LLM
- CTA
- Footer identique

---

## 5. Logique Roue (app.js)

### Canvas
- Taille: 420×420px (desktop), 300×300px (mobile)
- Dessin via `CanvasRenderingContext2D`
- Aiguille SVG fixe pointant vers le haut
- Animation: `requestAnimationFrame` avec easing `easeOutCubic`
- Durée: 3.5-5 secondes (random pour ne pas être prévisible)
- Rotations: 5-8 tours complets + angle final calculé
- Détection résultat: angle final → index du segment

### Catégories (5 par défaut)
```js
{
  fr: {
    label: "Soirée en amoureux",
    options: ["Dîner au restaurant","Film à la maison","Jeu de société","Balade nocturne","Massage à deux","Pique-nique","Concert","Soirée jeux vidéo"]
  }
  // ... + "Que manger ?", "Activités week-end", "Tâches ménagères", "Intimité & fun"
}
```

### localStorage
```js
'cdw_theme'           // 'light' | 'dark'
'cdw_lang'            // 'fr' | 'en'
'cdw_category'        // slug catégorie active
'cdw_options_{slug}'  // JSON array options personnalisées par catégorie
'cdw_history'         // JSON array [{option, category, date}] max 50 entrées
```

---

## 6. Internationalisation (i18n.js)

Objet de traductions statique:
```js
const TRANSLATIONS = {
  fr: { spinBtn: "Tourner la roue", addBtn: "Ajouter", ... },
  en: { spinBtn: "Spin the wheel", addBtn: "Add", ... }
}
```
Basculement: `document.querySelectorAll('[data-i18n]')` + `textContent = t[key]`
Meta title/description: swappés dynamiquement selon la langue.

---

## 7. SEO

### Par page
| Page | Title FR | Title EN |
|------|----------|----------|
| index | Roue de décision pour couples – Idées de sorties, repas et activités | Couple Decision Wheel – Date Night, Food & Weekend Ideas |
| about | À propos – Roue de décision pour couples | About – Couple Decision Wheel |
| faq | FAQ – Roue de décision pour couples | FAQ – Couple Decision Wheel |

### Éléments techniques
- `<meta name="description">` par page
- `<meta property="og:*">` (OpenGraph)
- `<link rel="canonical">`
- `robots.txt` + `sitemap.xml`
- Schema.org `WebApplication` JSON-LD sur index.html
- Balises H1 uniques, H2 structurés

### Mots-clés ciblés
- roue de décision couple
- idée sortie couple
- idée soirée en amoureux
- decision wheel for couples
- date night decision wheel

---

## 8. Accessibilité & Performance

- `aria-label` sur tous les boutons iconiques
- `tabindex` cohérent
- Spacebar → déclenche le spin (keydown listener)
- Contrastes WCAG AA (vérifiés sur bg light + dark)
- Images: aucune (SVG inline + Canvas uniquement)
- Fonts: `display=swap` pour éviter FOUT
- Pas de JS bloquant: scripts en fin de `<body>`

---

## 9. Emplacements AdSense (préparés, non implémentés)

```html
<!-- TOP: Insérer script AdSense ici -->
<div id="ad-top-banner" class="ad-slot ad-top" aria-hidden="true">
  <!-- <ins class="adsbygoogle" data-ad-slot="XXXX"></ins> -->
</div>

<!-- SIDE: À côté de la roue sur desktop, sous la roue sur mobile -->
<div id="ad-side-banner" class="ad-slot ad-side" aria-hidden="true">
  <!-- <ins class="adsbygoogle" data-ad-slot="XXXX"></ins> -->
</div>

<!-- BOTTOM: Au-dessus du footer -->
<div id="ad-bottom-banner" class="ad-slot ad-bottom" aria-hidden="true">
  <!-- <ins class="adsbygoogle" data-ad-slot="XXXX"></ins> -->
</div>
```
