(function () {
  var row = document.getElementById('wg-row');
  if (!row) return;
  var wg = row.querySelector('.wg'), globe = row.querySelector('.wg-globe');
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var x0 = 0, started = false;

  function layout() {
    var vw = document.documentElement.clientWidth, d = globe.offsetWidth;
    var cards = document.querySelectorAll('.service-card'), c5 = cards[4], gl;
    if (vw > 1000 && c5) gl = c5.getBoundingClientRect().left + d * 0.27 - d / 2; else gl = 14;
    row.style.setProperty('--gl', Math.round(gl) + 'px');
    row.style.setProperty('--br', (vw > 900 ? Math.max(52, Math.round(vw * 0.022)) : 14) + 'px');
    x0 = vw - gl + d + 24;
    return d;
  }
  function setPos(x, d) {
    globe.style.setProperty('--gx', x.toFixed(1) + 'px');
    globe.style.setProperty('--ga', (x / (d / 2) * 180 / Math.PI).toFixed(1) + 'deg');
  }
  function finish() {
    wg.classList.add('is-bar');
    setTimeout(function () { wg.classList.add('is-live'); }, reduce ? 0 : 1000);
    if (!reduce) setTimeout(spinLoop, 3000);
  }
  /* ogni 3 secondi il globo fa un giro completo su sé stesso */
  function spinLoop() {
    var t0 = null, dur = 1700;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      globe.style.setProperty('--ga', (360 * e).toFixed(1) + 'deg');
      if (p < 1) requestAnimationFrame(step);
      else { globe.style.setProperty('--ga', '0deg'); setTimeout(spinLoop, 3000); }
    }
    requestAnimationFrame(step);
  }
  function roll() {
    if (started) return; started = true;
    var d = layout();
    if (reduce) { setPos(0, d); globe.style.opacity = 1; finish(); return; }
    var dur = 2600, t0 = null;
    setPos(x0, d); globe.style.opacity = 1;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      setPos(x0 * (1 - e), d);
      if (p < 1) requestAnimationFrame(step); else { setPos(0, d); finish(); }
    }
    requestAnimationFrame(step);
  }
  function whenReady() {
    if (document.body.classList.contains('intro-active')) { setTimeout(whenReady, 300); return; }
    roll();
  }
  layout();
  addEventListener('resize', function () { if (started) { var d = layout(); if (!wg.classList.contains('is-bar')) return; setPos(0, d); } else layout(); });
  addEventListener('load', layout);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { io.disconnect(); whenReady(); }
    }, { threshold: 0.5 });
    io.observe(row);
  } else whenReady();
})();
