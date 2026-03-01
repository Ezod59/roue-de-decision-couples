// Ajoute BreadcrumbList + author à tous les articles de blog
// Usage : node assets/add-blog-schemas.js
const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

let updated = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // --- 1. Extraire headline et url depuis le JSON-LD Article existant ---
  const articleMatch = html.match(/"@type"\s*:\s*"Article"[\s\S]*?"headline"\s*:\s*"([^"]+)"[\s\S]*?"url"\s*:\s*"([^"]+)"/);
  if (!articleMatch) {
    console.log(`SKIP (no Article schema): ${file}`);
    continue;
  }
  const headline = articleMatch[1];
  const articleUrl = articleMatch[2];

  // --- 2. Vérifier si BreadcrumbList existe déjà ---
  if (html.includes('"BreadcrumbList"')) {
    console.log(`SKIP (BreadcrumbList already present): ${file}`);
    // Mais on update quand même l'author si absent
  }

  // --- 3. Ajouter author dans l'Article schema si absent ---
  if (!html.includes('"author"')) {
    html = html.replace(
      /"inLanguage"\s*:\s*"fr"\s*\n(\s*)\}/,
      `"inLanguage": "fr",\n    "author": { "@type": "Organization", "name": "CoupleDecide", "url": "https://coupledecide.com" }\n  }`
    );
  }

  // --- 4. Ajouter BreadcrumbList si absent ---
  if (!html.includes('"BreadcrumbList"')) {
    const breadcrumb = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://coupledecide.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://coupledecide.com/blog/" },
      { "@type": "ListItem", "position": 3, "name": "${headline}", "item": "${articleUrl}" }
    ]
  }
  </script>`;

    // Insérer avant le script Article JSON-LD
    html = html.replace(
      /(\s*<script type="application\/ld\+json">\s*\{\s*"@context"\s*:\s*"https:\/\/schema\.org"[\s\S]*?"@type"\s*:\s*"Article")/,
      `\n${breadcrumb}\n$1`
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`DONE: ${file}`);
  updated++;
}

console.log(`\n✅ ${updated} files updated`);
