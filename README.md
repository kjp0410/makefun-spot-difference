# makefun-spot-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kjp0410/makefun-spot-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kjp0410/makefun-spot-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Second Glance is a spot-the-difference game for desktop browsers. Two hand-drawn pictures sit side by side and differ in a handful of places: click a difference in either picture to mark it on both. Three scenes — a harbour at dusk (5 differences), a lantern market (7) and a clockwork library (9) — each against its own countdown. Wrong clicks cost 3 seconds, three hints a game shimmer near something you missed, and every sound is synthesized live with WebAudio: no files, no network, no dependencies. Play with the mouse, or entirely by keyboard (arrows + Enter, H/P/R/M). The scenes are drawn in code from one painter per scene, so the two panels can never drift apart except exactly where a difference is planted.

## Run it

```sh
python3 -m http.server 8080 --directory game
```

Then open http://localhost:8080 in a desktop browser and play. (Opening game/index.html straight from disk works too.)

The hand-in program writes the entry — `game/`, `screenshots/` and `dossier.json` — to an output directory:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=4s3d9qw1&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
