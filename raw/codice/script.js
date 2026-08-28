const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const form = document.querySelector('[data-contact-form]');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    if (status) status.classList.add('is-visible');
  });
}


const heroImage = document.querySelector('.home-hero-image');
const heroPanel = document.querySelector('.hero-panel-image');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroImage && heroPanel && !prefersReducedMotion) {
  let ticking = false;
  const updateHeroParallax = () => {
    const rect = heroPanel.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom > 0 && rect.top < vh) {
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      const offset = progress * 58; // movimento opposto allo scroll verso il basso
      heroImage.style.setProperty('--hero-parallax', `${offset}px`);
    }
    ticking = false;
  };
  const requestHeroParallax = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  };
  updateHeroParallax();
  window.addEventListener('scroll', requestHeroParallax, { passive: true });
  window.addEventListener('resize', requestHeroParallax);
}
