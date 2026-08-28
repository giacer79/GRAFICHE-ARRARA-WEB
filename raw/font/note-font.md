# Font utilizzati

Il sito non include file di font locali: i caratteri sono caricati/definiti
così in `style.css`:

- **Raleway** (titoli, pesi 700/800/900) — caricato da Google Fonts via
  `@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700;800;900&display=swap');`
  Richiede connessione internet per caricarsi; se il sito viene aperto
  offline o l'importazione fallisce, il browser usa il font di fallback
  indicato (`'Arial Black', system-ui, sans-serif`).
- **Avenir Next / Avenir** (testo body) — font di sistema, presente su
  macOS/iOS; sugli altri sistemi ricade sul fallback
  (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`).
- **'Wireframe'** — riferito nel CSS per le etichette piccole (numeri di
  sezione, eyebrow) ma non è un font realmente disponibile/incluso: ricade
  sempre sul fallback (`'Avenir Next', system-ui, sans-serif`). Da
  considerare se in futuro si vuole un font "tecnico" dedicato per quelle
  etichette.

Se in futuro si vuole rendere il sito indipendente da Google Fonts
(es. per GDPR/performance), bisognerà scaricare i file `.woff2` di Raleway
e servirli localmente da questa cartella.
