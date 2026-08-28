# Log — cronologia delle operazioni

Ordine cronologico, più recente in fondo.

- **Setup iniziale**: caricati i file del sito già iniziato (6 pagine
  HTML, `style.css`, `script.js`, logo, immagini). Analizzato lo stato:
  buon punto di partenza, non un abbozzo.
- **Consolidamento CSS**: ripulito `style.css` da 5 blocchi di patch
  sovrapposte con `!important`, in un unico foglio coerente (~473
  righe). Confermata la direzione stilistica (nero/rosso/fucsia, Raleway
  maiuscolo, motivo angolo tagliato).
- **Conferma logo**: verificato che `logo-arrara.png` caricato dall'utente
  fosse identico (md5) a quello già in uso — nessuna modifica necessaria,
  poi ricopiato esplicitamente su richiesta.
- **Conferma immagine hero**: stesso pattern — `home-page-arrara-parallax.jpeg`
  era già l'immagine hero della home, confermato byte-per-byte.
- **Rimozione testo header**: tolto "GRAFICHE ARRARA" e poi anche
  "TIPOGRAFIA · LITOGRAFIA" accanto al logo, su richieste successive.
- **Hero full-bleed**: immagine hero della home resa a piena larghezza
  (edge-to-edge) tramite variabile CSS `--frame-pad-x`, mantenendo la
  cornice a taglio d'angolo (che essendo una pseudo-classe dell'hero si
  è automaticamente estesa con lui).
- **Hover — titolo fluttuante**: aggiunta animazione di bobbing verticale
  al titolo delle card al passaggio del mouse (`@keyframes titleFloat`).
- **Hover — alone interno rosso**: aggiunto `box-shadow: inset` alle
  card, oltre al bagliore esterno già presente.
- **Problema visualizzazione mobile**: l'utente non riusciva a vedere le
  anteprime HTML correttamente su telefono (Chrome riceveva i file via
  `content://` invece di `file://`, mostrando testo grezzo senza stile).
  Provate varie soluzioni (download+apertura manuale, `file:///` diretto)
  senza successo definitivo. **Soluzione adottata**: generare
  screenshot statici (immagini JPG) del sito via `wkhtmltoimage`, che si
  vedono in modo affidabile su qualsiasi dispositivo.
- **Bug alt-text**: risolto un caso in cui il testo alternativo
  descrittivo dell'immagine hero appariva sovraimpresso (quando
  l'immagine non si caricava, es. aprendo `index.html` senza gli asset
  a fianco). Svuotato l'`alt` dell'immagine hero.
- **Secondo logo in header**: aggiunta una seconda copia (più piccola)
  del logo accanto a quello principale, al posto del testo rimosso.
- **Cornice hero arretrata**: la cornice a taglio d'angolo dell'hero è
  stata scostata di 26px dal bordo dell'immagine (che resta a piena
  larghezza), invece di essere a filo pagina.
- **Struttura progetto**: creata organizzazione `raw/` (materiali
  grezzi: codice, immagini, font, testi estratti, screenshot),
  `src/` (sito in produzione), primo abbozzo di `wiki/` e `CLAUDE.md`.
- **Sistema wiki completo**: create tutte le pagine wiki previste
  (`index.md`, `project-overview.md`, `brand.md`, `visual-style.md`,
  `site-architecture.md`, `pages.md`, `components.md`,
  `animation-system.md`, `code-review.md`, `improvement-plan.md`,
  `log.md`) e aggiornato `CLAUDE.md` con le regole operative per le
  prossime sessioni.
- **Discussione rimandata**: l'utente ha proposto di caricare esempi di
  layout per i box di categoria da riprodurre graficamente — da
  riprendere quando avrà il materiale pronto.
- **Prima immagine reale al posto del placeholder**: caricata
  `raw/immagini/PASTEL.png` (foto di packaging/branding per il cliente
  "Pastel", pasticceria/caffetteria — box, macaron, tartellette su
  marmo). Convertita e ottimizzata in `src/portfolio-hero-pastel.jpg`
  (da PNG 3.4MB a JPG ~370KB, ridimensionata a 2000px). Aggiunta la
  classe `.subhero-portfolio` in `style.css` per usarla come sfondo
  della sola subhero di `portfolio.html`, al posto del placeholder
  condiviso `home-hero.jpg`. Primo passo della priorità #2 in
  `improvement-plan.md`: le altre pagine (`progettazione`, `produzione`,
  `azienda`, `contatti`) e le card della home restano ancora sul
  placeholder.
- **Overlay più chiaro sulla subhero Portfolio**: su richiesta
  dell'utente, il gradiente scuro sopra `portfolio-hero-pastel.jpg` è
  stato reso meno opaco (da `.35` a `.08` sul lato destro, da `.88` a
  `.42` al centro), per rendere l'immagine reale più leggibile mantenendo
  il testo a sinistra ancora ben contrastato.
- **Fix angolo tagliato — sistemico, su tutto il sito**: notato che il
  motivo "angolo tagliato" era solo una linea decorativa disegnata sopra
  lo sfondo (via `::before`/`::after` con mask "exclude"), non un vero
  ritaglio: sfondi/immagini restavano rettangolari e "sbordavano" nel
  triangolo tagliato in alto a sinistra (visibile soprattutto con foto,
  es. la subhero Portfolio). Corretto alla radice aggiungendo
  `clip-path:polygon(...)` (stesso poligono del bordo, 34px o 24px a
  seconda della scala) direttamente nelle regole condivise di
  `style.css`: quella dei pannelli grandi (`.subhero,.final-cta,
  .map-block,.process-card,.service,.project-card,.hero-panel-image`) e
  quella delle card piccole (`.link-card,.feature-card`). Rimosso il
  clip-path locale, ormai ridondante, da `.subhero-portfolio`. Verificato
  su home (hero, link-card, feature-card), Produzione (subhero) e
  Contatti (map-block): angolo sempre pulito, nessun elemento più
  "sbordante".
- **Bagliori hover molto più evidenti in tutto il sito**: su richiesta
  dell'utente, intensificati tutti i box-shadow/text-shadow che si
  attivano al passaggio del mouse in `style.css`: alone principale delle
  card (`.link-card`, `.feature-card`, `.process-card`, `.service`,
  `.project-card` — raddoppiato blur e opacità, `filter:brightness`
  1.05→1.14), sottolineatura del menu (`.main-nav a::after`, 1px→2px con
  doppio bagliore), simbolo "+" dell'hero e delle card, link testuali
  (`.text-link`, `.outline-link`), pulsanti CTA (`.cta-button`,
  `.form-button`). Verificato applicando temporaneamente la classe hover
  a una card home (rimossa subito dopo lo screenshot): alone rosso/fucsia
  molto più diffuso e visibile rispetto a prima.
- **Rimosso il doppio logo nell'header**: le 6 pagine avevano due `<img>`
  identici (`.brand-mark` + `.brand-mark-secondary`, entrambi
  `logo-arrara.png`) affiancati nel link `.brand`. Su richiesta
  dell'utente rimosso il secondo, mantenendo un solo logo in alto a
  sinistra con `alt="Grafiche Arrara"` (spostato dal secondo img, per
  mantenere l'accessibilità sulle pagine dove il link `.brand` non ha
  `aria-label`). Rimossa anche la regola CSS `.brand-mark-secondary`,
  ormai inutilizzata.
- **Bug cache del browser risolto alla radice**: l'utente ha segnalato
  che la subhero Portfolio mostrava ancora l'immagine vecchia dopo le
  modifiche — causa: il browser teneva in cache `style.css` (il server
  di sviluppo Python non manda header di cache), quindi le modifiche
  CSS non venivano viste finché non si forzava un refresh. Risolto in
  modo permanente aggiungendo `?v=1` ai link di `style.css`/`script.js`
  in tutte e 6 le pagine — vedi la convenzione descritta in
  `site-architecture.md` (da incrementare a ogni modifica rilevante di
  CSS/JS).
- **Fix bug "Progettazione" evidenziato in home**: il link
  "Progettazione" nel menu di `index.html` aveva `class="active"` per
  errore (probabilmente copiato da `progettazione.html`). Rimosso: in
  home nessuna voce del menu deve risultare evidenziata.
- **Nuova feature: intro animata sulla home (lampadina → logo)**.
  Concept dell'utente: su sfondo nero, una piccola lampadina si accende
  e si trasforma nel logo Arrara, come "video di caricamento" prima
  della home — l'utente non ha ancora un video reale pronto, quindi
  realizzata per ora un'animazione CSS/SVG equivalente (struttura
  pensata per essere sostituita da un `<video>` reale in futuro, vedi
  `improvement-plan.md` punto 7). Solo su `index.html`, solo la prima
  volta per sessione (`sessionStorage`), non saltabile, ~3s, rispetta
  `prefers-reduced-motion`. Dettagli tecnici completi in `components.md`.
  Verificato via test "al rallentatore" (animazioni temporaneamente
  rallentate 13x, solo per QA in sessione) che ogni fase renderizza
  correttamente, poi verificato il ciclo completo a velocità reale e la
  non-ripetizione alla seconda visita.
- **Scoperto un bug di cache specifico del pannello Browser di anteprima**
  (non del sito): `localhost:8000` veniva servito con contenuti vecchi
  anche dopo riavvio del server e nuova tab, mentre `curl` confermava che
  il server rispondeva correttamente. Soluzione: usare `127.0.0.1:8000`
  invece di `localhost:8000` nel pannello di anteprima per bypassare la
  cache. Non è un problema che riguarda i visitatori reali del sito.
- **Intro home — lampadina più realistica e durata estesa a ~7s**: su
  richiesta dell'utente. La lampadina non è più solo line-art: vetro con
  gradiente radiale (effetto lucido/riflesso), filamento a spirale
  (curve invece di zig-zag), base metallica con gradiente e più fili di
  vite, due "reofori" (fili) che collegano il filamento alla base.
  Aggiunta anche una fase di colore in due passaggi — il bagliore parte
  bianco/giallo caldo (come una vera lampadina a incandescenza) e solo
  durante la dissolvenza verso il logo vira al rosso/fucsia del brand,
  per una transizione motivata invece di un salto di colore brusco.
  Timeline estesa da ~2.2s a ~7s totali (accensione più lenta e con un
  lieve sfarfallio iniziale, hold più lungo, dissolvenza finale invariata
  nella durata ma spostata più avanti) — vedi i tempi esatti in
  `components.md`. `script.js` aggiornato di conseguenza (attesa prima
  della dissolvenza dell'overlay portata da 2.6s a 6.5s).
  Verificato con una tecnica di "scrub" preciso (Web Animations API:
  pausa le animazioni e imposta `currentTime` a un valore esatto in ms,
  bypassando l'attesa in tempo reale) su più istanti chiave: lampadina
  spenta, lampadina accesa (bianco caldo), dissolvenza a metà, logo
  finale — tutte le fasi corrette.
- **Chiarito un equivoco**: l'utente vedeva un tasto del menu
  "sottolineato" tornando in home nel pannello di anteprima condiviso —
  non era un bug del sito ma il cursore del mouse dell'automazione
  rimasto per errore sopra quel link (essendo lo stesso pannello
  condiviso, l'artefatto era visibile anche all'utente). Risolto
  spostando il cursore fuori dalla nav dopo i test; il codice non aveva
  bisogno di modifiche (già verificato pulito in una sessione precedente).
- **Bug scoperto e corretto: versioni `?v=` disallineate**. Notato che
  solo `index.html` era stato aggiornato a `?v=3` negli interventi
  precedenti, mentre le altre 5 pagine erano rimaste a `?v=1` nonostante
  `style.css` fosse cambiato più volte nel frattempo (rischio reale di
  cache-visitatore con contenuti vecchi). Riallineate tutte e 6 le
  pagine.
- **Eccezione di stile: Portfolio in versione chiara** (richiesta
  esplicita dell'utente, in deroga alla regola "mai sfondo chiaro" di
  `visual-style.md`). Chiarito con l'utente che l'eccezione riguarda
  **l'intera pagina**, header e footer inclusi (non solo l'area
  centrale) — vedi domanda di chiarimento e risposta in questa sessione.
  Realizzato con scoping `body.portfolio-page`, per non toccare le altre
  5 pagine che condividono lo stesso `style.css`:
  - Pagina grigio molto chiaro (`#f4f3ef`), card/zone di contenuto
    bianche (`#fff`) — l'alternanza crea le "zone bianche e grigio
    molto chiaro" richieste.
  - **Problema scoperto e risolto**: il logo (`logo-arrara.png`) ha il
    testo "ARRARA GRAFICHE 1923" in bianco puro *dentro il file
    immagine* — invisibile su sfondo chiaro. Generata una variante
    `logo-arrara-dark.png` via script Python/Pillow: i pixel bianchi
    (color puro, distinto dal rosso dell'icona) ricolorati in `#1a1a1a`,
    icona rossa lasciata invariata. Usata solo nell'header di
    `portfolio.html`.
  - Testi principali ricoloriti in scuro (`#1a1a1a` / grigio scuro),
    mantenendo rosso/fucsia dove già presenti (sottolineatura nav,
    pulsanti CTA) e aggiungendo un piccolo accento rosso nuovo (linea
    sotto il titolo di ogni card portfolio) per rispettare la richiesta
    di lasciare "alcuni testi rossi".
  - Motivo "angolo tagliato": linea da bianca a scura
    (`rgba(20,20,20,.35)`) — più autentico come richiamo alle vere
    crocette di stampa (nere su carta bianca) rispetto al bianco su nero
    usato nel resto del sito.
  - Hover delle card ridisegnato per lo sfondo chiaro (ombra leggera +
    bordo rosso sottile, invece dell'alone interno pensato per sfondi
    scuri).
  - Verificato su desktop e mobile (incl. menu hamburger a schermo
    intero, anch'esso ricolorato) tramite screenshot e controlli diretti
    di `getComputedStyle` (più affidabili in questa sessione, lo
    screenshot del pannello di anteprima ha avuto alcuni scatti/blocchi
    temporanei non legati al codice).
- **Video reale per l'intro home, al posto della lampadina disegnata**.
  L'utente ha fornito un video generato con Adobe Firefly (lampadina che
  si accende di rosso, 8s, 1920×1080). Installati **Homebrew e ffmpeg**
  sul Mac dell'utente (non presenti di default) — l'utente ha eseguito
  di persona i comandi che richiedevano la password di amministratore,
  guidato passo passo.
  - **Problema scoperto**: il video sorgente finiva con una propria
    ricostruzione IA del logo, con l'anno sbagliato ("1933" invece di
    "1923") e uno stile diverso dal logo reale — usarlo così com'è
    avrebbe mostrato un logo scorretto in home.
  - **Soluzione**: tagliato il video ai primi 4.2s (solo la lampadina,
    verificato il punto di taglio frame per frame), poi composto con
    ffmpeg (`filter xfade`, transizione "fade" 0.8s) insieme a una scena
    del logo reale generata da zero con Python/Pillow (logo vero,
    `logo-arrara.png`, su sfondo quasi nero). Video finale ~7.4s,
    qualità alta (crf 15, ~2.5 Mbps, in linea con l'originale).
  - Rimossa la vecchia animazione CSS/SVG della lampadina (bulb line-art)
    e il crossfade separato verso il logo: ora tutto è dentro l'unico
    file video. `script.js` aggiornato di conseguenza (attesa portata a
    7.5s). File sorgente originale spostato in
    `raw/video/intro-lampadina-firefly.mp4` (materiale grezzo, non
    modificabile), il video finale composito vive in
    `src/intro-completo.mp4`.
  - **Due correzioni su feedback dell'utente dopo la prima resa**:
    (1) rimosso un alone/glow sfocato attorno al logo finale nella scena
    composita — l'utente lo trovava "sporco", ora il logo appare pulito
    su sfondo quasi nero; (2) il video aveva una dimensione fissa
    centrata e si vedeva il bordo rettangolare sopra lo sfondo della
    pagina — risolto rendendolo a schermo intero
    (`object-fit:cover`, nessun contenitore di dimensione fissa).
  - Verificato con `ffmpeg -ss <t> -frames:v 1` per estrarre e ispezionare
    fotogrammi precisi in ogni fase (lampadina, transizione, logo finale)
    e via browser con scrubbing diretto (`video.currentTime`).
- **Ulteriori rifiniture dell'intro su una serie di feedback ravvicinati
  dell'utente**, nella stessa sessione:
  1. **"più piccola e discreta" + barra di caricamento**: il video è
     tornato a una dimensione piccola e discreta (non più a schermo
     intero) con una barra di avanzamento sottile sotto, che si riempie
     nella stessa durata del video.
  2. **"non far vedere il riquadro"**: anche da piccolo, il video
     mostrava un bordo rettangolare percepibile sopra lo sfondo della
     pagina. Prima corretto con un `mask-image` CSS (radiale), poi
     rifinito ulteriormente (raggio/sfumatura insufficienti lasciavano
     intravedere un angolo arrotondato) fino a una sfumatura molto
     anticipata e ampia che elimina ogni bordo percepibile.
  3. **"barra più dinamica"**: aggiunto un riflesso bianco che scorre
     dentro la parte riempita della barra e un bagliore che pulsa, oltre
     al semplice riempimento lineare.
  4. **"effetto stampa più realistico"**: sostituita la dissolvenza
     semplice tra lampadina e logo con `xfade=transition=hrwind` (un
     effetto "vento" orizzontale con striature), più organico di un wipe
     geometrico netto.
  5. **Bug scoperto durante queste rifiniture**: applicando una
     vignettatura incisa nel video (per rendere i bordi affidabilmente
     neri, non dipendendo solo dal CSS), un primo tentativo con formato
     `rgb24` nel filtro `blend` di ffmpeg ha colorato la lampadina di
     **verde** invece che rossa. Causa: `blend=multiply` con `rgb24`
     (formato packed) gestisce male i piani colore; risolto usando
     `gbrp` (RGB planare), che dà il risultato cromaticamente corretto.
  6. Aggiunto anche `-movflags +faststart` in fase di encode, per un
     corretto streaming/seek del video via browser (mancava nelle
     versioni precedenti).
- **Aggiunta sequenza di icone sotto la barra di caricamento**: su
  richiesta dell'utente, 4 piccole icone SVG bianche a tema
  progettazione/stampa (matita, layout, stampante, goccia d'inchiostro)
  compaiono una alla volta, in sequenza, con un rapido fade-in/out
  ciascuna, durante la fase finale dell'intro (quando il logo si
  assesta). Tratto reso più sottile (`stroke-width` da 1.6 a 1.1) su
  ulteriore richiesta, per coerenza con lo stile "wireframe" sottile già
  usato altrove nel sito (numeri di sezione, eyebrow).
- **Logo finale ingrandito del 25%**: rigenerata la scena del logo
  (Python/Pillow, `logo_w` da 620px a 775px su tela 1920×1080) e
  ricomposto il video con la stessa pipeline (vignetta `gbrp` +
  `xfade=hrwind` + `faststart`).
- **Aggiunta una piccola transizione tra pagine**, su richiesta
  dell'utente, presente su tutte e 6 le pagine: dissolvenza a nero in
  uscita (al click su un link interno, che ritarda la navigazione di
  320ms) e in entrata (al caricamento di ogni pagina). Esclusi
  esplicitamente da questo comportamento: le ancore nella stessa pagina
  (es. "Vai alle sezioni" in home), i link esterni, i link
  `target="_blank"` e i click con tasti modificatori (Cmd/Ctrl aprono in
  nuova scheda normalmente). Rispetta `prefers-reduced-motion`
  (nessun ritardo, overlay istantaneo). Verificato: click su un link di
  navigazione → dissolvenza → pagina nuova → overlay tornato trasparente;
  click su un'ancora `#sezioni` → nessuna dissolvenza, solo scroll.
- **Nuova immagine hero della home**: sostituita `home-page-arrara-parallax.jpeg`
  con `home-hero-stationery.jpg`, un mockup fotografico (generato con
  Gemini) di cancelleria/materiali brandizzati Arrara — biglietti da
  visita, notebook, matite, gomma, carta intestata — su sfondo grigio
  scuro con nastri rossi/fucsia decorativi. File fornito dall'utente in
  `~/Downloads`, ottimizzato (ridimensionato a 2000px, compresso) e
  copiato in `src/`. Il vecchio file resta su disco ma non è più
  referenziato da nessuna pagina.
  Su richiesta dell'utente ("alza i testi"), il blocco di testo
  sull'hero (`.hero-copy-overlay`) è stato spostato più in alto:
  `top` da 50% a 34% (36% nei breakpoint mobile), per adattarsi meglio
  alla nuova immagine.
- **Hero della home animato con un video**: l'utente ha fornito un
  secondo file (`~/Downloads/vorrei_che_questa_immagine_fos.mp4`, 1280×720,
  10s) che mostra la stessa scena di cancelleria brandizzata mentre si
  "assembla" — scrivania vuota, nastri rosso/fucsia che scorrono, poi
  tutti gli oggetti (notebook, biglietti, matite, gomme, graffette)
  che appaiono in sequenza fino alla composizione completa (la stessa
  dell'immagine statica appena impostata). Copiato in `src/` come
  `home-hero-build.mp4` (ri-codificato senza audio, `faststart` per lo
  streaming). L'`<img>` dell'hero è diventato un `<video autoplay muted
  playsinline poster="home-hero-stationery.jpg">`: gioca una sola volta
  al caricamento (niente `loop` — un riavvio brusco da "scrivania vuota"
  sarebbe stridente) e resta fermo sull'ultimo fotogramma (la
  composizione completa) finché non si ricarica la pagina. Il filtro
  scurente e il parallasse allo scroll già esistenti (`script.js`,
  `.home-hero-image`) si applicano invariati, essendo basati sulla
  classe e non sul tag. Aggiunta gestione `prefers-reduced-motion`:
  toglie `autoplay` e porta il video direttamente all'ultimo fotogramma
  (niente riproduzione, ma comunque la scena completa, non quella
  vuota).
- **Due rifiniture sull'hero video, su richiesta dell'utente**:
  1. **Timing**: il video hero partiva subito all'autoplay, in parallelo
     all'intro — quando l'intro finiva, l'animazione di assemblaggio era
     già a metà o conclusa e l'effetto si perdeva. Tolto `autoplay` dal
     tag e sostituito con un avvio esplicito via `script.js`
     (`startHeroVideo()`), chiamato solo a intro conclusa
     (dentro `finishIntro`) — o subito, se l'intro non parte affatto
     (già vista in sessione, o `prefers-reduced-motion`). Rimosso anche
     il `poster` iniziale (mostrava la scena già completa, creando un
     salto visivo prima che il video ripartisse dalla scrivania vuota).
  2. **Qualità**: ricodificato `home-hero-build.mp4` con `crf` più basso
     (da 18 a 14, più alta qualità, bitrate ~3.25 Mbps invece di ~2.2).
  3. **Cornice ed effetto in alto**: rimossa la cornice a taglio d'angolo
     dell'hero (`.hero-panel-image::before/::after` — su richiesta
     esplicita, "elimina cornice della hero"). Lo spazio liberato è
     stato riusato per una sfumatura nera in alto (`linear-gradient`
     dall'alto, ~90% opaco a trasparente, altezza responsive
     `clamp(120px,16vw,220px)`), per un passaggio morbido tra l'header e
     il video sottostante invece di un taglio netto.
- **Watermark Gemini rimosso dal video hero**: il video fornito
  dall'utente aveva un piccolo watermark a forma di stella/scintilla
  (tipico dei contenuti generati con Gemini) in basso a destra
  (~1160,595 su un fotogramma 1280×720). Rimosso alla fonte con il
  filtro `delogo` di ffmpeg (`delogo=x=1115:y=550:w=95:h=95`) prima
  della codifica finale — verificato via estrazione di fotogrammi che
  non lascia artefatti visibili.
- **Sincronizzato l'oscuramento e il testo con la fine dell'animazione
  hero** (richiesta esplicita: "non fosse ancora scuro... l'alone scuro
  comparisse solo quando interviene il testo... a fine animazione").
  Prima il filtro scurente (`brightness(.5)`) era applicato sempre, fin
  dal primo fotogramma, e il testo (`.hero-copy-overlay`, `.hero-plus`)
  era sempre visibile. Ora:
  - Il video riproduce l'assemblaggio a piena luminosità (solo
    `contrast`/`saturate`, niente `brightness` ridotta).
  - Quando il video termina (evento `ended`, gestito in `script.js`),
    si attiva la classe `.is-dimmed` sul video (`brightness(.5)`, con
    `transition:filter 1.1s ease` per una dissolvenza morbida) e insieme
    compaiono in dissolvenza (`opacity`, 1.1s) sia il testo che l'icona
    "+" di scroll.
  - Rete di sicurezza: se l'evento `ended` non dovesse scattare per
    qualche motivo, un timeout a 11.5s dall'avvio forza comunque la
    comparsa di testo e oscuramento.
  - `prefers-reduced-motion`: oscuramento e testo compaiono da subito,
    nessuna attesa.
- **Rifinitura di formato dell'hero, in più passaggi successivi**
  (richieste esplicite dell'utente): il video, che prima riempiva tutto
  il pannello, è stato ridotto e riposizionato: ancorato in alto (subito
  sotto la barra di navigazione, non più centrato verticalmente), con
  altezza automatica in base al suo rapporto d'aspetto nativo (16:9)
  invece di essere stirato. Aggiunta una maschera CSS (`mask-image`,
  gradiente lineare) sui bordi del video per farlo sfumare nel nero di
  sfondo del pannello invece di un taglio netto. Dimensione finale
  (dopo due richieste di ingrandimento successive): larghezza **74%**
  del pannello (partito dal 50%, poi 62%, infine 74%), centrato
  (`left:13%`). Sfumatura nera aggiunta su **tutti e 4 i lati**:
  in alto e in basso tramite `.hero-panel-image::before`/`::after`
  (`linear-gradient` verticale, stessa tecnica già usata per il
  passaggio header→hero), a sinistra e destra tramite la `mask-image`
  sul video stesso.
- **Bug scoperto e corretto: sfumatura in basso invisibile**. L'utente
  ha segnalato che la sfumatura inferiore non si vedeva. Causa: la
  regola condivisa per `::after` (usata altrove per la lineetta
  diagonale del motivo "angolo tagliato") imposta `width:49px` e
  `transform:translateY(34px) rotate(-45deg)` — non avendole annullate
  nell'override per `.hero-panel-image::after`, la sfumatura veniva
  renderizzata come una fetta di 49px ruotata e fuori posizione invece
  che come barra a piena larghezza. Risolto aggiungendo `width:auto` e
  `transform:none` espliciti nell'override.
- **Animazione hero raddoppiata di velocità**: `heroVideo.playbackRate = 2`
  impostato in `script.js` prima di avviare la riproduzione (il video da
  10s ora si vede in ~5s). L'evento `ended` scatta comunque
  correttamente a velocità aumentata; la rete di sicurezza è stata
  accorciata di conseguenza (da 11.5s a 6.5s dall'avvio).
- **Bug scoperto e corretto: fotogramma fermo visibile all'avvio
  dell'hero**. L'utente segnalava di vedere "un'immagine statica"
  invece del video all'inizio. Causa: `startHeroVideo()` veniva chiamato
  dentro `finishIntro`, cioè **dopo** che la dissolvenza dell'intro
  (`.is-done`, transizione di opacità ~0.55s) fosse completamente
  terminata — ma durante quei ~550ms l'overlay diventa progressivamente
  trasparente, rendendo visibile l'hero sottostante, il cui video era
  ancora fermo sul primo fotogramma (la scrivania vuota) perché non
  ancora avviato. Risolto spostando la chiamata a `startHeroVideo()` nel
  punto in cui si aggiunge `.is-done` (inizio della dissolvenza), non
  più dentro `finishIntro` (fine dissolvenza) — così il video è già in
  movimento nel momento in cui l'intro comincia a diventare trasparente.
- **Serie di rifiniture rapide su richiesta dell'utente**:
  - **Intro ingrandita del 25%**: video (`clamp(150-260px)` →
    `clamp(188-325px)`), barra di caricamento (`clamp(120-190px)` →
    `clamp(150-238px)`) e icone (26px → 33px) del widget di caricamento
    iniziale, tutti scalati proporzionalmente.
  - **L'hero non riparte più tornando in home**: solo l'intro
    (lampadina→logo) aveva un flag di sessione; il video hero
    (assemblaggio cancelleria) ripartiva da capo ogni volta che si
    tornava sulla home da un'altra pagina. Aggiunto un secondo flag
    `sessionStorage.arraraHeroPlayed`: se già impostato, il video salta
    direttamente all'ultimo fotogramma (già scuro, testo già visibile),
    senza rigiocare l'animazione — stesso meccanismo già usato per
    `prefers-reduced-motion`.
  - **Bug scoperto e corretto: fascia nera vuota sotto l'hero**. Dopo
    aver rimpicciolito e riposizionato il video (ancorato in alto, 74%
    di larghezza), il pannello (`.hero-panel-image`) manteneva ancora il
    vecchio `min-height:clamp(520px,62vw,880px)` — dimensionato per il
    vecchio video a schermo intero. Con tutti i figli del pannello
    (video, testo, "+") posizionati `absolute` (fuori dal flusso), il
    pannello non aveva più nulla che ne determinasse l'altezza
    naturalmente, quindi restava alto quanto il vecchio `min-height`,
    lasciando una fascia nera vuota tra il fondo del video (più corto) e
    la sezione successiva. Risolto riducendo il `min-height` a
    `clamp(320px,47vw,560px)`, proporzionato alla nuova altezza reale del
    video (74% larghezza, rapporto 16:9). Rimossi anche due
    `min-height` residui nel breakpoint mobile, ormai incoerenti con le
    nuove dimensioni basate sul rapporto d'aspetto.
  - **Zoom lento sull'hero a fine animazione**: quando il video termina
    e compaiono oscuramento/testo (`revealHeroContent`), parte anche uno
    zoom lento e continuo (`startHeroZoom`, 9s, easing quadratico,
    scala da 1.018 a 1.09) per dare un leggero movimento sotto ai testi
    invece di un fotogramma completamente fermo. Implementato con una
    variabile CSS dedicata (`--hero-zoom`, usata nel `transform` insieme
    a `--hero-parallax`) aggiornata via `requestAnimationFrame` in JS,
    per non entrare in conflitto con la transizione veloce (`.08s`)
    già usata per il parallasse allo scroll. Disattivato se
    `prefers-reduced-motion`.
  - **Le 5 card di navigazione sotto l'hero rimpicciolite**: su
    richiesta esplicita, ridotte dimensione (`min-height` 310px→230px,
    padding 36×30px→26×22px) e font (numero 20px→15px, titolo
    24px→18px, testo 16px→13px) delle 5 `.link-card` (Progettazione,
    Produzione, Portfolio, Azienda, Contatti). Le `.feature-card`
    ("Progetti in evidenza", sezione diversa) restano invariate: le
    regole condivise sono state sovrascritte con selettori dedicati a
    `.link-card` da soli, per non toccare l'altro componente.
- **Evoluzione font Averta + accento ciano, dal fondo pagina alla home
  intera** (richiesta esplicita dell'utente, con allegato
  `~/Desktop/FONDO PAGINA.pdf`): vedi `visual-style.md` per la direzione
  aggiornata e `components.md` per i dettagli tecnici di `.stat-grid` e
  `.final-cta`. Cronologia del intervento:
  - **Lettura del PDF senza poppler**: `pdftoppm` non installato,
    l'utente non ha approvato l'installazione di Homebrew/poppler in
    quel momento. Risolto con `qlmanage -t -s 1600 -o . "FONDO PAGINA.pdf"`
    (Quick Look da riga di comando, nessuna installazione necessaria) per
    ottenere un PNG del PDF da analizzare.
  - **Font sbagliato al primo tentativo**: dall'immagine è stato scelto
    "Baloo 2" (Google Fonts) come il font visivamente più vicino
    disponibile via CDN. L'utente ha corretto: i font reali usati nel
    riferimento sono **Averta e Raleway**. Rimosso Baloo 2, e poiché
    Averta è un font commerciale non scaricabile legalmente da fonti
    arbitrarie, chiesto esplicitamente all'utente se avesse i file con
    licenza propria — l'utente li ha forniti in `raw/font/`
    (`AvertaStd-Bold.ttf`, `AvertaStd-Black.ttf`) insieme ai file Raleway
    (`Raleway-VariableFont_wght.ttf`, `Raleway-Italic-VariableFont_wght.ttf`).
    Copiati in una nuova cartella `src/fonts/` e caricati via 4 regole
    `@font-face` locali, rimuovendo l'`@import` Google Fonts — completa
    anche un punto già segnato in `improvement-plan.md` (font locale,
    indipendenza dal CDN).
  - **Colore ciano campionato dal PDF**: pixel-sampling diretto
    sull'immagine (due punti distinti, link "CONOSCI" e testo della CTA
    finale) → `#58D1E8` in entrambi i casi, aggiunto come nuova variabile
    `--cyan` (si affianca a rosso/fucsia, non li sostituisce).
  - **`.stat-grid` ridisegnata**: celle con bordo individuale (non più
    sfondo pieno), angolo tagliato solo sulla prima cella, numeri in
    Averta/fucsia. Testi della sezione "05/esperienza" riscritti per
    aderire al riferimento (titolo, paragrafo, didascalie delle 4
    statistiche).
  - **`.final-cta` ristrutturata**: dal grid a 2 colonne a un flex
    verticale a 3 righe (eyebrow / titolo diviso in due `<span>`
    affiancati / paragrafo+bottone), per replicare il layout del
    riferimento. In questo primo passaggio la foto di sfondo prevista dal
    riferimento (pianta/natura con overlay digitale) **non era
    disponibile** — nessun file fornito — quindi si è proceduto solo col
    gradiente esistente come sfondo, annotando il gap in
    `improvement-plan.md`.
  - **Foto della CTA finale ricevuta e integrata in un secondo momento**:
    l'utente ha incollato l'immagine mancante direttamente in chat (non
    come file allegato via percorso). Nessun tool disponibile estrae
    direttamente un'immagine incollata in chat su disco; recuperata
    leggendo il byte-per-byte dal transcript di sessione (`.jsonl`, campo
    `attachment.prompt[].source.data`, base64) e decodificata su disco —
    salvata come materiale originale in
    `raw/immagini/cta-finale-pianta.jpg`, poi copiata in
    `src/final-cta-bg.jpg` (nessun ridimensionamento necessario, già
    ~176KB a 2000px). Aggiunta come layer di `background` su `.final-cta`
    sotto il velo di scurimento esistente. `background-position`
    calibrato campionando via script (PIL) le righe con più verde
    (foglie del germoglio) per centrare la foto sul soggetto (`center 63%`)
    invece di lasciare la posizione a caso. Verificato via screenshot a
    tre larghezze (375px mobile, 800px tablet, 1600px desktop): il
    layout a due colonne del titolo con la pianta visibile nel mezzo
    funziona correttamente su desktop, impilato in colonna sotto i
    1100px.
  - Versione di cache-busting incrementata più volte nel corso di questo
    intervento (arrivata a `?v=27`), ogni volta su tutte e 6 le pagine.
  - **Scope escluso esplicitamente, su richiesta dell'utente**: nessuna
    modifica alle animazioni esistenti (intro lampadina→logo, video hero,
    transizione tra pagine) — restano identiche a prima di questo
    intervento.
  - **Rifiniture successive sul trattamento immagine di `.final-cta`**,
    su una serie di feedback ravvicinati dell'utente: "parta dal basso e
    sia fuori dalla cornice, adattata a tutta larghezza" → rimossa la
    cornice/angolo tagliato per questa sezione, resa a piena larghezza
    (stessa tecnica `--frame-pad-x` già usata per l'hero), immagine
    ancorata in basso. Poi "non tagliarla, né sopra né sotto" →
    passata da `background-size:cover` (che ritagliava) a
    `aspect-ratio:2000/1458` (identico rapporto del file sorgente) +
    `background-size:contain`, cosicché l'immagine sia sempre mostrata
    per intero, mai ritagliata, a costo di apparire più piccola nei
    layout dove il testo impilato (mobile) richiede più altezza di
    quanta ne dia il rapporto d'aspetto della foto.
  - **Tentativo intermedio poi annullato**: ricevuto un secondo PDF più
    grande (`~/Documents/FONDO PAGINA/FONDO PAGINA.pdf`, 59 pagine,
    letto via `qlmanage` — poppler non installato, disponibile solo la
    pagina 1) con "fai il testo come da pdf con font e disposizione
    identica". La pagina 1 del nuovo PDF mostra la cornice/angolo
    tagliato ancora presente con la pianta che sconfina solo sopra il
    bordo: provata una versione con bordo ripristinato + layer immagine
    separato che sconfina solo in alto. **Annullata subito su richiesta
    esplicita dell'utente** ("mantieni impostazione dell'immagine come
    detto prima") — il trattamento immagine resta quello del punto
    precedente (piena larghezza, nessuna cornice, mai ritagliata); il
    PDF va usato solo per verificare testo/font/dimensioni, non il
    layout dell'immagine.
  - **Dimensioni testo di `.final-cta` calibrate sul PDF**: misurato il
    cap-height dei caratteri nel render del PDF (pannello 1600×1166,
    combacia esattamente con le dimensioni renderizzate dal sito a
    quella larghezza) e confrontato con le metriche reali dei font
    caricati (`canvas.measureText`, cap-ratio diverso tra Averta e
    Raleway). Risultato: titolo aumentato da `clamp(32px,4vw,58px)` a
    `clamp(36px,4.6vw,72px)`, paragrafo da 20px fisso a
    `clamp(18px,1.6vw,25px)` con `max-width` aumentato da 480px a 580px
    per mantenere un a-capo simile a quello del riferimento alla
    dimensione più grande.
- **Verifica sitewide del nuovo font + bug di contrasto trovato e
  corretto in Portfolio**: controllate tutte e 6 le pagine (font
  caricati via `document.fonts`, screenshot) dopo il lavoro sopra.
  Trovato un problema **preesistente** (non introdotto in questa
  sessione, mai coperto dall'eccezione "Portfolio chiara" originale):
  il bottone `.footer .cta` ("Richiedi un preventivo ↗"), condiviso
  dalle 5 pagine interne, ha `color:#fff` fisso — corretto per sfondo
  scuro, ma su `portfolio.html` (sfondo quasi bianco `#f4f3ef`) risultava
  testo bianco su bianco, illeggibile. Corretto con un override mirato
  `.portfolio-page .footer .cta{color:#1a1a1a}`, coerente con gli altri
  colori scuri già usati nel footer di quella pagina. Versione
  cache-busting portata a `?v=28`.

- **SEO completo del sito — 04/08/2026**: definita una mappa delle
  ricerche per le sei pagine (`wiki/seo-strategy.md`) e riscritti i
  passaggi testuali necessari in modo naturale, mantenendo titoli
  creativi, struttura, palette e animazioni. Inseriti title e meta
  description unici, canonical, robots, Open Graph, Twitter Card e dati
  strutturati (`LocalBusiness`/`WebSite` in Home; WebPage/CollectionPage/
  AboutPage/ContactPage e breadcrumb nelle pagine interne). Aggiunti
  `sitemap.xml` e `robots.txt`. Due immagini già presenti nei materiali
  sono state copiate e ottimizzate a 2000px con nomi descrittivi per le
  subhero di Progettazione e Produzione; Portfolio mantiene l'immagine
  Pastel e l'hero Home mantiene il trattamento decorativo e le regole alt
  già deliberate. Aggiunti telefono, email e orari nella pagina
  Contatti. Corretto anche il testo della statistica "2" in Home in
  "anime integrate: progettazione e produzione". Cache-busting portato
  a `?v=41`. Verificati: un solo H1 per pagina, titoli/descrizioni unici,
  JSON-LD valido, riferimenti locali esistenti e sei URL in sitemap.
- **Video hero sostituito con un nuovo render 4K + fix testo IA**:
  l'utente ha fornito un secondo tentativo di video (Firefly, stesso
  concept, generato usando l'immagine corretta come riferimento —
  archiviato in `raw/video/home-hero-build-source-v2.mp4`, 1920×1080
  nativo). Stesso problema di testo IA illeggibile sotto il logo,
  risolto con la stessa tecnica: trim al punto di assestamento del
  movimento (~6.4s), transizione `fadeblack` (0.8s) verso il fotogramma
  finale corretto (`raw/immagini/home-hero-final-frame.jpg`), scala
  dell'immagine ricalibrata sui due render (diversi tra loro) via
  confronto di punti di riferimento, bordi riempiti con sfondo sfocato
  invece di bande nere. Consegnato stavolta a **3840×2160 nativo** (non
  1080p) su richiesta esplicita dell'utente — upscaling per
  interpolazione dal sorgente 1920×1080, ~18.7MB. Cache-busting `?v=43`.
- **Bug scoperto e corretto: doppio bagliore rosso nell'intro**.
  L'utente ha notato una sfumatura rossa "poco coerente con lo sfondo"
  nel video lampadina→logo. Causa: `.site-intro` aveva un
  `radial-gradient` rosso ambientale su tutto lo schermo (residuo della
  vecchia animazione CSS/SVG pre-video-reale, mai ripulito) **in più**
  rispetto al bagliore già naturale della lampadina incorporato nel
  video stesso — i due non coincidevano (uno stretto e naturale, l'altro
  ampio e uniforme), creando un doppio alone. Rimosso il
  radial-gradient CSS, lasciato solo `#020202` piatto: ora l'unico
  bagliore è quello naturale del video. Cache-busting `?v=44`.
