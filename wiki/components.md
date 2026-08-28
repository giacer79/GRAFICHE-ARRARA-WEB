# Components — elementi riutilizzabili

## Transizione tra pagine — `#pageTransition` (tutte e 6 le pagine)
Overlay `.page-transition` (`#020202`, `z-index:200`) presente su ogni
pagina, subito dopo `<body>`. Due momenti:
- **Entrata**: ogni pagina parte con l'overlay opaco (stato di default in
  CSS, niente flash perché è già così al primo paint) e `script.js` lo
  dissolve (`.is-hidden`, `opacity:0`, transizione .32s) appena il DOM è
  pronto (`requestAnimationFrame`).
- **Uscita**: `script.js` intercetta il click su ogni `<a href>` interno
  della pagina (esclusi: link con `#` — ancore nella stessa pagina, es.
  "Vai alle sezioni" in home —, link esterni `http(s):`/altri schemi,
  link con `target="_blank"`, click con tasti modificatori
  Cmd/Ctrl/Shift/Alt per aprire in nuova scheda), fa ricomparire
  l'overlay (rimuove `.is-hidden`) e ritarda la navigazione vera e
  propria di 320ms (`setTimeout`) così la dissolvenza fa in tempo a
  vedersi prima di lasciare la pagina.
- `prefers-reduced-motion`: l'overlay scompare all'istante
  (`.is-instant`, `transition:none`) e i click sui link non vengono
  intercettati — navigazione normale, nessun ritardo.
- `pageshow` con `event.persisted` (restore da bfcache, es. tasto
  "indietro" del browser): l'overlay viene rinascosto esplicitamente,
  per evitare che riappaia opaco su una pagina ripristinata dalla cache.

## Intro home page — `.site-intro` (solo `index.html`)
Overlay fisso a schermo intero (`#siteIntro`), mostrato solo la prima
volta per sessione (flag `sessionStorage.arraraIntroShown`, controllato
con uno script inline bloccante subito dopo il div per evitare un flash
alle visite successive). Blocca lo scroll (`body.intro-active`) finché
è visibile. `prefers-reduced-motion`: salta l'intro subito, va dritto
alla home (nessuna versione statica sostitutiva — evitarla del tutto è
il comportamento più corretto).

**Contenuto**: `.site-intro-mark` (contenitore flex verticale, centrato)
con dentro:
1. `<video class="site-intro-video">` — **piccolo e discreto**
   (`width:clamp(150px,17vw,260px)`, non a schermo intero: una prima
   versione full-bleed è stata sostituita su richiesta esplicita
   dell'utente, "più piccola e discreta"). Nessun riquadro visibile:
   `mask-image:radial-gradient(ellipse closest-side at center,#000 15%,transparent 92%)`
   fa sfumare i bordi del video nello sfondo molto prima di arrivare al
   bordo del rettangolo — un raggio più stretto (es. `circle`/60%)
   lasciava intravedere un angolo arrotondato, da qui il fade "closest-side"
   molto anticipato (15%→92%) che elimina qualunque bordo percepibile.
2. `.site-intro-progress` — barra di caricamento sottile sotto al video,
   che si riempie (`width:0→100%`) in un'animazione della stessa durata
   del video (`introProgress`, `linear`, `forwards`), così finisce
   esattamente quando l'animazione termina. Resa "dinamica" (richiesta
   dell'utente) con due animazioni aggiuntive in parallelo: un bagliore
   che pulsa (`introProgressPulse`, loop) e un riflesso bianco che scorre
   dentro la parte già riempita (`introProgressShine`, pseudo-elemento
   `::after`, loop indipendente dal riempimento).
3. `.site-intro-icons` — sotto la barra, 4 piccole icone SVG bianche
   (tratto sottile, `stroke-width:1.1`, coerente con lo stile
   "wireframe" del sito) a tema progettazione/stampa: matita, layout a
   griglia, stampante, goccia d'inchiostro. Impilate nello stesso punto
   (`position:absolute;inset:0` dentro un contenitore comune) e mostrate
   **una alla volta**, in sequenza, ciascuna con un rapido
   fade-in/hold/fade-out (`introIconFlash`, ~0.7s) e un proprio
   `animation-delay` scaglionato (4.4s, 5.15s, 5.9s, 6.65s) così da
   comparire durante la fase finale con il logo, appena prima che
   l'overlay sfumi.

Il video contiene **sia** la lampadina che si accende **sia** la
transizione al logo finale: non c'è un crossfade CSS separato verso un
`<img>`, tutto è dentro `intro-completo.mp4` (~7.4s). `script.js` aspetta
la durata del video (7.5s) poi aggiunge `.is-done` (fade dell'overlay) e
infine `.is-skipped`.

### Origine e pipeline del video (`intro-completo.mp4`)
L'utente ha fornito un video generato con Adobe Firefly (lampadina che
si accende di rosso, 1920×1080, 8s, `raw/video/intro-lampadina-firefly.mp4`).
Quel video finiva con una **propria** ricostruzione IA del logo,
imprecisa (anno sbagliato "1933" invece di "1923", stile diverso dal
logo reale) — usarlo così com'era avrebbe mostrato un logo scorretto.

Composizione fatta con **ffmpeg** (installato via Homebrew su richiesta
dell'utente, non presente di default — vedi `log.md`), iterata più volte
su feedback dell'utente fino alla versione attuale:

1. Tagliato il video Firefly ai primi **4.2s** (`-t 4.2`), prima che
   cominci la sua transizione verso il logo — punto esatto trovato
   estraendo ed ispezionando fotogrammi (`ffmpeg -ss <t> -frames:v 1`).
2. Generata con Python/Pillow un'immagine 1920×1080 col logo reale
   (`logo-arrara.png`) centrato su sfondo quasi nero con lieve tint
   rosso radiale — **senza** alone/glow sfocato attorno al logo (una
   prima versione con glow è stata tolta, l'utente la trovava "sporca").
3. **Vignettatura incisa nel video** (non solo CSS): generata con PIL una
   maschera radiale in scala di grigi (1920×1080, centro pieno, bordi a
   nero) e applicata a entrambe le clip (lampadina e scena del logo) con
   `ffmpeg blend=all_mode=multiply` **in formato `gbrp`** (RGB planare —
   fondamentale: con `rgb24` il blend produceva colori sbagliati,
   lampadina verde invece che rossa, per come `blend` gestisce i piani
   colore). Questo scurisce i bordi di ogni fotogramma fino al nero puro
   in modo affidabile, indipendentemente dal supporto della maschera CSS
   nel browser.
4. Transizione finale tra le due clip: non una semplice dissolvenza ma
   `xfade=transition=hrwind` (effetto "vento" orizzontale, con striature
   che scorrono) — su richiesta dell'utente di un effetto "stampa"
   orizzontale più realistico di un wipe geometrico netto (provato prima
   `wiperight`, poi sostituito).
5. Encode finale: h264, `-crf 15 -preset slow` (qualità alta, coerente
   col video originale) e **`-movflags +faststart`** (moov atom
   all'inizio del file: necessario per lo streaming/seek corretto via
   browser).

Se in futuro arriva un video diverso/più lungo: rifare la stessa
pipeline (trim + vignetta + composita col logo reale + xfade), non
riusare la fine del video sorgente così com'è se contiene testo/logo
generato dall'IA — va sempre verificato a occhio, frame per frame.

## Portfolio in versione chiara — `body.portfolio-page`
Unica pagina del sito con layout chiaro (eccezione voluta, vedi
`visual-style.md`). Tutte le regole sono scoping sotto
`.portfolio-page` in fondo a `style.css`, quindi non toccano le altre
5 pagine che condividono lo stesso foglio di stile.

- **Palette**: pagina `#f4f3ef` (grigio molto chiaro), card `#fff`,
  testo `#1a1a1a` / `rgba(26,26,26,.6-.7)` per il secondario. Rosso e
  fucsia (`--red`/`--fuchsia`) invariati: nav underline, pulsanti CTA
  (già su sfondo gradiente, nessuna modifica necessaria), e una nuova
  linea rossa sotto il titolo di ogni `.project-card`.
- **Logo**: usa `logo-arrara-dark.png` invece di `logo-arrara.png` (solo
  nell'header di questa pagina). È una variante generata via script
  Python/Pillow che ricolora in `#1a1a1a` i pixel bianchi puri del PNG
  originale (il testo "ARRARA GRAFICHE 1923"), lasciando l'icona rossa
  (`rgb(230,25,52)`) invariata — i due colori erano nettamente distinti
  nel file originale, quindi la sostituzione è pulita e senza artefatti.
  Se il logo originale viene mai ridisegnato, rigenerare anche questa
  variante con lo stesso script.
- **Subhero**: overlay chiaro (bianco→trasparente) sopra
  `portfolio-hero-pastel.jpg` invece del velo scuro usato altrove.
- **Motivo angolo tagliato**: linea scura (`rgba(20,20,20,.35)`) invece
  che bianca — coerente col resto (stesso `clip-path`), solo ricolorata.
- **Hover card**: sostituito l'alone rosso/fucsia interno (pensato per
  sfondi scuri) con un'ombra leggera + bordo rosso sottile (`0 0 0 1px
  rgba(223,0,54,.25)`), più adatto a una card bianca.
- **Menu mobile**: il pannello `.main-nav` a schermo intero e l'icona
  hamburger sono ricolorati coerentemente (bianco/scuro invece di
  nero/bianco).
- **Bug corretto**: il bottone `.footer .cta` ("Richiedi un preventivo")
  eredita `color:#fff` dalla regola condivisa (pensata per le altre 5
  pagine, sfondo scuro) — su questa pagina risultava testo bianco su
  sfondo quasi bianco, praticamente invisibile. Aggiunta
  `.portfolio-page .footer .cta{color:#1a1a1a}` insieme agli altri
  override del footer.

## Header / `.site-header`
- `.brand`: un solo logo (`.brand-mark`, 82px), link a `index.html`
  (in passato c'era una seconda copia più piccola affiancata,
  `.brand-mark-secondary` — rimossa su richiesta dell'utente).
- `.main-nav`: link di navigazione, sottolineatura animata in gradiente
  rosso/fucsia su hover/active.
- `.menu-toggle`: hamburger animato (si trasforma in "X"), attivo
  ≤1100px, apre `.main-nav` a schermo intero.

## Hero (solo home) — `.hero-panel-image`
`.hero-copy-overlay` (eyebrow, h1, descrizione con linea decorativa) +
video (`.home-hero-image`) + "+" di scroll (`.hero-plus`). Testo alzato
a `top:34%` (era 50%, centrato) su richiesta dell'utente. **Nessuna
cornice**: il motivo a taglio d'angolo condiviso con gli altri pannelli
è stato rimosso su richiesta esplicita — `.hero-panel-image::before` e
`::after` sono riusati come sfumature nere (top e bottom,
`linear-gradient` verticale, altezza `clamp(120px,16vw,220px)` ciascuna)
invece della cornice, per un passaggio morbido tra header/contenuto
sottostante e il video.

**Video hero** (`home-hero-build.mp4`): mostra la scena di cancelleria
brandizzata Arrara mentre si assembla (scrivania vuota → nastri colorati
→ oggetti che appaiono uno a uno → composizione completa).

Versione attuale: sorgente nativo 4K fornito dall'utente
(`raw/video/VIDEO HOME.mp4`, 3840×2160, 8s), con testo IA illeggibile
sotto il logo (stesso problema del video intro) corretto sostituendo il
fotogramma finale con un'immagine pulita fornita dall'utente
(`raw/immagini/home-hero-final-frame.jpg`). Pipeline: trim a 6.3s
(punto in cui il movimento si esaurisce) → transizione `fadeblack`
(0.8s, non un dissolve diretto — nasconde il lieve disallineamento tra
video e immagine) → fermo immagine finale, con l'immagine ricalibrata
in scala (misurata via due punti di riferimento comuni: era ~14% più
zoomata del video) e i bordi riempiti con una copia sfocata della
stessa immagine invece di bande nere. Encode 1920×1080, `crf 14
-preset slow`, nessun audio, ~8.4MB.

- **Formato**: non più full-bleed. Ancorato in alto (subito sotto la
  nav, non centrato verticalmente), largo il 74% del pannello
  (`left:13%`), altezza automatica secondo il rapporto d'aspetto nativo
  16:9 (niente più stiramento). Dimensione decisa in tre passaggi
  successivi su richiesta dell'utente (50%→62%→74%). `mask-image`
  (gradiente lineare orizzontale) sui bordi sinistro/destro del video
  stesso, così si sfuma nel nero del pannello invece di un taglio netto
  — stessa idea delle sfumature top/bottom di `::before`/`::after` sopra,
  ma applicata al video anziché al pannello.
- **Timing di avvio**: `muted playsinline preload="auto"`, **senza**
  `autoplay` nel markup — parte via `script.js` (`startHeroVideo()`)
  solo **a intro home conclusa** (dentro `finishIntro`), così
  l'assemblaggio si vede per intero invece di essere già a metà quando
  l'intro sparisce; se l'intro non parte (già vista in sessione) il
  video parte comunque subito. Nessun `poster` (mostrerebbe la scena già
  completa, creando un salto quando il video poi riparte dalla scrivania
  vuota). **Senza** `loop` (gioca una volta, resta fermo sull'ultimo
  fotogramma).
- **Oscuramento e testo sincronizzati con la fine dell'animazione**: il
  video riproduce a piena luminosità (`filter:contrast/saturate`, niente
  `brightness` ridotta) finché non termina. All'evento `ended`,
  `script.js` (`revealHeroContent()`) aggiunge `.is-dimmed` al video
  (attiva `brightness(.5)`, con `transition:filter 1.1s ease`) e insieme
  fa comparire in dissolvenza (`opacity`, 1.1s) sia `.hero-copy-overlay`
  che `.hero-plus`. Rete di sicurezza: timeout a 11.5s dall'avvio nel
  caso `ended` non scattasse. `prefers-reduced-motion`: oscuramento e
  testo compaiono da subito, video portato all'ultimo fotogramma senza
  riprodurre.
- Il parallasse allo scroll (preesistente, basato sulla classe
  `.home-hero-image` non sul tag) continua a funzionare invariato.

## Link card (griglia navigazione home) — `.link-card`
5 card cliccabili verso le sezioni del sito. Numero, titolo, descrizione,
"+" che ruota su hover. Dimensioni e font ridotti su richiesta
dell'utente (`min-height` 230px, padding 26×22px, font num/h2/p
rispettivamente 15/18/13px) tramite regole `.link-card`-only dichiarate
dopo quelle condivise con `.feature-card` — quest'ultima resta alle
dimensioni originali (310px, 36×30px, 20/24/16px).

**Illustrazioni SVG a tema, non più foto placeholder**: le 5 card
condividevano tutte lo sfondo fotografico `home-hero.jpg` (stesso
placeholder generico, solo crop/overlay diversi) — sostituito su
richiesta esplicita dell'utente con uno sfondo scuro neutro
(`background-color:#0d0c0e` + leggerissimo gradiente, **nessun tint
rosso/fucsia permanente**) e un'illustrazione SVG `.card-illustration`
dedicata per ciascun argomento, in stile "wireframe" coerente con le
icone dell'intro (`stroke="currentColor"`, `stroke-width:1.4`, nessun
fill): 01 Progettazione → pennino che disegna una linea curva; 02
Produzione → rullo/pressa da stampa con foglio stampato; 03 Portfolio →
due cornici sovrapposte; 04 Azienda → sagoma di edificio; 05 Contatti →
busta. Posizionate `absolute` in basso a destra (`right/bottom:20px`,
`width:clamp(72px,10vw,116px)`), opacità `.4` a riposo, **fucsia e più
opaca (`.85`) solo in `:hover`** insieme al bagliore esterno/interno già
esistente su `.link-card:hover` — questa è la fonte dell'"alone rosso
solo quando selezionate" richiesto: prima il tint rosso era sempre
acceso nel gradiente di sfondo, ora l'unico rosso è il bagliore hover
(preesistente) più il colore dell'icona che passa a `var(--fuchsia)`
in hover.

Motivo della scelta SVG invece di foto reali: nessun tool di
generazione immagini fotorealistiche disponibile in sessione, e nessuna
foto reale specifica per "produzione/azienda/contatti" ancora fornita
dall'utente (vedi `improvement-plan.md` punto 2) — l'utente ha scelto
esplicitamente l'opzione illustrazioni vettoriali quando gliel'ho
proposta come alternativa. Se in futuro arrivano foto reali per queste
5 sezioni, sostituire `.card-illustration` con un `background-image`
come già fatto per Portfolio/CTA finale, non è un'esclusione permanente.

## Feature card (progetti in evidenza, home) — `.feature-card`
Simile a `.link-card` ma 3 elementi, dimensioni maggiori, usata per
mostrare progetti "in evidenza" (attualmente placeholder).

## Process / service / project card — `.process-card`, `.service`,
`.project-card`
Card più piccole e semplici, usate per: step del processo (home),
elenco servizi (Progettazione/Produzione/Azienda), categorie portfolio.
Corner-cut "grande" (34px) nonostante siano fisicamente più piccole delle
link-card — scelta voluta per un effetto proporzionalmente più marcato.

## Subhero (pagine interne) — `.subhero`
Intestazione di pagina: eyebrow ("01 / PROGETTAZIONE" ecc.), titolo
grande, sottotitolo. Sfondo fotografico scurito.

Le pagine Progettazione e Produzione usano immagini tematiche dedicate,
tramite `.subhero-progettazione` e `.subhero-produzione`, con lo stesso
gradiente scuro e senza cambiare struttura o animazioni. Portfolio
mantiene la propria eccezione chiara già documentata. Azienda e Contatti
continuano temporaneamente a usare il placeholder condiviso.

## Numeri / esperienza (home) — `.numbers-section`, `.stat-grid`
Sezione "05 / esperienza": titolo + paragrafo + link `.text-link` a
sinistra (`.numbers-copy`), griglia 2×2 di statistiche a destra
(`.stat-grid`). Rifatta su riferimento PDF fornito dall'utente (vedi
`visual-style.md`, "Evoluzione: font Averta + accento ciano"):
- Ogni cella (`.stat-grid div`) ha un bordo sottile individuale
  (`border:1px solid rgba(255,255,255,.22)`, margini negativi di `-.5px`
  per far collassare i bordi adiacenti in un'unica linea, come una vera
  griglia disegnata). Angolo tagliato (`clip-path`, 24px) **solo sulla
  prima cella** (`:first-child`), non su tutte — a differenza del motivo
  standard applicato uniformemente altrove.
- Numeri (`strong`): font titoli (Averta), peso 800, 54px, colore fucsia
  (prima erano bianchi su sfondo cella pieno).
- Il link `.text-link` di questa sezione ha la prima parola ("Conosci")
  in `<strong class="accent-cyan">` — nuovo accento ciano, non
  sostituisce il resto del link che resta bianco.

## CTA finale (home) — `.final-cta`
Sezione "06 / contatto", ultima prima del footer. Ristrutturata su
riferimento PDF fornito dall'utente per includere una **foto di sfondo
reale** (pianta/germoglio con overlay digitale a rete, fornita
dall'utente come immagine allegata in chat — salvata in
`raw/immagini/cta-finale-pianta.jpg` e ottimizzata in
`src/final-cta-bg.jpg`), sostituendo il solo gradiente rosso/fucsia/nero
usato in precedenza (gradiente mantenuto, ma solo come velo di
scurimento sopra la foto: `linear-gradient(180deg,...)` +
`url('final-cta-bg.jpg') center 63%/cover no-repeat`, layer multipli
nello stesso `background`).

Markup passato da un grid a 2 colonne (numero+titolo | testo+bottone) a
**flex verticale** con tre righe dirette figlie di `.final-cta`:
1. `.home-section-number` — eyebrow "06 / contatto".
2. `<h2 class="final-cta-heading">` — **due `<span>`** (non più un unico
   blocco con `<br>`), disposti con `display:flex;justify-content:
   space-between`: "Hai un progetto" a sinistra, "da far crescere?" a
   destra, con la foto della pianta visibile nello spazio centrale tra i
   due — replica il layout del riferimento PDF, dove il germoglio cresce
   visivamente "tra" le due metà del titolo.
3. `.final-cta-foot` — flex `space-between`: paragrafo (ciano,
   `max-width:480px`) a sinistra, `.cta-button` a destra.

Responsive: sotto i 1100px, `.final-cta-heading`/`.final-cta-foot`
tornano `flex-direction:column` (impilati, allineati a sinistra) — sotto
quella soglia non c'è spazio per il layout affiancato del riferimento,
che è pensato per schermi larghi.

**Posizione della foto**: `background-position` calibrato campionando
via script (PIL) le righe dell'immagine con più contenuto verde (foglie
del germoglio, banda 55-75% dell'altezza originale) per centrare la
foto sul soggetto invece di lasciare la scelta al caso — `center 63%`
mostra le foglie e un accenno di terra, coerente col riferimento.
Nessun pre-crop del file: l'immagine sorgente (2000×1458) resta intera
in `src/`, il posizionamento è solo CSS.

Il "?" di chiusura non è più in un proprio `<span>` colorato: nel
riferimento resta bianco come il resto del titolo (nessuna regola
`.final-cta h2 span{color:...}` esiste, a differenza delle altre
intestazioni del sito dove l'ultimo carattere è fucsia).

**Il footer `.home-footer` ora vive dentro `.final-cta`** (ultimo figlio
della sezione, non più un `<footer>` fratello separato subito dopo),
con `.final-cta>.home-footer{margin-top:auto}` per restare ancorato in
fondo al pannello — su richiesta dell'utente di far proseguire la foto
della pianta "fino in fondo, anche sotto il footer": essendo lo sfondo
un'unica immagine sul contenitore, portare il footer dentro il
contenitore è stato il modo più semplice per farlo appoggiare sulla
stessa immagine senza dover allineare due sfondi separati.

**Titolo allineato a sinistra** (non più `justify-content:space-between`
tra i due `<span>`, ora `flex-start`): su richiesta esplicita
dell'utente dopo aver visto la versione con "da far crescere?" spinto
sul bordo destro — le due metà del titolo ora stanno vicine a sinistra
(separate dal `gap`), la pianta non è più visivamente "in mezzo" alle
due metà come nel riferimento PDF, ma è quello che l'utente ha chiesto.

**Dimensioni testo calibrate sul PDF** (non gli stessi valori delle
altre intestazioni della home, che condividono `clamp(50px,5.2vw,92px)`
+ paragrafo fisso a 20px): misurato il cap-height dei caratteri nel
render del PDF di riferimento (pixel-perfect, il pannello renderizzato a
1600×1166 coincide esattamente con le dimensioni del PDF) e confrontato
con `ctx.measureText().actualBoundingBoxAscent` sui font realmente
caricati nel sito (Averta per il titolo, Raleway per il paragrafo, cap-
ratio diversi tra i due — non si può assumere lo stesso rapporto
cap-height/font-size per font diversi). Risultato:
`.final-cta-heading{font-size:clamp(36px,4.6vw,72px)}` (era
`clamp(32px,4vw,58px)`) e `.final-cta-foot p{font-size:clamp(18px,
1.6vw,25px);max-width:580px}` (era fisso a 20px, ereditato dalla regola
condivisa `.final-cta p`, con `max-width:480px`) — entrambi
sensibilmente più grandi per allinearsi al riferimento.

## Footer
Due varianti distinte:
- `.footer` — pagine interne: titolo CTA, indirizzo, contatti, bottone
  "Richiedi un preventivo".
- `.home-footer` — solo home: copyright, link sito, icone social.

## Form contatti — `.contact-form`
Campi: nome, email, telefono, servizio (select), messaggio. Submit
gestito lato client da `script.js` (mostra `.form-status`), **nessun
invio reale**.

## Mappa — `.map-block`
`iframe` Google Maps (filtro CSS per adattarlo alla palette scura) +
pin animato (`.map-pin`, pulsazione via `@keyframes pinGlow`/`pinPulse`).
