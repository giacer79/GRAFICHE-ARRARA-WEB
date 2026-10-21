/* Chatta con noi: apre WhatsApp con il messaggio già scritto.
   Per attivare WhatsApp inserire qui il numero in formato internazionale, senza + e senza spazi (es. '393331234567'). */
(function () {
  var WA_NUMBER = '';
  var PHONE = '+390294967323', PHONE_LABEL = '02 9496 7323', MAIL = 'info@grafichearrara.com';
  var DEFAULT_MSG = 'Buongiorno, vorrei informazioni sui vostri servizi.';

  var root = document.createElement('div');
  root.className = 'ac-chat';
  var primary = WA_NUMBER
    ? '<button class="ac-chat-send" type="button" data-send>Scrivici su WhatsApp <span aria-hidden="true">↗</span></button>'
    : '<a class="ac-chat-send" data-mail href="#">Scrivici una mail <span aria-hidden="true">↗</span></a>';
  root.innerHTML =
    '<div class="ac-chat-panel" id="ac-chat-panel" role="dialog" aria-label="Chatta con Grafiche Arrara" hidden>' +
      '<div class="ac-chat-head"><img src="assets/logo.png" alt="" width="38" height="28"><div><strong>Grafiche Arrara</strong><span>Ti rispondiamo il prima possibile</span></div></div>' +
      '<div class="ac-chat-body">' +
        '<p class="ac-chat-msg">Ciao! Raccontaci cosa ti serve: progetto grafico, stampa, preventivo.</p>' +
        '<textarea id="ac-chat-text" aria-label="Il tuo messaggio" placeholder="Scrivi qui il tuo messaggio…"></textarea>' +
        primary +
        '<div class="ac-chat-alt"><a href="tel:' + PHONE + '">Chiama ' + PHONE_LABEL + '</a>' + (WA_NUMBER ? '<a data-mail href="#">Email</a>' : '') + '</div>' +
      '</div>' +
    '</div>' +
    '<button class="ac-chat-btn" type="button" aria-expanded="false" aria-controls="ac-chat-panel" aria-label="Chatta con noi">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.3A8.4 8.4 0 1 1 21 11.5z"/></svg>' +
      '<span class="ac-chat-label">CHATTA CON NOI</span>' +
    '</button>';
  document.body.appendChild(root);

  var btn = root.querySelector('.ac-chat-btn'), panel = root.querySelector('.ac-chat-panel'), text = root.querySelector('#ac-chat-text');
  function setOpen(open) {
    root.classList.toggle('is-open', open);
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Chiudi la chat' : 'Chatta con noi');
    if (open) text.focus({ preventScroll: true }); else btn.focus({ preventScroll: true });
  }
  btn.addEventListener('click', function () { setOpen(panel.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });
  document.addEventListener('click', function (e) { if (!panel.hidden && !root.contains(e.target)) setOpen(false); });

  var msg = function () { return (text.value || '').trim() || DEFAULT_MSG; };
  var send = root.querySelector('[data-send]');
  if (send) send.addEventListener('click', function () {
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg()), '_blank', 'noopener');
  });
  Array.prototype.forEach.call(root.querySelectorAll('[data-mail]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Richiesta dal sito') + '&body=' + encodeURIComponent(msg());
    });
  });
})();
