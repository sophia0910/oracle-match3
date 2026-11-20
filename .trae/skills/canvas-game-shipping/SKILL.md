---
name: canvas-game-shipping
description: Build and ship HTML5 Canvas games for browser and WeChat mini-game, with headless pixel verification and GitHub Pages deploys. Use when building, changing, or releasing a canvas game or mini-game. Do not use for ordinary web apps.
---

# Canvas Game Shipping

Procedures proven on oracle-match3. Adapt paths; keep the verification loop.

## Repo shape

- `index.html` loads plain script tags, then `game.js`. No build step.
- `game.js` is the shell: canvas, DPR, layout, state machine, input, all screens.
- `js/core.js` pure match logic; `js/data.js` content; `js/glyphs.js` image assets; `js/sfx.js` audio; optional `js/gif.js` encoder.
- Dual platform at the top of `game.js`:
  `var isWx = typeof wx !== 'undefined' && typeof wx.createCanvas === 'function';`
  then `require()` vs window globals. Use `wx.getWindowInfo()` for width/height/safeArea, `wx.getStorageSync` vs `localStorage`, `wx.shareAppMessage` for sharing.

## Layout rules

- `resize()` sets `canvas.width = viewW * dpr`, `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`, then recomputes layout.
- One `computeLayout()` yields content width, board rect, footer Y. Clamp cell size so 8 columns fit short screens.
- Respect `safeTop`. Anchor top blocks to the card top, footer blocks to the card bottom.
- Target 320x568 through 430x932. Cap card width near 440 and height near 820.
- Keep touch targets at least 44px. Shrink the visual pill if needed, enlarge its hit rect instead.

## Verification loop without vision

1. Syntax check without node:
   `/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -e "new Function(readFile('game.js'));'ok'"`
2. Serve: `python3 -m http.server 8765 --directory <repo>`.
3. Exact-size screenshots: headless Chrome ignores `--window-size` width. Wrap `index.html` in a same-origin `_one.html?w=&h=` iframe, screenshot at 520x960, then crop `(0,0,w,h)` with PIL.
4. Inspect a PNG with the Read tool and a target description; back it with PIL probes (bounding boxes, ink counts, color runs) for objective checks.
5. Interaction tests: same-origin iframe, dispatch `pointerdown`/`pointerup` or drag events, write `OUT[...]` to `document.title`, read via `--dump-dom | grep -o 'OUT\[[^]]*\]'`.
6. Virtual-time caveat: rapid `setTimeout` steps may not repaint between them. Assert the final state with a `--screenshot`, not intermediate canvas signatures.
7. If the project ships a debug bundle, regenerate it after every `game.js` edit (oracle-match3: `python3 /tmp/gen_debug.js.py` writes `_game_poster.js`).

## Deploy

- GitHub Pages serves `main` root. Commit source only; keep preview/test pages `_*` in `.gitignore`.
- Push with a clean git config: `GIT_CONFIG_GLOBAL=/dev/null GIT_TERMINAL_PROMPT=0 git push origin HEAD`.
- The `gh` CLI may need `GH_CONFIG_DIR=/tmp/ghconfig` and an explicit binary path.
- Poll builds: `gh api repos/<owner>/<repo>/pages/builds --jq '.[0] | "\(.status) \(.commit[0:7])"'` until `built`.

## Content and assets

- `data.js`: characters with `id/kai/gloss/kid/adult`; levels with `pool/req/moves/verse`.
- Keep a level near 24-32 moves for a 2-3 minute round, three target characters, one target word.
- Record glyph provenance in a code comment. Never label assets CC0 or 汉典 unless every file is verified; per-character scan sources differ.
- Persist progress as JSON `{unlocked, learned[], bigText}`; filter `learned` against current data on load.

## Input and state

- Build hit rects during drawing, reset them before each redraw.
- Swipe detection: require `|dx| >= 40` and `|dx| > 1.2 * |dy|`. Branch by screen and clamp navigation to the unlocked range.
- Test every new gesture with synthetic pointer events before shipping.

## Pitfalls

- Centralize font sizing in one `setFont(size)` so a big-text setting multiplies exactly once.
- Run every user-visible label through `fitText` when it can overflow.
- Do not trust `--window-size` for viewport width; wrap in a fixed iframe.
- Stale hit rects swallow taps when overlays close.
- `file://` pages cannot inspect `http://` iframe documents; serve the test page from the same origin.
