/* ============================================================
   app.js — CoupleDecide core logic
   Wheel drawing, animation, localStorage, options management
   ============================================================ */

/* --- Segment colors (cycled for any number of options) --- */
const COLORS = ['#E11D48','#A855F7','#2DD4BF','#F97316','#4338CA','#10B981','#EC4899','#EAB308'];

/* --- Default categories & options (FR/EN) --- */
const DEFAULT_CATEGORIES = {
  soiree: {
    fr: { label: 'Soirée en amoureux', options: ['Dîner au restaurant','Film à la maison','Jeu de société','Balade nocturne','Massage à deux','Pique-nique en intérieur','Concert ou spectacle','Soirée cuisine ensemble'] },
    en: { label: 'Date Night', options: ['Dinner at a restaurant','Movie at home','Board game night','Night walk','Couples massage','Indoor picnic','Concert or show','Cook together'] }
  },
  manger: {
    fr: { label: 'Que manger ?', options: ['Pizza','Sushi','Burger','Pâtes','Salade fraîche','Cuisine thaï','Tacos','Raclette'] },
    en: { label: 'What to Eat?', options: ['Pizza','Sushi','Burger','Pasta','Fresh salad','Thai food','Tacos','Cheese fondue'] }
  },
  weekend: {
    fr: { label: 'Activités week-end', options: ['Randonnée','Musée ou expo','Cinéma','Jeux de société','Sortie vélo','Marché local','Spa ou bain chaud','Atelier créatif'] },
    en: { label: 'Weekend Activities', options: ['Hiking','Museum or exhibition','Cinema','Board games','Cycling','Local market','Spa or hot bath','Creative workshop'] }
  },
  taches: {
    fr: { label: 'Tâches ménagères', options: ["Passer l'aspirateur",'Faire la vaisselle','Courses alimentaires','Nettoyer la salle de bain','Laver le linge','Ranger le salon','Sortir les poubelles','Cuisiner le repas'] },
    en: { label: 'Household Chores', options: ['Vacuuming','Doing the dishes','Grocery shopping','Clean the bathroom','Do the laundry','Tidy the living room','Take out trash','Cook dinner'] }
  },
  intimite: {
    fr: { label: 'Intimité & fun', options: ['Massage doux','Regarder un film romantique','Préparer un bain parfumé',"Écrire une lettre d'amour",'Danser à la maison','Jeu de questions vérité','Soirée câlins','Photo session amusante'] },
    en: { label: 'Intimacy & Fun', options: ['Soft massage','Watch a romantic movie','Draw a scented bath','Write a love letter','Dance at home','Truth questions game','Cuddle evening','Fun photo session'] }
  }
};

/* --- LocalStorage helpers --- */
const LS = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};

function getOptions(categorySlug, lang) {
  const stored = LS.get(`cdw_options_${categorySlug}`);
  return stored || DEFAULT_CATEGORIES[categorySlug][lang].options.slice();
}

function saveOptions(categorySlug, options) {
  LS.set(`cdw_options_${categorySlug}`, options);
}

/* --- Wheel Drawing --- */
function drawWheel(canvas, options, rotationAngle = 0) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(cx, cy) - 8;
  const n = options.length;

  ctx.clearRect(0, 0, w, h);

  if (n === 0) {
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
    return;
  }

  const sliceAngle = (Math.PI * 2) / n;

  options.forEach((opt, i) => {
    const startAngle = rotationAngle + i * sliceAngle - Math.PI / 2;
    const endAngle = startAngle + sliceAngle;

    /* Segment fill */
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();

    /* Segment border */
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Label */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.max(10, Math.min(14, radius / (n + 1)))}px 'Plus Jakarta Sans', sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;

    const label = opt.length > 18 ? opt.substring(0, 16) + '…' : opt;
    ctx.fillText(label, radius - 12, 5);
    ctx.restore();
  });

  /* Center circle */
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

/* --- Spin Animation --- */
let isSpinning = false;
let currentRotation = 0;

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function spinWheel(canvas, options, onResult) {
  if (isSpinning || options.length === 0) return;
  isSpinning = true;

  const totalRotation = (Math.PI * 2) * (5 + Math.random() * 3); /* 5-8 full turns */
  const duration = 3500 + Math.random() * 1500; /* 3.5-5s */
  const startRotation = currentRotation;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    currentRotation = startRotation + totalRotation * eased;
    drawWheel(canvas, options, currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      const result = getResult(options, currentRotation);
      onResult(result);
    }
  }

  requestAnimationFrame(animate);
}

function getResult(options, rotation) {
  const n = options.length;
  const sliceAngle = (Math.PI * 2) / n;
  /* Normalize rotation so pointer (top = -π/2) hits the right segment */
  const normalized = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  /* Pointer is at top (-π/2), so we need the segment that covers the top */
  const pointerAngle = (Math.PI * 2 - normalized + Math.PI * 2) % (Math.PI * 2);
  const index = Math.floor(pointerAngle / sliceAngle) % n;
  return options[index];
}

/* ============================================================
   App Init — runs on index.html only
   ============================================================ */
function initWheelApp() {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return; /* Not on wheel page */

  /* --- State --- */
  let lang = LS.get('cdw_lang') || 'fr';
  let theme = LS.get('cdw_theme') || 'light';
  let currentCategory = LS.get('cdw_category') || 'soiree';
  let options = [];

  /* --- Theme --- */
  function applyTheme(t) {
    document.documentElement.classList.toggle('dark', t === 'dark');
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
    LS.set('cdw_theme', t);
  }

  /* --- Language --- */
  function applyLang(l) {
    lang = l;
    applyTranslations(l); /* from i18n.js */
    /* Update lang toggle text */
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = l === 'fr' ? 'EN' : 'FR';
    /* Re-render category select with translated labels */
    renderCategorySelect();
    loadCategory(currentCategory);
  }

  /* --- Canvas size --- */
  function setCanvasSize() {
    const size = window.innerWidth <= 800 ? 300 : 420;
    canvas.width = size;
    canvas.height = size;
  }

  /* --- Category select population --- */
  function renderCategorySelect() {
    const sel = document.getElementById('categorySelect');
    if (!sel) return;
    sel.innerHTML = '';
    Object.keys(DEFAULT_CATEGORIES).forEach(slug => {
      const opt = document.createElement('option');
      opt.value = slug;
      opt.textContent = DEFAULT_CATEGORIES[slug][lang].label;
      if (slug === currentCategory) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  /* --- Load category options --- */
  function loadCategory(slug) {
    currentCategory = slug;
    LS.set('cdw_category', slug);
    options = getOptions(slug, lang);
    renderOptions();
    drawWheel(canvas, options, currentRotation);
  }

  /* --- Options list rendering --- */
  function renderOptions() {
    const list = document.getElementById('optionsList');
    const count = document.getElementById('optionsCount');
    if (!list) return;
    if (count) count.textContent = `(${options.length})`;
    list.innerHTML = '';
    options.forEach((opt, i) => {
      const item = document.createElement('div');
      item.className = 'option-item';
      item.setAttribute('role', 'listitem');
      item.innerHTML = `
        <span class="option-color-dot" style="background:${COLORS[i % COLORS.length]}"></span>
        <span class="option-text">${escapeHTML(opt)}</span>
        <button class="option-delete" aria-label="Supprimer ${escapeHTML(opt)}" data-index="${i}">✕</button>
      `;
      list.appendChild(item);
    });
    /* Delete listeners */
    list.querySelectorAll('.option-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        options.splice(idx, 1);
        saveOptions(currentCategory, options);
        renderOptions();
        drawWheel(canvas, options, currentRotation);
      });
    });
  }

  /* --- Add option --- */
  function addOption() {
    const input = document.getElementById('addOptionInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val || options.includes(val)) return;
    options.push(val);
    saveOptions(currentCategory, options);
    input.value = '';
    renderOptions();
    drawWheel(canvas, options, currentRotation);
  }

  /* --- Reset options --- */
  function resetOptions() {
    localStorage.removeItem(`cdw_options_${currentCategory}`);
    options = getOptions(currentCategory, lang);
    renderOptions();
    drawWheel(canvas, options, currentRotation);
  }

  /* --- Show result modal --- */
  function showResult(result) {
    const overlay = document.getElementById('resultModal');
    const resultEl = document.getElementById('modalResult');
    if (!overlay || !resultEl) return;
    resultEl.textContent = result;
    overlay.classList.add('active');
  }

  /* --- Spin button --- */
  function doSpin() {
    if (isSpinning) return;
    const btn = document.getElementById('spinBtn');
    if (btn) btn.classList.add('spinning');
    spinWheel(canvas, options, result => {
      if (btn) btn.classList.remove('spinning');
      showResult(result);
    });
  }

  /* --- Escape HTML --- */
  function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* --- Event listeners --- */
  document.getElementById('spinBtn')?.addEventListener('click', doSpin);
  document.getElementById('spinAgainBtn')?.addEventListener('click', () => {
    document.getElementById('resultModal')?.classList.remove('active');
    setTimeout(doSpin, 300);
  });
  document.getElementById('closeModalBtn')?.addEventListener('click', () => {
    document.getElementById('resultModal')?.classList.remove('active');
  });
  document.getElementById('resultModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
  });
  document.getElementById('categorySelect')?.addEventListener('change', e => loadCategory(e.target.value));
  document.getElementById('addOptionBtn')?.addEventListener('click', addOption);
  document.getElementById('addOptionInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') addOption(); });
  document.getElementById('resetBtn')?.addEventListener('click', resetOptions);
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
  });
  document.getElementById('langToggle')?.addEventListener('click', () => {
    const next = lang === 'fr' ? 'en' : 'fr';
    applyLang(next);
  });
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !e.target.matches('input,textarea,select,button')) {
      e.preventDefault();
      doSpin();
    }
  });
  window.addEventListener('resize', () => {
    setCanvasSize();
    drawWheel(canvas, options, currentRotation);
  });

  /* --- Boot --- */
  applyTheme(theme);
  applyLang(lang);
  setCanvasSize();
  renderCategorySelect();
  loadCategory(currentCategory);
}

/* --- Shared header init (all pages) --- */
function initSharedHeader() {
  const lang = LS.get('cdw_lang') || 'fr';
  const theme = LS.get('cdw_theme') || 'light';

  document.documentElement.classList.toggle('dark', theme === 'dark');

  document.getElementById('themeToggle')?.addEventListener('click', function() {
    const isDark = document.documentElement.classList.toggle('dark');
    LS.set('cdw_theme', isDark ? 'dark' : 'light');
    this.textContent = isDark ? '☀️' : '🌙';
  });
  document.getElementById('langToggle')?.addEventListener('click', function() {
    const current = LS.get('cdw_lang') || 'fr';
    const next = current === 'fr' ? 'en' : 'fr';
    applyTranslations(next);
    this.textContent = next === 'fr' ? 'EN' : 'FR';
  });

  /* Set theme btn icon */
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';

  /* Set lang btn text */
  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';

  applyTranslations(lang);
}

/* --- Hamburger menu (all pages) --- */
function initHamburger() {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  /* Stop propagation on nav clicks (except links) to prevent outside-click handler */
  nav.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  /* Close menu when a nav link is clicked */
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  /* Close menu on outside click */
  document.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });
}

/* --- Run on DOM ready --- */
function _initAll() {
  initSharedHeader();
  initHamburger();
  initWheelApp();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initAll);
} else {
  _initAll();
}
