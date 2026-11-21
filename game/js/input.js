'use strict';
/*
 * input.js — mouse and keyboard play.
 *
 * Mouse: a click on either panel reports panel coordinates (600 x 460
 * scene space) to the game. Keyboard: the arrow keys / WASD raise a
 * crosshair that roams the whole stage; Enter or Space "clicks" wherever
 * it hovers. H, P, R and M are the hint, pause, restart and mute keys.
 */

function createInput(refs, handlers) {
  const { leftCanvas, rightCanvas, stage, cursor } = refs;

  function toSceneCoords(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (600 / rect.width),
      y: (clientY - rect.top) * (460 / rect.height),
    };
  }

  function bindPanel(canvas, panel) {
    canvas.addEventListener('click', (ev) => {
      const p = toSceneCoords(canvas, ev.clientX, ev.clientY);
      handlers.onPick(panel, p.x, p.y);
    });
  }
  bindPanel(leftCanvas, 'L');
  bindPanel(rightCanvas, 'R');

  // Keyboard crosshair, positioned in stage coordinates.
  const cross = { x: 0, y: 0, active: false };
  const STEP = 14;

  function stagePointFor(panel, x, y) {
    const canvas = panel === 'L' ? leftCanvas : rightCanvas;
    const stageRect = stage.getBoundingClientRect();
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left - stageRect.left + (x / 600) * rect.width,
      y: rect.top - stageRect.top + (y / 460) * rect.height,
    };
  }

  function panelPointFromStage(px, py) {
    for (const [panel, canvas] of [['L', leftCanvas], ['R', rightCanvas]]) {
      const stageRect = stage.getBoundingClientRect();
      const rect = canvas.getBoundingClientRect();
      const lx = px - (rect.left - stageRect.left);
      const ly = py - (rect.top - stageRect.top);
      if (lx >= 0 && ly >= 0 && lx <= rect.width && ly <= rect.height) {
        return { panel, x: lx * (600 / rect.width), y: ly * (460 / rect.height) };
      }
    }
    return null;
  }

  function showCursor() {
    if (!cross.active) {
      cross.active = true;
      const start = stagePointFor('L', 300, 230);
      cross.x = start.x;
      cross.y = start.y;
      cursor.style.display = 'block';
    }
  }

  function moveCursor(dx, dy) {
    showCursor();
    const rect = stage.getBoundingClientRect();
    cross.x = Math.max(0, Math.min(rect.width, cross.x + dx));
    cross.y = Math.max(0, Math.min(rect.height, cross.y + dy));
    cursor.style.left = cross.x + 'px';
    cursor.style.top = cross.y + 'px';
  }

  window.addEventListener('keydown', (ev) => {
    const k = ev.key;
    if (k === 'ArrowLeft' || k === 'a') { moveCursor(-STEP, 0); ev.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd') { moveCursor(STEP, 0); ev.preventDefault(); }
    else if (k === 'ArrowUp' || k === 'w') { moveCursor(0, -STEP); ev.preventDefault(); }
    else if (k === 'ArrowDown' || k === 's') { moveCursor(0, STEP); ev.preventDefault(); }
    else if ((k === 'Enter' || k === ' ') && cross.active) {
      const hit = panelPointFromStage(cross.x, cross.y);
      if (hit) handlers.onPick(hit.panel, hit.x, hit.y);
      ev.preventDefault();
    }
    else if (k === 'h' || k === 'H') handlers.onHint();
    else if (k === 'p' || k === 'P') handlers.onPause();
    else if (k === 'r' || k === 'R') handlers.onRestart();
    else if (k === 'm' || k === 'M') handlers.onMute();
  });

  return { moveCursor };
}
