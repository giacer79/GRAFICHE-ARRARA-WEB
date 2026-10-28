(function () {
  var tab = document.querySelector('.web-tab');
  var services = document.querySelector('.services');
  if (!tab || !services) return;
  // Larghezza: dal bordo destro fino a metà della card "Azienda" (4ª)
  function size() {
    var card = services.querySelectorAll('.service-card')[3];
    var vw = document.documentElement.clientWidth;
    var w;
    if (card && vw > 700) { var r = card.getBoundingClientRect(); w = vw - (r.left + r.width / 2); }
    else w = Math.min(vw * 0.86, 340);
    tab.style.setProperty('--wt-w', Math.max(260, Math.round(w)) + 'px');
  }
  function show() { tab.classList.add('is-on'); }
  size();
  addEventListener('resize', size);
  addEventListener('load', size);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { show(); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(tab.parentNode);
  } else show();
})();
