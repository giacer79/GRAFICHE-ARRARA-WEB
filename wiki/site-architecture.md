# Site architecture

## Stack
HTML + CSS + JS puro. Nessun framework, nessun bundler, nessuna
dipendenza npm. Si apre direttamente in browser da `src/`.

## Struttura dei file (`src/`)
```
src/
├── index.html            (Home)
├── progettazione.html
├── produzione.html
├── portfolio.html
├── azienda.html
├── contatti.html
├── style.css              (unico foglio di stile, condiviso da tutte le pagine)
├── script.js               (menu mobile, parallax hero, submit form simulato)
├── sitemap.xml             (le 6 URL canoniche del sito)
├── robots.txt              (indicizzazione consentita + posizione sitemap)
├── fonts/                  (Averta Bold/Black + Raleway variabile, @font-face locali)
├── logo-arrara.png
├── logo-arrara-dark.png    (variante testo scuro, solo per Portfolio chiara)
├── home-hero.jpg            (immagine placeholder, riusata come sfondo di più card)
├── home-page-arrara-parallax.jpeg   (vecchia immagine hero, non più usata — rimasta su disco)
├── home-hero-stationery.jpg   (poster/fallback statico dell'hero: mockup cancelleria/branding)
├── home-hero-build.mp4        (video hero attuale della home: la stessa scena che si assembla)
├── portfolio-hero-pastel.jpg   (immagine reale per la subhero di Portfolio)
├── progettazione-grafica-studio-grafiche-arrara.jpg (subhero Progettazione)
├── stampa-digitale-grande-formato-grafiche-arrara.jpg (subhero Produzione)
├── final-cta-bg.jpg        (foto di sfondo della CTA finale in home: pianta/germoglio)
└── intro-completo.mp4      (video intro home: lampadina + logo, vedi components.md)
```

### Font locali (`src/fonts/`)
`AvertaStd-Bold.ttf`, `AvertaStd-Black.ttf`,
`Raleway-VariableFont_wght.ttf`, `Raleway-Italic-VariableFont_wght.ttf`.
Caricati via `@font-face` in cima a `style.css`, nessuna dipendenza da
Google Fonts CDN. Averta è commerciale: i file arrivano da `raw/font/`
(forniti dall'utente, licenza propria), mai da scaricare online — vedi
`visual-style.md` per la cronologia completa di questa scelta.

Tutte le pagine condividono lo stesso `style.css` e `script.js` via
`<link>`/`<script>`, e ripetono lo stesso markup di header/footer.

### Come sostituire un'immagine da soli (senza passare da Claude)
Mappa di dove ogni file immagine/video viene effettivamente usato:

| File | Dove appare |
|---|---|
| `logo-arrara.png` | Logo header — su Home, Progettazione, Produzione, Azienda, Contatti |
| `logo-arrara-dark.png` | Logo header — solo Portfolio (variante scura per sfondo chiaro) |
| `home-hero.jpg` | Sfondo placeholder delle 3 feature-card (Home) e delle subhero di Azienda/Contatti |
| `portfolio-hero-pastel.jpg` | Sfondo subhero di Portfolio |
| `progettazione-grafica-studio-grafiche-arrara.jpg` | Sfondo subhero di Progettazione; immagine Open Graph e ImageObject della pagina |
| `stampa-digitale-grande-formato-grafiche-arrara.jpg` | Sfondo subhero di Produzione; immagine Open Graph e ImageObject della pagina |
| `final-cta-bg.jpg` | Sfondo sezione "Hai un progetto da far crescere?" (fondo Home) |
| `home-hero-build.mp4` | Video hero Home (assemblaggio cancelleria) |
| `intro-completo.mp4` | Video introduttivo Home (lampadina→logo) |

**Modo più semplice — nessuna modifica al codice**: salva la nuova
immagine con **lo stesso nome e la stessa estensione** del file che
vuoi sostituire, direttamente dentro `src/`, sovrascrivendo il vecchio
file. Nessun HTML/CSS da toccare: il sito la userà automaticamente.
- Mantieni proporzioni simili all'originale (le immagini di sfondo
  usano `object-fit:cover`/`background-size:cover`, quindi tollerano
  rapporti d'aspetto leggermente diversi, ma un'immagine molto più
  stretta/larga verrà ritagliata in modo imprevisto).
- Dimensione consigliata: **~2000px** sul lato lungo, JPG compresso
  (qualità 80-85%) — abbastanza per schermi retina senza appesantire il
  caricamento. File da 5-10MB dritti dalla fotocamera/AI vanno
  ridimensionati prima (chiedi a Claude di farlo se non hai un tool a
  portata di mano).
- Se hai anche il file "originale" (foto non ritagliata, PNG pesante,
  export AI ecc.), mettine una copia in `raw/immagini/` — è la cartella
  dei materiali sorgente, utile come riferimento futuro anche se non è
  quella letta dal sito.

**Se invece vuoi usare un nome file diverso** (es. `nuova-foto.jpg`
invece di sovrascrivere `home-hero.jpg`), serve anche un piccolo intervento
di testo: nei file `.html` cerca `src="home-hero.jpg"` (per `<img>`), in
`style.css` cerca `url('home-hero.jpg')` (può comparire più volte, come
per `home-hero.jpg` che è condivisa da più elementi) e sostituisci il
nome ovunque compaia.

**Passaggio che NON si può saltare — refresh della cache**: il browser
tiene in cache `style.css` a lungo (vedi sezione sotto). Sostituendo solo
un'immagine (non `style.css`/`script.js`) di solito **non** serve
incrementare `?v=`, ma il **browser stesso può comunque tenere in cache
la vecchia immagine** con lo stesso nome file: se dopo aver sostituito il
file non vedi il cambiamento, fai un refresh forzato (su Mac,
Cmd+Shift+R) invece del refresh normale.

### Cache busting
I link a `style.css` e `script.js` in tutte le 6 pagine includono un
parametro di versione (`style.css?v=1`, `script.js?v=1`): senza server
che gestisca `Cache-Control`/`ETag`, i browser tendono a tenere in cache
questi file a lungo, mostrando versioni vecchie dopo una modifica (bug
riscontrato più volte durante lo sviluppo). **Convenzione**: ogni volta
che si modifica `style.css` o `script.js` in modo visibile, incrementare
il numero di versione in tutte e 6 le pagine HTML (stesso giro già
necessario per le modifiche condivise a header/footer).

## Navigazione
Menu identico su tutte le pagine, ordine:
`Progettazione → Produzione → Portfolio → Azienda → Contatti`
(il logo in header linka sempre a `index.html`).

Su mobile (≤1100px) il menu diventa un pannello a schermo intero
attivato da un bottone hamburger (`.menu-toggle` + `#mainNav.is-open`,
gestito da `script.js`).

## Relazione tra le pagine
- **Home** (`index.html`): unica pagina con hero fotografico a piena
  larghezza; contiene anche la griglia di navigazione alle 5 sezioni,
  più sezioni editoriali (visione, processo, progetti in evidenza,
  numeri, CTA finale).
- **Le 5 pagine interne** condividono la stessa struttura:
  `subhero` (titolo + intro) → `content-page` (contenuto specifico) →
  `footer` (comune, con CTA e dati di contatto) — tranne `contatti.html`
  che ha anche form + mappa al posto del contenuto generico.

Dettaglio di ciascuna pagina in `pages.md`.
