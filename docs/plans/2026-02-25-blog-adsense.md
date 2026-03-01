# Blog CoupleDecide — Plan d'implémentation (AdSense)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Créer une section blog avec 15 articles de 1000–1500 mots pour satisfaire les critères de contenu Google AdSense 2026.

**Architecture:** Pages HTML statiques dans `/blog/`, index des articles sur `blog/index.html`, 15 articles individuels. Style partagé avec le site existant via `css/styles.css` + bloc `<style>` inline pour les styles spécifiques aux articles. Schema.org `Article` sur chaque page, GA4, canonical, og:*.

**Tech Stack:** HTML5, CSS3 (variables existantes du site), JS existant (i18n.js + app.js pour header), Google Analytics GA4.

---

## Contexte pour les subagents

Le site est un site statique pur à `C:\Projets\Roue de décision couples\`.
- `css/styles.css` — design system existant (ne pas modifier)
- `js/i18n.js` + `js/app.js` — scripts partagés (header dark mode + hamburger)
- Couleurs : `--primary: #E11D48`, `--accent-purple: #A855F7`, `--accent-teal: #2DD4BF`
- Font : Plus Jakarta Sans (déjà dans styles.css)
- Header identique sur toutes les pages existantes (copier depuis `about.html`)
- Footer identique : About · FAQ · Contact · Mentions légales · Confidentialité

**Template article HTML à suivre exactement** (copier/adapter pour chaque article) :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[TITRE] – CoupleDecide</title>
  <meta name="description" content="[DESCRIPTION 155 chars max]">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://coupledecide.com/blog/[SLUG].html">
  <link rel="alternate" hreflang="fr" href="https://coupledecide.com/blog/[SLUG].html">
  <link rel="alternate" hreflang="x-default" href="https://coupledecide.com/blog/[SLUG].html">
  <meta property="og:title" content="[TITRE] – CoupleDecide">
  <meta property="og:description" content="[DESCRIPTION]">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://coupledecide.com/blog/[SLUG].html">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[TITRE] – CoupleDecide">
  <meta name="twitter:description" content="[DESCRIPTION]">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="../css/styles.css">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-89WZ4NMW6S"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-89WZ4NMW6S');
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[TITRE]",
    "description": "[DESCRIPTION]",
    "url": "https://coupledecide.com/blog/[SLUG].html",
    "publisher": {
      "@type": "Organization",
      "name": "CoupleDecide",
      "url": "https://coupledecide.com"
    },
    "datePublished": "2026-02-25",
    "dateModified": "2026-02-25",
    "inLanguage": "fr"
  }
  </script>
  <style>
    .article-page { max-width: 740px; margin: 0 auto; padding: 3rem 1.5rem; }
    .article-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; }
    .article-category { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); background: rgba(225,29,72,0.1); padding: 0.3rem 0.75rem; border-radius: var(--radius-pill); }
    .article-date { font-size: 0.85rem; color: var(--text-muted); }
    .article-read-time { font-size: 0.85rem; color: var(--text-muted); }
    .article-page h1 { font-size: clamp(1.6rem, 4vw, 2.2rem); line-height: 1.25; margin-bottom: 1rem; }
    .article-intro { font-size: 1.1rem; color: var(--text-muted); line-height: 1.75; margin-bottom: 2rem; border-left: 3px solid var(--primary); padding-left: 1.25rem; }
    .article-page h2 { font-size: 1.3rem; font-weight: 700; margin: 2.25rem 0 0.75rem; }
    .article-page h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: var(--text); }
    .article-page p { line-height: 1.8; margin-bottom: 1.1rem; }
    .article-page ul, .article-page ol { padding-left: 1.5rem; margin-bottom: 1.1rem; }
    .article-page li { line-height: 1.75; margin-bottom: 0.4rem; color: var(--text-muted); }
    .article-page li strong { color: var(--text); }
    .article-highlight { background: var(--surface-2); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 1.25rem 1.5rem; margin: 1.75rem 0; }
    .article-highlight p { margin: 0; font-style: italic; }
    .article-cta-box { background: linear-gradient(135deg, rgba(225,29,72,0.08), rgba(168,85,247,0.08)); border: 1px solid rgba(225,29,72,0.2); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; margin: 2.5rem 0; }
    .article-cta-box p { margin: 0 0 1rem; font-weight: 500; }
    .article-back { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 2rem; }
    .article-back:hover { color: var(--primary); }
  </style>
</head>
<body>
[HEADER identique à about.html]
<main>
  <div class="article-page">
    <a href="../blog/" class="article-back">← Retour au blog</a>
    <div class="article-meta">
      <span class="article-category">[CATÉGORIE]</span>
      <span class="article-date">25 février 2026</span>
      <span class="article-read-time">⏱ [X] min de lecture</span>
    </div>
    <h1>[TITRE H1]</h1>
    <p class="article-intro">[ACCROCHE 2-3 phrases]</p>
    [CONTENU 1000–1500 MOTS]
    <div class="article-cta-box">
      <p>Toujours en panne d'idée ? Laissez la roue décider pour vous !</p>
      <a href="../index.html" class="about-cta">🎡 Tourner la roue</a>
    </div>
  </div>
</main>
[FOOTER identique avec liens ../about.html, ../faq.html, ../contact.html, ../legal.html, ../privacy.html]
<script src="../js/i18n.js"></script>
<script src="../js/app.js"></script>
</body>
</html>
```

---

## Task 1 : Infrastructure blog (index + CSS blog/nav)

**Files:**
- Create: `blog/index.html`
- Modify: `index.html` (ajouter Blog au header-nav et mobile-nav)
- Modify: `about.html`, `faq.html`, `contact.html`, `legal.html`, `privacy.html` (idem)

**Étape 1 — Créer `blog/index.html`**

Page listant les 15 articles avec des cartes (titre, catégorie, extrait, lien). Structure :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog – Idées et conseils pour les couples | CoupleDecide</title>
  <meta name="description" content="Articles et conseils pratiques pour les couples : idées de soirées, de sorties, de repas, d'activités et bien plus. Le blog de CoupleDecide.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://coupledecide.com/blog/">
  <meta property="og:title" content="Blog CoupleDecide – Idées et conseils pour les couples">
  <meta property="og:description" content="Articles et conseils pratiques pour les couples : idées de soirées, de sorties, de repas, d'activités et bien plus.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://coupledecide.com/blog/">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="../css/styles.css">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-89WZ4NMW6S"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-89WZ4NMW6S');</script>
  <style>
    .blog-hero { text-align: center; padding: 3rem 1.5rem 2rem; }
    .blog-hero h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 0.75rem; }
    .blog-hero p { color: var(--text-muted); font-size: 1.05rem; max-width: 520px; margin: 0 auto; }
    .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; padding: 2rem 1.5rem 4rem; max-width: 1100px; margin: 0 auto; }
    .blog-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; transition: transform var(--transition), box-shadow var(--transition); display: flex; flex-direction: column; }
    .blog-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    .blog-card-cat { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.75rem; }
    .blog-card h2 { font-size: 1.05rem; font-weight: 700; line-height: 1.4; margin-bottom: 0.6rem; }
    .blog-card h2 a { color: var(--text); }
    .blog-card h2 a:hover { color: var(--primary); }
    .blog-card p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.65; flex: 1; margin-bottom: 1rem; }
    .blog-card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); }
    .blog-card-read { color: var(--primary); font-weight: 600; font-size: 0.875rem; }
    .blog-card-read:hover { opacity: 0.8; }
  </style>
</head>
<body>
<!-- Header identique à about.html MAIS avec "Blog" actif dans nav -->
<!-- ... -->
<main>
  <div class="blog-hero">
    <h1>Le blog CoupleDecide</h1>
    <p>Idées, conseils et inspirations pour rendre votre vie de couple plus fun et plus simple.</p>
  </div>
  <div class="blog-grid">
    <!-- 15 cartes articles — voir liste complète ci-dessous -->
  </div>
</main>
<!-- Footer identique -->
</body>
</html>
```

Les 15 cartes à inclure dans `.blog-grid` (ordre d'affichage) :

| # | Fichier | Catégorie | Titre court | Extrait (2 phrases) | Temps lecture |
|---|---|---|---|---|---|
| 1 | `idees-soirees-romantiques-maison.html` | Soirées | 20 idées de soirées romantiques à la maison | Pas besoin de réserver un restaurant pour vivre un moment magique. Voici 20 idées de soirées à partager chez vous, du plus simple au plus mémorable. | 6 min |
| 2 | `idees-sorties-couple-weekend.html` | Sorties | Idées de sorties en couple pour le week-end | Le week-end arrive et vous manquez d'inspiration ? Découvrez nos meilleures idées de sorties pour sortir de votre routine. | 5 min |
| 3 | `que-manger-ce-soir-couple.html` | Repas | Que manger ce soir ? Le guide pour les couples indécis | "Je sais pas, et toi ?" — Si cette phrase résonne, ce guide est fait pour vous. Explorez les cuisines du monde sans quitter votre cuisine. | 5 min |
| 4 | `repartir-taches-menageres-couple.html` | Tâches | Répartir les tâches ménagères sans dispute | Le partage des corvées est l'une des premières sources de tension en couple. Voici comment en faire quelque chose d'équitable et même ludique. | 6 min |
| 5 | `date-night-idees-originales.html` | Soirées | 15 idées de date night pour sortir de la routine | La routine s'installe vite en couple. Ces 15 idées de date night vous aideront à retrouver la complicité des premiers temps. | 5 min |
| 6 | `films-romantiques-couple.html` | Soirées | Les meilleurs films romantiques à regarder en couple | Une bonne soirée ciné commence par le bon film. Notre sélection couvre tous les styles pour plaire à monsieur et madame. | 6 min |
| 7 | `activites-sportives-couple.html` | Activités | Les meilleures activités sportives à faire en couple | Le sport à deux, c'est bon pour la santé… et pour le couple. Voici les activités les plus amusantes à pratiquer ensemble. | 5 min |
| 8 | `week-end-amoureux-idees.html` | Sorties | Week-end en amoureux : idées pour une escapade réussie | Quelques jours loin du quotidien font parfois des miracles pour un couple. Nos idées pour planifier une escapade mémorable. | 6 min |
| 9 | `communication-couple-quotidien.html` | Conseils | Mieux communiquer en couple au quotidien | La communication est le pilier de toute relation épanouie. Des conseils concrets pour mieux se parler, s'écouter et se comprendre. | 7 min |
| 10 | `jeux-societe-couple.html` | Soirées | Les meilleurs jeux de société pour les couples | Les jeux de société font revivre la complicité des soirées entre amis… mais en mode romantique. Notre sélection pour les couples. | 5 min |
| 11 | `idees-cadeaux-partenaire.html` | Conseils | Idées de cadeaux originaux pour son ou sa partenaire | Trouver le cadeau parfait pour l'être aimé n'est pas toujours simple. Voici des idées qui sortent des sentiers battus. | 6 min |
| 12 | `activites-creatives-couple-maison.html` | Activités | Activités créatives à faire en couple à la maison | Quand la météo ne se prête pas aux sorties, la créativité prend le relais. Des activités originales à tester à deux chez vous. | 5 min |
| 13 | `pique-nique-romantique-guide.html` | Sorties | Préparer un pique-nique romantique : le guide | Un pique-nique romantique, ça se prépare. De l'endroit idéal au menu parfait, voici comment créer un moment inoubliable. | 5 min |
| 14 | `complicite-couple-conseils.html` | Conseils | Entretenir la complicité dans son couple | La complicité ne s'entretient pas toute seule. Découvrez des habitudes simples pour rester proches, même dans le quotidien. | 7 min |
| 15 | `diner-romantique-idees.html` | Soirées | Dîner romantique : idées pour une soirée mémorable | Un dîner romantique ne demande pas des étoiles au Guide Michelin. Nos idées pour créer une atmosphère magique chez vous ou au restaurant. | 5 min |

**Étape 2 — Ajouter "Blog" dans la nav de toutes les pages existantes**

Dans chaque fichier (index.html, about.html, faq.html, contact.html, legal.html, privacy.html), dans `<nav class="header-nav">` ET `<nav class="mobile-nav">`, ajouter APRÈS le lien FAQ :
```html
<a href="blog/" class="nav-link">Blog</a>
```
(Pour les pages dans `/blog/`, utiliser `href="../blog/"`)

**Étape 3 — Commit**
```bash
git add blog/index.html index.html about.html faq.html contact.html legal.html privacy.html 404.html
git commit -m "feat: add blog index page and Blog nav link on all pages"
```

---

## Task 2 : Articles 1–3

### Article 1 : `blog/idees-soirees-romantiques-maison.html`

**Catégorie :** Soirées | **Temps :** 6 min | **Mots cibles :** ~1200

**Titre H1 :** 20 idées de soirées romantiques à la maison

**Description meta :** Pas besoin de sortir pour vivre un moment inoubliable. Découvrez 20 idées de soirées romantiques à la maison pour renouer avec la complicité de votre couple.

**Accroche :** Il y a des soirs où l'envie de sortir est bien là, mais la fatigue ou la météo en décide autrement. Et si rester chez soi devenait la meilleure option ? Avec un peu d'imagination et quelques détails bien choisis, votre salon peut se transformer en scène de film romantique. Voici 20 idées pour rendre vos soirées à la maison aussi mémorables que vos meilleures sorties.

**Plan :**
- H2 : Créer l'ambiance avant tout (bougies, musique, téléphones éteints)
- H2 : Soirées cuisine (cuisiner ensemble, tester une recette d'un pays qu'on rêve de visiter, blind-test de vins)
- H2 : Soirées jeux et défis (quiz couple, jeu de rôle "date dans un restaurant imaginaire", battle artistique)
- H2 : Soirées détente et bien-être (spa à la maison, massage échangé, méditation à deux)
- H2 : Soirées culturelles (regarder un documentaire suivi d'un débat, écouter un album en entier, lire un livre à voix haute)
- H2 : Pour aller plus loin (lien vers la roue de décision)
- CTA box

**Ton :** Chaleureux, complice, concret. Utiliser "vous" et parfois "on". Quelques touches d'humour doux. Éviter le ton corporate.

---

### Article 2 : `blog/idees-sorties-couple-weekend.html`

**Catégorie :** Sorties | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Idées de sorties en couple pour le week-end : que faire à deux ?

**Description meta :** Manque d'inspiration pour votre week-end ? Découvrez nos meilleures idées de sorties en couple, du musée au marché, de la randonnée à l'atelier créatif.

**Accroche :** Le vendredi soir arrive avec sa grande question : "On fait quoi ce week-end ?" Entre les envies de chacun, la météo capricieuse et l'habitude qui pousse toujours vers les mêmes endroits, trouver une bonne idée n'est pas si simple. Voici de quoi alimenter votre prochain conseil de guerre en couple.

**Plan :**
- H2 : Sorties culturelles (musées, expos temporaires, cinéma en plein air, visite d'un quartier inconnu de votre ville)
- H2 : Sorties nature (randonnée niveau 0, ballade à vélo, pique-nique dans un parc, cueillette selon la saison)
- H2 : Sorties gourmandes (marché local, cours de cuisine, déjeuner dans un restaurant jamais testé, visite d'une brasserie artisanale)
- H2 : Sorties originales (escape game, atelier poterie, mini-golf, soirée bowling, cours de danse)
- H2 : L'astuce du hasard (présenter la roue + lien)
- CTA box

---

### Article 3 : `blog/que-manger-ce-soir-couple.html`

**Catégorie :** Repas | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Que manger ce soir ? Le guide pour les couples chroniquement indécis

**Description meta :** "Je sais pas, et toi ?" Enfin une réponse. De la pizza aux sushis, en passant par la cuisine thaïe et les tacos, tour d'horizon des meilleures options du soir.

**Accroche :** La question revient chaque soir avec une ponctualité remarquable. "T'as une idée pour le dîner ?" Suivi de "Je sais pas, et toi ?" — puis dix minutes de négociations qui s'achèvent invariablement sur la même pizza du vendredi. Si vous vous reconnaissez dans cette scène, ce guide est fait pour vous.

**Plan :**
- H2 : Quand vous voulez du réconfort (pasta, risotto, tartiflette, soupe maison — le répertoire du "câlin dans une assiette")
- H2 : Quand vous avez envie de voyager (sushis, cuisine thaïe, tacos, curry indien — et comment les commander ou les cuisiner)
- H2 : Quand vous avez la flemme mais refusez la livraison (œufs brouillés gourmet, tartines chic, planche apéro dînatoire)
- H2 : Quand vous voulez vous faire plaisir (pizza maison, burger du dimanche, raclette — les classiques qui ne déçoivent jamais)
- H2 : La solution si vous n'arrivez toujours pas à choisir (roue "Que manger ?" + lien)
- CTA box

---

## Task 3 : Articles 4–6

### Article 4 : `blog/repartir-taches-menageres-couple.html`

**Catégorie :** Tâches | **Temps :** 6 min | **Mots cibles :** ~1200

**Titre H1 :** Tâches ménagères en couple : comment les répartir sans se disputer

**Description meta :** La répartition des tâches ménagères est l'une des premières sources de tension en couple. Méthodes, outils et état d'esprit pour en finir avec les injustices du quotidien.

**Accroche :** Dans presque tous les couples, il y a un moment où la question des tâches ménagères cesse d'être anodine. Qui passe l'aspirateur ? Qui fait les courses ? Qui pense à changer le papier toilette ? Ce qui semblait évident au début devient peu à peu une source de rancœur silencieuse. Mais ça n'a pas à être ainsi.

**Plan :**
- H2 : Pourquoi la répartition des tâches crée des tensions (charge mentale, invisibilité du travail domestique, attentes non formulées)
- H2 : Les méthodes qui fonctionnent (liste partagée, roulement hebdomadaire, spécialisation selon les préférences, "faire ensemble")
- H2 : Ce qu'il faut éviter (le "tu l'as pas fait comme il faut", le score imaginaire, attendre que l'autre le fasse)
- H2 : Les outils pratiques (apps, tableau blanc en cuisine, Google Keep partagé)
- H2 : La méthode ludique : laisser le hasard décider (roue des tâches ménagères + lien)
- CTA box

---

### Article 5 : `blog/date-night-idees-originales.html`

**Catégorie :** Soirées | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Date night : 15 idées originales pour sortir de la routine en couple

**Description meta :** La routine s'installe vite. Ces 15 idées de date night vous aideront à retrouver la complicité des premiers temps, sans forcément dépenser une fortune.

**Accroche :** Quand on est ensemble depuis un moment, les soirées tendent à se ressembler. Canapé, série, téléphone. Ce n'est pas mauvais — c'est même doux et rassurant. Mais de temps en temps, un petit grain de sable dans la routine fait du bien. Voici 15 idées de "date night" qui vous sortiront de l'ordinaire.

**Plan :**
- H2 : Les classiques revisités (ciné avec un film que ni l'un ni l'autre n'aurait choisi seul, dîner dans un resto d'une cuisine jamais testée, balade nocturne dans un quartier inconnu)
- H2 : Les dates à la maison (recréer le premier dîner, soirée "sans écran", karaoké improvisé dans le salon)
- H2 : Les dates actives (cours de danse, escape game, accrobranche, piscine à des horaires inhabituels)
- H2 : Les dates culturelles (vernissage, concert surprise, atelier céramique, ciné-club avec débat)
- H2 : Le date night spontané (laisser la roue décider — toute la soirée, restaurant inclus)
- CTA box

---

### Article 6 : `blog/films-romantiques-couple.html`

**Catégorie :** Soirées | **Temps :** 6 min | **Mots cibles :** ~1200

**Titre H1 :** Films romantiques à regarder en couple : notre sélection incontournable

**Description meta :** De la comédie romantique au drame poignant, voici les films à regarder en couple pour une soirée ciné parfaite. Pour elle, pour lui, et pour les deux.

**Accroche :** Choisir un film à deux, c'est parfois une négociation à part entière. L'un veut de l'action, l'autre du romantisme, et on finit par regarder la même chose pour la troisième fois parce que "au moins on est sûrs d'aimer". Cette liste est là pour mettre tout le monde d'accord.

**Plan :**
- H2 : Les comédies romantiques indémodables (Notting Hill, Coup de foudre à Notting Hill, The Proposal, Crazy Rich Asians — pourquoi ils tiennent la distance)
- H2 : Les drames qui font pleurer ensemble (La La Land, Eternal Sunshine, The Notebook — pour partager une émotion vraie)
- H2 : Les films feel-good (About Time, Julie & Julia, Chef — chaleureux sans être mièvres)
- H2 : Pour les couples qui aiment un peu de frissons (Gone Girl, Mr. & Mrs. Smith — quand la tension fait partie du romantisme)
- H2 : Et si vous n'arrivez toujours pas à choisir ? (roue "Soirée en amoureux" + lien)
- CTA box

---

## Task 4 : Articles 7–9

### Article 7 : `blog/activites-sportives-couple.html`

**Catégorie :** Activités | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Activités sportives en couple : bougez ensemble, restez soudés

**Description meta :** Le sport à deux, c'est bon pour la santé et pour la relation. Yoga, randonnée, tennis, danse : découvrez les activités sportives les plus adaptées aux couples.

**Accroche :** Faire du sport ensemble, ce n'est pas juste "aller courir côte à côte en silence". C'est partager un effort, se motiver mutuellement, et souvent rire de situations que vous ne vivriez pas autrement. Voici comment transformer le sport en vrai moment de complicité.

**Plan :**
- H2 : Pourquoi faire du sport en couple est bénéfique pour la relation (endorphines partagées, objectifs communs, confiance)
- H2 : Les activités douces et accessibles (yoga, pilates, marche nordique, vélo — parfait pour tous les niveaux)
- H2 : Les activités à sensations (escalade indoor, tennis, padel, boxe thaïe — pour ceux qui aiment se dépasser ensemble)
- H2 : Les activités aquatiques (natation, stand-up paddle, kayak — l'eau comme terrain de jeu)
- H2 : La danse, le sport qu'on oublie toujours (salsa, bachata, rock — contact, rythme et fous rires garantis)
- H2 : Par où commencer ? (roue "Activités week-end" + lien)
- CTA box

---

### Article 8 : `blog/week-end-amoureux-idees.html`

**Catégorie :** Sorties | **Temps :** 6 min | **Mots cibles :** ~1200

**Titre H1 :** Week-end en amoureux : idées pour une escapade réussie sans se ruiner

**Description meta :** Un week-end en amoureux n'a pas besoin d'être luxueux pour être inoubliable. Idées de destinations, d'hébergements et d'activités pour une escapade parfaite à deux.

**Accroche :** Il y a des week-ends qui laissent des souvenirs pour longtemps. Pas forcément parce qu'ils étaient parfaits, mais parce qu'ils ont créé quelque chose — un fou rire au mauvais moment, une découverte inattendue, un dîner improvisé dans une ville inconnue. Voici comment provoquer ces moments.

**Plan :**
- H2 : Choisir la bonne destination (à moins de 2h de chez vous, campagne vs mer vs montagne vs ville, hors saison pour le charme)
- H2 : L'hébergement qui fait la différence (chambre d'hôtes atypique, cabane dans les arbres, hôtel spa, tiny house — quand le lieu devient l'expérience)
- H2 : Planifier sans sur-planifier (1-2 activités maximum par jour, garder du temps pour flâner, manger là où on passe devant)
- H2 : Les incontournables d'un week-end réussi (un bon restaurant, une balade sans destination, une photo spontanée)
- H2 : Mini-budget mais maxi-souvenirs (idées pour moins de 150€ pour deux)
- CTA box

---

### Article 9 : `blog/communication-couple-quotidien.html`

**Catégorie :** Conseils | **Temps :** 7 min | **Mots cibles :** ~1400

**Titre H1 :** Mieux communiquer en couple au quotidien : conseils qui changent vraiment les choses

**Description meta :** La communication est le pilier d'un couple épanoui. Des conseils concrets — et humains — pour mieux s'écouter, s'exprimer et éviter les malentendus du quotidien.

**Accroche :** La communication en couple, c'est un peu comme la plomberie : on n'y pense pas quand ça marche, et quand ça grippe, ça fait des dégâts. Le bon côté ? Ça s'apprend. Et contrairement à ce qu'on croit, il ne s'agit pas de parler davantage, mais de parler mieux.

**Plan :**
- H2 : Le problème n°1 : on parle mais on ne s'entend pas (écoute active vs attente de prendre la parole)
- H2 : Exprimer ses besoins sans accuser (la phrase en "je" vs en "tu")
- H2 : Les petits rituels qui entretiennent le lien (le point quotidien, le "check-in" du week-end, les questions qui vont au-delà de "ça va ?")
- H2 : Comment désamorcer une dispute avant qu'elle dégénère (le signal pause, la règle des 10 minutes, l'humour comme soupape)
- H2 : Les sujets qu'on évite et qu'on devrait aborder (finances, projets d'avenir, frustrations accumulées)
- H2 : La communication passe aussi par les actes (les petits gestes qui disent ce que les mots ne disent pas)
- CTA box

---

## Task 5 : Articles 10–12

### Article 10 : `blog/jeux-societe-couple.html`

**Catégorie :** Soirées | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Les meilleurs jeux de société pour les couples : notre sélection

**Description meta :** Les jeux de société, c'est pour les soirées entre amis ? Détrompez-vous. Voici les meilleurs jeux à deux pour passer une soirée complice et ludique en couple.

**Accroche :** Ranger le téléphone, s'asseoir face à face et jouer ensemble — ça semble presque révolutionnaire en 2026. Et pourtant, les couples qui jouent ensemble témoignent tous de la même chose : on apprend des choses sur l'autre qu'on n'aurait jamais découvertes autrement. Voici notre sélection.

**Plan :**
- H2 : Les jeux de connivence (Codenames Duo, Patchwork, 7 Wonders Duel — pour jouer ensemble contre le jeu)
- H2 : Les jeux de questions (We're Not Really Strangers, TableTopics Couples, Joker Smiley — pour se redécouvrir)
- H2 : Les jeux de stratégie à deux (Hive, Lost Cities, Jaipur — pour les cerveaux en compétition)
- H2 : Les jeux rapides et fun (Dobble, Blink, Tenzi — pour les soirées où on n'a pas d'énergie pour le mode campagne)
- H2 : Créer votre propre soirée jeux (roue pour décider quel jeu sortir, snacks, ambiance)
- CTA box

---

### Article 11 : `blog/idees-cadeaux-partenaire.html`

**Catégorie :** Conseils | **Temps :** 6 min | **Mots cibles :** ~1200

**Titre H1 :** Idées de cadeaux originaux pour son ou sa partenaire (au-delà des fleurs)

**Description meta :** Trouver le cadeau parfait pour l'être aimé, c'est tout un art. Découvrez des idées originales pour toutes les occasions et tous les budgets, bien au-delà des classiques.

**Accroche :** Les fleurs, c'est beau. Le chocolat, c'est délicieux. Mais quand on a les mêmes gestes depuis des années, même le plus beau bouquet peut sembler automatique. Cette liste, c'est pour ceux qui veulent montrer qu'ils ont vraiment pensé à l'autre.

**Plan :**
- H2 : Les cadeaux d'expérience (cours de cuisine, spa en duo, atelier poterie, concert surprise, nuit dans un lieu insolite)
- H2 : Les cadeaux qui créent des souvenirs (livre photo d'une année partagée, map des voyages communs, puzzle avec une photo personnelle)
- H2 : Les cadeaux du quotidien qui changent tout (abonnement à quelque chose qu'il/elle aime, kit pour son hobby, un objet qui simplifie sa routine)
- H2 : Les cadeaux spontanés et sans occasion (le petit "juste parce que je pensais à toi" — le plus puissant de tous)
- H2 : La lettre manuscrite (pourquoi c'est toujours le meilleur cadeau, comment la rédiger)
- H2 : Utiliser la roue pour choisir l'activité du cadeau
- CTA box

---

### Article 12 : `blog/activites-creatives-couple-maison.html`

**Catégorie :** Activités | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Activités créatives à faire en couple à la maison : 12 idées pour s'amuser autrement

**Description meta :** Peinture, cuisine, bricolage, musique : découvrez 12 activités créatives à faire en couple à la maison pour passer une soirée originale et mémorable.

**Accroche :** Il n'y a pas besoin d'être artiste pour se lancer dans une activité créative en couple. Il suffit d'un peu de matériel, d'une bonne ambiance, et d'accepter d'avance que le résultat final sera peut-être… discutable. C'est d'ailleurs souvent là que naissent les meilleurs souvenirs.

**Plan :**
- H2 : Les activités artistiques (peinture intuitive en binôme sur une même toile, dessin en aveugle, carnet de voyage illustré)
- H2 : Les activités culinaires créatives (inventer une recette de A à Z avec des ingrédients contraints, faire ses propres pâtes fraîches, soirée macarons)
- H2 : Les activités manuelles (origami, fabrication de bougies ou de savons, jardinage en pot sur le balcon)
- H2 : Les activités musicales (créer une playlist commune pour chaque humeur, apprendre un accord de guitare ensemble, faire un blind-test maison)
- H2 : Le principe du "date créatif" régulier (en faire un rituel mensuel)
- CTA box

---

## Task 6 : Articles 13–15

### Article 13 : `blog/pique-nique-romantique-guide.html`

**Catégorie :** Sorties | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Pique-nique romantique : le guide pour un moment parfait à deux

**Description meta :** Un pique-nique romantique réussi, ça se prépare. De l'endroit idéal au menu parfait, voici tous nos conseils pour créer un moment inoubliable en plein air.

**Accroche :** Il y a quelque chose d'intemporel dans l'idée du pique-nique. Pas de table à réserver, pas de serveur qui interrompt la conversation toutes les cinq minutes, juste vous deux, une couverture et un panier. Mais pour que ce moment soit vraiment romantique et non pas "on mange par terre avec des fourmis", quelques préparatifs s'imposent.

**Plan :**
- H2 : Choisir le bon endroit (parc peu fréquenté, bord de rivière, colline avec vue, jardin public au lever du soleil)
- H2 : Le menu qui impressionne sans stresser (ce qu'on peut préparer à l'avance, les aliments à éviter par grande chaleur, idées de plats "assemblage" élégants)
- H2 : L'équipement qui fait la différence (couverture confortable, coussin de sol, plateau de service, bougie de table lestée pour le vent)
- H2 : Les petits détails qui transforment un pique-nique en souvenir (une lettre cachée dans le panier, la bonne playlist, une activité de fin — parties d'échecs, lecture partagée)
- H2 : En cas de mauvais temps (le pique-nique improvisé dans le salon)
- CTA box

---

### Article 14 : `blog/complicite-couple-conseils.html`

**Catégorie :** Conseils | **Temps :** 7 min | **Mots cibles :** ~1400

**Titre H1 :** Entretenir la complicité dans son couple : les habitudes qui font toute la différence

**Description meta :** La complicité ne s'entretient pas toute seule. Découvrez les habitudes simples et les rituels qui permettent de rester proches, même après des années de vie commune.

**Accroche :** La complicité, c'est ce regard complice échangé dans une pièce remplie de monde. C'est rire d'une blague que personne d'autre ne comprendrait. C'est savoir ce que l'autre pense avant qu'il ne parle. Elle ne disparaît pas du jour au lendemain — mais sans attention, elle s'érode. Doucement. Insidieusement. Et un jour on se rend compte qu'on partage un logement plus qu'une vie.

**Plan :**
- H2 : Comprendre ce qu'est vraiment la complicité (vs amour, vs amitié — l'espace unique qu'elle occupe dans une relation)
- H2 : Les rituels qui la nourrissent (le café du matin partagé, le message du midi, le recap de la journée en marchant)
- H2 : Les "jeux" de couple (poser une vraie question par semaine, s'envoyer un souvenir commun, le défi mensuel)
- H2 : Ce qui érode la complicité et comment l'éviter (les écrans à table, les soirées en parallèle, la routine qui robotise)
- H2 : Retrouver la complicité quand elle s'est perdue (ce n'est pas dramatique, c'est normal — et ça se répare)
- H2 : La roue comme outil de complicité (tourner la roue ensemble = un micro-rituel ludique)
- CTA box

---

### Article 15 : `blog/diner-romantique-idees.html`

**Catégorie :** Soirées | **Temps :** 5 min | **Mots cibles :** ~1100

**Titre H1 :** Dîner romantique : idées pour créer une soirée mémorable

**Description meta :** Restaurant étoilé ou cuisine maison ? Découvrez nos idées pour organiser un dîner romantique inoubliable, avec ou sans réservation.

**Accroche :** Un dîner romantique, ce n'est pas une question de budget. C'est une question d'intention. Un plat simple cuisinée avec soin, des bougies, et l'envie de prendre le temps — voilà tout ce qu'il faut. Mais quelques idées bien choisies ne font jamais de mal.

**Plan :**
- H2 : Dîner à la maison comme au restaurant (dresser la table comme un pro, l'importance de la lumière, mettre de la musique d'ambiance)
- H2 : Menu maison qui impressionne (entrée froide simple, plat mijote qui cuit tout seul, dessert qui ne rate jamais — proposer des exemples concrets)
- H2 : Choisir le bon restaurant (les critères qui font une bonne table romantique : intimité, lumière, bruit ambiant, service discret)
- H2 : Les restaurants thématiques originaux (restaurant dans le noir, dîner dans les airs, resto avec vue, pop-up dîner)
- H2 : Le dîner en voyage ou en escapade (comment trouver la perle rare loin de chez soi)
- H2 : Et si vous ne savez pas où aller ? (roue "Que manger ?" + lien)
- CTA box

---

## Task 7 : Sitemap & commit final

**Files:**
- Modify: `sitemap.xml`

**Ajouter ces 16 URLs** (blog index + 15 articles) dans `sitemap.xml` avec priority 0.7 et lastmod 2026-02-25 :

```xml
<url><loc>https://coupledecide.com/blog/</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://coupledecide.com/blog/idees-soirees-romantiques-maison.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/idees-sorties-couple-weekend.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/que-manger-ce-soir-couple.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/repartir-taches-menageres-couple.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/date-night-idees-originales.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/films-romantiques-couple.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/activites-sportives-couple.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/week-end-amoureux-idees.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/communication-couple-quotidien.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/jeux-societe-couple.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/idees-cadeaux-partenaire.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/activites-creatives-couple-maison.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/pique-nique-romantique-guide.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/complicite-couple-conseils.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://coupledecide.com/blog/diner-romantique-idees.html</loc><lastmod>2026-02-25</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
```

**Commit final :**
```bash
git add sitemap.xml
git commit -m "feat: update sitemap with blog index and 15 articles"
git push origin master
```
