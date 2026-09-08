const siteIntro = document.getElementById('siteIntro');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (siteIntro && !siteIntro.classList.contains('is-skipped')) {
  if (prefersReducedMotion) {
    siteIntro.classList.add('is-skipped');
    sessionStorage.setItem('arraraIntroShown', '1');
  } else {
    document.body.classList.add('intro-active');
    const finishIntro = () => {
      document.body.classList.remove('intro-active');
      siteIntro.classList.add('is-skipped');
      sessionStorage.setItem('arraraIntroShown', '1');
    };
    setTimeout(() => {
      siteIntro.classList.add('is-done');
      siteIntro.addEventListener('transitionend', finishIntro, { once: true });
      setTimeout(finishIntro, 700);
    }, 7500);
  }
}

const pageTransition = document.getElementById('pageTransition');
if (pageTransition) {
  const transitionReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealPage = () => pageTransition.classList.add('is-hidden');
  if (transitionReducedMotion) {
    pageTransition.classList.add('is-instant');
    revealPage();
  } else {
    requestAnimationFrame(revealPage);
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (
        !href ||
        href.charAt(0) === '#' ||
        /^[a-z]+:/i.test(href) ||
        link.target === '_blank'
      ) return;
      link.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        pageTransition.classList.remove('is-hidden');
        setTimeout(() => { window.location.href = href; }, 320);
      });
    });
  }
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) revealPage();
  });
}

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
