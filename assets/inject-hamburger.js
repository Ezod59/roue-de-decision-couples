// Injects inline hamburger script after </header> in all HTML files
// Usage: node assets/inject-hamburger.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const INLINE_SCRIPT = `<script>/* hamburger */
(function(){var btn=document.getElementById('menuToggle'),nav=document.getElementById('mobileNav');if(!btn||!nav)return;var lt=0;function set(v){nav.classList.toggle('open',v);btn.classList.toggle('open',v);btn.setAttribute('aria-expanded',String(v));}btn.addEventListener('touchstart',function(e){e.stopPropagation();},{passive:true});btn.addEventListener('touchend',function(e){e.stopPropagation();e.preventDefault();lt=Date.now();set(!nav.classList.contains('open'));},{passive:false});btn.addEventListener('click',function(e){e.stopPropagation();if(Date.now()-lt<500)return;set(!nav.classList.contains('open'));});nav.addEventListener('touchstart',function(e){e.stopPropagation();},{passive:true});nav.addEventListener('click',function(e){e.stopPropagation();});nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){set(false);});});document.addEventListener('touchstart',function(){set(false);},{passive:true});document.addEventListener('click',function(){set(false);});})();
</script>`;

function getHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getHtmlFiles(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

const files = getHtmlFiles(root);
let updated = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');

  // Skip if inline hamburger script already injected
  if (html.includes('/* hamburger */')) {
    console.log(`SKIP (already injected): ${path.relative(root, file)}`);
    continue;
  }

  // Skip if no menuToggle (no hamburger on this page)
  if (!html.includes('menuToggle')) {
    console.log(`SKIP (no hamburger): ${path.relative(root, file)}`);
    continue;
  }

  // Inject after </header>
  if (!html.includes('</header>')) {
    console.log(`SKIP (no </header>): ${path.relative(root, file)}`);
    continue;
  }

  html = html.replace('</header>', '</header>\n' + INLINE_SCRIPT);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`DONE: ${path.relative(root, file)}`);
  updated++;
}

console.log(`\n✅ ${updated} files updated`);
