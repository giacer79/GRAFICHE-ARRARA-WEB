/* Mappa della sede: carta vettoriale scorrevole e zoomabile.
   Trascinamento col mouse o col dito, rotellina / pizzico per lo zoom, doppio clic, pulsanti e tastiera.
   Pan e zoom cambiano il viewBox dell'SVG: i tratti restano nitidi a ogni ingrandimento. */
(function () {
  var box = document.getElementById('map');
  if (!box) return;
  var svg = box.querySelector('svg.ct-map-img'), pin = box.querySelector('.pin');
  if (!svg) return;

  var WX = 1400, WY = 625;            /* mezza larghezza / altezza della carta (unità SVG) */
  var BASE_W = 1120, BASE_H = 500;    /* vista iniziale */
  var MAXZ = 7;
  var cx = 0, cy = 0, z = 1, U0 = 1, MINZ = 0.4;
  var pts = {}, pinch = null;

  function dims() { return { w: box.clientWidth, h: box.clientHeight }; }
  function units() { var d = dims(); U0 = Math.max(BASE_W / d.w, BASE_H / d.h); MINZ = Math.max(d.w * U0 / (2 * WX), d.h * U0 / (2 * WY)); }
  function clamp() {
    var d = dims(), u = U0 / z;
    z = Math.min(MAXZ, Math.max(MINZ, z)); u = U0 / z;
    var hw = d.w * u / 2, hh = d.h * u / 2;
    cx = Math.min(WX - hw, Math.max(-WX + hw, cx));
    cy = Math.min(WY - hh, Math.max(-WY + hh, cy));
  }
  function atHome() { return Math.abs(z - 1) < 0.002 && Math.abs(cx) < 0.5 && Math.abs(cy) < 0.5; }
  function apply() {
    var d = dims(); if (!d.w) return;
    units(); clamp();
    var u = U0 / z, vw = d.w * u, vh = d.h * u;
    svg.setAttribute('viewBox', (cx - vw / 2) + ' ' + (cy - vh / 2) + ' ' + vw + ' ' + vh);
    if (pin) { pin.style.left = ((0 - (cx - vw / 2)) / vw * 100) + '%'; pin.style.top = ((0 - (cy - vh / 2)) / vh * 100) + '%'; }
    btnIn.disabled = z >= MAXZ - 0.001;
    btnOut.disabled = z <= MINZ + 0.001;
    btnReset.hidden = atHome();
  }
  /* zoom mantenendo fermo il punto sotto il cursore (px, py in pixel della cornice) */
  function zoomAt(px, py, nz) {
    var d = dims(); units();
    nz = Math.min(MAXZ, Math.max(MINZ, nz));
    var u = U0 / z, wx = cx + (px - d.w / 2) * u, wy = cy + (py - d.h / 2) * u;
    z = nz; u = U0 / z;
    cx = wx - (px - d.w / 2) * u; cy = wy - (py - d.h / 2) * u;
    apply();
  }
  function home() { z = 1; cx = 0; cy = 0; apply(); }
  function panBy(dx, dy) { var u = U0 / z; cx -= dx * u; cy -= dy * u; apply(); }

  /* Spilla: posizione assoluta nella cornice, si sposta con la carta */
  if (pin) pin.style.margin = '-22px 0 0 -22px';

  /* Pulsanti */
  var ctr = document.createElement('div');
  ctr.className = 'ct-map-ctrl';
  ctr.innerHTML = '<button type="button" data-z="in" aria-label="Ingrandisci la mappa">+</button>' +
    '<button type="button" data-z="out" aria-label="Riduci la mappa">−</button>' +
    '<button type="button" data-z="reset" aria-label="Torna alla vista iniziale" hidden>⌂</button>';
  box.appendChild(ctr);
  var btnIn = ctr.querySelector('[data-z=in]'), btnOut = ctr.querySelector('[data-z=out]'), btnReset = ctr.querySelector('[data-z=reset]');
  ctr.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var d = dims();
    if (b.dataset.z === 'in') zoomAt(d.w / 2, d.h / 2, z * 1.6);
    else if (b.dataset.z === 'out') zoomAt(d.w / 2, d.h / 2, z / 1.6);
    else home();
  });
  ctr.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  ctr.addEventListener('dblclick', function (e) { e.stopPropagation(); });

  /* Rotellina: zoom sul punto del cursore */
  box.addEventListener('wheel', function (e) {
    e.preventDefault();
    var r = box.getBoundingClientRect(), d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomAt(e.clientX - r.left, e.clientY - r.top, z * Math.exp(-d * 0.0015));
  }, { passive: false });

  /* Trascinamento e pizzico */
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  box.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button > 0) return;
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    try { box.setPointerCapture(e.pointerId); } catch (_) {}
    var ids = Object.keys(pts);
    if (ids.length === 2) pinch = { d: dist(pts[ids[0]], pts[ids[1]]), z: z };
    box.classList.add('is-drag');
  });
  box.addEventListener('pointermove', function (e) {
    if (!pts[e.pointerId]) return;
    var prev = pts[e.pointerId];
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pts);
    if (ids.length === 2 && pinch) {
      var a = pts[ids[0]], b = pts[ids[1]], r = box.getBoundingClientRect();
      zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, pinch.z * dist(a, b) / pinch.d);
      return;
    }
    if (ids.length === 1) panBy(e.clientX - prev.x, e.clientY - prev.y);
  });
  function end(e) {
    delete pts[e.pointerId];
    if (Object.keys(pts).length < 2) pinch = null;
    if (!Object.keys(pts).length) box.classList.remove('is-drag');
  }
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);

  /* Doppio clic / doppio tocco: ingrandisce sul punto (oltre un certo livello torna alla vista iniziale) */
  box.addEventListener('dblclick', function (e) {
    var r = box.getBoundingClientRect();
    if (z >= 4) home(); else zoomAt(e.clientX - r.left, e.clientY - r.top, z * 2);
  });

  /* Tastiera */
  box.setAttribute('tabindex', '0');
  box.addEventListener('keydown', function (e) {
    var d = dims(), used = true;
    if (e.key === '+' || e.key === '=') zoomAt(d.w / 2, d.h / 2, z * 1.4);
    else if (e.key === '-' || e.key === '_') zoomAt(d.w / 2, d.h / 2, z / 1.4);
    else if (e.key === '0') home();
    else if (e.key === 'ArrowLeft') panBy(60, 0);
    else if (e.key === 'ArrowRight') panBy(-60, 0);
    else if (e.key === 'ArrowUp') panBy(0, 60);
    else if (e.key === 'ArrowDown') panBy(0, -60);
    else used = false;
    if (used) e.preventDefault();
  });

  window.addEventListener('resize', apply);
  box.classList.add('is-zoomed');
  apply();
})();
