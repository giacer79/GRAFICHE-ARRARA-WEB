# Grafiche Arrara — sito web (NUOVO SITO GA — variante parallela)

> **Progetto separato**: nato il 25/08/2026 come copia di
> `grafiche-arrara-project` (stessi font, animazioni, componenti,
> convenzioni), per esplorare un nuovo design della home basato su un
> PDF fornito dall'utente, senza toccare il sito principale. Le due
> cartelle non sono collegate: modifiche qui non si riflettono là e
> viceversa.

Sito vetrina per Grafiche Arrara, tipografia e litografia storica di
Abbiategrasso (MI), fondata nel 1923. HTML/CSS/JS statico, nessun
framework o build step: si apre direttamente in browser da `src/`.

Stile: elegante, moderno, grafico — base cromatica nero, rosso e
fucsia, coerente col logo e con un'immagine professionale da studio
grafico/tipografia. Vedi `wiki/visual-style.md` per i dettagli completi:
è la direzione **definitiva**, non va reinventata.

## Struttura del progetto

- **`raw/`** — materiali originali: da leggere, **mai modificare**.
  Contiene `codice/` (snapshot del codice), `immagini/`, `font/`,
  `testi/` (contenuto estratto pagina per pagina), `screenshot/`.
- **`wiki/`** — documentazione viva del progetto (memoria persistente:
  vedi sotto). Inizia sempre da `wiki/index.md`.
- **`src/`** — il sito vero e proprio, quello in produzione. Le
  modifiche vanno fatte qui.
- **`CLAUDE.md`** (questo file) — regole operative per ogni sessione.

## Regole operative

1. **Non modificare mai i file dentro `raw/`.** Sono materiale di
   riferimento, non lavorabile.
2. **Prima di lavorare sul codice**, leggi i materiali dentro `raw/`
   se servono per capire lo stato originale/storico di qualcosa.
3. Ogni sintesi o decisione va scritta in modo ordinato dentro `wiki/`,
   non solo in chat.
4. **Aggiorna `wiki/index.md`** quando aggiungi o cambi sostanzialmente
   una pagina della wiki, con l'elenco aggiornato e una breve
   descrizione.
5. **Aggiorna `wiki/log.md`** dopo ogni operazione importante (nuova
   funzionalità, fix, decisione di stile, contenuto aggiunto).
6. **Prima di modificare il sito** in modo non banale, scrivi gli step
   consigliati in `wiki/improvement-plan.md` — pianifica, poi esegui.
7. **All'inizio di una nuova sessione**, leggi in ordine:
   `CLAUDE.md` → `wiki/index.md` → le pagine wiki rilevanti per il
   compito richiesto. Non ripartire da zero: la wiki è la memoria del
   progetto.
8. Usa la wiki come **memoria persistente**: non chiedere all'utente di
   rispiegare colori, stile, struttura, decisioni già prese o problemi
   già risolti — sono documentati in `wiki/`. Se manca qualcosa che
   servirebbe sapere, aggiungilo tu alla pagina wiki pertinente appena
   lo scopri.

## Convenzioni tecniche

- Nessun framework, bundler o dipendenza npm: il sito resta HTML/CSS/JS
  puro.
- Le 6 pagine (`index.html`, `progettazione.html`, `produzione.html`,
  `portfolio.html`, `azienda.html`, `contatti.html`) condividono lo
  stesso `style.css`/`script.js` e ripetono header/footer identici: se
  cambi l'header, aggiornalo su tutte e 6.
- Il form contatti (`contatti.html`) è solo simulato lato client
  (`script.js` intercetta il submit): non è collegato a un vero invio.
- Le immagini di sfondo delle card home e dei `.subhero` riusano tutte
  `home-hero.jpg` come placeholder: da sostituire con foto reali quando
  disponibili (vedi `wiki/improvement-plan.md`).

## Lingua
L'utente comunica in italiano. Testi, commenti nel codice e voci della
wiki restano in italiano.
