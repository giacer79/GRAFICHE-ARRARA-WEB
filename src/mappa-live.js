/* Mappa interattiva: Google Maps incorporata (zoom, spostamento, vista satellite, Street View, indicazioni).
   Si attiva solo quando la pagina è aperta da sola (file o sito); nelle anteprime in cornice e senza
   connessione resta visibile la mappa stilizzata con zoom e spostamento. */
(function () {
  var box = document.getElementById('map');
  if (!box) return;
  try { if (window.top !== window.self) return; } catch (_) { return; }
  if (navigator.onLine === false) return;

  var LAT = 45.3833514, LNG = 8.9131348;
  var live = document.createElement('div');
  live.className = 'ct-map-live';
  var f = document.createElement('iframe');
  f.title = 'Mappa interattiva: sede di Grafiche Arrara, Viale Sforza 125, Abbiategrasso';
  f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer-when-downgrade';
  f.allowFullscreen = true;
  f.src = 'https://maps.google.com/maps?q=' + LAT + ',' + LNG + '&z=17&hl=it&output=embed';
  f.addEventListener('load', function () {
    live.classList.add('ready');
    box.classList.add('has-live');
    box.removeAttribute('role'); box.removeAttribute('aria-label'); box.removeAttribute('tabindex');
  });
  live.appendChild(f);
  box.appendChild(live);
})();
