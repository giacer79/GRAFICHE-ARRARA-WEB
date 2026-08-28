# Visual style — stile grafico definitivo

> Questa è la direzione visiva **consolidata e bloccata** del sito.
> Non va cambiata senza un'indicazione esplicita dell'utente: se un
> compito sembra richiedere di deviare da queste regole, chiedi prima.

## Palette
| Ruolo | Valore | Variabile CSS |
|---|---|---|
| Sfondo | `#020202` / `#030303` | — |
| Testo principale | `#f8f6f6` | `--white` |
| Testo secondario | `rgba(248,246,246,.68)` | `--muted` |
| Rosso | `#df0036` | `--red` |
| Fucsia | `#ee1b78` | `--fuchsia` |
| Ciano (accento secondario) | `#58d1e8` | `--cyan` |

Gli accenti rosso/fucsia sono quasi sempre in **gradiente**
(`linear-gradient(90deg, var(--red), var(--fuchsia))`), raramente a tinta
piatta. Sfondo sempre scuro/nero, mai chiaro: è un tratto distintivo,
non uno stato temporaneo.

Il **ciano** (`--cyan`) è un accento aggiunto in una revisione successiva
(vedi sotto, "Evoluzione: font Averta + accento ciano"): si affianca a
rosso/fucsia, non li sostituisce. Uso attuale: paragrafo della CTA finale
(`.final-cta p`), parola singola in link testuali via classe
`.accent-cyan` (es. "Conosci" in `.numbers-copy`).

## Tipografia
- **Titoli**: **Averta** (Bold/Black, font commerciale caricato
  localmente da file forniti dall'utente — vedi sotto), con Raleway come
  fallback, pesi 800–900, maiuscolo nei contesti "label" (eyebrow, nav),
  non necessariamente maiuscolo nei titoli editoriali grandi.
  Letter-spacing negativo sui titoli grandi (effetto compatto/moderno),
  positivo sulle etichette piccole (effetto "distanziato").
- **Testo body**: Raleway (variabile), fallback Avenir Next / sans-serif
  di sistema.
- Font caricati **localmente** da `src/fonts/` via `@font-face` (non più
  da CDN Google Fonts): `AvertaStd-Bold.ttf`, `AvertaStd-Black.ttf`,
  `Raleway-VariableFont_wght.ttf`, `Raleway-Italic-VariableFont_wght.ttf`.
  Averta è un font commerciale: i file sono stati forniti direttamente
  dall'utente (licenza propria) in `raw/font/` e copiati in `src/fonts/`
  — non scaricare mai una copia di Averta da internet, non è
  legalmente disponibile come font libero. Solo i pesi Bold/Black sono
  disponibili (nessun Regular/weight intermedio): elementi che
  richiedono altri pesi ricadono sul peso disponibile più vicino o su
  Raleway.

### Evoluzione: font Averta + accento ciano (da riferimento utente)
L'utente ha fornito un mockup (`~/Desktop/FONDO PAGINA.pdf`, una pagina,
letto come immagine via `qlmanage` — `pdftoppm`/poppler non installato)
del fondo pagina della home (sezioni "05/esperienza" e "06/contatto"),
chiedendo di estendere font/proporzioni/stile del riferimento **a tutto
il sito**, mantenendo intatte tutte le animazioni esistenti. L'utente ha
poi corretto l'identificazione visiva iniziale del font (un tentativo con
"Baloo 2" da Google Fonts) chiarendo che i font reali sono **Averta e
Raleway**, e ha fornito i file Averta di persona.

Cosa è cambiato, in sintesi (dettagli tecnici in `components.md` e
`log.md`):
- Font titoli: da Raleway-solo ad Averta (con Raleway/system-ui a
  cascata come fallback).
- Nuovo accento `--cyan` (`#58d1e8`), campionato per pixel-sampling
  diretto dal PDF di riferimento (due punti diversi dell'immagine,
  risultato praticamente identico — colore intenzionale, non artefatto
  di compressione).
- `.stat-grid` (numeri "100+/2/1/360°" in home): celle con bordo sottile
  individuale, angolo tagliato solo sulla prima cella (non su tutte).
- `.final-cta`: foto di sfondo reale (pianta/germoglio con overlay
  digitale, fornita dall'utente) al posto del solo gradiente; titolo
  diviso in due blocchi sulla stessa riga (sinistra/destra) con la pianta
  visibile nello spazio centrale — vedi `components.md`.

**Nota per sessioni future**: questa evoluzione **aggiorna la direzione
"definitiva"** descritta in questa pagina (non è un'eccezione locale come
Portfolio chiaro) — il resto della regola "non deviare senza indicazione
esplicita" resta valido, semplicemente il font/palette di riferimento
ora è questo, non più Raleway-solo/nessun ciano.

## Motivo ricorrente: "angolo tagliato"
La firma visiva del sito, concettualmente legata alla **rifilatura di
stampa** (coerente col mestiere di una tipografia). Un angolo in alto a
sinistra di ogni pannello/card è tagliato di netto da una linea diagonale
sottile bianca. Implementato con `clip-path` + `mask` su `::before`
(la cornice) e `::after` (la linea diagonale).

Due scale, deliberatamente diverse:
- **Grande** (taglio 34px): pannelli principali — `.hero-panel-image`,
  `.subhero`, `.final-cta`, `.map-block`, `.process-card`, `.service`,
  `.project-card`
- **Piccola** (taglio 24px): card di navigazione — `.link-card`,
  `.feature-card`

Sull'hero della home, la cornice è arretrata di **26px** rispetto al
bordo dell'immagine (che è invece a piena larghezza, edge-to-edge) — non
è più a filo pagina/immagine, per scelta esplicita.

## Home hero
- Immagine a piena larghezza (edge-to-edge), scurita
  (`filter: brightness(.5) contrast(1.08) saturate(.98)`).
- Testo (eyebrow, titolo, descrizione) in sovrimpressione a sinistra,
  centrato verticalmente.
- Leggero effetto parallax al momento dello scroll (via JS).
- `alt` dell'immagine hero volutamente **vuoto** (`alt=""`): l'immagine è
  decorativa, il contenuto informativo è già nel testo visibile in
  sovrimpressione. Non ripristinare un alt descrittivo qui: in certe
  condizioni di caricamento appariva come testo sovraimpresso indesiderato
  (vedi `log.md`).

## Interazioni (dettagliate in `animation-system.md`)
- Card: sollevamento leggero + bagliore esterno + alone rosso/fucsia
  interno + titolo che fluttua, tutto al passaggio del mouse.
- Rispetto sistematico di `prefers-reduced-motion`.

## Eccezione documentata: Portfolio in versione chiara
Su richiesta esplicita dell'utente, **solo** `portfolio.html` (l'intera
pagina, header e footer inclusi) usa un layout chiaro — grigio molto
chiaro `#f4f3ef` + zone bianche `#fff`, testo scuro `#1a1a1a`, con
rosso/fucsia mantenuti come accenti (nav underline, CTA, dettagli sulle
card). Scoping via `body.portfolio-page` in `style.css`, non applicato
alle altre 5 pagine. **Non "correggere" questa pagina riportandola allo
sfondo scuro**: è un'eccezione voluta, non un errore. Dettagli tecnici
in `components.md`, motivazione e cronologia in `log.md`.

## Cosa NON fare
- Non introdurre colori piatti/pastello o palette chiare sulle **altre
  5 pagine**: lo sfondo scuro è strutturale, non un dettaglio (eccetto
  Portfolio, vedi sopra).
- Non tornare a Raleway-solo per i titoli, e non reintrodurre il CDN
  Google Fonts: Averta (locale, `src/fonts/`) + Raleway sono lo stato
  attuale, voluto dall'utente (vedi sopra).
- Non rimuovere il motivo dell'angolo tagliato: è l'elemento
  concettualmente più legato al mestiere del cliente.
- Non ripristinare il testo "GRAFICHE ARRARA" / "TIPOGRAFIA ·
  LITOGRAFIA" accanto al logo: è stato rimosso su richiesta esplicita
  e sostituito da una seconda copia del logo stesso.
