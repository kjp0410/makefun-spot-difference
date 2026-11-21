'use strict';
/*
 * scenes.js — the three picture pairs of Second Glance.
 *
 * Each scene is painted by one function that draws BOTH panels: it receives
 * the side ('L' or 'R') and asks diff() for every value that changes between
 * the two pictures. diff() returns the left or right value and registers a
 * hotspot, so the clickable regions always match what is actually drawn.
 * Everything else is drawn identically on both sides.
 */

let activeSide = 'L';
let activeDiffs = [];

function beginPaint(side) {
  activeSide = side;
  activeDiffs = [];
}

function diff(id, x, y, r, label, leftValue, rightValue) {
  activeDiffs.push({ id, x, y, r, label });
  return activeSide === 'L' ? leftValue : rightValue;
}

function collectedDiffs() {
  return activeDiffs;
}

/* Deterministic pseudo-random from an index, so both panels agree. */
function rnd(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------ */
/* Scene 1 — Harbour at Dusk (5 differences)                           */
/* ------------------------------------------------------------------ */

function paintHarbour(ctx) {
  // Sky and sea
  ctx.fillStyle = verticalGradient(ctx, 0, 300, [[0, '#2e3a67'], [0.55, '#b8557a'], [1, '#f2a65a']]);
  ctx.fillRect(0, 0, 600, 300);
  ctx.fillStyle = verticalGradient(ctx, 300, 460, [[0, '#35507a'], [1, '#1d2f52']]);
  ctx.fillRect(0, 300, 600, 160);

  // Sun low on the horizon, with a soft glow
  fillCircle(ctx, 170, 288, 58, 'rgba(255, 190, 110, 0.25)');
  fillCircle(ctx, 170, 288, 34, '#ffd98a');

  // Distant hills along the horizon
  fillPoly(ctx, [[0, 300], [0, 268], [70, 252], [150, 272], [210, 300]], '#5a4470');
  fillPoly(ctx, [[390, 300], [450, 262], [520, 278], [600, 258], [600, 300]], '#54406a');

  drawCloud(ctx, 92, 58, 1.1, 'rgba(255, 183, 165, 0.8)');
  drawCloud(ctx, 438, 76, 0.9, 'rgba(255, 183, 165, 0.65)');
  drawCloud(ctx, 252, 128, 0.7, 'rgba(240, 160, 150, 0.55)');

  drawGull(ctx, 118, 96, 1, '#2c2c44');
  const gullPresent = diff('gull', 152, 88, 20, 'One gull has flown away', true, false);
  if (gullPresent) drawGull(ctx, 152, 88, 0.9, '#2c2c44');
  drawGull(ctx, 322, 68, 1.1, '#2c2c44');

  // Rocky point and lighthouse on the right
  fillPoly(ctx, [[452, 360], [470, 306], [520, 292], [566, 308], [584, 360]], '#3d3550');
  fillPoly(ctx, [[452, 360], [584, 360], [584, 372], [452, 372]], '#332c46');
  fillPoly(ctx, [[497, 306], [533, 306], [527, 196], [503, 196]], '#e8e2d4'); // tower
  fillPoly(ctx, [[500, 268], [530, 268], [528, 240], [502, 240]], '#c8452c'); // band
  fillPoly(ctx, [[503, 214], [527, 214], [526, 196], [504, 196]], '#c8452c'); // band
  fillRect(ctx, 498, 188, 34, 10, '#4a3b30');
  fillPoly(ctx, [[493, 188], [537, 188], [515, 168]], '#33302e'); // roof
  const lampLit = diff('lamp', 515, 174, 24, 'The lighthouse lamp', true, false);
  if (lampLit) {
    fillPoly(ctx, [[503, 168], [503, 182], [392, 208], [398, 150]], 'rgba(255, 224, 138, 0.20)');
    fillCircle(ctx, 515, 175, 17, 'rgba(255, 224, 138, 0.5)');
    fillCircle(ctx, 515, 175, 8, '#ffe98a');
  } else {
    fillCircle(ctx, 515, 175, 8, '#5a606e');
  }
  fillRect(ctx, 511, 232, 8, 14, '#4a3b30');

  // Quay and houses on the left
  fillRect(ctx, 0, 330, 336, 24, '#4a4356');
  fillRect(ctx, 0, 330, 336, 5, '#665c74');
  const houseCols = ['#7a4a56', '#5d5a7a', '#86604a'];
  const roofCols = ['#3a3049', '#33283f', '#40342c'];
  for (let i = 0; i < 3; i++) {
    const hx = 18 + i * 102;
    fillRect(ctx, hx, 262, 84, 68, houseCols[i]);
    fillPoly(ctx, [[hx - 6, 262], [hx + 90, 262], [hx + 42, 226]], roofCols[i]);
    fillRect(ctx, hx + 34, 296, 16, 34, '#2e2430');
    fillRect(ctx, hx + 10, 276, 13, 15, '#23283d');
    fillRect(ctx, hx + 61, 276, 13, 15, '#23283d');
  }
  // One window of the first house is lit in one picture only
  const windowLit = diff('window', 62, 292, 15, 'A harbour house window', true, false);
  fillRect(ctx, 55, 284, 14, 17, windowLit ? '#ffd76a' : '#23283d');
  strokeLine(ctx, 62, 284, 62, 301, '#4a3b30', 2);
  strokeLine(ctx, 55, 292, 69, 292, '#4a3b30', 2);

  // Lamp posts on the quay (the same in both pictures)
  for (const lx of [150, 268]) {
    strokeLine(ctx, lx, 330, lx, 292, '#241f2e', 4);
    fillCircle(ctx, lx, 288, 5, '#ffca7a');
    fillCircle(ctx, lx, 288, 11, 'rgba(255, 202, 122, 0.25)');
  }

  // Crates on the quay
  fillRect(ctx, 296, 306, 24, 24, '#8a6a44');
  fillRect(ctx, 322, 312, 18, 18, '#75582f');

  // Sailboat, left of centre
  fillPoly(ctx, [[168, 372], [266, 372], [250, 394], [184, 394]], '#6e3b2a');
  fillRect(ctx, 168, 368, 98, 6, '#8a5138');
  strokeLine(ctx, 216, 372, 216, 238, '#4a3423', 4);
  fillPoly(ctx, [[220, 246], [220, 362], [264, 362]], '#f2ead8');
  fillPoly(ctx, [[212, 258], [212, 358], [180, 358]], '#e3d5bd');
  const flagColor = diff('flag', 224, 232, 18, 'The sailboat flag', '#e0483e', '#3e7fe0');
  fillPoly(ctx, [[216, 222], [216, 238], [236, 230]], flagColor);

  // Small boat silhouette, right of centre
  fillPoly(ctx, [[382, 388], [428, 388], [418, 402], [392, 402]], '#2c3a5e');
  strokeLine(ctx, 405, 388, 405, 356, '#2c3a5e', 3);
  fillPoly(ctx, [[408, 360], [408, 386], [424, 386]], '#46586f');

  // Buoy in the foreground: the number of white bands changes
  const bands = diff('buoy', 432, 400, 24, 'The buoy bands', 3, 2);
  fillPoly(ctx, [[416, 380], [448, 380], [442, 420], [422, 420]], '#c23b2e');
  ctx.fillStyle = '#f2ead8';
  for (let i = 0; i < bands; i++) ctx.fillRect(419 + i * 1, 390 + i * 11, 26 - i * 2, 5);
  strokeLine(ctx, 432, 380, 432, 368, '#7a241c', 3);
  fillCircle(ctx, 432, 366, 4, '#7a241c');

  // Sparkles on the water
  ctx.strokeStyle = 'rgba(255, 217, 138, 0.5)';
  ctx.lineWidth = 2;
  for (const [sx, sy, sl] of [[120, 322, 16], [196, 336, 22], [150, 356, 12], [300, 420, 18], [520, 428, 20], [70, 428, 14]]) {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + sl, sy);
    ctx.stroke();
  }
}

/* ------------------------------------------------------------------ */
/* Scene 2 — Lantern Market (7 differences)                            */
/* ------------------------------------------------------------------ */

function paintMarket(ctx) {
  ctx.fillStyle = verticalGradient(ctx, 0, 360, [[0, '#131b3a'], [1, '#2c2a55']]);
  ctx.fillRect(0, 0, 600, 360);
  fillRect(ctx, 0, 360, 600, 100, '#38324e');

  // Stars
  for (let i = 0; i < 26; i++) {
    const sx = rnd(i * 3 + 1) * 580 + 10;
    const sy = rnd(i * 7 + 2) * 150 + 8;
    fillCircle(ctx, sx, sy, 1.4, 'rgba(255,255,255,0.7)');
  }

  // Moon: the crescent faces the other way in one picture
  const moonDir = diff('moon', 522, 56, 24, 'The crescent moon', 1, -1);
  fillCircle(ctx, 522, 56, 21, '#f5eeda');
  fillCircle(ctx, 522 + 11 * moonDir, 50, 17, '#171f42');

  // Rooftop silhouettes
  fillPoly(ctx, [[0, 210], [60, 168], [130, 210]], '#1c2342');
  fillPoly(ctx, [[440, 216], [520, 162], [600, 216], [600, 240], [440, 240]], '#1c2342');
  fillRect(ctx, 0, 208, 600, 10, '#1c2342');

  // Lantern string across the top
  ctx.strokeStyle = '#0e1330';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 26);
  ctx.quadraticCurveTo(300, 96, 600, 26);
  ctx.stroke();
  const stringCols = ['#e86a5a', '#f2b04a', '#7ac74f', '#5aa9e6', '#b07fe8', '#e86a5a'];
  for (let i = 0; i < 6; i++) {
    const lx = 52 + i * 58;
    const ly = 44 + Math.sin((i + 0.5) / 6 * Math.PI) * 26;
    if (i === 3) continue; // the big centre lantern hangs here instead
    fillEllipse(ctx, lx, ly, 11, 14, stringCols[i]);
    fillRect(ctx, lx - 4, ly - 17, 8, 4, '#8a6a2f');
    fillCircle(ctx, lx, ly, 15, 'rgba(255, 210, 130, 0.10)');
  }
  // The big centre lantern changes colour
  const lanternColor = diff('lantern', 300, 88, 26, 'The big lantern', '#ff9f43', '#2fd4c4');
  fillCircle(ctx, 300, 88, 34, 'rgba(255, 210, 130, 0.13)');
  fillEllipse(ctx, 300, 88, 24, 29, lanternColor);
  fillRect(ctx, 290, 55, 20, 6, '#8a6a2f');
  fillRect(ctx, 290, 115, 20, 6, '#8a6a2f');
  strokeLine(ctx, 300, 121, 300, 138, '#c23b2e', 3);

  // Cobbles
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 30; i++) {
    fillEllipse(ctx, rnd(i * 11) * 580 + 10, 378 + rnd(i * 13) * 70, 16, 5, 'rgba(255,255,255,0.05)');
  }

  /* Left stall */
  fillRect(ctx, 44, 218, 8, 142, '#5a4028');
  fillRect(ctx, 224, 218, 8, 142, '#5a4028');
  for (let i = 0; i < 6; i++) fillRect(ctx, 34 + i * 35, 196, 18, 26, i % 2 ? '#c8452c' : '#f2ead8');
  fillPoly(ctx, [[30, 196], [238, 196], [224, 222], [44, 222]], '#a03a28');
  fillRect(ctx, 36, 316, 200, 14, '#6e4f30');
  fillRect(ctx, 36, 330, 200, 30, '#54391f');
  // Jars and baskets on the counter
  fillEllipse(ctx, 76, 306, 14, 17, '#b07a3f');
  fillEllipse(ctx, 108, 310, 11, 13, '#8e9e4f');
  fillPoly(ctx, [[140, 316], [172, 316], [164, 296], [148, 296]], '#a5713a');
  fillCircle(ctx, 150, 294, 6, '#e86a5a');
  fillCircle(ctx, 162, 294, 6, '#f2b04a');
  fillCircle(ctx, 156, 288, 6, '#7ac74f');

  // Teapot on the left stall: steam in one picture only
  const steam = diff('steam', 196, 262, 20, 'Steam over the teapot', true, false);
  fillEllipse(ctx, 196, 296, 20, 14, '#7f8c99');
  fillCircle(ctx, 196, 284, 7, '#6b7885');
  fillPoly(ctx, [[214, 292], [228, 284], [216, 300]], '#7f8c99');
  if (steam) {
    ctx.strokeStyle = 'rgba(230, 238, 245, 0.75)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (const off of [-8, 4]) {
      ctx.beginPath();
      ctx.moveTo(196 + off, 272);
      ctx.quadraticCurveTo(190 + off, 260, 196 + off, 250);
      ctx.quadraticCurveTo(202 + off, 240, 196 + off, 230);
      ctx.stroke();
    }
  }

  // Cat on a crate: its tail curls the other way in one picture
  const tailDir = diff('cat', 116, 348, 24, 'The market cat', 1, -1);
  fillRect(ctx, 84, 356, 66, 34, '#6e4f30');
  fillRect(ctx, 84, 356, 66, 6, '#86643c');
  fillEllipse(ctx, 116, 344, 22, 13, '#2e2a33');
  fillCircle(ctx, 134, 330, 11, '#2e2a33');
  fillPoly(ctx, [[126, 322], [130, 310], [136, 320]], '#2e2a33');
  fillPoly(ctx, [[136, 320], [142, 310], [144, 322]], '#2e2a33');
  fillCircle(ctx, 131, 329, 1.8, '#ffd76a');
  fillCircle(ctx, 140, 329, 1.8, '#ffd76a');
  ctx.strokeStyle = '#2e2a33';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(96, 350);
  ctx.quadraticCurveTo(96 - 20 * tailDir, 344, 92 - 24 * tailDir, 324);
  ctx.stroke();

  /* Sign board between the stalls: one glyph stroke is missing in one picture */
  fillRect(ctx, 252, 138, 58, 66, '#7a5a34');
  fillRect(ctx, 258, 144, 46, 54, '#e8dcc0');
  ctx.strokeStyle = '#33302e';
  ctx.lineWidth = 4;
  ctx.strokeRect(266, 152, 30, 38);
  strokeLine(ctx, 266, 164, 296, 164, '#33302e', 4);
  const glyphStroke = diff('sign', 281, 176, 18, 'The sign painter missed a stroke', true, false);
  if (glyphStroke) strokeLine(ctx, 268, 176, 294, 176, '#33302e', 4);
  strokeLine(ctx, 281, 164, 281, 190, '#33302e', 4);

  /* Right stall */
  fillRect(ctx, 372, 218, 8, 142, '#5a4028');
  fillRect(ctx, 552, 218, 8, 142, '#5a4028');
  const awningColor = diff('awning', 466, 198, 28, 'The right stall awning', '#8e6cc8', '#5aa469');
  fillPoly(ctx, [[362, 222], [570, 222], [556, 192], [376, 192]], awningColor);
  for (let i = 0; i < 5; i++) fillRect(ctx, 386 + i * 36, 196, 16, 24, 'rgba(255,255,255,0.20)');
  fillRect(ctx, 364, 316, 200, 14, '#6e4f30');
  fillRect(ctx, 364, 330, 200, 30, '#54391f');
  // Pots and a pumpkin pile
  fillEllipse(ctx, 404, 304, 13, 16, '#7a9e4f');
  fillEllipse(ctx, 434, 308, 11, 12, '#b07a3f');
  fillCircle(ctx, 500, 306, 13, '#e07f2e');
  fillCircle(ctx, 524, 310, 10, '#e07f2e');
  fillCircle(ctx, 512, 296, 9, '#eda63f');

  // String of chillies under the right stall beam: there in one picture only
  const chillies = diff('chillies', 452, 248, 18, 'The string of chillies', true, false);
  if (chillies) {
    strokeLine(ctx, 452, 222, 452, 236, '#8a6a2f', 2);
    for (let i = 0; i < 5; i++) fillEllipse(ctx, 452, 242 + i * 9, 4, 6, '#d43a2a');
  }

  // Hanging lamps and stools
  for (const [lx, ly] of [[250, 250], [340, 236]]) {
    strokeLine(ctx, lx, ly - 26, lx, ly, '#0e1330', 2);
    fillCircle(ctx, lx, ly + 4, 8, '#ffca7a');
    fillCircle(ctx, lx, ly + 4, 16, 'rgba(255, 202, 122, 0.18)');
  }
  fillRect(ctx, 268, 372, 30, 10, '#5a4028');
  fillRect(ctx, 470, 380, 34, 10, '#5a4028');
}

/* ------------------------------------------------------------------ */
/* Scene 3 — The Clockwork Library (9 differences)                     */
/* ------------------------------------------------------------------ */

function bookRow(ctx, x, y, w, seed) {
  // A row of book spines with deterministic heights and colours.
  const cols = ['#a03a28', '#2e5a7a', '#5a7a3a', '#8a6a2f', '#6a3a6e', '#b07a3f', '#385a4a', '#94552e'];
  let bx = x;
  let i = 0;
  while (bx < x + w - 10) {
    const bw = 9 + rnd(seed + i * 3) * 7;
    const bh = 34 + rnd(seed + i * 5) * 12;
    ctx.fillStyle = cols[Math.floor(rnd(seed + i * 7) * cols.length)];
    ctx.fillRect(bx, y - bh, bw, bh);
    ctx.fillRect(bx, y - bh + 5, bw, 3, 'rgba(255,235,190,0.35)');
    bx += bw + 2;
    i++;
  }
}

function paintLibrary(ctx) {
  ctx.fillStyle = verticalGradient(ctx, 0, 380, [[0, '#4a3226'], [1, '#6b4a2f']]);
  ctx.fillRect(0, 0, 600, 380);
  fillRect(ctx, 0, 380, 600, 80, '#54381f');
  for (let i = 0; i < 6; i++) strokeLine(ctx, 0, 392 + i * 12, 600, 392 + i * 12, 'rgba(0,0,0,0.18)', 2);
  fillEllipse(ctx, 310, 408, 190, 30, '#7a3038');
  fillEllipse(ctx, 310, 408, 150, 21, '#8e3a42');

  /* Window, top left, with a star that vanishes */
  fillRect(ctx, 30, 28, 112, 128, '#1d2440');
  for (const [sx, sy] of [[52, 52], [86, 84], [58, 118], [118, 128]]) drawStar(ctx, sx, sy, 4, '#f5eeda');
  const starPresent = diff('star', 110, 56, 15, 'A star over the library', true, false);
  if (starPresent) drawStar(ctx, 110, 56, 5, '#f5eeda');
  fillCircle(ctx, 122, 138, 10, '#e8e2d4');
  fillRect(ctx, 26, 24, 120, 8, '#33241a');
  fillRect(ctx, 26, 152, 120, 8, '#33241a');
  fillRect(ctx, 26, 24, 8, 136, '#33241a');
  fillRect(ctx, 138, 24, 8, 136, '#33241a');
  strokeLine(ctx, 86, 28, 86, 156, '#33241a', 5);

  /* The great clock: it tells a different time in one picture */
  fillCircle(ctx, 300, 102, 47, '#8a6a2f');
  fillCircle(ctx, 300, 102, 40, '#f2ead8');
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    strokeLine(ctx, 300 + Math.cos(a) * 33, 102 + Math.sin(a) * 33, 300 + Math.cos(a) * 37, 102 + Math.sin(a) * 37, '#4a3b30', 2);
  }
  // Clock angles: 0 points up (12), growing clockwise. Minute hand is up in
  // both pictures; the hour hand reads 3:00 in one and 5:00 in the other.
  const hourAngle = diff('clock', 300, 102, 30, 'The library clock', Math.PI / 2, Math.PI * 5 / 6);
  strokeLine(ctx, 300, 102, 300, 102 - 26, '#33302e', 4);
  strokeLine(ctx, 300, 102, 300 + Math.sin(hourAngle) * 19, 102 - Math.cos(hourAngle) * 19, '#33302e', 5);
  fillCircle(ctx, 300, 102, 4, '#8a6a2f');
  // Brass gears beside the clock
  for (const [gx, gy, gr] of [[238, 62, 13], [362, 58, 10]]) {
    ctx.strokeStyle = '#c9a44f';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      strokeLine(ctx, gx + Math.cos(a) * gr, gy + Math.sin(a) * gr, gx + Math.cos(a) * (gr + 5), gy + Math.sin(a) * (gr + 5), '#c9a44f', 4);
    }
  }

  /* Bookshelves */
  for (const sx of [168, 356]) {
    fillRect(ctx, sx, 168, 150, 196, '#3a281a');
    for (let r = 0; r < 3; r++) {
      const sy = 216 + r * 52;
      bookRow(ctx, sx + 8, sy, 134, sx + r * 40);
      fillRect(ctx, sx + 4, sy, 142, 6, '#54391f');
    }
    fillRect(ctx, sx, 160, 150, 10, '#54391f');
  }
  // One book spine changes colour
  const bookColor = diff('book', 240, 196, 15, 'A book on the second shelf', '#c23b2e', '#2e6ac2');
  fillRect(ctx, 233, 172, 14, 44, bookColor);
  fillRect(ctx, 233, 178, 14, 3, 'rgba(255,235,190,0.4)');

  // Ladder leaning on the right shelf
  ctx.strokeStyle = '#8a6a44';
  ctx.lineWidth = 5;
  strokeLine(ctx, 486, 364, 448, 190, '#8a6a44', 5);
  strokeLine(ctx, 512, 364, 474, 190, '#8a6a44', 5);
  for (let i = 0; i < 5; i++) {
    const t = i / 5;
    strokeLine(ctx, 486 - 38 * t - 4, 356 - 166 * t, 512 - 38 * t + 4, 356 - 166 * t, '#8a6a44', 4);
  }

  /* Owl on its stand: eyes open in one picture, shut in the other */
  strokeLine(ctx, 88, 356, 88, 268, '#4a3423', 6);
  strokeLine(ctx, 62, 268, 114, 268, '#4a3423', 6);
  fillEllipse(ctx, 88, 238, 21, 27, '#7a5a34');
  fillEllipse(ctx, 88, 246, 13, 18, '#c9b088');
  fillCircle(ctx, 88, 216, 16, '#8a6a44');
  fillPoly(ctx, [[74, 206], [78, 194], [84, 204]], '#7a5a34');
  fillPoly(ctx, [[92, 204], [98, 194], [102, 206]], '#7a5a34');
  const eyesOpen = diff('owl', 88, 216, 19, 'The owl is awake — or not', true, false);
  if (eyesOpen) {
    fillCircle(ctx, 82, 216, 4.6, '#fff');
    fillCircle(ctx, 94, 216, 4.6, '#fff');
    fillCircle(ctx, 82, 216, 2.2, '#1d1d24');
    fillCircle(ctx, 94, 216, 2.2, '#1d1d24');
  } else {
    ctx.strokeStyle = '#33302e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(82, 214, 4.4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(94, 214, 4.4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  fillPoly(ctx, [[88, 222], [84, 228], [92, 228]], '#e8a33d');

  /* Desk on the right */
  fillRect(ctx, 376, 330, 204, 12, '#4a3423');
  fillRect(ctx, 384, 342, 12, 44, '#3a281a');
  fillRect(ctx, 560, 342, 12, 44, '#3a281a');

  // Potion flask: the liquid changes colour
  const potionColor = diff('potion', 428, 302, 18, 'The potion flask', '#57d977', '#b45ae0');
  fillCircle(ctx, 428, 306, 17, potionColor);
  fillRect(ctx, 422, 276, 12, 16, '#cfd8dc');
  fillCircle(ctx, 428, 306, 17, 'rgba(255,255,255,0.10)');
  fillCircle(ctx, 422, 300, 4, 'rgba(255,255,255,0.5)');
  strokeLine(ctx, 411, 323, 445, 323, '#90a4ae', 2);

  // Candles: one flame is out in one picture
  const thirdFlame = diff('candles', 522, 284, 19, 'The third candle', true, false);
  const candleXs = [496, 512, 528];
  const candleHs = [30, 40, 34];
  for (let i = 0; i < 3; i++) {
    fillRect(ctx, candleXs[i] - 5, 330 - candleHs[i], 10, candleHs[i], '#e8e2d4');
    if (i < 2 || thirdFlame) {
      fillEllipse(ctx, candleXs[i], 330 - candleHs[i] - 8, 4, 8, '#ffb84d');
      fillCircle(ctx, candleXs[i], 330 - candleHs[i] - 8, 13, 'rgba(255, 184, 77, 0.18)');
    } else {
      strokeLine(ctx, candleXs[i], 330 - candleHs[i], candleXs[i], 330 - candleHs[i] - 6, '#555', 2);
    }
  }
  fillRect(ctx, 488, 330, 52, 5, '#8a6a2f');

  // Stack of books and a teacup on the desk
  fillRect(ctx, 452, 318, 34, 10, '#2e5a7a');
  fillRect(ctx, 456, 308, 28, 10, '#a03a28');
  fillEllipse(ctx, 560, 324, 11, 6, '#e8e2d4');
  fillRect(ctx, 551, 318, 18, 7, '#e8e2d4');

  /* Globe on its side table: one landmass is missing in one picture */
  fillRect(ctx, 118, 356, 66, 8, '#4a3423');
  fillRect(ctx, 124, 364, 8, 22, '#3a281a');
  fillRect(ctx, 170, 364, 8, 22, '#3a281a');
  fillCircle(ctx, 151, 322, 27, '#3e7fb8');
  fillEllipse(ctx, 138, 310, 10, 7, '#5aa469');
  fillEllipse(ctx, 166, 336, 8, 6, '#5aa469');
  const landPresent = diff('globe', 158, 318, 22, 'A continent on the globe', true, false);
  if (landPresent) fillEllipse(ctx, 158, 318, 9, 6, '#7ac74f');
  ctx.strokeStyle = '#8a6a2f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(151, 322, 30, 0, Math.PI * 2);
  ctx.stroke();

  /* Key on its hook: there in one picture, gone in the other */
  fillRect(ctx, 528, 158, 34, 26, '#3a281a');
  const keyPresent = diff('key', 545, 184, 15, 'The brass key', true, false);
  if (keyPresent) {
    strokeCircle(ctx, 545, 176, 5, '#e8c85a', 3);
    strokeLine(ctx, 545, 181, 545, 196, '#e8c85a', 3);
    strokeLine(ctx, 545, 190, 551, 190, '#e8c85a', 3);
    strokeLine(ctx, 545, 196, 551, 196, '#e8c85a', 3);
  }

  /* Plant by the desk: a leaf is missing in one picture */
  const leafCount = diff('plant', 566, 330, 19, 'The plant by the desk', 5, 4);
  fillPoly(ctx, [[548, 356], [584, 356], [578, 386], [554, 386]], '#a0522d');
  const leafAngles = [-0.9, -0.45, 0, 0.45, 0.9];
  for (let i = 0; i < leafCount; i++) {
    const a = leafAngles[i] - Math.PI / 2;
    const lx = 566 + Math.cos(a) * 26;
    const ly = 348 + Math.sin(a) * 26;
    strokeLine(ctx, 566, 352, lx, ly, '#3e7a3a', 3);
    fillEllipse(ctx, lx, ly, 9, 5, '#57a047');
  }

  // Pendant lamp glow, the same in both pictures
  strokeLine(ctx, 300, 0, 300, 26, '#241a12', 3);
  fillPoly(ctx, [[282, 44], [318, 44], [306, 26], [294, 26]], '#8a6a2f');
  fillCircle(ctx, 300, 48, 6, '#ffca7a');
  fillCircle(ctx, 300, 48, 26, 'rgba(255, 202, 122, 0.10)');
}

const SCENES = [
  { id: 'harbour', name: 'Harbour at Dusk', time: 150, paint: paintHarbour },
  { id: 'market', name: 'Lantern Market', time: 200, paint: paintMarket },
  { id: 'library', name: 'The Clockwork Library', time: 260, paint: paintLibrary },
];
