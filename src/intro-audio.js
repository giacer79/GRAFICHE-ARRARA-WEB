/* Colonna sonora sintetizzata dell'introduzione (Web Audio, nessun file).
   Ambiente d'ufficio -> sweep all'uscita del video -> rintocco sul logo.
   I browser bloccano l'audio senza un gesto: se serve, parte al primo tocco/tasto. */
(function(){
  var AC = window.AudioContext || window.webkitAudioContext;
  window.arraraIntroAudio = function(host){
    if (!AC) return null;
    var ctx = new AC(), master = ctx.createGain(), on = true, stopped = false, nodes = [];
    var pendingWhoosh = false, pendingChime = false;
    master.gain.value = 0; master.connect(ctx.destination);
    try { if (sessionStorage.getItem('arraraIntroMute') === '1') on = false; } catch(_){}

    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'intro-sound';
    host.appendChild(btn);
    function paint(){
      var live = on && ctx.state === 'running';
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Disattiva audio' : 'Attiva audio');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/>' +
        (on ? '<path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
            : '<path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>') +
        '</svg><span>' + (on ? (live ? 'Audio' : 'Tocca per audio') : 'Muto') + '</span>';
    }
    function level(){ master.gain.setTargetAtTime(on && !stopped ? 0.9 : 0, ctx.currentTime, 0.08); }
    function noiseBuf(sec){
      var b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return b;
    }
    function keep(n){ nodes.push(n); return n; }

    function ambient(){
      var t = ctx.currentTime, g = keep(ctx.createGain());
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 2.5);
      g.connect(master);
      [55, 82.4, 110.3].forEach(function(f, i){
        var o = keep(ctx.createOscillator()), og = ctx.createGain();
        o.type = i ? 'sine' : 'triangle'; o.frequency.value = f; og.gain.value = 0.16 / (i + 1);
        o.connect(og); og.connect(g); o.start(t);
      });
      var n = keep(ctx.createBufferSource()), f = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf(3); n.loop = true; f.type = 'lowpass'; f.frequency.value = 420; ng.gain.value = 0.07;
      n.connect(f); f.connect(ng); ng.connect(g); n.start(t);
    }
    function whoosh(){
      if (ctx.state !== 'running' || stopped) { pendingWhoosh = true; return; }
      var t = ctx.currentTime, n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      n.buffer = noiseBuf(3); f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(250, t); f.frequency.exponentialRampToValueAtTime(5200, t + 2.2);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9, t + 1.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t + 2.8);
    }
    function chime(){
      if (ctx.state !== 'running' || stopped) { pendingChime = true; return; }
      var t = ctx.currentTime;
      [[587.33, 0], [880, 0.14], [1174.66, 0.3]].forEach(function(p){
        var o = ctx.createOscillator(), g = ctx.createGain(), s = t + p[1];
        o.type = 'sine'; o.frequency.value = p[0];
        g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.38, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + 2.6);
        o.connect(g); g.connect(master); o.start(s); o.stop(s + 2.7);
      });
      var b = ctx.createOscillator(), bg = ctx.createGain();
      b.type = 'sine'; b.frequency.value = 73.4;
      bg.gain.setValueAtTime(0.0001, t); bg.gain.exponentialRampToValueAtTime(0.5, t + 0.04); bg.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      b.connect(bg); bg.connect(master); b.start(t); b.stop(t + 2.3);
    }

    var begun = false;
    function begin(){
      if (begun || stopped) return;
      begun = true; ambient(); level();
      if (pendingWhoosh) { pendingWhoosh = false; whoosh(); }
      if (pendingChime) { pendingChime = false; chime(); }
      paint();
    }
    function unlock(){
      ctx.resume().then(function(){ if (ctx.state === 'running') begin(); paint(); }).catch(function(){});
    }
    function gesture(e){
      if (e.target === btn) return;
      unlock();
      if (ctx.state === 'running') { document.removeEventListener('pointerdown', gesture, true); document.removeEventListener('keydown', gesture, true); }
    }
    btn.addEventListener('click', function(){
      on = !on;
      try { sessionStorage.setItem('arraraIntroMute', on ? '0' : '1'); } catch(_){}
      if (on) unlock();
      level(); paint();
    });
    document.addEventListener('pointerdown', gesture, true);
    document.addEventListener('keydown', gesture, true);
    ctx.addEventListener('statechange', paint);
    paint();
    unlock();
    setTimeout(function(){ if (ctx.state === 'running') begin(); }, 60);

    return {
      whoosh: whoosh,
      chime: chime,
      stop: function(){
        if (stopped) return; stopped = true;
        document.removeEventListener('pointerdown', gesture, true); document.removeEventListener('keydown', gesture, true);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
        setTimeout(function(){ nodes.forEach(function(n){ try { n.stop(); } catch(_){} }); try { ctx.close(); } catch(_){} btn.remove(); }, 1500);
      }
    };
  };
})();
