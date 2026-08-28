# Improvement plan — prossimi step consigliati

## Intervento SEO completo — 04/08/2026

Obiettivo approvato: collegare testi e immagini alle ricerche reali dei
potenziali clienti, mantenendo grafica, animazioni e struttura.

1. Definire una ricerca principale e un gruppo di ricerche correlate per
   ciascuna delle sei pagine. ✅
2. Inserire title, meta description, canonical, Open Graph e dati
   strutturati. ✅
3. Rendere più espliciti H1 e testi su progettazione grafica, stampa,
   packaging e localizzazione ad Abbiategrasso. ✅
4. Descrivere correttamente immagini informative e decorative senza
   alterare l'hero né le animazioni. ✅
5. Aggiungere `sitemap.xml` e `robots.txt`, quindi verificare link e
   markup. ✅

La mappa completa è documentata in `seo-strategy.md`.

> Da aggiornare **prima** di ogni intervento rilevante sul sito (regola
> operativa, vedi `CLAUDE.md`): qui si scrive il piano, poi si esegue.

## Stato attuale
Stile grafico **definitivo e consolidato** ✅. Il prossimo lavoro riguarda
contenuti, immagini e struttura — non più lo stile di base.

## Priorità consigliate (in ordine)

### 1. Portfolio — contenuto reale
È la pagina più scarna: solo 4 etichette di categoria senza progetti
veri. Serve capire da Gianluca quali lavori reali mostrare (foto,
descrizioni, eventuali categorie da aggiungere/togliere).

### 2. Immagini reali al posto dei placeholder
`home-hero.jpg` è riusata come sfondo di 3 feature-card e delle subhero
di Azienda e Contatti. Servono foto reali (materiali
stampati, macchinari, dettagli di lavorazione, sede) per differenziare
le sezioni e rendere il sito credibile come vetrina reale, non mockup.

✅ **Fatto per la subhero di Portfolio**: sostituita con
`portfolio-hero-pastel.jpg` (foto reale del progetto packaging "Pastel").

✅ **Fatto per Progettazione e Produzione**: durante l'intervento SEO
sono state utilizzate due immagini già presenti nei materiali del
progetto, esportate con nomi descrittivi e ottimizzate a 2000px:
`progettazione-grafica-studio-grafiche-arrara.jpg` e
`stampa-digitale-grande-formato-grafiche-arrara.jpg`.

✅ **Fatto diversamente per le 5 link-card**: invece di foto reali (non
disponibili, e nessun tool di generazione immagini in sessione),
sostituito il placeholder condiviso con illustrazioni SVG a tema
dedicate per ciascuna sezione — scelta esplicita dell'utente tra le
opzioni proposte. Vedi `components.md`. Se in futuro arrivano foto
reali per queste sezioni, si può tornare a un `background-image` senza
problemi.

Restano da sostituire: le 3 feature-card della home e le subhero di
Azienda e Contatti.

### 3. Testi definitivi
I testi attuali sono plausibili ma generici/segnaposto (specialmente in
Azienda, Produzione, Progettazione). Da rivedere con Gianluca per
allinearli a informazioni reali sull'azienda (team, macchinari
specifici, esempi concreti).

### 4. Form contatti funzionante
Attualmente solo simulato. Prima della pubblicazione serve collegarlo a
un vero sistema di invio (backend o servizio terzo).

### 5. Rifiniture di stile puntuali (facoltative, su richiesta)
Es. layout dei box di categoria — Gianluca ha menzionato di voler
caricare esempi di riferimento da riprodurre: discussione rimandata,
verificare se ha materiale da mostrare.

### 6. Pre-pubblicazione (quando i contenuti saranno pronti)
- ✅ Font serviti localmente, indipendenza da Google Fonts CDN (Averta +
  Raleway, vedi punto 9)
- ✅ Meta tag SEO unici su tutte le pagine
- ✅ Sitemap e robots.txt
- Favicon
- Scelta hosting/dominio

### 7. ✅ Intro animata sulla home (lampadina → logo)

Richiesta dall'utente: un breve "video di caricamento" prima della home,
come introduzione al sito. Idea del concept: dell'utente stesso ("una
piccola lampadina diventa luminosa e si trasforma nella forma del
logo"). Evoluta in più passaggi nella stessa sessione:

1. **Prima versione (nessun video ancora disponibile)**: animazione
   CSS/SVG — lampadina line-art disegnata a mano che si accende e
   dissolve nel logo. Sostituita completamente dal punto 2.
2. **Video reale fornito dall'utente** (generato con Adobe Firefly):
   integrato al posto della SVG. Scoperto che il video sorgente finiva
   con una propria ricostruzione IA del logo, imprecisa (anno sbagliato).
   Risolto tagliando il video prima di quel punto e componendolo con
   ffmpeg insieme a una scena del logo reale creata da zero (vedi
   `components.md` per la pipeline completa). ffmpeg/Homebrew installati
   sul Mac dell'utente appositamente (non presenti di default), con
   l'utente che ha eseguito i comandi con permessi di amministratore.
3. **Rifiniture su feedback dell'utente**: rimosso un alone/glow sfocato
   attorno al logo finale ("troppo sporco"); il video, che inizialmente
   aveva una dimensione fissa e mostrava un bordo rettangolare visibile
   sopra lo sfondo della pagina, è stato reso a schermo intero
   (`object-fit:cover`) eliminando il problema.

Caratteristiche finali (invariate rispetto al piano originale):
- Solo la prima volta per sessione (flag `sessionStorage`), non si
  ripete se si torna in home nella stessa visita.
- Non saltabile, dura ~7.4s.
- Solo su `index.html` (non sulle altre 5 pagine).
- Rispetta `prefers-reduced-motion` (salta l'intro, va dritto alla home).
- Blocca lo scroll (`body.intro-active`) finché è visibile.

Dettagli tecnici completi (markup, CSS, pipeline ffmpeg) in
`components.md`.

### 8. ✅ Eccezione di stile: Portfolio in versione chiara

Richiesta esplicita dell'utente, in deroga alla regola generale di
`visual-style.md` ("mai sfondo chiaro"): **solo** `portfolio.html`
(inclusi header e footer di quella pagina) passa a un layout chiaro —
zone bianche e grigio molto chiaro, mantenendo alcuni testi/accenti
rossi. Le altre 5 pagine restano invariate (stile scuro definitivo).

Piano:
- Scoping via `body.portfolio-page` (classe solo su `portfolio.html`) +
  nuova sezione dedicata in `style.css`, per non toccare le altre pagine
  che condividono lo stesso foglio di stile.
- **Logo**: il PNG del logo ha il testo "ARRARA GRAFICHE 1923" in bianco
  puro, invisibile su sfondo chiaro. Generata una variante
  `logo-arrara-dark.png` (stesso file, testo ricolorato in
  `#1a1a1a`, icona rossa invariata) via script Python/Pillow — i due
  colori originali (bianco e rosso `rgb(230,25,52)`) erano nettamente
  distinti, quindi la sostituzione è pulita. Usata solo nell'header di
  `portfolio.html`.
- **Palette chiara**: pagina `#f4f3ef` (grigio molto chiaro, caldo,
  intonato alle foto marmo/pastello), card/zone di contenuto `#ffffff`,
  testo principale `#1a1a1a`, testo secondario `rgba(26,26,26,.62)`.
  Rosso/fucsia (`--red`/`--fuchsia`) invariati, usati per: numeri
  eyebrow, sottolineatura titoli card, nav underline, pulsanti CTA
  (già su sfondo gradiente, non serve modificarli).
- **Motivo angolo tagliato**: la linea bianca diventa una linea scura
  (`rgba(20,20,20,.35)`), coerente com'è: crop mark nero su carta
  bianca è più realistico del bianco su nero.
- Componenti da ricolorare: `.site-frame`/`body` (sfondo), `.main-nav`
  (testo scuro, incl. pannello mobile), `.menu-toggle` (hamburger
  scuro), `.subhero-portfolio` (overlay chiaro sulla foto pastello,
  testo scuro), `.content-grid`/`.back` (testo scuro), `.project-card`
  (sfondo bianco, bordo scuro, piccolo accento rosso), `.footer`
  (testo scuro, bottone CTA invariato).

### 9. ✅ Evoluzione stile sitewide: nuovo font + accento ciano (da riferimento utente)

L'utente ha allegato un PDF (`~/Desktop/FONDO PAGINA.pdf`, letto come
immagine via `qlmanage` — `pdftoppm`/poppler non installato, l'utente ha
rifiutato l'installazione) con il mockup del fondo pagina della home
(sezioni "05/esperienza" e "06/contatto"), chiedendo di:
1. Aggiornare quelle due sezioni secondo il riferimento.
2. Estendere font/proporzioni/stile del riferimento **a tutto il sito**.
3. **Non toccare le animazioni già fatte** (intro lampadina→logo, video
   hero, transizione tra pagine) — restano identiche.

Analisi del riferimento (campionamento pixel diretto sull'immagine):
- **Font titoli**: bold, arrotondato, geometrico (terminali tondi,
  "a"/"o"/"s" molto rotondi) — nettamente diverso da Raleway
  (allora `--font-title`). Primo tentativo (Google Fonts "Baloo 2", il
  più vicino visivamente disponibile via CDN) **corretto dall'utente**:
  il font reale è **Averta**, non Baloo 2. Essendo un font commerciale,
  l'utente ha fornito di persona i file con licenza propria
  (`AvertaStd-Bold.ttf`, `AvertaStd-Black.ttf`) in `raw/font/`, caricati
  localmente in `src/fonts/` via `@font-face` — vedi `visual-style.md`
  e `site-architecture.md`.
- **Nuovo accento ciano**: `#58D1E8`, campionato in due punti diversi
  dell'immagine (link "CONOSCI" ed testo della CTA finale) con risultato
  praticamente identico (88,209,232 / 88,208,231) — è un colore
  brand intenzionale, non un artefatto. Aggiunto come nuova variabile
  `--cyan`, usato per testi/link secondari (non sostituisce
  rosso/fucsia, si affianca).
- **Rosa/fucsia**: campionato `#FD0076`, coerente con l'attuale
  `--fuchsia` (`#ee1b78`) — differenza minima da compressione PDF, non
  serve cambiare la variabile esistente.
- **Griglia statistiche** (100+/2/1/360°): stessa struttura 2×2 già
  presente (`.stat-grid`), ma con bordi sottili su ogni cella e angolo
  tagliato solo sulla cella in alto a sinistra (non su tutte) — numeri
  nel nuovo font, grandi, rosa.
- **CTA finale**: pannello con immagine di sfondo (pianta/natura con
  overlay digitale) che sfuma ai bordi nel pannello scuro — layout testo
  aggiornato (titolo diviso su due colonne, paragrafo in ciano, bottone
  rosa invariato). ✅ **Fatto**: l'utente ha in seguito fornito la foto
  (incollata direttamente in chat, recuperata dal transcript di sessione
  e salvata in `raw/immagini/cta-finale-pianta.jpg` /
  `src/final-cta-bg.jpg`) — vedi `components.md` e `log.md` per i
  dettagli di integrazione e calibrazione del `background-position`.

**Nota importante**: questo era in tensione con `visual-style.md`, che
documentava Raleway + solo rosso/fucsia come stile "definitivo e
bloccato". L'utente ha dato un'indicazione esplicita nuova (la regola
stessa di `visual-style.md` prevede questo caso), quindi si è proceduto.
✅ **`visual-style.md` è stato aggiornato di conseguenza** (palette e
tipografia ora riflettono Averta+Raleway+ciano come direzione attuale,
non più un'eccezione scollegata).

Scope escluso esplicitamente: `.site-intro*`, `.home-hero-image` e
tutte le regole/keyframes/JS delle animazioni (intro, hero,
page-transition) — invariate.
