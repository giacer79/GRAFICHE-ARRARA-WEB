/* Mappa della sede: zoom e spostamento (rotellina con Ctrl, trascinamento, pizzico, pulsanti, tastiera) */
(function () {
  var box = document.getElementById('map');
  if (!box) return;
  var img = box.querySelector('.ct-map-img'), pin = box.querySelector('.pin');
  if (!img) return;
  var pan = document.createElement('div');
  pan.className = 'ct-map-pan';
  box.insertBefore(pan, box.firstChild);
  pan.appendChild(img);
  if (pin) pan.appendChild(pin);

  var MIN = 1, MAX = 6, z = 1, tx = 0, ty = 0;
  var pts = {}, last = null, pinch = null, moved = false;

  function size() { return { w: box.clientWidth, h: box.clientHeight }; }
  function clamp() {
    var s = size();
    z = Math.min(MAX, Math.max(MIN, z));
    tx = Math.min(0, Math.max(s.w * (1 - z), tx));
    ty = Math.min(0, Math.max(s.h * (1 - z), ty));
  }
  function apply() {
    clamp();
    pan.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + z + ')';
    pan.style.setProperty('--zi', (1 / z).toFixed(4));
    box.classList.toggle('is-zoomed', z > 1.001);
    btnIn.disabled = z >= MAX - 0.001;
    btnOut.disabled = z <= MIN + 0.001;
    btnReset.hidden = z <= MIN + 0.001;
  }
  function zoomAt(px, py, nz) {
    nz = Math.min(MAX, Math.max(MIN, nz));
    var wx = (px - tx) / z, wy = (py - ty) / z;
    z = nz; tx = px - wx * z; ty = py - wy * z;
    apply();
  }
  function center() { var s = size(); return { x: s.w / 2, y: s.h / 2 }; }

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
    var c = center();
    if (b.dataset.z === 'in') zoomAt(c.x, c.y, z * 1.6);
    else if (b.dataset.z === 'out') zoomAt(c.x, c.y, z / 1.6);
    else { z = 1; tx = 0; ty = 0; apply(); }
  });
  ctr.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  ctr.addEventListener('dblclick', function (e) { e.stopPropagation(); });

  /* Suggerimento per la rotellina */
  var hint = document.createElement('div');
  hint.className = 'ct-map-hint'; hint.setAttribute('aria-hidden', 'true');
  hint.textContent = (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl') + ' + scorri per zoomare';
  box.appendChild(hint);
  var hintTimer;
  function showHint() { hint.classList.add('on'); clearTimeout(hintTimer); hintTimer = setTimeout(function () { hint.classList.remove('on'); }, 1400); }

  /* Rotellina: zoom solo con Ctrl/Cmd, altrimenti scorre la pagina */
  box.addEventListener('wheel', function (e) {
    if (!(e.ctrlKey || e.metaKey)) { showHint(); return; }
    e.preventDefault();
    var r = box.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, z * Math.exp(-e.deltaY * 0.0013));
  }, { passive: false });

  /* Trascinamento e pizzico */
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  box.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button > 0) return;
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    try { box.setPointerCapture(e.pointerId); } catch (_) {}
    var ids = Object.keys(pts);
    if (ids.length === 2) { pinch = { d: dist(pts[ids[0]], pts[ids[1]]), z: z }; }
    last = { x: e.clientX, y: e.clientY }; moved = false;
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
      moved = true; return;
    }
    if (ids.length === 1 && z > 1.001) {
      tx += e.clientX - prev.x; ty += e.clientY - prev.y; moved = true; apply();
    }
  });
  function end(e) {
    delete pts[e.pointerId];
    if (Object.keys(pts).length < 2) pinch = null;
    if (!Object.keys(pts).length) box.classList.remove('is-drag');
  }
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);

  /* Doppio clic / doppio tocco: ingrandisce sul punto */
  box.addEventListener('dblclick', function (e) {
    var r = box.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, z > 1.001 && z >= 2.9 ? 1 : z * 2);
    if (z <= 1.001) { tx = 0; ty = 0; apply(); }
  });

  /* Tastiera */
  box.setAttribute('tabindex', '0');
  box.addEventListener('keydown', function (e) {
    var step = 60, c = center(), used = true;
    if (e.key === '+' || e.key === '=') zoomAt(c.x, c.y, z * 1.4);
    else if (e.key === '-' || e.key === '_') zoomAt(c.x, c.y, z / 1.4);
    else if (e.key === '0') { z = 1; tx = 0; ty = 0; apply(); }
    else if (e.key === 'ArrowLeft') { tx += step; apply(); }
    else if (e.key === 'ArrowRight') { tx -= step; apply(); }
    else if (e.key === 'ArrowUp') { ty += step; apply(); }
    else if (e.key === 'ArrowDown') { ty -= step; apply(); }
    else used = false;
    if (used) e.preventDefault();
  });

  window.addEventListener('resize', apply);
  apply();
})();
