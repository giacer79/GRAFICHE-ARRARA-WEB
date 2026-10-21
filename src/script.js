window.__arraraReady = true;
const REVEAL_GROUPS = [
  ['.hero-content > *', .12, 0],
  ['.services .service-card', .08, 0],
  ['.vision > *', .14, 0],
  ['.process-inner > *', .09, 0],
  ['.portfolio > .eyebrow, .section-head', .08, 0],
  ['.project', .1, 2],
  ['.about-copy > *', .09, 0],
  ['.about .stat', .09, 0],
  ['.about-footer', 0, 0],
  ['.contact-inner', 0, 0]
];
let revealStarted = false;
const initReveal = (afterIntro) => {
  if (revealStarted) return;
  revealStarted = true;
  if (!document.documentElement.classList.contains('js')) return;
  const items = [];
  REVEAL_GROUPS.forEach(([selector, step, wrap]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      const idx = wrap ? i % wrap : i;
      const base = (afterIntro && selector.startsWith('.hero-content')) ? .35 : 0;
      el.style.setProperty('--d', (base + idx * step).toFixed(2) + 's');
      items.push(el);
    });
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      el.classList.add('is-in');
      const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.add('r-done'), (delay + .95) * 1000);
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => observer.observe(el));
};

// Mette in pausa le animazioni infinite quando la sezione non è visibile.
if ('IntersectionObserver' in window) {
  const pauser = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-paused', !entry.isIntersecting));
  }, { rootMargin: '80px 0px' });
  document.querySelectorAll('.site-header, .vision, .process').forEach(el => pauser.observe(el));
}

const homeVideo = document.querySelector('#home-video');
let homeVideoStarted = false;
const startHomeVideo = () => {
  if (!homeVideo || homeVideoStarted) return;
  homeVideoStarted = true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    homeVideo.hidden = true;
    return;
  }
  homeVideo.addEventListener('playing', () => homeVideo.classList.add('is-playing'), { once: true });
  homeVideo.play().catch(() => { homeVideo.hidden = true; });
};

const intro = document.querySelector('#site-intro');
if (intro && !intro.hidden) {
  const video = document.querySelector('#intro-video');
  const skip = document.querySelector('#skip-intro');
  const page = [document.querySelector('.site-header'), document.querySelector('main'), document.querySelector('footer')];
  page.forEach(element => { if (element) element.inert = true; });
  intro.focus({ preventScroll: true });
  let finished = false;
  let revealed = false;
  const finishIntro = () => {
    if (finished) return;
    finished = true;
    video.pause();
    if (window.__arraraWave) window.__arraraWave.stop();
    try { sessionStorage.setItem('arraraIntroShown', '1'); } catch (_) {}
    intro.classList.add('is-done');
    initReveal(true);
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      intro.hidden = true;
      document.body.classList.remove('intro-active');
      page.forEach(element => { if (element) element.inert = false; });
      document.querySelector('#hero-title')?.focus({ preventScroll: true });
      startHomeVideo();
    };
    intro.addEventListener('transitionend', event => { if (event.target === intro) reveal(); });
    setTimeout(reveal, 950);
  };
  skip.addEventListener('click', finishIntro);
  video.addEventListener('ended', finishIntro, { once: true });
  video.addEventListener('error', finishIntro, { once: true });
  video.addEventListener('playing', () => intro.classList.add('is-playing'), { once: true });
  if (location.hash !== '#intro-classico') {
    /* Intro: video ufficio a tutto schermo (sfocato, dissolvenza) -> poi logo centrale con icone */
    const office = document.createElement('video');
    office.className = 'site-intro-office';
    office.src = 'assets/intro-ufficio.mp4';
    office.muted = true; office.playsInline = true; office.preload = 'auto';
    office.setAttribute('aria-hidden', 'true');
    intro.prepend(office);
    const variant = location.hash === '#intro-sfarfallio' ? 'flicker' : 'soft';
    let dark = null;
    if (variant) {
      dark = document.createElement('div');
      dark.className = 'site-intro-dark ' + variant;
      dark.setAttribute('aria-hidden', 'true');
      office.after(dark);
    }
    intro.classList.add('office-wait');
    if (variant === 'soft') { /* logo senza alone rosso, per fondersi con il blu del fondo */ video.src = 'assets/intro-logo-pulito.mp4'; video.load(); }
    const wave = window.arraraWaveIntro ? window.arraraWaveIntro(intro) : null;
    window.__arraraWave = wave;
    let waveOn = false;
    let started = false;
    const startLogo = () => {
      if (started) return; started = true; intro.classList.remove('office-wait');
      if (variant === 'soft') {
        /* salta la parte della lampadina: parte dal logo (circa 4,0 s) */
        intro.classList.add('skip-bulb');
      } video.play().catch(finishIntro); };
    office.addEventListener('playing', () => { office.classList.add('is-on'); if (dark) dark.classList.add('go'); }, { once: true });
    office.addEventListener('timeupdate', () => {
      if (office.currentTime >= 8.7) {
        office.classList.add('is-out');
        if (wave && !waveOn) { waveOn = true; wave.start(); setTimeout(startLogo, 2300); }
      }
      if (!wave && office.currentTime >= 9.0) startLogo();
    });
    office.addEventListener('ended', () => { if (!wave) startLogo(); }, { once: true });
    office.addEventListener('error', startLogo, { once: true });
    office.play().catch(startLogo);
    setTimeout(finishIntro, 20000);
  } else {
    video.play().catch(finishIntro);
    setTimeout(finishIntro, 11000);
  }
}
if (!intro || intro.hidden) { startHomeVideo(); initReveal(false); }

const menuButton=document.querySelector('.menu-toggle');
const clientsCount=document.querySelector('.clients-count');
if(clientsCount){
  const target=Number(clientsCount.dataset.clientsCount);
  if(Number.isSafeInteger(target)&&target>0){
    const formatter=new Intl.NumberFormat('it-IT');
    const show=value=>{clientsCount.textContent=formatter.format(value)};
    const animate=()=>{
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){show(target);return}
      const start=performance.now();
      const duration=1900;
      const frame=now=>{
        const progress=Math.min((now-start)/duration,1);
        show(Math.round(target*(1-Math.pow(1-progress,3))));
        if(progress<1)requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver((entries)=>{
        if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();animate()}
      },{threshold:.25});
      observer.observe(clientsCount);
    }else{animate()}
  }
}
const nav=document.querySelector('.site-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Apri il menu':'Chiudi il menu');nav.classList.toggle('open',!open)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Apri il menu')}));
const details=[
  'Ogni progetto comincia dall’ascolto: mettiamo a fuoco esigenze, pubblico e obiettivi.',
  'Traduciamo le idee in un concept visivo, contenuti e materiali coordinati.',
  'Prepariamo i file e scegliamo tecniche, supporti e finiture adatti al risultato.',
  'Curiamo gli ultimi passaggi fino alla consegna del progetto finito.'
];
const longDetails=["Tutto comincia da una conversazione. Incontriamo il cliente per capire chi è, a chi si rivolge e che cosa vuole ottenere: obiettivi, pubblico, tono di voce e tempi. Guardiamo i materiali già esistenti e il contesto in cui il progetto vivrà, così da definire un'impostazione chiara che guiderà ogni scelta successiva.", "Le idee diventano un linguaggio visivo. Sviluppiamo il concept, la struttura dei contenuti e la direzione creativa: logo, colori, caratteri, impaginazione e formati. Presentiamo proposte concrete, le affiniamo insieme al cliente e prepariamo file coordinati, pronti per essere stampati o pubblicati.", "Il progetto prende forma. Curiamo la prestampa, verificando colori, margini e risoluzioni, e scegliamo tecnica e supporto più adatti: stampa digitale o offset, grande formato, finiture e lavorazioni speciali. Seguiamo ogni fase direttamente, per ottenere un risultato fedele al progetto.", "Accompagniamo il lavoro fino all'ultimo passaggio. Controlliamo il prodotto finito, lo confezioniamo con cura e lo consegniamo, curando dove serve anche la posa. Restiamo a disposizione per ogni supporto successivo: un unico interlocutore dall'idea al risultato."];
const touchOnly=window.matchMedia('(hover: none)');
const stepDetail=document.querySelector('.step-detail');
if(touchOnly.matches&&stepDetail)stepDetail.textContent=longDetails[0];
let swapTimer;
const swapDetail=text=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){stepDetail.textContent=text;return}
  clearTimeout(swapTimer);
  stepDetail.classList.add('is-swap');
  swapTimer=setTimeout(()=>{stepDetail.textContent=text;stepDetail.classList.remove('is-swap')},170);
};
document.querySelectorAll('.step').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.step').forEach(item=>{item.classList.remove('active');item.setAttribute('aria-expanded','false')});button.classList.add('active');button.setAttribute('aria-expanded','true');swapDetail((touchOnly.matches?longDetails:details)[Number(button.dataset.step)])}));
const projects=[
  {type:'COMUNICAZIONE',title:'Brochure Comune di Boffalora',description:'Un progetto editoriale che organizza informazioni e contenuti visivi in un racconto chiaro e riconoscibile.',image:'assets/boffalora.png',alt:'Brochure del Comune di Boffalora'},
  {type:'EDITORIA',title:'Gender Equality Plan IULM',description:'Progettazione grafica e impaginazione del Gender Equality Plan 2025-2027 dell’Università IULM: copertina e pagine interne con testi, dati e grafici.',image:'assets/progetto-iulm-gep.webp',alt:'Gender Equality Plan IULM: copertina e due doppie pagine interne'},
  {type:'COMUNICAZIONE',title:'Il Banco di Antonino',description:'Materiali coordinati che portano l’identità del progetto dal punto vendita alla comunicazione stampata.',image:'assets/antonino.png',alt:'Materiali di comunicazione per Il Banco di Antonino'},
  {type:'BRAND IDENTITY',title:'Pastel Pasticceria',description:'Un’identità visiva applicata al packaging, con un linguaggio coerente e distintivo.',image:'assets/pastel.png',alt:'Packaging Pastel Pasticceria'}
];
const dialog=document.querySelector('#project-dialog');const close=document.querySelector('.dialog-close');let lastTrigger;
document.querySelectorAll('.project').forEach(button=>button.addEventListener('click',()=>{const p=projects[Number(button.dataset.project)];lastTrigger=button;document.querySelector('#dialog-image').src=p.image;document.querySelector('#dialog-image').alt=p.alt;document.querySelector('#dialog-type').textContent='/ '+p.type;document.querySelector('#dialog-title').textContent=p.title;document.querySelector('#dialog-description').textContent=p.description;dialog.showModal();close.focus()}));
close.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog.addEventListener('close',()=>lastTrigger?.focus());

// Menu mobile: chiusura con Esc o toccando fuori dal pannello.
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.site-nav');
  if (!toggle || !panel) return;
  const closeMenu = (refocus) => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Apri il menu');
    if (refocus) toggle.focus();
  };
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.addEventListener('click', event => {
    if (!panel.contains(event.target) && !toggle.contains(event.target)) closeMenu(false);
  });
})();
