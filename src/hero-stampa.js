/* Avvia l'effetto di stampa del titolo quando l'intro è finita (o subito se non c'è). */
(() => {
  const wrap = document.querySelector('.hp-wrap');
  if (!wrap) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  // finché non parte, il titolo resta nascosto (le maschere partono da -12%)
  wrap.classList.add('hp-ready');
  let started = false;
  const start = () => {
    if (started) return; started = true;
    wrap.classList.remove('hp-go'); void wrap.offsetWidth; wrap.classList.add('hp-go');
  };
  const intro = () => document.body.classList.contains('intro-active');
  if (!intro()) { setTimeout(start, 250); }
  else {
    const mo = new MutationObserver(() => { if (!intro()) { mo.disconnect(); setTimeout(start, 350); } });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setTimeout(start, 14000);
  }
})();
