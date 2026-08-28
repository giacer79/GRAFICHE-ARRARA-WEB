# Code review — stato tecnico del codice

## CSS (`style.css`)
- **Consolidato** in un unico foglio pulito (da 749 a ~473 righe): erano
  presenti 5 blocchi di patch successive ("Aggiornamento home
  2026-07-06", "Ripristino titolo", ecc.) che si sovrascrivevano a
  vicenda con `!important`. Ora ogni regola compare una sola volta, con
  il valore finale a cui erano arrivate le patch.
- **Rimosso codice morto**: classe `.signal` (hero antico, non più
  usata), `.visually-hidden` (mai referenziata), regole per `.hero-panel`
  generico (in realtà si usa sempre `.hero-panel-image`).
- Uso di variabile CSS `--frame-pad-x` per rendere il padding laterale
  del `.site-frame` riutilizzabile (serve per far uscire l'hero a piena
  larghezza in modo responsive, senza duplicare valori per ogni
  breakpoint).
- Un solo `!important` rimasto, su `.lead` — necessario per vincere la
  specificità di `.home-intro-copy p` (stesso peso di specificità,
  altrimenti vincerebbe il selettore con l'elemento).

## HTML
- 6 pagine, markup ripetuto (header/footer identici copiati in ognuna,
  non ci sono include/template — limite intrinseco di un sito statico
  senza build step). Se cambia l'header, va cambiato in tutte e 6 le
  pagine a mano.

## JS (`script.js`)
- Piccolo e mirato: toggle menu mobile, submit form simulato, parallax
  hero (con guardia `prefers-reduced-motion` e throttling via
  `requestAnimationFrame`).

## Problemi noti / debito tecnico
1. **Form contatti non funzionante davvero** — solo simulato lato
   client. Serve un servizio di invio (es. backend leggero, o servizio
   tipo Formspree/EmailJS) prima della pubblicazione.
2. **Immagini placeholder ripetute** — tutte le card (link-card,
   feature-card) e il `.subhero` riusano `home-hero.jpg` come sfondo:
   da sostituire con foto reali dell'azienda/materiali.
3. **Font Raleway solo via Google Fonts CDN** — se il sito viene aperto
   offline o l'importazione fallisce, si perde il font titoli (fallback
   `Arial Black`). Da valutare se servire il font localmente prima della
   pubblicazione.
4. **Nessuna pagina 404, nessun meta tag SEO oltre a `description` sulla
   home**, nessuna sitemap — normale in questa fase, da affrontare prima
   della pubblicazione.
5. **Markup duplicato tra le 6 pagine** — accettabile per un sito di
   questa dimensione, ma da tenere a mente per coerenza quando si
   modifica l'header/footer.

## Bug risolti di recente
- L'attributo `alt` dell'immagine hero conteneva un testo descrittivo
  lungo che, in caso di mancato caricamento dell'immagine (es. aprendo
  `index.html` senza gli asset nella stessa cartella), veniva mostrato
  come testo sovraimpresso indesiderato. Risolto svuotando l'`alt`
  (l'immagine è decorativa, il testo informativo è già visibile in
  sovrimpressione).
