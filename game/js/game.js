'use strict';
/*
 * game.js — the state machine of Second Glance.
 *
 * Screens: title -> playing -> sceneClear -> (next scene | gameClear),
 * with timeUp and paused branching off playing. The two picture panels are
 * pre-rendered to offscreen canvases once per scene; each frame blits them
 * and draws the live overlays (found markers, hint pulse, miss flashes).
 */

const SG = (() => {
  const PANEL_W = 600;
  const PANEL_H = 460;
  const DPR = 2;

  const state = {
    screen: 'title',
    sceneIndex: 0,
    found: new Set(),
    hotspots: [],
    score: 0,
    sceneScoreStart: 0,
    mistakes: 0,
    hintsLeft: 3,
    timeLeft: 0,
    paused: false,
    still: false,
    hint: null,
    lastTickSecond: -1,
  };

  const markers = new Map(); // diff id -> timestamp the find animation began
  const flashes = [];        // wrong clicks: {panel, x, y, t0}
  let els = null;
  let panelImages = { L: null, R: null };
  let lastFrameAt = 0;

  function makePanelImage(scene, side) {
    const c = document.createElement('canvas');
    c.width = PANEL_W * DPR;
    c.height = PANEL_H * DPR;
    const ctx = c.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    beginPaint(side);
    scene.paint(ctx);
    if (side === 'L') state.hotspots = collectedDiffs();
    return c;
  }

  function currentScene() {
    return SCENES[state.sceneIndex];
  }

  function remaining() {
    return state.hotspots.length - state.found.size;
  }

  function toast(msg) {
    els.toast.textContent = msg;
  }

  function fmtTime(sec) {
    const s = Math.max(0, Math.ceil(sec));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  const hudCache = {};
  function setText(key, el, value) {
    if (hudCache[key] !== value) {
      hudCache[key] = value;
      el.textContent = value;
    }
  }

  function updateHud() {
    const scene = currentScene();
    setText('scene', els.hudScene, 'Scene ' + (state.sceneIndex + 1) + ' of ' + SCENES.length + ' — ' + scene.name);
    setText('left', els.hudLeft, String(remaining()));
    setText('found', els.hudFound, state.found.size + ' found of ' + state.hotspots.length);
    setText('score', els.hudScore, String(state.score));
    setText('time', els.timeText, fmtTime(state.timeLeft));
    setText('hint', els.btnHint, 'Hint (' + state.hintsLeft + ')');
    const pct = Math.max(0, Math.min(100, state.timeLeft / scene.time * 100));
    els.timeBar.style.width = pct + '%';
    els.timeBar.classList.toggle('low', state.timeLeft <= 30 && state.screen === 'playing');
  }

  function showOverlay(html) {
    els.overlay.innerHTML = html;
    els.overlay.style.display = 'flex';
  }

  function hideOverlay() {
    els.overlay.style.display = 'none';
    els.overlay.innerHTML = '';
  }

  function loadScene(index) {
    state.sceneIndex = index;
    const scene = currentScene();
    state.found = new Set();
    markers.clear();
    flashes.length = 0;
    state.hint = null;
    state.timeLeft = scene.time;
    state.lastTickSecond = -1;
    state.sceneScoreStart = state.score;
    state.paused = false;
    els.btnPause.textContent = 'Pause';
    panelImages = { L: makePanelImage(scene, 'L'), R: makePanelImage(scene, 'R') };
    state.screen = 'playing';
    hideOverlay();
    toast('Find ' + state.hotspots.length + ' differences in ' + scene.name + '.');
    updateHud();
    draw(performance.now());
  }

  function startGame() {
    state.score = 0;
    state.mistakes = 0;
    state.hintsLeft = 3;
    loadScene(0);
  }

  function sceneClear() {
    state.screen = 'sceneClear';
    const bonus = Math.ceil(state.timeLeft) * 2;
    state.score += bonus;
    Sound.sceneClear();
    const last = state.sceneIndex === SCENES.length - 1;
    showOverlay(
      '<div class="card">' +
      '<h2>' + currentScene().name + ' — clear!</h2>' +
      '<p>Every difference found. Time bonus: <b>+' + bonus + '</b></p>' +
      '<p>Score so far: <b>' + state.score + '</b> · Mistakes: ' + state.mistakes + '</p>' +
      '<button id="ovNext" class="big">' + (last ? 'See your final score' : 'Next scene') + '</button>' +
      '</div>'
    );
    els.overlay.querySelector('#ovNext').addEventListener('click', () => {
      if (last) gameClear();
      else loadScene(state.sceneIndex + 1);
    });
    updateHud();
  }

  function gameClear() {
    state.screen = 'gameClear';
    Sound.gameClear();
    const rating = state.score >= 2600 ? 'Eagle eyes!' : state.score >= 2000 ? 'Sharp spotter!' : 'Warm-up done — the pictures are still hiding things.';
    showOverlay(
      '<div class="card">' +
      '<h2>All three scenes clear!</h2>' +
      '<p class="big-score">' + state.score + '</p>' +
      '<p>' + rating + '</p>' +
      '<p>Mistakes: ' + state.mistakes + ' · Hints left: ' + state.hintsLeft + '</p>' +
      '<button id="ovAgain" class="big">Play again</button>' +
      '</div>'
    );
    els.overlay.querySelector('#ovAgain').addEventListener('click', startGame);
  }

  function timeUp() {
    state.screen = 'timeUp';
    Sound.timeUp();
    showOverlay(
      '<div class="card">' +
      '<h2>Time\'s up!</h2>' +
      '<p>' + remaining() + ' difference' + (remaining() === 1 ? '' : 's') + ' still hiding in ' + currentScene().name + '.</p>' +
      '<button id="ovRetry" class="big">Try this scene again</button>' +
      '</div>'
    );
    els.overlay.querySelector('#ovRetry').addEventListener('click', () => {
      state.score = state.sceneScoreStart;
      loadScene(state.sceneIndex);
    });
  }

  function showTitle() {
    state.screen = 'title';
    showOverlay(
      '<div class="card wide">' +
      '<h1>Second Glance</h1>' +
      '<p class="tag">A spot-the-difference game</p>' +
      '<p>Two pictures, side by side. They differ in a handful of places — ' +
      'click a difference in either picture to mark it on both. Wrong clicks cost 3 seconds. ' +
      'Three scenes, 21 differences, one ticking clock.</p>' +
      '<ul class="scenes">' +
      '<li>Harbour at Dusk — 5 differences · 2:30</li>' +
      '<li>Lantern Market — 7 differences · 3:20</li>' +
      '<li>The Clockwork Library — 9 differences · 4:20</li>' +
      '</ul>' +
      '<p class="keys">Mouse, or arrows + Enter · H hint · P pause · R restart · M mute</p>' +
      '<button id="ovStart" class="big">Start spotting</button>' +
      '</div>'
    );
    els.overlay.querySelector('#ovStart').addEventListener('click', startGame);
  }

  function onPick(panel, x, y) {
    if (state.screen !== 'playing' || state.paused) return;
    const now = performance.now();
    for (const hs of state.hotspots) {
      const d = Math.hypot(hs.x - x, hs.y - y);
      if (d <= Math.max(hs.r, 15)) {
        if (state.found.has(hs.id)) {
          toast('Already found: ' + hs.label + '.');
          return;
        }
        state.found.add(hs.id);
        markers.set(hs.id, now);
        state.score += 100;
        if (state.hint && state.hint.hs.id === hs.id) state.hint = null;
        Sound.find();
        toast('Found: ' + hs.label + '! +' + '100');
        updateHud();
        draw(now);
        if (remaining() === 0) sceneClear();
        return;
      }
    }
    state.mistakes += 1;
    state.score = Math.max(0, state.score - 25);
    state.timeLeft = Math.max(0, state.timeLeft - 3);
    flashes.push({ panel, x, y, t0: now });
    Sound.miss();
    toast('Not a difference — 3 seconds lost.');
    updateHud();
    draw(now);
  }

  function useHint() {
    if (state.screen !== 'playing' || state.paused) return;
    const unfound = state.hotspots.filter((h) => !state.found.has(h.id));
    if (!unfound.length) return;
    if (state.hintsLeft <= 0) {
      toast('No hints left — trust your eyes.');
      return;
    }
    state.hintsLeft -= 1;
    state.timeLeft = Math.max(1, state.timeLeft - 5);
    const hs = unfound[Math.floor(Math.random() * unfound.length)];
    state.hint = { hs, t0: performance.now() };
    Sound.hint();
    toast('Something shimmers… (−5 seconds)');
    updateHud();
  }

  function togglePause() {
    if (state.screen !== 'playing') return;
    state.paused = !state.paused;
    els.btnPause.textContent = state.paused ? 'Resume' : 'Pause';
    if (state.paused) {
      showOverlay('<div class="card"><h2>Paused</h2><p>The pictures are hidden — no peeking.</p><button id="ovResume" class="big">Resume</button></div>');
      els.overlay.querySelector('#ovResume').addEventListener('click', togglePause);
    } else {
      hideOverlay();
    }
  }

  function restartScene() {
    if (state.screen !== 'playing' && state.screen !== 'timeUp') return;
    state.score = state.sceneScoreStart;
    loadScene(state.sceneIndex);
  }

  /* ---------------- drawing ---------------- */

  function drawPanel(displayCtx, image, panel, now) {
    displayCtx.setTransform(1, 0, 0, 1, 0, 0);
    displayCtx.clearRect(0, 0, PANEL_W * DPR, PANEL_H * DPR);
    displayCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (image) displayCtx.drawImage(image, 0, 0, PANEL_W, PANEL_H);

    // Found markers: a gold ring that pops, then settles.
    for (const hs of state.hotspots) {
      if (!state.found.has(hs.id)) continue;
      const t0 = markers.get(hs.id);
      const p = state.still || t0 === undefined ? 1 : Math.min(1, (now - t0) / 350);
      const ease = 1 - Math.pow(1 - p, 3);
      const r = hs.r + 5 + (1 - ease) * 12;
      displayCtx.strokeStyle = 'rgba(30, 20, 5, 0.55)';
      displayCtx.lineWidth = 6;
      displayCtx.beginPath();
      displayCtx.arc(hs.x, hs.y, r, 0, Math.PI * 2);
      displayCtx.stroke();
      displayCtx.strokeStyle = '#ffd94d';
      displayCtx.lineWidth = 3.5;
      displayCtx.beginPath();
      displayCtx.arc(hs.x, hs.y, r, 0, Math.PI * 2);
      displayCtx.stroke();
    }

    // Hint pulse: a soft breathing circle somewhere near a difference.
    if (state.hint) {
      const phase = state.still ? 0.45 : ((now - state.hint.t0) % 1500) / 1500;
      const r = 26 + phase * 52;
      const alpha = 0.62 * (1 - phase);
      displayCtx.fillStyle = 'rgba(255, 235, 160, ' + (alpha * 0.5) + ')';
      displayCtx.beginPath();
      displayCtx.arc(state.hint.hs.x, state.hint.hs.y, r, 0, Math.PI * 2);
      displayCtx.fill();
      displayCtx.strokeStyle = 'rgba(255, 235, 160, ' + alpha + ')';
      displayCtx.lineWidth = 3;
      displayCtx.beginPath();
      displayCtx.arc(state.hint.hs.x, state.hint.hs.y, r, 0, Math.PI * 2);
      displayCtx.stroke();
    }

    // Wrong-click flashes on the panel that was clicked.
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      if (f.panel !== panel) continue;
      const age = state.still ? 9999 : now - f.t0;
      if (age > 500) { flashes.splice(i, 1); continue; }
      const a = 1 - age / 500;
      displayCtx.strokeStyle = 'rgba(255, 80, 70, ' + a + ')';
      displayCtx.lineWidth = 4;
      displayCtx.lineCap = 'round';
      const s = 11;
      displayCtx.beginPath();
      displayCtx.moveTo(f.x - s, f.y - s);
      displayCtx.lineTo(f.x + s, f.y + s);
      displayCtx.moveTo(f.x + s, f.y - s);
      displayCtx.lineTo(f.x - s, f.y + s);
      displayCtx.stroke();
    }
  }

  function draw(now) {
    drawPanel(els.cvL.getContext('2d'), panelImages.L, 'L', now);
    drawPanel(els.cvR.getContext('2d'), panelImages.R, 'R', now);
  }

  function frame(now) {
    const dt = Math.min(0.1, (now - lastFrameAt) / 1000 || 0);
    lastFrameAt = now;
    if (state.screen === 'playing' && !state.paused && !state.still) {
      state.timeLeft -= dt;
      const whole = Math.ceil(state.timeLeft);
      if (whole !== state.lastTickSecond) {
        state.lastTickSecond = whole;
        if (whole <= 10 && whole > 0) Sound.tick();
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        updateHud();
        timeUp();
      } else {
        updateHud();
      }
      draw(now);
    }
    if (!state.still) requestAnimationFrame(frame);
  }

  /* ---------------- screenshot states ---------------- */

  // The game's own demo states, used to take its screenshots: each sets up
  // a real mid-game position (some differences found, clock part-run).
  const SHOTS = {
    1: { scene: 0, found: 2, time: 97, score: 200, hints: 3 },
    2: { scene: 1, found: 3, time: 121, score: 640, hints: 3 },
    3: { scene: 2, found: 1, time: 203, score: 1150, hints: 2, hint: 'owl' },
    4: { scene: 1, found: 5, time: 17, score: 940, hints: 1 },
  };

  function startShot(n, still) {
    const cfg = SHOTS[n] || SHOTS[1];
    state.still = !!still;
    state.score = 0;
    state.mistakes = n === 4 ? 2 : 1;
    state.hintsLeft = cfg.hints;
    loadScene(cfg.scene);
    state.score = cfg.score;
    state.sceneScoreStart = cfg.score - cfg.found * 100;
    for (let i = 0; i < cfg.found && i < state.hotspots.length; i++) {
      state.found.add(state.hotspots[i].id);
      markers.set(state.hotspots[i].id, -100000);
    }
    state.timeLeft = cfg.time;
    if (cfg.hint) {
      const next = state.hotspots.find((h) => h.id === cfg.hint && !state.found.has(h.id))
        || state.hotspots.find((h) => !state.found.has(h.id));
      if (next) state.hint = { hs: next, t0: 0 };
    }
    toast(cfg.found + ' found — ' + remaining() + ' to go. Keep looking!');
    updateHud();
    draw(performance.now());
  }

  function init(refs) {
    els = refs;
    createInput(
      { leftCanvas: els.cvL, rightCanvas: els.cvR, stage: els.stage, cursor: els.kbCursor },
      { onPick, onHint: useHint, onPause: togglePause, onRestart: restartScene, onMute: () => els.btnMute.click() }
    );
    els.btnHint.addEventListener('click', useHint);
    els.btnPause.addEventListener('click', togglePause);
    els.btnRestart.addEventListener('click', restartScene);
    els.btnMute.addEventListener('click', () => {
      const m = Sound.toggleMute();
      els.btnMute.textContent = m ? 'Unmute' : 'Mute';
    });
    // Paint the first scene behind the title so the page is never blank.
    panelImages = { L: makePanelImage(SCENES[0], 'L'), R: makePanelImage(SCENES[0], 'R') };
    state.timeLeft = SCENES[0].time;
    updateHud();
    draw(performance.now());
    showTitle();
    requestAnimationFrame(frame);
  }

  return { init, startGame, startShot, state };
})();
