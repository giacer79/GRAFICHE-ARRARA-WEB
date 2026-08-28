# Animation system

Principio generale: movimento **sottile e funzionale**, mai decorativo
fine a sé stesso. Ogni animazione rispetta `prefers-reduced-motion`
dove tecnicamente rilevante (in particolare parallax e float dei titoli).

## Hover sulle card (link-card, feature-card, process-card, service,
project-card)
Al passaggio del mouse, tre effetti combinati:
1. **Sollevamento**: `translateY(-5px)` (solo link-card/feature-card).
2. **Bagliore esterno + alone interno**: `box-shadow` con componente
   esterna (rosso/fucsia diffuso) e componente `inset` (alone rosso
   interno alla card) — aggiunto su richiesta esplicita.
3. **Titolo che fluttua**: il testo del titolo (`h2`/`h3` della card)
   anima un leggero bobbing verticale in loop (`@keyframes titleFloat`,
   ±6px, 2.2s), finché il mouse resta sopra. Disattivato se l'utente ha
   impostato "riduci le animazioni".

## Hero home — parallax
`script.js` calcola lo scroll e sposta l'immagine hero verticalmente
(`--hero-parallax`, max ~58px) in direzione opposta allo scroll, per un
effetto di profondità leggero. Disattivato se `prefers-reduced-motion`.

## Icona "+"
Presente su card e link testuali (`.card-plus`, `.hero-plus`,
`.text-link span`, `.cta-button span`): ruota di 90° su hover,
cambiando colore verso il fucsia.

## Menu mobile
Hamburger (`.menu-toggle`) si trasforma in "X" tramite rotazione delle
due barre (`span:first-child`/`span:last-child`), gestito da classe
`.is-open` aggiunta via JS.

## Pin sulla mappa (contatti)
Pulsazione continua (`@keyframes pinGlow` per il bagliore, `pinPulse`
per gli anelli concentrici che si espandono e svaniscono), sempre attiva
(non legata a hover): serve a farlo notare come punto di interesse sulla
mappa.

## Form contatti
Nessuna animazione particolare: il messaggio di conferma
(`.form-status`) passa da `display:none` a visibile al submit, senza
transizione animata al momento.
