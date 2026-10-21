/* Barra menu laterale: copia i link del menu principale della pagina e li mostra in verticale
   non appena l'header esce dallo schermo. */
(function () {
  var nav = document.getElementById('site-nav');
  var header = document.querySelector('.site-header');
  if (!nav || !header) return;
  var bar = document.createElement('nav');
  bar.className = 'ac-side';
  bar.setAttribute('aria-label', 'Menu rapido');
  nav.querySelectorAll('a').forEach(function (a) {
    var c = a.cloneNode(true);
    c.removeAttribute('id');
    bar.appendChild(c);
  });
  document.body.appendChild(bar);
  function set(on) { bar.classList.toggle('is-on', on); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { set(!e[0].isIntersecting); }).observe(header);
  } else {
    var f = function () { set(window.scrollY > header.offsetHeight); };
    window.addEventListener('scroll', f, { passive: true }); f();
  }
})();
