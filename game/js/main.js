'use strict';
/*
 * main.js — bootstrap. Gathers the page elements, starts the game, and
 * honours the game's own screenshot states: ?shot=1..4 sets up a real
 * mid-game position, &still=1 freezes the animation clock so the frame
 * can be captured exactly (used to take the entry's screenshots).
 */

document.addEventListener('DOMContentLoaded', () => {
  const refs = {
    cvL: document.getElementById('cvL'),
    cvR: document.getElementById('cvR'),
    stage: document.getElementById('stage'),
    kbCursor: document.getElementById('kbCursor'),
    overlay: document.getElementById('overlay'),
    toast: document.getElementById('toast'),
    hudScene: document.getElementById('hudScene'),
    hudLeft: document.getElementById('hudLeft'),
    hudFound: document.getElementById('hudFound'),
    hudScore: document.getElementById('hudScore'),
    timeBar: document.getElementById('timeBar'),
    timeText: document.getElementById('timeText'),
    btnHint: document.getElementById('btnHint'),
    btnPause: document.getElementById('btnPause'),
    btnRestart: document.getElementById('btnRestart'),
    btnMute: document.getElementById('btnMute'),
  };
  SG.init(refs);

  const params = new URLSearchParams(location.search);
  const shot = parseInt(params.get('shot') || '', 10);
  if (shot >= 1 && shot <= 4) {
    SG.startShot(shot, params.get('still') === '1');
  }
});
