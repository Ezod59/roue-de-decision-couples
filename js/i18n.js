/* ============================================================
   i18n.js — FR/EN translations for CoupleDecide
   Usage: Apply with data-i18n="key" attributes on elements.
          Call applyTranslations(lang) to switch language.
   ============================================================ */

const TRANSLATIONS = {
  fr: {
    /* Header */
    'nav.wheel':    'La Roue',
    'nav.about':    'À propos',
    'nav.faq':      'FAQ',
    'lang.toggle':  'EN',
    'dark.toggle':  '🌙',

    /* Wheel page */
    'category.label':     'Catégorie',
    'spin.btn':           'Tourner la roue',
    'spin.hint':          'Appuie sur Espace pour tourner',
    'options.title':      'Options',
    'options.count':      '{n} options',
    'add.placeholder':    'Ajouter une option...',
    'add.btn':            'Ajouter',
    'reset.btn':          '↺ Réinitialiser les options',
    'modal.label':        'La roue a décidé…',
    'modal.spin-again':   'Retourner',
    'modal.close':        'Fermer',

    /* Category names */
    'cat.soiree':    'Soirée en amoureux',
    'cat.manger':    'Que manger ?',
    'cat.weekend':   'Activités week-end',
    'cat.taches':    'Tâches ménagères',
    'cat.intimite':  'Intimité & fun',

    /* About page */
    'about.hero.title': 'La roue qui décide pour vous',
    'about.hero.sub':   'Fini les "je sais pas toi ?" — laissez la roue trancher !',
    'about.cta':        '🎡 Essayer la roue',
    'about.f1.title':   'Soirées parfaites',
    'about.f1.desc':    "Films, restaurants, balades — trouvez l'idée parfaite pour votre soirée.",
    'about.f2.title':   'Repas sans prise de tête',
    'about.f2.desc':    'Pizza ? Sushi ? Pasta ? La roue tranche le débat du dîner en une seconde.',
    'about.f3.title':   'Week-ends animés',
    'about.f3.desc':    'Randonnée, musée, jeux de société — découvrez des activités sympa ensemble.',
    'about.f4.title':   'Tâches partagées',
    'about.f4.desc':    'Attribuez les corvées de façon ludique — plus de disputes sur qui fait quoi.',

    /* FAQ page */
    'faq.hero.title':   'Questions fréquentes',
    'faq.hero.sub':     'Tout ce que vous voulez savoir sur la Roue de décision pour couples.',

    /* Footer */
    'footer.about':     'À propos',
    'footer.faq':       'FAQ',
    'footer.privacy':   'Confidentialité',
    'footer.copy':      '© 2026 CoupleDecide — Fait avec ❤️ pour les couples',
  },

  en: {
    /* Header */
    'nav.wheel':    'The Wheel',
    'nav.about':    'About',
    'nav.faq':      'FAQ',
    'lang.toggle':  'FR',
    'dark.toggle':  '🌙',

    /* Wheel page */
    'category.label':     'Category',
    'spin.btn':           'Spin the wheel',
    'spin.hint':          'Press Space to spin',
    'options.title':      'Options',
    'options.count':      '{n} options',
    'add.placeholder':    'Add an option...',
    'add.btn':            'Add',
    'reset.btn':          '↺ Reset to defaults',
    'modal.label':        'The wheel has decided…',
    'modal.spin-again':   'Spin again',
    'modal.close':        'Close',

    /* Category names */
    'cat.soiree':    'Date Night',
    'cat.manger':    'What to Eat?',
    'cat.weekend':   'Weekend Activities',
    'cat.taches':    'Household Chores',
    'cat.intimite':  'Intimacy & Fun',

    /* About page */
    'about.hero.title': 'The wheel that decides for you',
    'about.hero.sub':   "No more \"I don't know, what do you want?\" — let the wheel decide!",
    'about.cta':        '🎡 Try the wheel',
    'about.f1.title':   'Perfect evenings',
    'about.f1.desc':    'Movies, restaurants, walks — find the perfect idea for your date night.',
    'about.f2.title':   'Meals without drama',
    'about.f2.desc':    'Pizza? Sushi? Pasta? The wheel settles the dinner debate in a second.',
    'about.f3.title':   'Fun weekends',
    'about.f3.desc':    'Hiking, museums, board games — discover fun activities together.',
    'about.f4.title':   'Shared chores',
    'about.f4.desc':    "Assign tasks in a fun way — no more arguing about who does what.",

    /* FAQ page */
    'faq.hero.title':   'Frequently Asked Questions',
    'faq.hero.sub':     'Everything you want to know about the Couple Decision Wheel.',

    /* Footer */
    'footer.about':     'About',
    'footer.faq':       'FAQ',
    'footer.privacy':   'Privacy',
    'footer.copy':      '© 2026 CoupleDecide — Made with ❤️ for couples',
  }
};

/* --- Meta tags per language --- */
const META = {
  fr: {
    title: 'Roue de décision pour couples – Idées de sorties, repas et activités',
    description: 'Utilisez notre roue de décision pour couples pour choisir vos sorties, repas, activités du week-end et tâches ménagères. Simple, ludique et 100% gratuite.',
  },
  en: {
    title: 'Couple Decision Wheel – Date Night, Food & Weekend Ideas',
    description: 'Use our couple decision wheel to choose date ideas, meals, weekend activities and chores. Simple, fun and 100% free.',
  }
};

/**
 * Apply translations to all [data-i18n] elements.
 * @param {string} lang - 'fr' or 'en'
 */
function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  /* Update placeholders */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  /* Update meta */
  if (META[lang]) {
    document.title = META[lang].title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = META[lang].description;
  }
  /* Store preference */
  localStorage.setItem('cdw_lang', lang);
}
