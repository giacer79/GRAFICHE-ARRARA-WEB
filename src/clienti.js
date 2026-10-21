window.__arraraReady = true;
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const setMenu = open => {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  nav.classList.toggle('open', open);
};
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => { if (!nav.contains(e.target) && !menuButton.contains(e.target)) setMenu(false); });

// Pausa del bagliore dell'header e dell'anello fuori schermo.
if ('IntersectionObserver' in window) {
  const header = document.querySelector('.site-header');
  new IntersectionObserver(en => header.classList.toggle('is-paused', !en[0].isIntersecting)).observe(header);
  const hero = document.querySelector('.cl-hero');
  new IntersectionObserver(en => hero.classList.toggle('is-offscreen', !en[0].isIntersecting), { rootMargin: '120px 0px' }).observe(hero);
}

// Entrata allo scroll.
if (document.documentElement.classList.contains('js')) {
  const items = document.querySelectorAll('.cl-intro > *, .cl-card, .cl-sectors > *, .cl-cta > *');
  items.forEach((el, i) => el.style.setProperty('--d', ((i % 3) * .1).toFixed(2) + 's'));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => io.observe(el));
}
