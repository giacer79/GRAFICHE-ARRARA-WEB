/* Mappa reale (OpenStreetMap, stile scuro CARTO) con scorrimento e zoom senza limiti.
   Si attiva solo se la pagina è aperta da sola, c'è connessione e un riquadro di prova si carica davvero:
   in tutti gli altri casi resta la mappa stilizzata (mappa-zoom.js). */
(function () {
  var box = document.getElementById('map');
  if (!box) return;
  try { if (window.top !== window.self) return; } catch (_) { return; }
  if (navigator.onLine === false) return;

  var LAT = 45.3833514, LNG = 8.9131348;
  var TILE = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  var probe = new Image(), done = false;
  function fail() { done = true; }
  probe.onload = function () { if (!done) { done = true; start(); } };
  probe.onerror = fail;
  setTimeout(fail, 6000);
  probe.src = TILE.replace('{s}', 'a').replace('{z}', 17).replace('{x}', 68718).replace('{y}', 46086).replace('{r}', '');

  function load(tag, attrs, cb) {
    var el = document.createElement(tag);
    Object.keys(attrs).forEach(function (k) { el[k] = attrs[k]; });
    el.onload = cb; el.onerror = function () { cb(new Error('load')); };
    document.head.appendChild(el);
  }

  function start() {
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'assets/leaflet/leaflet.css';
    document.head.appendChild(css);
    load('script', { src: 'assets/leaflet/leaflet.js' }, function (err) {
      if (err instanceof Error || !window.L) return;
      var live = document.createElement('div');
      live.className = 'ct-map-live';
      box.appendChild(live);
      var map = L.map(live, { center: [LAT, LNG], zoom: 17, minZoom: 2, maxZoom: 20, zoomSnap: 0.5, wheelPxPerZoomLevel: 90, worldCopyJump: true, attributionControl: true });
      L.tileLayer(TILE, {
        subdomains: 'abcd', maxZoom: 20, maxNativeZoom: 20,
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
      }).addTo(map);
      var pin = '<span class="pin" aria-hidden="true"><i></i><i></i><b></b><em class="pin-label">GRAFICHE ARRARA</em></span>';
      L.marker([LAT, LNG], { icon: L.divIcon({ className: 'ct-pin-icon', html: pin, iconSize: [44, 44], iconAnchor: [22, 22] }), keyboard: false }).addTo(map);
      var shown = false;
      function show() { if (shown) return; shown = true; live.classList.add('ready'); box.classList.add('has-live'); }
      map.once('load', function () { setTimeout(show, 300); });
      setTimeout(show, 2500);
      map.whenReady(function () { setTimeout(function () { map.invalidateSize(); }, 50); });
    });
  }
})();
