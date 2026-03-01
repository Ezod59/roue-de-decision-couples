// Génère assets/og-image.png depuis un SVG inline
// Usage : node assets/generate-og.js
const sharp = require('sharp');
const path = require('path');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Fond principal -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1a1035"/>
    </linearGradient>
    <!-- Halo gauche -->
    <radialGradient id="glow1" cx="20%" cy="50%" r="45%">
      <stop offset="0%" stop-color="#E11D48" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#E11D48" stop-opacity="0"/>
    </radialGradient>
    <!-- Halo droit -->
    <radialGradient id="glow2" cx="80%" cy="50%" r="40%">
      <stop offset="0%" stop-color="#A855F7" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#A855F7" stop-opacity="0"/>
    </radialGradient>
    <!-- Roue — secteurs -->
    <linearGradient id="s1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
    <linearGradient id="s2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
    <linearGradient id="s3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>
    <linearGradient id="s4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
    <linearGradient id="s5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="s6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4338CA"/>
      <stop offset="100%" stop-color="#3730a3"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#E11D48" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Fond -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Ligne de séparation subtile -->
  <line x1="0" y1="628" x2="1200" y2="628" stroke="#E11D48" stroke-width="3" stroke-opacity="0.6"/>

  <!-- === ROUE (côté droit) === -->
  <!-- Roue à 6 secteurs, centrée en (870, 315), rayon 200 -->
  <!-- Secteur 1 : 0° – 60° -->
  <path d="M870,315 L870,115 A200,200 0 0,1 1043.2,215 Z" fill="url(#s1)" opacity="0.92" filter="url(#shadow)"/>
  <!-- Secteur 2 : 60° – 120° -->
  <path d="M870,315 L1043.2,215 A200,200 0 0,1 1043.2,415 Z" fill="url(#s2)" opacity="0.92"/>
  <!-- Secteur 3 : 120° – 180° -->
  <path d="M870,315 L1043.2,415 A200,200 0 0,1 870,515 Z" fill="url(#s3)" opacity="0.92"/>
  <!-- Secteur 4 : 180° – 240° -->
  <path d="M870,315 L870,515 A200,200 0 0,1 696.8,415 Z" fill="url(#s4)" opacity="0.92"/>
  <!-- Secteur 5 : 240° – 300° -->
  <path d="M870,315 L696.8,415 A200,200 0 0,1 696.8,215 Z" fill="url(#s5)" opacity="0.92"/>
  <!-- Secteur 6 : 300° – 360° -->
  <path d="M870,315 L696.8,215 A200,200 0 0,1 870,115 Z" fill="url(#s6)" opacity="0.92"/>

  <!-- Séparateurs entre secteurs -->
  <line x1="870" y1="315" x2="870" y2="115" stroke="#0F172A" stroke-width="2.5" opacity="0.7"/>
  <line x1="870" y1="315" x2="1043.2" y2="215" stroke="#0F172A" stroke-width="2.5" opacity="0.7"/>
  <line x1="870" y1="315" x2="1043.2" y2="415" stroke="#0F172A" stroke-width="2.5" opacity="0.7"/>
  <line x1="870" y1="315" x2="870" y2="515" stroke="#0F172A" stroke-width="2.5" opacity="0.7"/>
  <line x1="870" y1="315" x2="696.8" y2="415" stroke="#0F172A" stroke-width="2.5" opacity="0.7"/>
  <line x1="870" y1="315" x2="696.8" y2="215" stroke="#0F172A" stroke-width="2.5" opacity="0.7"/>

  <!-- Cercle central -->
  <circle cx="870" cy="315" r="48" fill="#0F172A" stroke="#1E293B" stroke-width="3"/>
  <!-- Coeur centré -->
  <text x="870" y="328" font-size="32" text-anchor="middle" fill="#E11D48">♥</text>

  <!-- Cercle bordure extérieur -->
  <circle cx="870" cy="315" r="200" fill="none" stroke="#334155" stroke-width="2" opacity="0.5"/>

  <!-- Flèche indicatrice (haut) -->
  <polygon points="870,96 855,118 885,118" fill="#F8FAFC" opacity="0.9"/>

  <!-- === TEXTE (côté gauche) === -->
  <!-- Badge catégorie -->
  <rect x="72" y="100" width="162" height="34" rx="17" fill="#E11D48" fill-opacity="0.15" stroke="#E11D48" stroke-width="1.5" stroke-opacity="0.4"/>
  <text x="153" y="122" font-size="13" font-weight="700" text-anchor="middle" fill="#E11D48" font-family="system-ui, sans-serif" letter-spacing="1.5">OUTIL GRATUIT</text>

  <!-- Titre principal -->
  <text x="72" y="210" font-size="72" font-weight="800" fill="#F8FAFC" font-family="system-ui, sans-serif" letter-spacing="-1">Roue de</text>
  <text x="72" y="290" font-size="72" font-weight="800" font-family="system-ui, sans-serif" letter-spacing="-1">
    <tspan fill="#E11D48">décision</tspan>
  </text>
  <text x="72" y="370" font-size="72" font-weight="800" fill="#F8FAFC" font-family="system-ui, sans-serif" letter-spacing="-1">pour couples</text>

  <!-- Tagline -->
  <text x="72" y="430" font-size="22" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="400">Sorties · Repas · Activités · Tâches ménagères</text>

  <!-- Chips catégories -->
  <!-- Chip 1 -->
  <rect x="72" y="468" width="128" height="36" rx="18" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="136" y="491" font-size="14" font-weight="600" text-anchor="middle" fill="#E11D48" font-family="system-ui, sans-serif">🍽 Repas</text>
  <!-- Chip 2 -->
  <rect x="212" y="468" width="148" height="36" rx="18" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="286" y="491" font-size="14" font-weight="600" text-anchor="middle" fill="#A855F7" font-family="system-ui, sans-serif">🎬 Soirée</text>
  <!-- Chip 3 -->
  <rect x="372" y="468" width="168" height="36" rx="18" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="456" y="491" font-size="14" font-weight="600" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, sans-serif">🏃 Activités</text>

  <!-- Domaine -->
  <text x="72" y="576" font-size="20" fill="#475569" font-family="system-ui, sans-serif" font-weight="500">coupledecide.com</text>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(__dirname, 'og-image.png'))
  .then(() => console.log('✅ og-image.png generated (1200×630)'))
  .catch(err => console.error('❌ Error:', err));
