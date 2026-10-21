window.__arraraReady = true;
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Apri il menu' : 'Chiudi il menu');
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Apri il menu');
}));

const ribbon = document.querySelector('.design-ribbon');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Fascia arancione: il movimento continuo è in CSS (keyframes); qui solo pausa fuori schermo e parallasse.
const hero = document.querySelector('.design-hero');
if (ribbon && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => hero.classList.toggle('is-offscreen', !entries[0].isIntersecting), { rootMargin: '120px 0px' }).observe(hero);
}
// Pulviscolo luminoso: ogni tanto compare sulla fascia e sulla scritta BRAND (nessun effetto legato al mouse).
if (ribbon && hero && !reduceMotion.matches) {
  const waves = ribbon.querySelector('.design-waves');
  const wordImgs = [...ribbon.querySelectorAll('.design-brandtext')];
  const brand = wordImgs[0];
  const layer = document.createElement('div');
  layer.className = 'design-sparkles';
  layer.setAttribute('aria-hidden', 'true');
  ribbon.appendChild(layer);
  const SW = 220, SH = 126;
  const sample = img => {
    try {
      const c = document.createElement('canvas');
      const isWord = img !== waves;
      const w = isWord ? 240 : SW, h = isWord ? Math.max(8, Math.round(240 * img.naturalHeight / img.naturalWidth)) : SH;
      c.width = w; c.height = h;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(img, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data, pts = [];
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (d[(j * w + i) * 4 + 3] > 140) pts.push([(i + Math.random()) / w, (j + Math.random()) / h]);
      return pts.length ? pts : null;
    } catch (e) { return null; }
  };
  let ringPts = null;
  const textPts = new Map();
  const prepOne = i => { if (i === waves) ringPts = sample(waves); else textPts.set(i, sample(i)); };
  [waves, ...wordImgs].forEach(i => i.complete ? prepOne(i) : i.addEventListener('load', () => prepOne(i), { once: true }));
  const angle = () => {
    const m = /(-?[\d.]+)deg/.exec(getComputedStyle(waves).rotate || '');
    return m ? parseFloat(m[1]) * Math.PI / 180 : 0;
  };
  const pick = () => {
    let active = null, best = .5;
    wordImgs.forEach(i => { const o = parseFloat(getComputedStyle(i.parentElement).opacity); if (o > best) { best = o; active = i; } });
    if (active && Math.random() < .38) {
      const R = ribbon.getBoundingClientRect(), r = active.getBoundingClientRect();
      const pts = textPts.get(active);
      const p = pts ? pts[Math.floor(Math.random() * pts.length)] : [Math.random(), Math.random()];
      return [((r.left - R.left) + p[0] * r.width) / R.width * 100, ((r.top - R.top) + p[1] * r.height) / R.height * 100];
    }
    const W = ribbon.clientWidth, H = ribbon.clientHeight;
    let p;
    if (ringPts) p = ringPts[Math.floor(Math.random() * ringPts.length)];
    else { const t = Math.random() * 6.283, r = .32 + Math.random() * .18; p = [.5 + Math.cos(t) * r * H / W, .5 + Math.sin(t) * r]; }
    const a = angle(), dx = (p[0] - .5) * W, dy = (p[1] - .5) * H;
    const x = dx * Math.cos(a) - dy * Math.sin(a), y = dx * Math.sin(a) + dy * Math.cos(a);
    return [50 + x / W * 100, 50 + y / H * 100];
  };
  const spawn = () => {
    const s = document.createElement('i');
    const [x, y] = pick();
    const star = false;
    const size = star ? 0 : 2 + Math.random() * 2.8;
    s.className = 'spark' + (star ? ' spark--star' : '');
    s.style.cssText = `left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;--dx:${(Math.random() * 30 - 15).toFixed(1)}px;--dy:${(Math.random() * -26 - 4).toFixed(1)}px;--o:${(.45 + Math.random() * .5).toFixed(2)};animation-duration:${(2.6 + Math.random() * 2.6).toFixed(2)}s`;
    layer.appendChild(s);
    s.addEventListener('animationend', () => s.remove(), { once: true });
  };
  const loop = () => {
    if (!hero.classList.contains('is-offscreen') && !document.hidden && layer.childElementCount < 30) {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let k = 0; k < n; k++) spawn();
    }
    setTimeout(loop, 350 + Math.random() * 700);
  };
  setTimeout(loop, 3600);
}

// Pausa del bagliore dell'header quando non è visibile.
if ('IntersectionObserver' in window) {
  const header = document.querySelector('.site-header');
  new IntersectionObserver(entries => header.classList.toggle('is-paused', !entries[0].isIntersecting)).observe(header);
}

// Entrata allo scroll: pannello Processo e quattro card.
if (document.documentElement.classList.contains('js')) {
  const items = [
    ...document.querySelectorAll('.design-process > *'),
    ...document.querySelectorAll('.design-card')
  ];
  document.querySelectorAll('.design-process > *').forEach((el, i) => el.style.setProperty('--d', (i * .1).toFixed(2) + 's'));
  document.querySelectorAll('.design-card').forEach((el, i) => el.style.setProperty('--d', ((i % 2) * .12).toFixed(2) + 's'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      el.classList.add('is-in');
      const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.add('r-done'), (delay + .95) * 1000);
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => observer.observe(el));
}

// Menu mobile: chiusura con Esc o toccando fuori dal pannello.
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.site-nav');
  if (!toggle || !panel) return;
  const closeMenu = (refocus) => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Apri il menu');
    if (refocus) toggle.focus();
  };
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.addEventListener('click', event => {
    if (!panel.contains(event.target) && !toggle.contains(event.target)) closeMenu(false);
  });
})();
