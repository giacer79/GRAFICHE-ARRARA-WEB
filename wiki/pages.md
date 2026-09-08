# Pages — dettaglio pagina per pagina

## Home (`index.html`)
Redesign fedele a `HOME.pdf` (mockup InDesign fornito dall'utente,
28/08/2026 — vedi `improvement-plan.md` e `log.md`). Include anche,
prima del contenuto vero e proprio, il video di apertura lampadina→logo
(`.site-intro`, solo su questa pagina — vedi `components.md`) e la
transizione a dissolvenza tra pagine condivisa con le altre 5. Sezioni
di contenuto, in ordine:
1. **Hero** — foto reale (notebook/penne/nastro rosso-fucsia su
   scrivania, `home-hero-notebook.jpg`), scurita, con titolo "Diamo
   forma alle tue idee" in sovrimpressione.
2. **Griglia di navigazione** (5 card, `.area-nav`) — Progettazione,
   Produzione, Portfolio, Azienda, Contatti. Ogni card usa
   un'illustrazione SVG tematica dedicata.
3. **Riga icone isometriche** (`.icon-row`, 5 tile) — Progettazione,
   Stampa, Grande formato, Allestimenti, Comunicazione digitale. Icone
   3D estratte dal PDF (`icon-*.jpg`), ognuna link alla pagina
   corrispondente.
4. **Visione** ("Dall'idea alla materia") — testo introduttivo + link
   "Scopri il nostro metodo".
5. **Processo** (4 step: Ascolto, Progetto, Produzione, Consegna) —
   sfondo con grafica ad onda rosso→fucsia (`process-wave.jpg`).
6. **Progetti in evidenza** (`.project-grid`, 4 card: Boffalora,
   Luxury, Antonino, Pastel) — badge categoria ciano sulla foto +
   didascalia corsiva sotto (es. "/ brochure comune di boffalora").
7. **Esperienza** — foto reale di una persona (`team-portrait.jpg`)
   accanto alla griglia statistiche: 100+ anni, 2 anime integrate, 1
   partner unico, 360° gestione progetto.
8. **CTA finale** + footer home (diverso dal footer delle altre pagine:
   ha social invece del box contatti).

Stato contenuti: testi rivisti in chiave SEO naturale per tipografia,
progettazione grafica, stampa e localizzazione ad Abbiategrasso. I
"Progetti in evidenza" riusano foto già presenti nel progetto (non
ancora casi reali documentati con testo dedicato).

## Progettazione (`progettazione.html`)
Subhero + 4 servizi: Brand identity, Editorial design, Packaging,
Campagne. Testi SEO rivisti; subhero con immagine dedicata alla
progettazione grafica.

## Produzione (`produzione.html`)
Subhero + 4 servizi: Stampa digitale, Stampa offset, Grande formato,
Finitura/fustellatura/legatoria. Testi SEO rivisti; subhero con immagine
dedicata ai macchinari di stampa.

## Portfolio (`portfolio.html`)
Subhero + 4 categorie: Brand identity, Cataloghi ed editoria, Packaging,
Allestimenti. **Nessun progetto reale mostrato** — solo etichette di
categoria con una riga di descrizione generica. Questa pagina è la più
scarna di contenuto reale e la prima candidata per il prossimo lavoro sui
contenuti.

Titolo, descrizione, testo e immagine del progetto Pastel sono stati
collegati alle ricerche su portfolio grafica, packaging e stampa.

## Azienda (`azienda.html`)
Subhero + 4 valori: Esperienza, Tecnologia, Consulenza, Qualità.
Testo rivisto per esplicitare tipografia/litografia ad Abbiategrasso dal
1923.

## Contatti (`contatti.html`)
Subhero + form contatti (nome, email, telefono, servizio, messaggio) +
mappa (Viale Sforza 125, Abbiategrasso) con pin animato.
Sono stati aggiunti telefono, email e orari visibili, oltre ai dati SEO
locali.
⚠️ Il form è **solo simulato**: `script.js` intercetta il submit e mostra
un messaggio di conferma statico, ma non invia realmente nulla (nessun
backend/servizio email collegato).

## Footer condiviso (pagine interne)
Uguale su Progettazione/Produzione/Portfolio/Azienda/Contatti: titolo
"Hai un'idea? Facciamola diventare reale.", indirizzo, contatti, CTA
"Richiedi un preventivo".
