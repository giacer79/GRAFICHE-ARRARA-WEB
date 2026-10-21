/* Rivela le sezioni delle pagine interne quando entrano nello schermo */
(function () {
  var root = document.documentElement;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { root.classList.remove('pg-js'); return; }
  var sel = '.am-item,.az-story,.az-values>*,.az-values .wrap>*,.az-split,.az-photo,.cl-logo,.design-content>*,.ct>*,.ct-map,.am-cta-band .wrap>*';
  var items = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (el) {
    return !el.closest('main>section:first-of-type');
  });
  items.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (s) { return s.matches(sel); });
    el.style.setProperty('--pg-i', Math.min(sibs.indexOf(el), 5));
    el.classList.add('pg-reveal');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
  setTimeout(function () { items.forEach(function (el) { el.classList.add('in'); }); }, 8000);
})();
