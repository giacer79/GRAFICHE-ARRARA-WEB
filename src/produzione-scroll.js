/* Pagina Produzione: man mano che si scrolla, box e immagini arrivano da fuori pagina (dai lati) e si compongono.
   Alcuni elementi (immagini principali, gallerie Tabloid e Cartotecnica) invece si aprono in orizzontale da una linea centrale.
   Animazione legata allo scroll: tornando su, gli elementi ripartono verso l'esterno. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  var items = Array.prototype.slice.call(document.querySelectorAll('.am-item'));
  var targets = [];
  function add(el, extra, mode) { if (el) targets.push({ el: el, dir: 1, delay: extra || 0, mode: mode || 'fly' }); }
  items.forEach(function (it) {
    it.classList.remove('pg-reveal');            // niente doppia animazione
    add(it.querySelector(':scope > .am-copy'));
    add(it.querySelector(':scope > .am-media'), .08, 'open');
    var blocks = it.querySelectorAll(':scope > .tb-block');
    Array.prototype.forEach.call(blocks, function (b) {
      add(b.querySelector('.tb-title'));
      var open = (b.id === 'tabloid' || b.id === 'cartotecnica') ? 'open' : 'fly';
      Array.prototype.forEach.call(b.querySelectorAll('.tb-fig'), function (f, i) { add(f, i * .07, open); });
    });
  });
  var band = document.querySelector('.am-cta-band .wrap');
  if (band) { add(band); }
  document.querySelectorAll('.am-item.pg-reveal,.am-cta-band .wrap>*').forEach(function (e) { e.classList.remove('pg-reveal'); });
  if (!targets.length) return;
  root.classList.add('prod-fly');
  targets.forEach(function (t) { t.el.setAttribute('data-fly', ''); });

  var vw = innerWidth, vh = innerHeight;
  function measure() {
    vw = innerWidth; vh = innerHeight;
    targets.forEach(function (t) { t.el.style.transform = 'none'; t.el.style.clipPath = 'none'; });
    targets.forEach(function (t) {
      var r = t.el.getBoundingClientRect();
      t.dir = (r.left + r.width / 2) < vw / 2 ? -1 : 1;
      if (t.el.classList.contains('wrap')) t.dir = 0;   // fascia finale: sale dal basso
    });
  }
  function ease(p) { return 1 - Math.pow(1 - p, 3); }
  var ticking = false;
  function update() {
    ticking = false;
    targets.forEach(function (t) {
      var r = t.el.getBoundingClientRect();
      // r.top non dipende dal translateX: il progresso resta stabile
      var start = vh * 0.98 - t.delay * vh * 0.25;
      var p = Math.max(0, Math.min(1, (start - r.top) / (vh * 0.52)));
      var e = ease(p);
      if (t.mode === 'open') {   // si apre in orizzontale da una linea centrale, ma solo quando il fondo dell'elemento è già entrato nello schermo
        var base = Math.min(r.bottom, r.top + vh * 0.85);
        var po = Math.max(0, Math.min(1, (vh * 0.98 - t.delay * vh * 0.1 - base) / (vh * 0.3)));
        e = ease(po);
        var h = (1 - e) * 50;
        t.el.style.opacity = '1';
        t.el.style.transform = 'none';
        t.el.style.clipPath = e >= 0.999 ? 'none' : 'inset(' + h.toFixed(2) + '% 0 ' + h.toFixed(2) + '% 0)';
        return;
      }
      var x = t.dir * (1 - e) * vw * 0.75;
      var y = t.dir === 0 ? (1 - e) * 80 : 0;
      t.el.style.opacity = (0.15 + 0.85 * e).toFixed(3);
      t.el.style.transform = e >= 0.999 ? 'none' : 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + (t.dir * (1 - e) * 2.2).toFixed(2) + 'deg)';
    });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', function () { measure(); req(); });
  addEventListener('load', function () { measure(); update(); });
  measure(); update();
})();
