/* 甲骨消消乐 · 微信小游戏主程序（十五契垂直切片） */
(function () {
  'use strict';

  var isWx = typeof wx !== 'undefined' && typeof wx.createCanvas === 'function';
  var Core = isWx ? require('./js/core.js') : window.OracleCore;
  var Glyphs = isWx ? require('./js/glyphs.js') : window.OracleGlyphs;
  var Data = isWx ? require('./js/data.js') : window.OracleData;
  var Sfx = isWx ? require('./js/sfx.js') : window.OracleSfx;
  var Evo = null;
  try {
    Evo = isWx ? require('./js/evo-data.js') : window.OracleEvo;
  } catch (e) { Evo = null; }
  var Gif = null;
  try {
    Gif = isWx ? require('./js/gif.js') : window.OracleGif;
  } catch (e) { Gif = null; }

  var SIZE = Core.SIZE;
  var LEVEL_COUNT = Data.LEVELS.length;

  var C = {
    bgTop: '#F8F0DF',
    bgMid: '#F1E4CC',
    bgBottom: '#E3D0AE',
    panel: '#E7D6B7',
    tile: '#FCF6E8',
    tileBorder: 'rgba(122,96,62,0.26)',
    ink: '#33291F',
    inkSoft: 'rgba(58,45,30,0.58)',
    inkFaint: 'rgba(58,45,30,0.38)',
    red: '#A83A2A',
    gold: '#B4914E',
    cream: '#FBF3E2'
  };

  /* ---------------- 环境与画布 ---------------- */

  var canvas, ctx, viewW, viewH, dpr, safeTop, layout;
  var isBrowser = !isWx;

  if (isWx) {
    canvas = wx.createCanvas();
    var winInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    viewW = winInfo.screenWidth || winInfo.windowWidth;
    viewH = winInfo.screenHeight || winInfo.windowHeight;
    dpr = Math.min(winInfo.pixelRatio || 1, 3);
    safeTop = (winInfo.safeArea && winInfo.safeArea.top) || winInfo.statusBarHeight || 0;
  } else {
    canvas = document.getElementById('game');
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    safeTop = 0;
    canvas.style.touchAction = 'none';
  }

  ctx = canvas.getContext('2d');

  function resize() {
    if (!isWx) {
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 3);
    }
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    if (!isWx) {
      canvas.style.width = viewW + 'px';
      canvas.style.height = viewH + 'px';
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computeLayout();
  }

  function computeLayout() {
    var contentW = Math.min(viewW - 24, 440);
    var x = (viewW - contentW) / 2;
    var top = safeTop + 8;
    var headerH = 30;
    var panelY = top + headerH + 6;
    var panelH = 88;
    var boardTop = panelY + panelH + 12;
    var avail = viewH - boardTop - 68;
    var cell = Math.floor(Math.min((contentW - 16) / 8, avail / 8));
    cell = Math.max(22, Math.min(52, cell));
    var boardSize = cell * 8 + 16;
    var boardX = (viewW - boardSize) / 2;
    var boardY = boardTop + Math.max(0, (avail - boardSize) / 2);

    layout = {
      contentW: contentW,
      x: x,
      top: top,
      panel: { x: x, y: panelY, w: contentW, h: panelH },
      board: { x: boardX, y: boardY, size: boardSize, cell: cell, pad: 8 },
      footerY: boardY + boardSize + 14
    };
  }

  function tileCenter(r, c) {
    var b = layout.board;
    return {
      x: b.x + b.pad + c * b.cell + b.cell / 2,
      y: b.y + b.pad + r * b.cell + b.cell / 2
    };
  }

  /* ---------------- 进度存储 ---------------- */

  var STORE_KEY = 'oracle_slice_progress';

  function loadProgress() {
    try {
      var raw = isWx ? wx.getStorageSync(STORE_KEY) : window.localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!obj || typeof obj !== 'object') return null;
      return obj;
    } catch (e) {
      return null;
    }
  }

  function saveProgress() {
    try {
      var raw = JSON.stringify(progress);
      if (isWx) wx.setStorageSync(STORE_KEY, raw);
      else window.localStorage.setItem(STORE_KEY, raw);
    } catch (e) { /* 忽略存储异常 */ }
  }

  var progress = { unlocked: 1, learned: [], bigText: false };
  var stored = loadProgress();
  if (stored) {
    if (stored.bigText === true) progress.bigText = true;
    if (typeof stored.unlocked === 'number') {
      progress.unlocked = Math.max(1, Math.min(LEVEL_COUNT, Math.floor(stored.unlocked)));
    }
    if (Object.prototype.toString.call(stored.learned) === '[object Array]') {
      progress.learned = stored.learned.filter(function (id) {
        return !!Data.BY_ID[id];
      });
    }
    /* 旧存档只记了每契目标字：补齐该契应识的另外两字，并顺势解锁下一契 */
    for (var li = 0; li < Data.LEVELS.length; li++) {
      var olv = Data.LEVELS[li];
      if (!olv.learn || progress.learned.indexOf(olv.char) < 0) continue;
      for (var lj = 0; lj < olv.learn.length; lj++) {
        if (progress.learned.indexOf(olv.learn[lj]) < 0) progress.learned.push(olv.learn[lj]);
      }
      progress.unlocked = Math.max(progress.unlocked,
        Math.min(LEVEL_COUNT, li + 2));
    }
    saveProgress();
  }

  /* ---------------- 分享挑战 ---------------- */

  var challenge = null;
  var lastQuery = '';

  function applyQuery(q) {
    if (!q) return false;
    var n = parseInt(q.lv, 10);
    if (!(n >= 1 && n <= LEVEL_COUNT)) return false;
    var s = parseInt(q.step, 10);
    s = s >= 1 && s <= 200 ? s : 0;
    var key = n + ':' + s;
    if (key === lastQuery) return false;
    lastQuery = key;
    challenge = { level: n - 1, step: s, done: false, mine: 0 };
    progress.unlocked = Math.max(progress.unlocked, n);
    saveProgress();
    return true;
  }

  function readLaunch() {
    if (!isWx || !wx.getLaunchOptionsSync) return;
    try {
      applyQuery(wx.getLaunchOptionsSync().query);
    } catch (e) { /* 忽略 */ }
  }

  function watchShow() {
    if (!isWx || !wx.onShow) return;
    try {
      wx.onShow(function (res) {
        if (applyQuery(res && res.query)) goHome();
      });
    } catch (e) { /* 忽略 */ }
  }

  function shareChallenge(full) {
    if (!isWx || !wx.shareAppMessage) {
      showToast('微信内才能分享');
      return;
    }
    var lv = levelConfig();
    var used = state.steps || 1;
    var title = full
      ? '甲骨消消乐 · 我已 ' + LEVEL_COUNT + ' 契圆满，识得 ' + Data.CHARS.length + ' 字，来闯「' + lv.title + '」？'
      : '甲骨消消乐 · 我在「' + lv.title + ' · ' + Data.char(lv.char).kai
        + '」用了 ' + used + ' 步成文，敢来挑战？';
    try {
      wx.shareAppMessage({
        title: title,
        query: 'lv=' + (state.levelIndex + 1) + '&step=' + used
      });
    } catch (e) { /* 忽略 */ }
  }

  function recordChallenge() {
    if (state.quick) return;
    if (!challenge || challenge.done) return;
    if (challenge.level !== state.levelIndex) return;
    challenge.done = true;
    challenge.mine = state.steps;
  }

  readLaunch();

  /* ---------------- 状态 ---------------- */

  var state = {
    screen: 'start',
    startSel: Math.min(progress.unlocked - 1, LEVEL_COUNT - 1),
    libraryTab: 'chars',
    librarySel: null,
    noteSel: null,
    posterCanvas: null,
    evo: null,
    levelIndex: 0,
    levelPage: 0,
    grid: null,
    tiles: [],
    moves: 0,
    steps: 0,
    score: 0,
    maxMult: 1,
    quick: false,
    timeLeft: 0,
    combo: 0,
    streak: 0,
    collected: {},
    pulse: {},
    selected: -1,
    phase: 'idle',
    timer: 0,
    swapA: -1,
    swapB: -1,
    pops: [],
    comboText: null,
    toast: null,
    hint: null,
    idleTime: 0,
    time: 0,
    cardT: 0,
    cardSrc: false,
    result: null,
    quiz: null,
    particles: [],
    rings: [],
    shake: 0,
    flash: 0,
    milestone: null,
    milestoneIdx: 0,
    milestoneMarks: []
  };

  var ui = {
    restart: null,
    exit: null,
    primary: null,
    secondary: null,
    share: null,
    fontPill: null,
    hint: null,
    cardSrc: null,
    prev: null,
    next: null,
    optA: null,
    optB: null,
    library: null,
    pick: null,
    startEvo: null,
    levelCells: null,
    levelsClose: null,
    quick: null,
    close: null,
    tabChars: null,
    tabVerses: null,
    tabNotes: null,
    libraryClose: null,
    libraryCells: null,
    verseCells: null,
    noteCells: null,
    noteClose: null,
    poster: null,
    evoBtn: null,
    evo: null,
    evoReplay: null,
    evoSave: null,
    evoClose: null,
    posterSave: null,
    posterClose: null,
    posterImage: null,
    feedback: null
  };

  function levelConfig() {
    if (state.quick && quickLevel) return quickLevel;
    return Data.LEVELS[state.levelIndex] || Data.LEVELS[0];
  }

  /* ---------------- 快契：90 秒一字一局 ---------------- */

  var QUICK_SECONDS = 90;
  var QUICK_GOAL = 8;
  var quickLevel = null;

  function quickCandidates() {
    var ids = [];
    function add(id) {
      if (Data.BY_ID[id] && ids.indexOf(id) < 0) ids.push(id);
    }
    for (var i = 0; i < progress.learned.length; i++) add(progress.learned[i]);
    for (var j = 0; j < progress.unlocked && j < LEVEL_COUNT; j++) add(Data.LEVELS[j].char);
    if (!ids.length) add(Data.LEVELS[0].char);
    return ids;
  }

  function startQuick() {
    var ids = quickCandidates();
    var target = ids[Math.floor(Math.random() * ids.length)];
    var tType = Data.typeOf(target);
    var decoys = [];
    var guard = 0;
    while (decoys.length < 4 && guard < 80) {
      guard++;
      var c = Data.CHARS[Math.floor(Math.random() * Data.CHARS.length)].id;
      var ty = Data.typeOf(c);
      if (ty == null || ty === tType || decoys.indexOf(c) >= 0) continue;
      var dup = false;
      for (var d = 0; d < decoys.length; d++) {
        if (Data.typeOf(decoys[d]) === ty) dup = true;
      }
      if (!dup) decoys.push(c);
    }

    quickLevel = {
      title: '快契',
      char: target,
      pool: [target, target, target, target].concat(decoys),
      req: [{ id: target, n: QUICK_GOAL }],
      moves: 0,
      spirit: []
    };

    state.quick = true;
    startLevel(0);
    state.timeLeft = QUICK_SECONDS;
    state.moves = 999;
  }

  function leaveQuick() {
    state.quick = false;
    quickLevel = null;
    state.timeLeft = 0;
  }

  function levelPool() {
    var lv = levelConfig();
    var distinct = [];
    var seen = {};
    for (var i = 0; i < lv.pool.length && distinct.length < 6; i++) {
      var t = Data.typeOf(lv.pool[i]);
      if (t == null || seen[t]) continue;
      seen[t] = 1;
      distinct.push(t);
    }
    var allow = {};
    for (var d = 0; d < distinct.length; d++) allow[distinct[d]] = 1;
    var pool = [];
    for (var j = 0; j < lv.pool.length; j++) {
      var v = Data.typeOf(lv.pool[j]);
      if (v != null && allow[v]) pool.push(v);
    }
    return pool.length ? pool : null;
  }

  function overallProgress() {
    var lv = levelConfig();
    var got = 0, all = 0;
    for (var i = 0; i < lv.req.length; i++) {
      var req = lv.req[i];
      got += Math.min(req.n, state.collected[req.id] || 0);
      all += req.n;
    }
    return all ? got / all : 0;
  }

  function collectedTotal() {
    var lv = levelConfig();
    var got = 0;
    for (var i = 0; i < lv.req.length; i++) {
      var req = lv.req[i];
      got += Math.min(req.n, state.collected[req.id] || 0);
    }
    return got;
  }

  function totalRequired() {
    var lv = levelConfig();
    var all = 0;
    for (var i = 0; i < lv.req.length; i++) all += lv.req[i].n;
    return all;
  }

  function milestoneThresholds() {
    var all = totalRequired();
    return [
      Math.max(1, Math.round(all / 3)),
      Math.max(2, Math.round(all * 2 / 3))
    ];
  }

  function isComplete() {
    var lv = levelConfig();
    for (var i = 0; i < lv.req.length; i++) {
      var req = lv.req[i];
      if ((state.collected[req.id] || 0) < req.n) return false;
    }
    return true;
  }

  /* ---------------- 关卡流程 ---------------- */

  function makeTile(type, r, c) {
    var p = tileCenter(r, c);
    return {
      type: type, r: r, c: c,
      px: p.x, py: p.y,
      scale: 1, alpha: 1,
      clearing: false, clearT: 0,
      spirit: null
    };
  }

  function buildTiles(grid) {
    state.grid = grid;
    state.tiles = new Array(SIZE * SIZE);
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var i = r * SIZE + c;
        state.tiles[i] = makeTile(grid[i], r, c);
      }
    }
  }

  var spiritBag = [];

  function spiritPool() {
    var lv = levelConfig();
    var ids = [];
    function add(id) {
      if (Data.BY_ID[id] && ids.indexOf(id) < 0) ids.push(id);
    }
    var base = lv.spirit || [];
    for (var i = 0; i < base.length; i++) add(base[i]);
    var pool = lv.pool || [];
    for (var j = 0; j < pool.length; j++) add(pool[j]);
    add(lv.char);
    for (var k = 0; k < progress.learned.length; k++) add(progress.learned[k]);
    return ids;
  }

  function randomSpirit() {
    var lv = levelConfig();
    if (!(lv.spirit && lv.spirit.length)) return null;
    if (Math.random() > 0.11) return null;
    if (!spiritBag.length) {
      spiritBag = spiritPool();
      for (var i = spiritBag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = spiritBag[i];
        spiritBag[i] = spiritBag[j];
        spiritBag[j] = tmp;
      }
    }
    return spiritBag.pop();
  }

  function startLevel(index) {
    state.levelIndex = Math.max(0, Math.min(LEVEL_COUNT - 1, index));
    var lv = levelConfig();
    Sfx.play('start');

    state.screen = 'play';
    state.phase = 'idle';
    state.timer = 0;
    state.combo = 0;
    state.streak = 0;
    state.score = 0;
    state.maxMult = 1;
    state.selected = -1;
    state.pops = [];
    state.comboText = null;
    state.toast = null;
    state.posterCanvas = null;
    state.evo = null;
    state.hint = null;
    state.idleTime = 0;
    state.cardT = 0;
    state.quiz = null;
    state.result = null;
    state.collected = {};
    state.pulse = {};
    state.steps = 0;
    state.particles = [];
    state.rings = [];
    state.shake = 0;
    state.flash = 0;
    state.milestone = null;
    state.milestoneIdx = 0;
    state.milestoneMarks = milestoneThresholds();
    spiritBag = [];

    for (var i = 0; i < lv.req.length; i++) {
      state.collected[lv.req[i].id] = 0;
      state.pulse[lv.req[i].id] = 0;
    }
    state.moves = lv.moves + 4;

    var pool = levelPool();
    var grid = Core.createGrid(Math.random, pool);
    var guard = 0;
    while (!grid && guard < 4) {
      grid = Core.createGrid(Math.random, pool);
      guard++;
    }
    if (!grid) grid = Core.createGrid(Math.random);
    buildTiles(grid);
  }

  function completeLevel() {
    var lv = levelConfig();
    var ids = lv.learn && lv.learn.length ? lv.learn : [lv.char];
    for (var i = 0; i < ids.length; i++) {
      if (!Data.BY_ID[ids[i]]) continue;
      if (progress.learned.indexOf(ids[i]) < 0) progress.learned.push(ids[i]);
    }
    progress.unlocked = Math.max(progress.unlocked, Math.min(LEVEL_COUNT, state.levelIndex + 2));
    saveProgress();
  }

  function learnQuickChar() {
    var ch = Data.char(levelConfig().char);
    if (progress.learned.indexOf(ch.id) < 0) {
      progress.learned.push(ch.id);
      saveProgress();
    }
  }

  function advance() {
    if (state.levelIndex >= LEVEL_COUNT - 1) {
      state.screen = 'result';
      state.result = 'all';
      return;
    }
    startLevel(state.levelIndex + 1);
  }

  function goHome() {
    state.screen = 'start';
    state.startSel = Math.min(progress.unlocked - 1, LEVEL_COUNT - 1);
    leaveQuick();
    state.quiz = null;
    state.result = null;
    state.librarySel = null;
    state.noteSel = null;
    state.posterCanvas = null;
    state.evo = null;
    state.toast = null;
  }

  function openLibrary() {
    state.screen = 'library';
    state.libraryTab = 'chars';
    state.librarySel = null;
    state.noteSel = null;
    state.toast = null;
  }

  var readingsCache = null;

  function readings() {
    if (readingsCache) return readingsCache;
    readingsCache = [];
    for (var i = 0; i < Data.LEVELS.length; i++) {
      var ch = Data.char(Data.LEVELS[i].char);
      if (ch && ch.bone) {
        readingsCache.push({
          id: ch.id,
          kai: ch.kai,
          meaning: ch.meaning,
          text: ch.bone,
          gloss: ch.gloss
        });
      }
    }
    return readingsCache;
  }

  function levelForChar(id) {
    for (var i = 0; i < Data.LEVELS.length; i++) {
      if (Data.LEVELS[i].char === id) return i;
    }
    return -1;
  }

  function noteOpen(note) {
    return progress.learned.length >= note.need;
  }

  function notesUnlockedCount() {
    var n = 0;
    for (var i = 0; i < Data.NOTES.length; i++) {
      if (noteOpen(Data.NOTES[i])) n++;
    }
    return n;
  }

  function noteById(id) {
    for (var i = 0; i < Data.NOTES.length; i++) {
      if (Data.NOTES[i].id === id) return Data.NOTES[i];
    }
    return null;
  }

  /* ---------------- 棋盘操作 ---------------- */

  function doSwap(a, b) {
    var tg = state.grid[a];
    state.grid[a] = state.grid[b];
    state.grid[b] = tg;

    var tt = state.tiles[a];
    state.tiles[a] = state.tiles[b];
    state.tiles[b] = tt;

    var ta = state.tiles[a];
    var tb = state.tiles[b];
    if (ta) { ta.r = Math.floor(a / SIZE); ta.c = a % SIZE; }
    if (tb) { tb.r = Math.floor(b / SIZE); tb.c = b % SIZE; }
    state.selected = -1;
  }

  function attemptSwap(a, b) {
    if (state.screen !== 'play' || state.phase !== 'idle') return;
    var ar = Math.floor(a / SIZE), ac = a % SIZE;
    var br = Math.floor(b / SIZE), bc = b % SIZE;
    if (Math.abs(ar - br) + Math.abs(ac - bc) !== 1) return;

    doSwap(a, b);
    Sfx.play('swap');
    state.hint = null;
    state.idleTime = 0;
    state.swapA = a;
    state.swapB = b;
    state.phase = 'swap';
    state.timer = 0;
  }

  function tapCell(index) {
    if (state.screen !== 'play' || state.phase !== 'idle') return;
    state.hint = null;
    state.idleTime = 0;
    Sfx.play('tap');

    var tile = state.tiles[index];
    if (tile && tile.spirit && state.selected === -1) {
      openQuiz(index, tile.spirit);
      return;
    }

    if (state.selected === -1) {
      state.selected = index;
      return;
    }
    if (state.selected === index) {
      state.selected = -1;
      return;
    }

    var a = state.selected;
    var b = index;
    var ar = Math.floor(a / SIZE), ac = a % SIZE;
    var br = Math.floor(b / SIZE), bc = b % SIZE;
    if (Math.abs(ar - br) + Math.abs(ac - bc) === 1) {
      attemptSwap(a, b);
    } else {
      state.selected = index;
    }
  }

  function collect(t) {
    var lv = levelConfig();
    for (var i = 0; i < lv.req.length; i++) {
      var req = lv.req[i];
      if (Data.typeOf(req.id) === t.type) {
        var cur = state.collected[req.id] || 0;
        if (cur < req.n) {
          state.collected[req.id] = cur + 1;
          state.pulse[req.id] = 1;
        }
      }
    }
    if (t.spirit) {
      Sfx.play('spirit');
      state.moves += 1;
      var ch = Data.char(t.spirit);
      showToast('字灵 · ' + ch.kai + '：' + ch.meaning + '　步数 +1');
    }
  }

  function resolve(combo) {
    var matched = Core.findMatches(state.grid);
    if (matched.size === 0) {
      finishTurn();
      return;
    }

    state.phase = 'clear';
    state.timer = 0;
    state.combo = combo;
    var mult = combo + Math.min(2, Math.max(0, (state.streak || 1) - 1));
    state.maxMult = Math.max(state.maxMult || 1, mult);
    Sfx.play('match', { combo: mult });

    var sumX = 0, sumY = 0, count = 0;
    matched.forEach(function (i) {
      var t = state.tiles[i];
      if (!t) return;
      t.clearing = true;
      t.clearT = 0;
      t.spin = Math.random() < 0.5 ? -1 : 1;
      state.grid[i] = -1;
      collect(t);
      var p = tileCenter(t.r, t.c);
      sumX += p.x;
      sumY += p.y;
      count++;
      spawnBurst(p.x, p.y, 4 + Math.min(6, mult), {
        speed: 100 + mult * 18 + count * 3,
        size: 3 + Math.min(1.4, mult * 0.25),
        lift: 60
      });
    });

    if (!count) return;

    var cx = sumX / count, cy = sumY / count;
    var gained = count * 10 * mult + (count > 3 ? (count - 3) * 15 * mult : 0);
    state.score += gained;
    state.pops.push({
      x: cx,
      y: cy,
      text: '+' + gained,
      t: 0,
      size: 16 + Math.min(10, count * 1.4)
    });
    state.rings.push({
      x: cx, y: cy, t: 0,
      r: layout.board.cell * 0.22,
      max: layout.board.cell * (0.85 + Math.min(1.1, count * 0.12)),
      color: mult >= 3 ? '192,138,62' : '168,58,42'
    });
    spawnBurst(cx, cy, mult >= 3 ? 18 : 9, {
      speed: 165 + mult * 26,
      size: 3.4,
      color: '#C08A3E',
      spark: true,
      lift: 30
    });
    state.shake = Math.max(state.shake, Math.min(7, 1.6 + mult * 1.1 + (count - 3) * 0.25));
    if (mult >= 4) state.flash = Math.max(state.flash, 0.55);
    if (mult >= 2) {
      state.comboText = { text: '连击 ×' + mult, t: 0 };
    }
    checkMilestones();
    vibrate();
  }

  function removeCleared() {
    for (var i = 0; i < state.tiles.length; i++) {
      if (state.tiles[i] && state.tiles[i].clearing) {
        state.tiles[i] = null;
        state.grid[i] = -1;
      }
    }
  }

  function cascadeType(r, c) {
    if (Math.random() > 0.28) return null;
    var l1 = c >= 1 ? state.tiles[r * SIZE + c - 1] : null;
    var l2 = c >= 2 ? state.tiles[r * SIZE + c - 2] : null;
    if (l1 && l2 && l1.type === l2.type) return l1.type;
    var d1 = r + 1 < SIZE ? state.tiles[(r + 1) * SIZE + c] : null;
    var d2 = r + 2 < SIZE ? state.tiles[(r + 2) * SIZE + c] : null;
    if (d1 && d2 && d1.type === d2.type) return d1.type;
    return null;
  }

  function applyGravity() {
    var cell = layout.board.cell;
    var pad = layout.board.pad;
    var b = layout.board;
    var pool = levelPool();

    for (var c = 0; c < SIZE; c++) {
      var write = SIZE - 1;
      for (var r = SIZE - 1; r >= 0; r--) {
        var i = r * SIZE + c;
        var t = state.tiles[i];
        if (!t) continue;
        var j = write * SIZE + c;
        if (j !== i) {
          state.tiles[j] = t;
          state.tiles[i] = null;
          t.r = write;
          t.c = c;
          state.grid[j] = t.type;
          state.grid[i] = -1;
        }
        write--;
      }

      var missing = write + 1;
      for (var r2 = write; r2 >= 0; r2--) {
        var type;
        var spirit = randomSpirit();
        if (spirit) {
          type = Data.typeOf(spirit);
        } else if ((type = cascadeType(r2, c)) != null) {
          /* 偶尔补出可消的棋子，让连锁更常发生 */
        } else if (pool) {
          type = pool[Math.floor(Math.random() * pool.length)];
        } else {
          type = Math.floor(Math.random() * Core.TYPES);
        }
        var nt = makeTile(type, r2, c);
        nt.spirit = spirit;
        nt.px = b.x + pad + c * cell + cell / 2;
        nt.py = b.y + pad + (r2 - missing) * cell + cell / 2;
        var j2 = r2 * SIZE + c;
        state.tiles[j2] = nt;
        state.grid[j2] = type;
      }
    }
  }

  function reshuffle() {
    var pool = levelPool();
    var grid = Core.createGrid(Math.random, pool);
    var guard = 0;
    while (!grid && guard < 4) {
      grid = Core.createGrid(Math.random, pool);
      guard++;
    }
    if (!grid) grid = Core.createGrid(Math.random);
    buildTiles(grid);
    showToast('无可用步，重排甲骨');
  }

  function finishTurn() {
    state.phase = 'idle';
    state.timer = 0;
    state.combo = 0;
    state.selected = -1;
    state.hint = null;
    state.idleTime = 0;

    if (isComplete()) {
      if (state.quick) learnQuickChar();
      else completeLevel();
      recordChallenge();
      Sfx.play('win');
      state.screen = 'card';
      state.cardT = 0;
      state.cardSrc = false;
      vibrate();
      return;
    }

    if (state.moves <= 0) {
      Sfx.play('fail');
      state.screen = 'result';
      state.result = 'fail';
      return;
    }

    if (!Core.findPossibleMove(state.grid)) {
      reshuffle();
    }
  }

  function quickTimeUp() {
    if (state.screen !== 'play') return;
    Sfx.play('fail');
    state.phase = 'idle';
    state.timer = 0;
    state.selected = -1;
    state.screen = 'result';
    state.result = 'quickfail';
  }

  function vibrate() {
    try {
      if (isWx) {
        if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      } else if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(8);
      }
    } catch (e) { /* 忽略 */ }
  }

  function showToast(str) {
    state.toast = { text: str, t: 0 };
  }

  /* ---------------- 意见反馈 ---------------- */

  /* 填入微信云开发环境 ID 后反馈才会上传；留空则只暂存本地。 */
  var FEEDBACK_ENV = '';
  var FEEDBACK_KEY = 'oracle-match3.feedback';
  var FEEDBACK_THANKS = [
    '收到，谢谢。史官已刻进龟甲。',
    '记下了。改没改，你回来一看便知。',
    '这条我们当真，谢谢你说出来。',
    '已录入。史官不睡，先去改字。'
  ];
  var feedbackPending = null;
  var feedbackCloudReady = false;

  function pendingFeedback() {
    if (feedbackPending) return feedbackPending;
    try {
      if (isWx) {
        feedbackPending = wx.getStorageSync(FEEDBACK_KEY) || [];
      } else {
        feedbackPending = JSON.parse(window.localStorage.getItem(FEEDBACK_KEY) || '[]');
      }
    } catch (e) {
      feedbackPending = [];
    }
    return feedbackPending;
  }

  function savePendingFeedback() {
    try {
      if (isWx) wx.setStorageSync(FEEDBACK_KEY, pendingFeedback());
      else window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(pendingFeedback()));
    } catch (e) { /* 忽略 */ }
  }

  function feedbackContext() {
    var lv = levelConfig();
    var sys = {};
    if (isWx) {
      try { sys = wx.getSystemInfoSync() || {}; } catch (e) { /* 忽略 */ }
    }
    return {
      text: '',
      screen: state.screen,
      level: lv ? lv.title : '',
      quick: !!state.quick,
      learned: progress.learned.length,
      model: sys.model || '',
      system: sys.system || '',
      at: Date.now()
    };
  }

  function uploadFeedback(entry) {
    if (!isWx || !wx.cloud || !FEEDBACK_ENV) return false;
    try {
      if (!feedbackCloudReady) {
        wx.cloud.init({ env: FEEDBACK_ENV, traceUser: false });
        feedbackCloudReady = true;
      }
      wx.cloud.database().collection('feedback').add({ data: entry }).then(function () {
        var list = pendingFeedback();
        var i = list.indexOf(entry);
        if (i >= 0) {
          list.splice(i, 1);
          savePendingFeedback();
        }
      }, function () { /* 留到下次启动补发 */ });
      return true;
    } catch (e) {
      return false;
    }
  }

  function flushFeedback() {
    var list = pendingFeedback();
    for (var i = 0; i < list.length; i++) uploadFeedback(list[i]);
  }

  function submitFeedback(txt) {
    var entry = feedbackContext();
    entry.text = txt;
    var list = pendingFeedback();
    list.push(entry);
    if (list.length > 20) list.splice(0, list.length - 20);
    savePendingFeedback();

    if (!isWx) { showToast('已记录，网页版暂未接通'); return; }
    if (!FEEDBACK_ENV) { showToast('已记录，反馈通道未开启'); return; }
    uploadFeedback(entry);
    showToast(FEEDBACK_THANKS[Math.floor(Math.random() * FEEDBACK_THANKS.length)]);
  }

  function openFeedback() {
    if (!isWx) {
      var txt = window.prompt('意见反馈（一句话即可）', '');
      if (txt && txt.trim()) submitFeedback(txt.trim().slice(0, 200));
      return;
    }
    wx.showModal({
      title: '意见反馈',
      editable: true,
      placeholderText: '一句话说说建议或遇到的问题',
      confirmText: '发送',
      cancelText: '算了',
      success: function (res) {
        if (!res.confirm) return;
        var txt = (res.content || '').trim();
        if (!txt) { showToast('写一句话就行'); return; }
        submitFeedback(txt.slice(0, 200));
      }
    });
  }

  function spawnBurst(x, y, n, opts) {
    opts = opts || {};
    if (state.particles.length > 220) return;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = (opts.speed || 120) * (0.45 + Math.random() * 0.9);
      state.particles.push({
        x: x + (Math.random() - 0.5) * layout.board.cell * 0.3,
        y: y + (Math.random() - 0.5) * layout.board.cell * 0.3,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - (opts.lift || 40),
        size: (opts.size || 2.6) * (0.6 + Math.random() * 0.8),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 14,
        life: 0.42 + Math.random() * 0.38,
        t: 0,
        spark: !!opts.spark,
        color: opts.color || '#3B2C1E'
      });
    }
  }

  function checkMilestones() {
    if (!state.milestoneMarks.length) return;
    var total = collectedTotal();
    while (state.milestoneIdx < state.milestoneMarks.length &&
      total >= state.milestoneMarks[state.milestoneIdx]) {
      state.milestoneIdx++;
      state.moves += 1;
      var p = layout.panel;
      var bx = p.x + 41, by = p.y + p.h / 2;
      spawnBurst(bx, by, 18, {
        speed: 165, size: 2.8, color: '#C08A3E', spark: true, lift: 20
      });
      state.rings.push({
        x: bx, y: by, t: 0, r: 10, max: 62, color: '192,138,62'
      });
      state.milestone = {
        t: 0,
        done: state.milestoneIdx,
        got: total,
        all: totalRequired()
      };
      state.flash = Math.max(state.flash, 0.45);
      Sfx.play('milestone');
      vibrate();
    }
  }

  /* ---------------- 字灵考校 ---------------- */

  function openQuiz(index, charId) {
    var ch = Data.char(charId);
    var other = null;
    var guard = 0;
    do {
      other = Data.CHARS[Math.floor(Math.random() * Data.CHARS.length)];
      guard++;
    } while (guard < 40 && (other.id === ch.id || other.meaning === ch.meaning));

    var options = [
      { text: ch.meaning, ok: true },
      { text: other.meaning, ok: false }
    ];
    if (Math.random() < 0.5) options.reverse();

    state.quiz = { charId: charId, tileIndex: index, options: options, t: 0 };
    state.screen = 'quiz';
    state.selected = -1;
  }

  function answerQuiz(ok) {
    var q = state.quiz;
    if (!q) return;
    if (ok) {
      Sfx.play('right');
      var t = state.tiles[q.tileIndex];
      if (t) t.spirit = null;
      state.moves += 3;
      showToast('答对 · 步数 +3');
    } else {
      Sfx.play('wrong');
      showToast('未合，再观其形');
    }
    state.quiz = null;
    state.screen = 'play';
  }

  /* ---------------- 更新 ---------------- */

  function update(dt) {
    state.time += dt;

    if (state.quick && state.screen === 'play') {
      state.timeLeft = Math.max(0, state.timeLeft - dt);
      if (state.timeLeft <= 0) quickTimeUp();
    }

    for (var i = state.particles.length - 1; i >= 0; i--) {
      var pt = state.particles[i];
      pt.t += dt;
      if (pt.t >= pt.life) { state.particles.splice(i, 1); continue; }
      pt.vy += 520 * dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.rot += pt.vr * dt;
    }
    for (var ri = state.rings.length - 1; ri >= 0; ri--) {
      state.rings[ri].t += dt;
      if (state.rings[ri].t > 0.5) state.rings.splice(ri, 1);
    }
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 22);
    if (state.flash > 0) state.flash = Math.max(0, state.flash - dt * 2.6);
    if (state.milestone) {
      state.milestone.t += dt;
      if (state.milestone.t > 1.55) state.milestone = null;
    }

    for (var key in state.pulse) {
      if (state.pulse[key] > 0) state.pulse[key] = Math.max(0, state.pulse[key] - dt * 2.8);
    }

    for (var p = state.pops.length - 1; p >= 0; p--) {
      state.pops[p].t += dt;
      if (state.pops[p].t > 0.9) state.pops.splice(p, 1);
    }
    if (state.comboText) {
      state.comboText.t += dt;
      if (state.comboText.t > 1.1) state.comboText = null;
    }
    if (state.toast) {
      state.toast.t += dt;
      if (state.toast.t > 1.9) state.toast = null;
    }
    if (state.screen === 'card') state.cardT += dt;
    if (state.screen === 'quiz' && state.quiz) state.quiz.t += dt;
    if (state.evo) state.evo.t = Math.min(EVO_TOTAL, state.evo.t + dt);

    if (state.grid && state.screen === 'play') {
      var k = 1 - Math.exp(-20 * dt);
      for (var n = 0; n < state.tiles.length; n++) {
        var t = state.tiles[n];
        if (!t) continue;
        var target = tileCenter(t.r, t.c);
        t.px += (target.x - t.px) * k;
        t.py += (target.y - t.py) * k;
        if (t.clearing) {
          t.clearT += dt;
          var q = Math.min(1, t.clearT / 0.22);
          var punch = Math.sin(Math.min(1, q / 0.32) * Math.PI * 0.5);
          t.scale = 1 + 0.34 * punch - 0.98 * q * q;
          t.alpha = 1 - q * q * q;
          t.rot = (t.spin || 1) * q * 0.5;
        } else if (t.scale !== 1 || t.alpha !== 1 || t.rot) {
          t.scale = 1;
          t.alpha = 1;
          t.rot = 0;
        }
      }
    }

    if (state.screen !== 'play') return;

    if (state.phase === 'swap') {
      state.timer += dt;
      if (state.timer >= 0.14) {
        if (Core.findMatches(state.grid).size === 0) {
          doSwap(state.swapA, state.swapB);
          Sfx.play('bad');
          state.streak = 0;
          state.phase = 'revert';
          state.timer = 0;
        } else {
          state.moves--;
          state.steps++;
          state.streak = Math.min(9, (state.streak || 0) + 1);
          resolve(1);
        }
      }
    } else if (state.phase === 'revert') {
      state.timer += dt;
      if (state.timer >= 0.14) {
        state.phase = 'idle';
        state.timer = 0;
      }
    } else if (state.phase === 'clear') {
      state.timer += dt;
      if (state.timer >= 0.22) {
        removeCleared();
        applyGravity();
        state.phase = 'fall';
        state.timer = 0;
      }
    } else if (state.phase === 'fall') {
      state.timer += dt;
      if (state.timer >= 0.22) {
        if (Core.findMatches(state.grid).size > 0) {
          resolve(state.combo + 1);
        } else {
          finishTurn();
        }
      }
    }

    if (state.phase === 'idle') {
      state.idleTime += dt;
      var hintDelay = 7;
      if (state.idleTime > hintDelay && !state.hint) {
        var mv = Core.findPossibleMove(state.grid);
        if (mv) state.hint = { a: mv[0], b: mv[1] };
      }
    } else {
      state.idleTime = 0;
    }
  }

  /* ---------------- 绘制工具 ---------------- */

  function rr(x, y, w, h, r) {
    var rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  var FONT_SCALE = progress.bigText ? 1.18 : 1;

  function setFont(size, weight) {
    ctx.font = (weight ? weight + ' ' : '') + (size * FONT_SCALE) +
      'px "Noto Serif SC","Source Han Serif SC","Songti SC","STSong","Noto Serif CJK SC","SimSun",serif';
  }

  function text(str, x, y, size, color, align, baseline, weight) {
    setFont(size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = baseline || 'alphabetic';
    ctx.fillText(str, x, y);
  }

  var NO_LINE_START = '。，、；：！？）】」』”’…·';

  function fitText(str, size, maxW, weight) {
    setFont(size, weight);
    if (ctx.measureText(str).width <= maxW) return str;
    var out = str;
    while (out.length > 1 && ctx.measureText(out + '…').width > maxW) {
      out = out.slice(0, out.length - 1);
    }
    return out + '…';
  }

  function wrap(str, maxW, size) {
    setFont(size);
    var lines = [];
    var cur = '';
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);
      var overflow = cur && ctx.measureText(cur + ch).width > maxW;
      if (overflow && NO_LINE_START.indexOf(ch) < 0) {
        lines.push(cur);
        cur = ch;
      } else {
        cur += ch;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function drawLines(lines, cx, y, lh, size, color, align) {
    for (var i = 0; i < lines.length; i++) {
      text(lines[i], cx, y + i * lh, size, color, align || 'center', 'middle');
    }
  }

  /* ---------------- 绘制 ---------------- */

  function drawBackground() {
    var g = ctx.createLinearGradient(0, 0, 0, viewH);
    g.addColorStop(0, C.bgTop);
    g.addColorStop(0.55, C.bgMid);
    g.addColorStop(1, C.bgBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, viewW, viewH);

    ctx.save();
    ctx.fillStyle = 'rgba(140,106,63,0.05)';
    ctx.beginPath();
    ctx.arc(viewW * 0.92, viewH * 0.06, viewW * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(140,106,63,0.04)';
    ctx.beginPath();
    ctx.arc(viewW * 0.04, viewH * 0.94, viewW * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawHeader() {
    var l = layout;

    /* 首页大标题在卡片里，顶部这行小标题就不画，免得长屏上出现两个「甲骨消消乐」 */
    if (state.screen !== 'start') {
      setFont(19, 'bold');
      var titleW = ctx.measureText('甲骨消消乐').width;
      text('甲骨消消乐', l.x, l.top + 15, 19, C.ink, 'left', 'middle', 'bold');

      var sx = l.x + titleW + 8;
      var sy = l.top + 3;
      ctx.save();
      ctx.shadowColor = 'rgba(168,58,42,0.32)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      rr(sx, sy, 22, 22, 4);
      ctx.fillStyle = C.red;
      ctx.fill();
      ctx.restore();
      text('契', sx + 11, sy + 12, 13, '#F7EBD6', 'center', 'middle', 'bold');
    }

    if (state.screen === 'play') {
      var rw = 50, rh = 24;
      var rx = l.x + l.contentW - rw;
      var ry = l.top + 3;

      var mw = 24;
      var mx = rx - mw - 8;
      rr(mx, ry, mw, rh, 12);
      ctx.fillStyle = 'rgba(255,250,238,0.5)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(140,106,63,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      text(Sfx.isMuted() ? '静' : '音', mx + mw / 2, ry + rh / 2 + 0.5, 11,
        Sfx.isMuted() ? C.inkFaint : C.inkSoft, 'center', 'middle');
      ui.sound = { x: mx - 4, y: ry - 4, w: mw + 8, h: rh + 8 };

      rr(rx, ry, rw, rh, 12);
      ctx.fillStyle = 'rgba(255,250,238,0.5)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(140,106,63,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      text('重开', rx + rw / 2, ry + rh / 2 + 0.5, 11.5, C.inkSoft, 'center', 'middle');
      ui.restart = { x: rx - 6, y: ry - 6, w: rw + 12, h: rh + 12 };

      var ew = 44;
      var ex = mx - ew - 8;
      rr(ex, ry, ew, rh, 12);
      ctx.fillStyle = 'rgba(255,250,238,0.5)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(140,106,63,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      text('退出', ex + ew / 2, ry + rh / 2 + 0.5, 11.5, C.inkSoft, 'center', 'middle');
      ui.exit = { x: ex - 4, y: ry - 4, w: ew + 8, h: rh + 8 };
    } else {
      ui.restart = null;
      ui.sound = null;
      ui.exit = null;
      ui.feedback = null;
    }
  }

  function drawTargetPanel() {
    var p = layout.panel;
    var lv = levelConfig();
    var ch = Data.char(lv.char);

    ctx.save();
    ctx.shadowColor = 'rgba(92,62,30,0.10)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    rr(p.x, p.y, p.w, p.h, 14);
    ctx.fillStyle = 'rgba(255,251,242,0.66)';
    ctx.fill();
    ctx.restore();

    rr(p.x, p.y, p.w, p.h, 14);
    ctx.strokeStyle = 'rgba(158,126,82,0.26)';
    ctx.lineWidth = 1;
    ctx.stroke();

    var box = 58;
    var bx = p.x + 12;
    var by = p.y + (p.h - box) / 2;
    var cx = bx + box / 2;
    var cy = by + box / 2;

    rr(bx, by, box, box, 10);
    ctx.fillStyle = 'rgba(250,242,226,0.92)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,145,78,0.38)';
    ctx.stroke();

    var prog = overallProgress();
    ctx.beginPath();
    ctx.arc(cx, cy, box / 2 + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(158,126,82,0.16)';
    ctx.lineWidth = 3;
    ctx.stroke();
    if (prog > 0.001) {
      ctx.beginPath();
      ctx.arc(cx, cy, box / 2 + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog);
      ctx.strokeStyle = C.red;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.lineCap = 'butt';
    }

    for (var mi = 1; mi <= 2; mi++) {
      var ang = -Math.PI / 2 + Math.PI * 2 * (mi / 3);
      var dx = cx + Math.cos(ang) * (box / 2 + 6);
      var dy = cy + Math.sin(ang) * (box / 2 + 6);
      var marked = state.milestoneIdx >= mi;
      ctx.beginPath();
      ctx.arc(dx, dy, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = marked ? C.red : C.cream;
      ctx.fill();
      ctx.strokeStyle = marked ? C.red : 'rgba(158,126,82,0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    Glyphs.drawById(ctx, ch.glyph, cx, cy, box * 0.6, Math.max(1.6, box * 0.058), C.ink, true);

    var rx = bx + box + 14;
    text((state.quick ? '快契 · 90 秒' : '第 ' + (state.levelIndex + 1) + ' / ' + LEVEL_COUNT + ' 契') +
      ' · 造「' + ch.kai + '」', rx, p.y + 18, 11.5, C.inkSoft, 'left', 'middle');
    text(ch.meaning, rx, p.y + 37, 15.5, C.ink, 'left', 'middle', 'bold');

    var reqs = lv.req;
    var maxChips = reqs.length > 1 ? 2 : 1;
    for (var i = 0; i < maxChips; i++) {
      var req = reqs[i];
      if (!req) break;
      var rc = Data.char(req.id);
      var chipX = rx + i * 76;
      var chipY = p.y + 56;

      var pl = state.pulse[req.id] || 0;
      Glyphs.drawById(ctx, rc.glyph, chipX + 8, chipY + 2, 15, 1.6,
        pl > 0.05 ? C.red : C.ink, true);

      var got = Math.min(req.n, state.collected[req.id] || 0);
      text(got + '/' + req.n, chipX + 20, chipY + 3, 11.5,
        got >= req.n ? C.red : C.inkSoft, 'left', 'middle', got >= req.n ? 'bold' : null);

      var bw = 62;
      rr(chipX, chipY + 13, bw, 4, 2);
      ctx.fillStyle = 'rgba(140,106,63,0.16)';
      ctx.fill();
      if (got > 0) {
        rr(chipX, chipY + 13, Math.max(4, bw * got / req.n), 4, 2);
        ctx.fillStyle = C.red;
        ctx.fill();
      }
    }

    var mx = p.x + p.w - 30;
    if (state.quick) {
      var secs = Math.max(0, Math.ceil(state.timeLeft));
      text(String(secs), mx, p.y + 34, 22,
        secs <= 10 ? C.red : C.ink, 'center', 'middle', 'bold');
      text('秒', mx, p.y + 56, 9.5, C.inkSoft, 'center', 'middle');
    } else {
      text(String(state.moves), mx, p.y + 34, 22,
        state.moves <= 4 ? C.red : C.ink, 'center', 'middle', 'bold');
      text('步', mx, p.y + 56, 9.5, C.inkSoft, 'center', 'middle');
    }
  }

  function drawBoardPanel() {
    var b = layout.board;
    var pad = b.pad;
    var cell = b.cell;

    ctx.save();
    ctx.shadowColor = 'rgba(92,62,30,0.18)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    rr(b.x, b.y, b.size, b.size, 16);
    ctx.fillStyle = C.panel;
    ctx.fill();
    ctx.restore();

    var g = ctx.createLinearGradient(0, b.y, 0, b.y + b.size);
    g.addColorStop(0, 'rgba(255,250,238,0.4)');
    g.addColorStop(1, 'rgba(191,163,117,0.18)');
    rr(b.x, b.y, b.size, b.size, 16);
    ctx.fillStyle = g;
    ctx.fill();

    rr(b.x + 0.5, b.y + 0.5, b.size - 1, b.size - 1, 16);
    ctx.strokeStyle = 'rgba(150,118,74,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = 'rgba(120,94,58,0.07)';
    ctx.lineWidth = 1;
    for (var i = 1; i < SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(b.x + pad + i * cell, b.y + pad);
      ctx.lineTo(b.x + pad + i * cell, b.y + pad + cell * SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x + pad, b.y + pad + i * cell);
      ctx.lineTo(b.x + pad + cell * SIZE, b.y + pad + i * cell);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawTile(t, index) {
    var cell = layout.board.cell;
    var size = cell - 5;
    var isSelected = state.selected === index && !t.clearing;
    var hint = state.hint;
    var isHint = !!hint && (hint.a === index || hint.b === index) && !t.clearing;
    var scale = (t.scale == null ? 1 : t.scale);
    if (isSelected) scale *= 1 + 0.03 * Math.sin(state.time * 7);

    var ch = Data.CHARS[t.type] || Data.CHARS[0];
    var spirit = t.spirit ? Data.char(t.spirit) : null;

    ctx.save();
    ctx.translate(t.px, t.py);
    if (t.rot) ctx.rotate(t.rot);
    ctx.scale(scale, scale);
    ctx.globalAlpha = t.alpha == null ? 1 : t.alpha;

    if (isSelected) {
      ctx.shadowColor = 'rgba(168,58,42,0.35)';
      ctx.shadowBlur = 10;
    }
    rr(-size / 2, -size / 2, size, size, size * 0.26);
    ctx.fillStyle = t.clearing ? C.red : (spirit ? '#FAEFD2' : C.tile);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    ctx.lineWidth = 1;
    ctx.strokeStyle = t.clearing
      ? 'rgba(140,44,32,0.9)'
      : (spirit ? 'rgba(180,145,78,0.85)' : C.tileBorder);
    ctx.stroke();

    if (isSelected) {
      rr(-size / 2 - 1, -size / 2 - 1, size + 2, size + 2, size * 0.28);
      ctx.strokeStyle = C.red;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (isHint) {
      var pulse = 0.5 + 0.5 * Math.sin(state.time * 5);
      ctx.save();
      ctx.shadowColor = 'rgba(168,58,42,0.55)';
      ctx.shadowBlur = 6 + 8 * pulse;
      rr(-size / 2 - 1, -size / 2 - 1, size + 2, size + 2, size * 0.28);
      ctx.strokeStyle = 'rgba(168,58,42,' + (0.25 + 0.4 * pulse).toFixed(3) + ')';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    var glyphId = spirit ? spirit.glyph : ch.glyph;
    Glyphs.drawById(
      ctx, glyphId, 0, 0, size * 0.7,
      Math.max(1.7, size * 0.078),
      t.clearing ? C.cream : (spirit ? '#8A5A20' : C.ink),
      true
    );

    if (spirit && !t.clearing) {
      ctx.beginPath();
      ctx.arc(size * 0.32, -size * 0.32, Math.max(2, size * 0.06), 0, Math.PI * 2);
      ctx.fillStyle = C.red;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawTiles() {
    var pass, i, t;
    for (pass = 0; pass < 2; pass++) {
      for (i = 0; i < state.tiles.length; i++) {
        t = state.tiles[i];
        if (!t) continue;
        if (pass === 0 && t.clearing) continue;
        if (pass === 1 && !t.clearing) continue;
        drawTile(t, i);
      }
    }
  }

  function drawPops() {
    for (var i = 0; i < state.pops.length; i++) {
      var pop = state.pops[i];
      var alpha = Math.max(0, 1 - pop.t / 0.9);
      var size = (pop.size || 17) + pop.t * 5;
      ctx.save();
      ctx.globalAlpha = alpha;
      setFont(size, 'bold');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var y = pop.y - 14 - pop.t * 36;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(251,243,226,0.85)';
      ctx.strokeText(pop.text, pop.x, y);
      ctx.fillStyle = C.red;
      ctx.fillText(pop.text, pop.x, y);
      ctx.restore();
    }
  }

  function drawParticles() {
    var list = state.particles;
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var k = p.t / p.life;
      var alpha = k < 0.65 ? 1 : Math.max(0, 1 - (k - 0.65) / 0.35);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.spark) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.4, p.size * 0.72);
        ctx.lineCap = 'round';
        var len = p.size * 3.2;
        ctx.beginPath();
        ctx.moveTo(-len / 2, 0);
        ctx.lineTo(len / 2, 0);
        ctx.stroke();
        ctx.lineCap = 'butt';
      } else {
        ctx.fillStyle = p.color;
        rr(-p.size / 2, -p.size / 2, p.size, p.size * 0.7, p.size * 0.24);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawRings() {
    for (var i = 0; i < state.rings.length; i++) {
      var rg = state.rings[i];
      var k = Math.min(1, rg.t / 0.5);
      var ease = 1 - Math.pow(1 - k, 3);
      var r = rg.r + (rg.max - rg.r) * ease;
      ctx.beginPath();
      ctx.arc(rg.x, rg.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + rg.color + ',' + (0.8 * (1 - k)).toFixed(3) + ')';
      ctx.lineWidth = 4 * (1 - k) + 0.8;
      ctx.stroke();
    }
  }

  function drawMilestone() {
    var m = state.milestone;
    if (!m) return;
    var appear = Math.min(1, m.t / 0.2);
    var fade = m.t > 1.15 ? Math.max(0, 1 - (m.t - 1.15) / 0.4) : 1;
    var ease = 1 - Math.pow(1 - appear, 3);
    var scale = 0.88 + 0.12 * ease + 0.025 * Math.sin(m.t * 9) * Math.max(0, 1 - m.t * 1.6);
    var bx = layout.board.x + layout.board.size / 2;
    var by = layout.board.y + layout.board.size * 0.34;
    var w = Math.min(248, layout.board.size - 36), h = 62;

    ctx.save();
    ctx.globalAlpha = ease * fade;
    ctx.translate(bx, by);
    ctx.scale(scale, scale);

    ctx.shadowColor = 'rgba(120,70,30,0.28)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 5;
    rr(-w / 2, -h / 2, w, h, 13);
    ctx.fillStyle = 'rgba(253,246,232,0.97)';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(168,58,42,0.55)';
    ctx.lineWidth = 1.4;
    rr(-w / 2, -h / 2, w, h, 13);
    ctx.stroke();

    drawSeal(-w / 2 + 30, 0, 36, '成');
    text('部件已集 ' + m.done + ' / 3', -w / 2 + 56, -9, 13.5, C.ink, 'left', 'middle', 'bold');
    text('步数 +1 · 已集 ' + m.got + '/' + m.all, -w / 2 + 56, 11, 9.5, C.inkSoft, 'left', 'middle');
    ctx.restore();
  }

  function drawCombo() {
    if (!state.comboText) return;
    var c = state.comboText;
    var alpha = Math.max(0, 1 - c.t / 1.1);
    var scale = 1 + Math.min(0.3, c.t * 1.4);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(viewW / 2, layout.board.y + 34);
    ctx.scale(scale, scale);
    setFont(21, 'bold');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(251,243,226,0.92)';
    ctx.strokeText(c.text, 0, 0);
    ctx.fillStyle = C.red;
    ctx.fillText(c.text, 0, 0);
    ctx.restore();
  }

  function drawToast() {
    if (!state.toast) return;
    var t = state.toast;
    var alpha = t.t < 0.2 ? t.t / 0.2 : Math.max(0, 1 - (t.t - 1.4) / 0.5);
    var w = Math.min(layout.contentW - 20, 280), h = 34;
    var x = viewW / 2 - w / 2;
    var y = layout.board.y + layout.board.size - 50;
    if (state.evo || state.posterCanvas) y = viewH - 96;

    ctx.save();
    ctx.globalAlpha = alpha;
    rr(x, y, w, h, 17);
    ctx.fillStyle = 'rgba(51,41,31,0.84)';
    ctx.fill();
    setFont(11.5);
    ctx.fillStyle = C.cream;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.text, viewW / 2, y + h / 2 + 0.5, w - 20);
    ctx.restore();
  }

  function drawFooter() {
    ui.hint = null;
    if (state.screen !== 'play') return;

    var hw = 64, hh = 26;
    var hx = layout.x + layout.contentW - hw;
    var hy = layout.footerY;
    rr(hx, hy, hw, hh, hh / 2);
    ctx.fillStyle = 'rgba(255,250,238,0.66)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(168,58,42,0.34)';
    ctx.lineWidth = 1;
    ctx.stroke();
    text('提示', hx + hw / 2, hy + hh / 2 + 0.5, 11.5, C.red, 'center', 'middle', 'bold');
    ui.hint = { x: hx - 4, y: hy - 4, w: hw + 8, h: hh + 8 };

    var tip = fitText('交换相邻甲骨 · 三枚同形即消 · 集齐部件以成字', 9.5,
      layout.contentW - hw - 10);
    text(tip, layout.x, hy + hh / 2 + 0.5, 9.5, 'rgba(90,74,52,0.5)', 'left', 'middle');
  }

  /* 卡住时自己点一下：亮出可消的一对，不扣步数 */
  function requestHint() {
    if (state.screen !== 'play' || state.phase !== 'idle') return;
    if (!state.grid) return;
    var mv = Core.findPossibleMove(state.grid);
    if (!mv) {
      showToast('已无可用步，正在重排');
      reshuffle();
      return;
    }
    state.hint = { a: mv[0], b: mv[1] };
    state.idleTime = 0;
    Sfx.play('select');
  }

  function drawCard(x, y, w, h) {
    ctx.save();
    ctx.shadowColor = 'rgba(60,40,20,0.38)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 12;
    rr(x, y, w, h, 18);
    ctx.fillStyle = '#FBF3E0';
    ctx.fill();
    ctx.restore();

    rr(x, y, w, h, 18);
    ctx.strokeStyle = 'rgba(180,145,78,0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    rr(x + 7, y + 7, w - 14, h - 14, 13);
    ctx.strokeStyle = 'rgba(168,58,42,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawOrnament(cx, y) {
    ctx.strokeStyle = 'rgba(180,145,78,0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 46, y);
    ctx.lineTo(cx - 10, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 10, y);
    ctx.lineTo(cx + 46, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, y - 4);
    ctx.lineTo(cx + 4, y);
    ctx.lineTo(cx, y + 4);
    ctx.lineTo(cx - 4, y);
    ctx.closePath();
    ctx.fillStyle = C.gold;
    ctx.fill();
  }

  function drawButton(rect, label, opts) {
    opts = opts || {};
    var fs = opts.size || 15;
    var fill = opts.ink ? C.ink : (opts.ghost ? 'rgba(255,250,238,0.7)' : C.red);
    var color = opts.ink ? C.cream : (opts.ghost ? C.inkSoft : C.cream);
    var x = rect.x, y = rect.y, w = rect.w, h = rect.h;
    ctx.save();
    if (opts.disabled) ctx.globalAlpha *= 0.35;

    if (!opts.ghost) {
      ctx.save();
      ctx.shadowColor = opts.ink ? 'rgba(40,30,18,0.30)' : 'rgba(150,50,35,0.28)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      rr(x, y, w, h, h / 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
      if (opts.ink) {
        rr(x + 1.5, y + 1.5, w - 3, h - 3, (h - 3) / 2);
        ctx.strokeStyle = 'rgba(196,163,102,0.55)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else {
      rr(x, y, w, h, h / 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = 'rgba(140,106,63,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    var tx = x + w / 2;
    if (opts.play) {
      setFont(fs, 'bold');
      var tw = ctx.measureText(label).width;
      var iconW = fs * FONT_SCALE * 0.6;
      var gapI = 5;
      var total = iconW + gapI + tw;
      var left = x + (w - total) / 2;
      var cy = y + h / 2 + 1;
      ctx.beginPath();
      ctx.moveTo(left + 1, cy - iconW * 0.58);
      ctx.lineTo(left + 1 + iconW * 0.82, cy);
      ctx.lineTo(left + 1, cy + iconW * 0.58);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      tx = left + iconW + gapI + tw / 2;
    }

    text(label, tx, y + h / 2 + 1, fs, color, 'center', 'middle', 'bold');
    ctx.restore();
  }

  /* ---------------- 弹层：开始 ---------------- */

  /* 首页切契：只允许在已开范围内换，越界不动 */
  function selectStartLevel(i) {
    var max = Math.min(progress.unlocked - 1, LEVEL_COUNT - 1);
    var n = Math.max(0, Math.min(max, i));
    if (n === state.startSel) return;
    state.startSel = n;
    Sfx.play('select');
  }

  function drawChevron(cx, cy, dir, on) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - dir * 3, cy - 5);
    ctx.lineTo(cx + dir * 3, cy);
    ctx.lineTo(cx - dir * 3, cy + 5);
    ctx.strokeStyle = on ? 'rgba(168,58,42,0.72)' : 'rgba(140,106,63,0.16)';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }

  /* 首页贴边卡片：左右各 12，上下各 16，长屏最多 820 高 */
  function startCardRect() {
    var w = layout.contentW;
    var top = safeTop + 16;
    var h = Math.min(820, viewH - top - 16);
    return {
      x: (viewW - w) / 2,
      y: top + Math.max(0, (viewH - top - 16 - h) / 2),
      w: w,
      h: h
    };
  }

  function drawStart() {
    var cx = viewW / 2;
    var r = startCardRect();
    var x = r.x, y = r.y, w = r.w, h = r.h;

    /* 多出来的高度摊进四处间距（字变 / 已识 / 主按钮 / 十契），字号不动 */
    var g = Math.max(0, Math.min(84, (h - 468) / 4));

    /* 首页可选的契：只在已开的范围内左右滑/点箭头切换 */
    var maxSel = Math.min(progress.unlocked - 1, LEVEL_COUNT - 1);
    var sel = Math.max(0, Math.min(maxSel, state.startSel));
    state.startSel = sel;

    drawCard(x, y, w, h);
    drawOrnament(cx, y + 56);

    text('甲骨消消乐', cx, y + 80, 28, C.ink, 'center', 'middle', 'bold');
    text('契于龟甲 · 消而成文', cx, y + 106, 12, C.inkSoft, 'center', 'middle');

    /* 字号是设置项，单放右上角；「意见」放左上角与之对称 */
    drawFontToggle(x + w - 12, y + 14);
    var fbx = x + 12, fby = y + 16, fbw = 44, fbh = 24;
    rr(fbx, fby, fbw, fbh, 12);
    ctx.fillStyle = 'rgba(255,250,238,0.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(140,106,63,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    text('意见', fbx + fbw / 2, fby + fbh / 2 + 0.5, 11, C.inkSoft, 'center', 'middle');
    ui.feedback = { x: fbx - 6, y: fby - 6, w: fbw + 12, h: fbh + 12 };

    var inviting = !!challenge && !challenge.done;
    var demoIdx = inviting ? challenge.level : sel;
    var demoCh = Data.char(Data.LEVELS[demoIdx].char);

    /* 首屏字变：一进首页就能看见这个字从甲骨走到楷书 */
    var px = x + 20, pw = w - 40, py = y + 128 + g, ph = 58;
    rr(px, py, pw, ph, 15);
    ctx.fillStyle = 'rgba(255,250,238,0.62)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,145,78,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ui.startEvo = { x: px, y: py, w: pw, h: ph };
    var demo = drawStartEvo(demoCh, px + 40, py + 29, 42);

    ctx.beginPath();
    ctx.moveTo(px + 78, py + 14);
    ctx.lineTo(px + 78, py + 44);
    ctx.strokeStyle = 'rgba(180,145,78,0.28)';
    ctx.stroke();

    var dmeta = EVO_META[demo.stages[demo.i]];
    text(dmeta.name, px + 90, py + 20, 13.5, C.ink, 'left', 'middle', 'bold');
    text(fitText(dmeta.era + ' · ' + dmeta.note, 9.5, pw - 150), px + 90, py + 35, 9.5,
      C.inkSoft, 'left', 'middle');

    var ALL_STAGE = ['oracle', 'bronze', 'seal', 'kai'];
    var curAll = ALL_STAGE.indexOf(demo.stages[demo.i]);
    for (var d = 0; d < ALL_STAGE.length; d++) {
      var has = demo.stages.indexOf(ALL_STAGE[d]) >= 0;
      var act = d === curAll;
      ctx.beginPath();
      ctx.arc(px + 92 + d * 14, py + 47, act ? 3.4 : 2.2, 0, Math.PI * 2);
      if (!has) {
        ctx.strokeStyle = 'rgba(150,120,80,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = act ? C.red : 'rgba(150,120,80,0.42)';
        ctx.fill();
      }
    }

    text(demoCh.kai, px + pw - 36, py + 23, 22, C.gold, 'center', 'middle', 'bold');
    text('点开细看', px + pw - 36, py + 43, 8, 'rgba(168,58,42,0.6)', 'center', 'middle');

    var learned = progress.learned.length;
    var infoY = y + 206 + g * 1.8;
    var infoLine = fitText('已识 ' + learned + ' / ' + Data.CHARS.length + ' 字 · 已开 ' +
      progress.unlocked + ' / ' + LEVEL_COUNT + ' 契', 11, w - 40);
    if (inviting) {
      var clv = Data.LEVELS[challenge.level];
      var cch = Data.char(clv.char);
      var invite = challenge.step
        ? '好友在「' + clv.title + ' · ' + cch.kai + '」用 ' + challenge.step + ' 步成文'
        : '好友邀你共契「' + clv.title + ' · ' + cch.kai + '」';
      text(invite, cx, infoY - 8, 11, C.gold, 'center', 'middle', 'bold');
      text(fitText(infoLine, 10, w - 40), cx, infoY + 12, 10,
        'rgba(90,74,52,0.5)', 'center', 'middle');
    } else {
      text(infoLine, cx, infoY, 11.5, C.gold, 'center', 'middle', 'bold');
    }

    var nextIndex = inviting ? challenge.level : sel;
    var selDone = progress.learned.indexOf(Data.char(Data.LEVELS[sel].char).id) >= 0;
    var primaryY = y + 228 + g * 2.1;
    ui.primary = { x: x + 20, y: primaryY, w: w - 40, h: 50 };
    if (inviting) drawButton(ui.primary, '接受挑战 · ' + Data.LEVELS[nextIndex].title, { size: 15 });
    else if (selDone) drawButton(ui.primary, '重玩「' + Data.LEVELS[nextIndex].title + '」', { size: 15 });
    else drawButton(ui.primary, '继续「' + Data.LEVELS[nextIndex].title + '」', { size: 15 });

    /* 副按钮宽按卡片内宽均分，320 窄屏也不会探出卡片 */
    var bgap = 10;
    var bw = Math.floor((w - 40 - bgap * 2) / 3);
    var rowY = primaryY + 64;
    ui.pick = { x: x + 20, y: rowY, w: bw, h: 46 };
    ui.library = { x: x + 20 + bw + bgap, y: rowY, w: bw, h: 46 };
    ui.quick = { x: x + 20 + (bw + bgap) * 2, y: rowY, w: bw, h: 46 };
    drawButton(ui.pick, '选契', { ghost: true, size: 13.5 });
    drawButton(ui.library, '字库', { ghost: true, size: 13.5 });
    drawButton(ui.quick, '快契', { ghost: true, size: 13.5 });

    /* 十契点阵：一眼看出走到第几契；页脚随卡片高度往下摊 */
    var metaY = y + h - 24;
    var divY = y + 350 + g * 2.7;
    var dotsY = divY + 20;
    var foot1Y = y + 406 + g * 3.4;
    var foot2Y = foot1Y + 20;

    ctx.beginPath();
    ctx.moveTo(x + 20, divY);
    ctx.lineTo(x + w - 20, divY);
    ctx.strokeStyle = 'rgba(180,145,78,0.26)';
    ctx.lineWidth = 1;
    ctx.stroke();

    /* 契名两侧的小箭头：可点，也可整屏左右滑；只到已开的最后一契为止 */
    drawChevron(x + 26, dotsY, -1, sel > 0);
    text(Data.LEVELS[sel].title, x + 36, dotsY, 10.5,
      'rgba(58,45,30,0.62)', 'left', 'middle', 'bold');
    drawChevron(x + 94, dotsY, 1, sel < maxSel);
    ui.prev = { x: x + 4, y: dotsY - 22, w: 44, h: 44 };
    ui.next = { x: x + 72, y: dotsY - 22, w: 44, h: 44 };

    var dotR = LEVEL_COUNT > 10 ? 3.6 : 4.5;
    var dotGap = Math.min(LEVEL_COUNT > 10 ? 10 : 14,
      (w - 40 - 48 - dotR * 2) / Math.max(1, LEVEL_COUNT - 1));
    var dotRight = x + w - 20 - dotR;
    for (var k = 0; k < LEVEL_COUNT; k++) {
      var kch = Data.char(Data.LEVELS[k].char);
      var kdone = progress.learned.indexOf(kch.id) >= 0;
      var kx = dotRight - (LEVEL_COUNT - 1 - k) * dotGap;
      ctx.beginPath();
      ctx.arc(kx, dotsY, dotR, 0, Math.PI * 2);
      if (kdone) {
        ctx.fillStyle = C.red;
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(140,106,63,0.3)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      if (k === sel) {
        ctx.beginPath();
        ctx.arc(kx, dotsY, dotR + 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168,58,42,0.8)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    }

    text('点字卡可看甲骨原文与字形本源', cx, foot1Y, 10.5,
      'rgba(90,74,52,0.48)', 'center', 'middle');
    text('停手七秒或点「提示」，会亮出一处可消', cx, foot2Y, 10.5,
      'rgba(90,74,52,0.48)', 'center', 'middle');
    text(fitText('共 ' + LEVEL_COUNT + ' 契 ' + Data.CHARS.length +
      ' 字 · 字形参考汉典与《趣味的甲骨金文》等', 9, w - 32),
      cx, metaY, 9, 'rgba(90,74,52,0.34)', 'center', 'middle');
  }

  /* 右上角「大字」：虚线细边的小开关，样式刻意区别于实心胶囊 */
  function drawFontToggle(right, top) {
    var fw = 56, fh = 28;
    var bx = right - fw;
    /* 视觉尺寸不变，热区补到 68×44，够 44px 触控线 */
    ui.fontPill = { x: bx - 6, y: top - 8, w: fw + 12, h: 44 };
    var on = progress.bigText;
    rr(bx, top, fw, fh, fh / 2);
    ctx.fillStyle = on ? 'rgba(168,58,42,0.10)' : 'rgba(255,250,238,0.45)';
    ctx.fill();
    ctx.strokeStyle = on ? 'rgba(168,58,42,0.55)' : 'rgba(140,106,63,0.3)';
    ctx.lineWidth = 1;
    if (ctx.setLineDash) ctx.setLineDash([3, 2]);
    ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    text('大字', bx + fw / 2, top + fh / 2 + 0.5, 10.5,
      on ? C.red : 'rgba(58,45,30,0.5)', 'center', 'middle', 'bold');
  }

  /* ---------------- 选契：契图 ---------------- */

  function openLevels() {
    state.screen = 'levels';
    state.levelPage = Math.floor(state.levelIndex / 10);
    state.librarySel = null;
    state.noteSel = null;
    state.toast = null;
  }

  function drawLevels() {
    var cx = viewW / 2;
    var w = Math.min(layout.contentW - 8, 332);
    var cols = 2;
    var gap = 10;
    var perPage = 10;
    var pages = Math.ceil(LEVEL_COUNT / perPage);
    var page = Math.max(0, Math.min(pages - 1, state.levelPage || 0));
    state.levelPage = page;
    var start = page * perPage;
    var count = Math.min(perPage, LEVEL_COUNT - start);
    var cellW = (w - 32 - gap) / cols;
    var cellH = Math.min(58, Math.max(46, (viewH - 240) / 5 - gap));
    var rows = Math.ceil(count / cols);
    var h = 82 + rows * (cellH + gap) - gap + 78;
    var x = cx - w / 2;
    var y = Math.max(safeTop + 10, (viewH - h) / 2);

    drawCard(x, y, w, h);
    text('契图', cx, y + 32, 17, C.ink, 'center', 'middle', 'bold');
    text('已识 ' + progress.learned.length + ' / ' + Data.CHARS.length +
      ' 字 · 已开 ' + progress.unlocked + ' / ' + LEVEL_COUNT + ' 契' +
      (pages > 1 ? ' · 第 ' + (page + 1) + '/' + pages + ' 页' : ''),
      cx, y + 56, 10.5, C.inkSoft, 'center', 'middle');

    ui.levelCells = [];
    for (var n = 0; n < count; n++) {
      var i = start + n;
      var col = n % cols;
      var row = Math.floor(n / cols);
      var bx = x + 16 + col * (cellW + gap);
      var by = y + 80 + row * (cellH + gap);
      var lv = Data.LEVELS[i];
      var ch = Data.char(lv.char);
      var unlocked = i < progress.unlocked;
      var done = progress.learned.indexOf(ch.id) >= 0;

      rr(bx, by, cellW, cellH, 10);
      ctx.fillStyle = done
        ? 'rgba(168,58,42,0.07)'
        : (unlocked ? 'rgba(255,250,238,0.82)' : 'rgba(190,172,142,0.16)');
      ctx.fill();
      ctx.strokeStyle = (unlocked && !done) ? 'rgba(168,58,42,0.55)' : 'rgba(158,126,82,0.26)';
      ctx.lineWidth = (unlocked && !done) ? 1.5 : 1;
      ctx.stroke();

      Glyphs.drawById(ctx, ch.glyph, bx + 27, by + cellH / 2, 30, 1.6,
        unlocked ? C.ink : 'rgba(58,45,30,0.26)', true);

      text(lv.title + (done ? ' · 已识' : unlocked ? ' · 可闯' : ' · 未开'),
        bx + 50, by + 20, 10, done ? C.red : (unlocked ? C.inkSoft : C.inkFaint),
        'left', 'middle', done ? 'bold' : null);
      text(unlocked ? ch.kai + ' · ' + ch.meaning : '未开',
        bx + 50, by + 40, 12, unlocked ? C.ink : C.inkFaint, 'left', 'middle', 'bold');

      ui.levelCells.push({ x: bx, y: by, w: cellW, h: cellH, index: i, locked: !unlocked });
    }

    if (pages > 1) {
      ui.levelPrev = { x: x + 16, y: y + h - 54, w: 74, h: 38 };
      ui.levelNext = { x: x + w - 90, y: y + h - 54, w: 74, h: 38 };
      drawButton(ui.levelPrev, '上一页', {
        ghost: true, size: 11.5, disabled: page <= 0
      });
      drawButton(ui.levelNext, '下一页', {
        ghost: true, size: 11.5, disabled: page >= pages - 1
      });
    }
    ui.levelsClose = { x: cx - 42, y: y + h - 54, w: 84, h: 38 };
    drawButton(ui.levelsClose, '合上', { ghost: true, size: 12 });
  }

  /* ---------------- 字卡海报 ---------------- */

  var POSTER_W = 1080, POSTER_H = 1440;
  var posterOff = null;

  function posterFont(p, size, weight) {
    p.font = (weight ? weight + ' ' : '') + size +
      'px "Noto Serif SC","Source Han Serif SC","Songti SC","STSong","Noto Serif CJK SC","SimSun",serif';
  }

  function posterText(p, str, x, y, size, color, align, baseline, weight) {
    posterFont(p, size, weight);
    p.fillStyle = color;
    p.textAlign = align || 'left';
    p.textBaseline = baseline || 'alphabetic';
    p.fillText(str, x, y);
  }

  function posterWrap(p, str, maxW, size) {
    posterFont(p, size);
    var lines = [];
    var cur = '';
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      var over = cur && p.measureText(cur + c).width > maxW;
      if (over && NO_LINE_START.indexOf(c) < 0) {
        lines.push(cur);
        cur = c;
      } else {
        cur += c;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function posterRound(p, x, y, w, h, r) {
    p.beginPath();
    p.moveTo(x + r, y);
    p.arcTo(x + w, y, x + w, y + h, r);
    p.arcTo(x + w, y + h, x, y + h, r);
    p.arcTo(x, y + h, x, y, r);
    p.arcTo(x, y, x + w, y, r);
    p.closePath();
  }

  function buildPoster() {
    var lv = levelConfig();
    var ch = Data.char(lv.char);
    var pv = null;
    try {
      if (!posterOff) posterOff = isWx ? wx.createCanvas() : document.createElement('canvas');
      pv = posterOff;
    } catch (e) { pv = null; }
    if (!pv) { showToast('当前环境不支持生成字卡'); return; }

    pv.width = POSTER_W;
    pv.height = POSTER_H;
    var p = pv.getContext('2d');

    var bg = p.createLinearGradient(0, 0, 0, POSTER_H);
    bg.addColorStop(0, '#FBF4E6');
    bg.addColorStop(0.6, '#F2E4CA');
    bg.addColorStop(1, '#E2CDA6');
    p.fillStyle = bg;
    p.fillRect(0, 0, POSTER_W, POSTER_H);

    p.strokeStyle = 'rgba(160,124,68,0.32)';
    p.lineWidth = 2;
    p.strokeRect(44, 44, POSTER_W - 88, POSTER_H - 88);

    posterText(p, '甲 骨 消 消 乐', 540, 122, 38, '#B4914E', 'center', 'middle', 'bold');
    posterText(p, '契于龟甲 · 消而成文', 540, 168, 20,
      'rgba(58,45,30,0.42)', 'center', 'middle');
    posterText(p, state.quick ? '快契 · 九十秒成文' : '契文已成 · ' + lv.title, 540, 218, 23,
      '#B4914E', 'center', 'middle', 'bold');

    p.beginPath();
    p.arc(540, 420, 178, 0, Math.PI * 2);
    p.fillStyle = 'rgba(252,246,232,0.92)';
    p.fill();
    p.strokeStyle = 'rgba(180,145,78,0.5)';
    p.lineWidth = 2;
    p.stroke();
    p.beginPath();
    p.arc(540, 420, 166, 0, Math.PI * 2);
    p.strokeStyle = 'rgba(180,145,78,0.2)';
    p.lineWidth = 1;
    p.stroke();

    Glyphs.drawById(p, ch.glyph, 540, 420, 280, 6, C.ink, true);

    posterText(p, '甲 骨 文', 540, 634, 20, 'rgba(58,45,30,0.38)', 'center', 'middle');
    posterText(p, ch.kai, 540, 716, 108, C.red, 'center', 'middle', 'bold');
    posterText(p, ch.pinyin, 540 + 88, 712, 27, 'rgba(58,45,30,0.5)', 'left', 'middle');
    posterText(p, ch.meaning, 540, 818, 40, C.ink, 'center', 'middle', 'bold');

    var copy = ch.kid;
    var lines = posterWrap(p, copy, 800, 25);
    if (lines.length > 2) lines = lines.slice(0, 2);
    for (var i = 0; i < lines.length; i++) {
      posterText(p, lines[i], 540, 874 + i * 40, 25,
        'rgba(58,45,30,0.72)', 'center', 'middle');
    }

    p.strokeStyle = 'rgba(150,120,80,0.24)';
    p.lineWidth = 1;
    p.beginPath();
    p.moveTo(140, 958);
    p.lineTo(POSTER_W - 140, 958);
    p.stroke();

    if (ch.bone) {
      posterText(p, '「' + ch.bone + '」', 540, 1016, 38, C.red, 'center', 'middle', 'bold');
      posterText(p, ch.gloss, 540, 1068, 25, 'rgba(58,45,30,0.55)', 'center', 'middle');
    } else {
      posterText(p, ch.gloss, 540, 1016, 28, 'rgba(58,45,30,0.55)', 'center', 'middle');
    }

    posterText(p, (state.quick ? '九十秒' : '第 ' + (state.levelIndex + 1) + ' 契') +
      ' · ' + (state.quick ? '' : state.steps + ' 步 · ') + state.score + ' 分 · 连击 ×' +
      (state.maxMult || 1),
      540, 1128, 26, 'rgba(58,45,30,0.58)', 'center', 'middle');
    posterText(p, '字卡入库 · 已识 ' + progress.learned.length + ' / ' +
      Data.CHARS.length + ' 字',
      540, 1174, 23, 'rgba(58,45,30,0.4)', 'center', 'middle');

    p.save();
    p.translate(938, 1278);
    p.rotate(-0.05);
    posterRound(p, -46, -46, 92, 92, 8);
    p.fillStyle = C.red;
    p.fill();
    posterText(p, '契', 0, 2, 48, '#FBF3E2', 'center', 'middle', 'bold');
    p.restore();

    posterText(p, '甲骨消消乐 · ' + LEVEL_COUNT + ' 契 ' + Data.CHARS.length + ' 字',
      540, 1356, 21, 'rgba(58,45,30,0.32)', 'center', 'middle');

    if (isWx) {
      try {
        wx.canvasToTempFilePath({
          canvas: pv,
          success: function (res) {
            if (wx.showShareImageMenu) {
              wx.showShareImageMenu({ path: res.tempFilePath });
            } else if (wx.saveImageToPhotosAlbum) {
              wx.saveImageToPhotosAlbum({ filePath: res.tempFilePath });
            }
          },
          fail: function () { showToast('字卡生成失败，再试一次'); }
        });
      } catch (e) {
        showToast('字卡生成失败，再试一次');
      }
      return;
    }

    state.posterCanvas = pv;
  }

  function downloadPoster() {
    if (!state.posterCanvas) return;
    try {
      var a = document.createElement('a');
      a.href = state.posterCanvas.toDataURL('image/png');
      a.download = '甲骨字卡-' + Data.char(levelConfig().char).kai + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      state.posterCanvas = null;
      showToast('字卡已存到下载文件夹');
    } catch (e) {
      showToast('下载失败，请长按图片保存');
    }
  }

  function drawPosterPreview() {
    var pv = state.posterCanvas;
    if (!pv) return;

    ctx.fillStyle = 'rgba(28,20,12,0.7)';
    ctx.fillRect(0, 0, viewW, viewH);

    var maxW = Math.min(viewW - 56, 340);
    var maxH = viewH - 190;
    var scale = Math.min(maxW / POSTER_W, maxH / POSTER_H);
    var dw = POSTER_W * scale;
    var dh = POSTER_H * scale;
    var dx = (viewW - dw) / 2;
    var dy = Math.max(safeTop + 14, (viewH - dh - 60) / 2);

    ctx.save();
    ctx.shadowColor = 'rgba(20,12,6,0.45)';
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FBF4E6';
    ctx.fillRect(dx, dy, dw, dh);
    ctx.restore();
    ctx.drawImage(pv, dx, dy, dw, dh);

    text('长按字卡可保存 · 也可直接截图', viewW / 2, dy + dh + 19, 10.5,
      'rgba(255,248,235,0.8)', 'center', 'middle');

    ui.posterImage = { x: dx, y: dy, w: dw, h: dh };
    ui.posterSave = { x: viewW / 2 - 100, y: dy + dh + 34, w: 92, h: 34 };
    ui.posterClose = { x: viewW / 2 + 8, y: dy + dh + 34, w: 92, h: 34 };
    drawButton(ui.posterSave, '下载', { size: 12.5 });
    drawButton(ui.posterClose, '关闭', { ghost: true, size: 12.5 });
  }

  function drawSpellCard() {
    var lv = levelConfig();
    var ch = Data.char(lv.char);
    var cx = viewW / 2;
    var w = Math.min(layout.contentW - 4, 336);
    var h = Math.min(viewH - 40, 500);
    var x = cx - w / 2;
    var y = Math.max(safeTop + 10, (viewH - h) / 2);

    var t = Math.min(1, state.cardT / 0.35);
    var ease = 1 - Math.pow(1 - t, 3);

    ctx.save();
    ctx.translate(cx, y + h / 2);
    ctx.scale(0.92 + 0.08 * ease, 0.92 + 0.08 * ease);
    ctx.translate(-cx, -(y + h / 2));
    ctx.globalAlpha = ease;

    drawCard(x, y, w, h);

    text(state.quick ? '快契已成 · 九十秒' : '契文已成 · ' + lv.title,
      cx, y + 32, 11, C.gold, 'center', 'middle', 'bold');

    /* 右上角小开关：白话 ↔ 字源 */
    var sw = 52, sh = 24;
    var sx0 = x + w - 12 - sw;
    rr(sx0, y + 20, sw, sh, sh / 2);
    ctx.fillStyle = 'rgba(255,250,238,0.55)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(140,106,63,0.32)';
    ctx.lineWidth = 1;
    if (ctx.setLineDash) ctx.setLineDash([3, 2]);
    ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    text(state.cardSrc ? '白话' : '字源', sx0 + sw / 2, y + 20 + sh / 2 + 0.5, 10.5,
      C.inkSoft, 'center', 'middle', 'bold');
    ui.cardSrc = { x: sx0 - 4, y: y + 14, w: sw + 8, h: sh + 12 };

    var gx = cx, gy = y + 102;
    ctx.beginPath();
    ctx.arc(gx, gy, 52, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250,242,226,0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,145,78,0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    Glyphs.drawById(ctx, ch.glyph, gx, gy, 82, 2.6, C.ink, true);

    /* 圆章可点；刚进字卡的 3 秒给一圈呼吸提示 */
    var halo = Math.max(0, 1 - state.cardT / 3);
    if (halo > 0.01) {
      var rp = 57 + 3 * (0.5 + 0.5 * Math.sin(state.cardT * 7));
      ctx.beginPath();
      ctx.arc(gx, gy, rp, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168,58,42,' + (0.45 * halo).toFixed(3) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ui.evoBtn = { x: gx - 56, y: gy - 56, w: 112, h: 112 };
    text('甲骨文', gx, y + 166, 9, C.inkFaint, 'center', 'middle');

    text(ch.kai, cx, y + 200, 34, C.red, 'center', 'middle', 'bold');
    text(ch.pinyin, cx + 30, y + 196, 11, C.inkSoft, 'left', 'middle');
    text(ch.meaning, cx, y + 228, 14, C.ink, 'center', 'middle', 'bold');

    /* 白话与字源互切：默认一句白话，想深看再点右上角 */
    var copy = state.cardSrc ? ch.adult : ch.kid;
    var lines = wrap(copy, w - 56, 11.5);
    if (lines.length > 3) lines = lines.slice(0, 3);
    drawLines(lines, cx, y + 258, 19, 11.5, 'rgba(58,45,30,0.78)');

    var boneY = y + 320;
    if (ch.bone) {
      text('「' + ch.bone + '」', cx, boneY - 8, 12.5, C.red, 'center', 'middle');
      text(ch.gloss, cx, boneY + 10, 10.5, C.inkSoft, 'center', 'middle');
    } else {
      text(ch.gloss, cx, boneY + 8, 11, C.inkSoft, 'center', 'middle');
    }

    ctx.strokeStyle = 'rgba(150,120,80,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 44, y + 341);
    ctx.lineTo(x + w - 44, y + 341);
    ctx.stroke();

    text(state.quick
      ? '九十秒 · 得分 ' + state.score + ' · 最高连击 ×' + state.maxMult
      : '本关 ' + state.steps + ' 步 · 得分 ' + state.score + ' · 最高连击 ×' + state.maxMult,
      cx, y + 354, 10.5, C.inkSoft, 'center', 'middle');
    text('字卡入库 · 已识 ' + progress.learned.length + ' / ' + Data.CHARS.length,
      cx, y + 374, 10.5, C.inkSoft, 'center', 'middle');
    if (ch.bone) {
      text('新可释读「' + ch.bone + '」', cx, y + 394, 10.5, C.red, 'center', 'middle', 'bold');
    } else {
      text('去字库可以翻看这张字卡', cx, y + 394, 10.5, C.inkFaint, 'center', 'middle');
    }

    if (!state.quick && challenge && challenge.done && challenge.level === state.levelIndex && challenge.step) {
      var mine = challenge.mine || state.steps;
      var gap = challenge.step - mine;
      var cmp = gap > 0
        ? '你 ' + mine + ' 步 · 好友 ' + challenge.step + ' 步 · 快 ' + gap + ' 步'
        : (gap === 0
          ? '与好友同为 ' + mine + ' 步'
          : '你 ' + mine + ' 步 · 好友 ' + challenge.step + ' 步 · 慢 ' + (-gap) + ' 步');
      text(cmp, cx, y + h - 92, 11, gap >= 0 ? C.red : C.inkSoft, 'center', 'middle', 'bold');
    }

    var primaryLabel = state.quick ? '再来一局' : '收下此字';
    var btnY = y + h - 68;
    if (isWx) {
      if (state.quick) {
        ui.primary = { x: cx - 154, y: btnY, w: 104, h: 44 };
        ui.evo = { x: cx - 44, y: btnY, w: 92, h: 44 };
        ui.poster = { x: cx + 54, y: btnY, w: 100, h: 44 };
        ui.share = null;
        drawButton(ui.primary, primaryLabel, { size: 12.5 });
        drawButton(ui.poster, '存字卡', { ghost: true, size: 11 });
      } else {
        ui.primary = { x: cx - 162, y: btnY, w: 92, h: 44 };
        ui.evo = { x: cx - 65, y: btnY, w: 78, h: 44 };
        ui.poster = { x: cx + 18, y: btnY, w: 66, h: 44 };
        ui.share = { x: cx + 89, y: btnY, w: 72, h: 44 };
        drawButton(ui.primary, primaryLabel, { size: 11.5 });
        drawButton(ui.poster, '存字卡', { ghost: true, size: 9.5 });
        drawButton(ui.share, '分享', { ghost: true, size: 9.5 });
      }
    } else {
      ui.share = null;
      ui.primary = { x: cx - 150, y: btnY, w: 104, h: 44 };
      ui.evo = { x: cx - 40, y: btnY, w: 96, h: 44 };
      ui.poster = { x: cx + 62, y: btnY, w: 88, h: 44 };
      drawButton(ui.primary, primaryLabel, { size: 14 });
      drawButton(ui.poster, '存字卡', { ghost: true, size: 11.5 });
    }

    /* 演变按钮：墨色实心 + 播放符号；字卡刚出现时轻微呼吸 */
    var es = state.cardT < 3
      ? 1 + 0.05 * (1 - state.cardT / 3) * Math.abs(Math.sin(state.cardT * 8))
      : 1;
    ctx.save();
    ctx.translate(ui.evo.x + ui.evo.w / 2, ui.evo.y + ui.evo.h / 2);
    ctx.scale(es, es);
    ctx.translate(-(ui.evo.x + ui.evo.w / 2), -(ui.evo.y + ui.evo.h / 2));
    drawButton(ui.evo, '看演变', { ink: true, size: isWx ? (state.quick ? 11 : 10.5) : 12, play: true });
    ctx.restore();

    ctx.restore();
  }

  /* ---------------- 弹层：字源演变 ---------------- */

  var EVO_TOTAL = 5;
  var EVO_FADE = 0.42;
  var EVO_META = {
    oracle: { name: '甲骨文', era: '商', note: '契刻于龟甲兽骨，刀锋瘦硬' },
    bronze: { name: '金文', era: '商周', note: '铸于青铜彝器，笔画圆浑' },
    seal: { name: '小篆', era: '秦', note: '秦并天下，书同文，字形匀整' },
    kai: { name: '楷书', era: '今', note: '隶楷递变，沿用至今' }
  };
  var evoImages = {};

  function evoStages(glyph) {
    var mask = (Evo && Evo[glyph]) || '';
    var out = ['oracle'];
    if (mask.indexOf('b') >= 0) out.push('bronze');
    if (mask.indexOf('s') >= 0) out.push('seal');
    out.push('kai');
    return out;
  }

  function evoImage(glyph, style) {
    var key = glyph + '-' + style;
    if (evoImages[key]) return evoImages[key];
    var img = null;
    try {
      img = isWx ? wx.createImage() : new Image();
      img.src = 'assets/evo/' + key + '.png';
    } catch (e) { img = null; }
    evoImages[key] = img;
    return img;
  }

  function openEvolution(ch) {
    if (!ch) return;
    var stages = evoStages(ch.glyph);
    for (var i = 1; i < stages.length - 1; i++) evoImage(ch.glyph, stages[i]);
    state.evo = { ch: ch, stages: stages, t: 0 };
    Sfx.play('select');
  }

  function evoGlyph(ch, style, x, y, size, alpha) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    if (style === 'oracle') {
      Glyphs.drawById(ctx, ch.glyph, x, y, size, Math.max(1.8, size * 0.05), C.ink, true);
    } else if (style === 'kai') {
      text(ch.kai, x, y + 2, size * 0.94, C.ink, 'center', 'middle', 'bold');
    } else {
      var img = evoImage(ch.glyph, style);
      var ok = img && img.complete !== false && (img.naturalWidth || img.width) > 0;
      if (ok) ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    }
    ctx.restore();
  }

  /* 首屏自动演示：与弹层共用同一套字形 */
  function startEvoNow(ch) {
    var stages = evoStages(ch.glyph);
    var hold = 1.05, fade = 0.3;
    var t = state.time % (stages.length * hold);
    var i = Math.floor(t / hold);
    var local = t - i * hold;
    return { stages: stages, i: i, a: local < fade ? local / fade : 1 };
  }

  function drawStartEvo(ch, x, y, size) {
    var s = startEvoNow(ch);
    for (var k = 1; k < s.stages.length - 1; k++) evoImage(ch.glyph, s.stages[k]);
    if (s.a < 1) {
      var p = (s.i + s.stages.length - 1) % s.stages.length;
      evoGlyph(ch, s.stages[p], x, y, size, 1 - s.a);
    }
    evoGlyph(ch, s.stages[s.i], x, y, size, s.a);
    return s;
  }

  /* ---------------- 演变导出：动图（GIF） ---------------- */

  var EVO_CARD_W = 320;
  var EVO_CARD_H = 420;

  function withCtx(target, fn) {
    var old = ctx;
    ctx = target;
    try {
      fn();
    } finally {
      ctx = old;
    }
  }

  function makeOffscreen(w, h) {
    try {
      var cv = isWx ? wx.createCanvas() : document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      return cv;
    } catch (e) {
      return null;
    }
  }

  function drawEvoCardFrame(c2, ch, stages, idx, blend) {
    var W = EVO_CARD_W, H = EVO_CARD_H, cx = W / 2;
    withCtx(c2, function () {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#F6EDDA';
      ctx.fillRect(0, 0, W, H);

      rr(14, 14, W - 28, H - 28, 16);
      ctx.strokeStyle = 'rgba(180,145,78,0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();
      rr(21, 21, W - 42, H - 42, 12);
      ctx.strokeStyle = 'rgba(168,58,42,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      text('字 源 演 变', cx, 54, 13, C.gold, 'center', 'middle', 'bold');

      var gy = 196, radius = 92;
      ctx.beginPath();
      ctx.arc(cx, gy, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250,242,226,0.95)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(180,145,78,0.38)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      var gsize = 168;
      if (blend > 0 && idx > 0) {
        evoGlyph(ch, stages[idx - 1], cx, gy, gsize, 1 - blend);
        evoGlyph(ch, stages[idx], cx, gy, gsize, blend);
      } else {
        evoGlyph(ch, stages[idx], cx, gy, gsize, 1);
      }

      var meta = EVO_META[stages[idx]];
      text('「' + meta.name + '」', cx, 316, 20, C.ink, 'center', 'middle', 'bold');
      text(meta.era + ' · ' + meta.note, cx, 342, 10.5, C.inkSoft, 'center', 'middle');

      var ALL = ['oracle', 'bronze', 'seal', 'kai'];
      var gap = 34, tlY = 368;
      var sx = cx - gap * 1.5;
      ctx.strokeStyle = 'rgba(150,120,80,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, tlY);
      ctx.lineTo(sx + gap * 3, tlY);
      ctx.stroke();
      var curAll = ALL.indexOf(stages[idx]);
      for (var d = 0; d < ALL.length; d++) {
        var has = stages.indexOf(ALL[d]) >= 0;
        var active = d === curAll;
        ctx.beginPath();
        ctx.arc(sx + d * gap, tlY, active ? 5 : 3.2, 0, Math.PI * 2);
        if (!has) {
          ctx.strokeStyle = 'rgba(150,120,80,0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = active ? C.red : (d < curAll ? C.gold : 'rgba(150,120,80,0.32)');
          ctx.fill();
        }
      }

      text('甲骨消消乐 · ' + ch.kai + ' ' + ch.pinyin, cx, 394, 10,
        'rgba(90,74,52,0.55)', 'center', 'middle');
    });
  }

  function evoImagesReady(ch, stages) {
    for (var i = 1; i < stages.length - 1; i++) {
      var img = evoImage(ch.glyph, stages[i]);
      if (!img || img.complete === false || !(img.naturalWidth || img.width)) return false;
    }
    return true;
  }

  function buildEvoGif(ch, stages) {
    if (!Gif) return null;
    var cv = makeOffscreen(EVO_CARD_W, EVO_CARD_H);
    if (!cv) return null;
    var c2 = cv.getContext('2d');
    var frames = [], delays = [];
    var blends = [0.34, 0.68];

    function grab() {
      frames.push(Gif.quantize(c2.getImageData(0, 0, EVO_CARD_W, EVO_CARD_H).data));
    }

    for (var i = 0; i < stages.length; i++) {
      if (i > 0) {
        for (var b = 0; b < blends.length; b++) {
          drawEvoCardFrame(c2, ch, stages, i, blends[b]);
          grab();
          delays.push(110);
        }
      }
      drawEvoCardFrame(c2, ch, stages, i, 0);
      grab();
      delays.push(820);
    }
    return Gif.encode(frames, EVO_CARD_W, EVO_CARD_H, delays);
  }

  var B64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  function bytesToBase64(bytes) {
    var out = '';
    var len = bytes.length;
    var i = 0;
    for (; i + 2 < len; i += 3) {
      var n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      out += B64CHARS.charAt((n >> 18) & 63) + B64CHARS.charAt((n >> 12) & 63) +
        B64CHARS.charAt((n >> 6) & 63) + B64CHARS.charAt(n & 63);
    }
    var rest = len - i;
    if (rest === 1) {
      var n1 = bytes[i] << 16;
      out += B64CHARS.charAt((n1 >> 18) & 63) + B64CHARS.charAt((n1 >> 12) & 63) + '==';
    } else if (rest === 2) {
      var n2 = (bytes[i] << 16) | (bytes[i + 1] << 8);
      out += B64CHARS.charAt((n2 >> 18) & 63) + B64CHARS.charAt((n2 >> 12) & 63) +
        B64CHARS.charAt((n2 >> 6) & 63) + '=';
    }
    return out;
  }

  function saveEvoGif(ch, bytes) {
    if (isWx) {
      try {
        var path = wx.env.USER_DATA_PATH + '/evo-' + ch.id + '.gif';
        wx.getFileSystemManager().writeFileSync(path, bytesToBase64(bytes), 'base64');
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function () { showToast('动图已存入相册'); },
          fail: function () { showToast('未获相册授权'); }
        });
      } catch (e) {
        showToast('存图失败');
      }
      return;
    }
    try {
      var blob = new Blob([bytes], { type: 'image/gif' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '字源演变-' + ch.kai + '.gif';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      showToast('动图已存下');
    } catch (e) {
      showToast('存图失败');
    }
  }

  function exportEvoGif() {
    var ev = state.evo;
    if (!ev) return;
    if (!Gif) {
      showToast('此版本不支持存动图');
      return;
    }
    if (!evoImagesReady(ev.ch, ev.stages)) {
      showToast('字形还在加载，稍候再试');
      return;
    }
    Sfx.play('tap');
    showToast('正在生成动图…');
    setTimeout(function () {
      var bytes = buildEvoGif(ev.ch, ev.stages);
      if (!bytes) {
        showToast('生成失败');
        return;
      }
      saveEvoGif(ev.ch, bytes);
    }, 60);
  }

  function drawEvolution() {
    var ev = state.evo;
    if (!ev) return;
    var ch = ev.ch;
    var stages = ev.stages;
    var t = ev.t;

    ctx.fillStyle = 'rgba(24,17,10,0.64)';
    ctx.fillRect(0, 0, viewW, viewH);

    var w = Math.min(layout.contentW - 24, 302);
    var h = Math.min(470, viewH - 40);
    var cx = viewW / 2;
    var x = cx - w / 2;
    var y = Math.max(safeTop + 16, (viewH - h) / 2);
    var compact = h < 446;

    var t0 = Math.min(1, t / 0.28);
    var ease = 1 - Math.pow(1 - t0, 3);

    ctx.save();
    ctx.translate(cx, y + h / 2);
    ctx.scale(0.94 + 0.06 * ease, 0.94 + 0.06 * ease);
    ctx.translate(-cx, -(y + h / 2));
    ctx.globalAlpha = ease;

    drawCard(x, y, w, h);

    text('字源演变', cx, y + 28, 11, C.gold, 'center', 'middle', 'bold');

    var per = EVO_TOTAL / stages.length;
    var idx = Math.min(stages.length - 1, Math.floor(t / per));
    var local = t - idx * per;
    var k = Math.min(1, local / EVO_FADE);

    var gy = y + (compact ? 130 : 150);
    var gsize = compact ? 126 : 152;
    var radius = compact ? 70 : 84;

    ctx.beginPath();
    ctx.arc(cx, gy, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250,242,226,0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,145,78,0.32)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (idx > 0 && local < EVO_FADE) {
      evoGlyph(ch, stages[idx - 1], cx, gy, gsize * (1 + 0.06 * k), 1 - k);
    }
    evoGlyph(ch, stages[idx], cx, gy, gsize * (0.94 + 0.06 * k), k);

    var meta = EVO_META[stages[idx]];
    var nameY = gy + radius + 26;
    text('「' + meta.name + '」', cx, nameY, 17, C.ink, 'center', 'middle', 'bold');
    var capY = nameY + 22;
    text(meta.era + ' · ' + meta.note, cx, capY, 10.5, C.inkSoft, 'center', 'middle');

    /* 时间轴：固定四个节点，缺拓本的画空心点 */
    var ALL_EVO = ['oracle', 'bronze', 'seal', 'kai'];
    var missing = [];
    for (var m = 0; m < ALL_EVO.length; m++) {
      if (stages.indexOf(ALL_EVO[m]) < 0) missing.push(ALL_EVO[m]);
    }
    var tlY = capY + (missing.length ? 34 : 32);
    var gapW = Math.min(42, (w - 130) / (ALL_EVO.length - 1));
    var startX = cx - (ALL_EVO.length - 1) * gapW / 2;
    ctx.strokeStyle = 'rgba(150,120,80,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, tlY);
    ctx.lineTo(startX + (ALL_EVO.length - 1) * gapW, tlY);
    ctx.stroke();
    var curAll = ALL_EVO.indexOf(stages[idx]);
    for (var i = 0; i < ALL_EVO.length; i++) {
      var dotX = startX + i * gapW;
      var has = stages.indexOf(ALL_EVO[i]) >= 0;
      var active = i === curAll;
      ctx.beginPath();
      ctx.arc(dotX, tlY, active ? 4.5 : (has ? 3 : 2.6), 0, Math.PI * 2);
      if (!has) {
        ctx.strokeStyle = 'rgba(150,120,80,0.42)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = active ? C.red : (i < curAll ? C.gold : 'rgba(150,120,80,0.3)');
        ctx.fill();
      }
    }

    if (missing.length) {
      var names = [];
      for (var n = 0; n < missing.length; n++) names.push(EVO_META[missing[n]].name);
      text('本字' + names.join('、') + '拓本未见，已略过',
        cx, capY + 17, 9, 'rgba(168,58,42,0.62)', 'center', 'middle');
    }

    var divY = tlY + 20;
    ctx.strokeStyle = 'rgba(150,120,80,0.22)';
    ctx.beginPath();
    ctx.moveTo(x + 44, divY);
    ctx.lineTo(x + w - 44, divY);
    ctx.stroke();

    var charY = divY + 22;
    text(ch.kai + '　' + ch.pinyin + ' · ' + ch.meaning,
      cx, charY, 13, C.red, 'center', 'middle', 'bold');

    var btnY = y + h - 52;
    var adultTop = charY + 20;
    var lines = wrap(ch.adult, w - 56, 10.5);
    var maxLines = Math.max(1, Math.floor((btnY - 12 - adultTop) / 14) + 1);
    if (lines.length > maxLines) lines = lines.slice(0, maxLines);
    if (lines.length > 3) lines = lines.slice(0, 3);
    drawLines(lines, cx, adultTop, 14, 10.5, 'rgba(58,45,30,0.72)');

    ui.evoCard = { x: x, y: y, w: w, h: h };
    var bw = Math.floor((w - 56) / 3);
    var bgap = (w - 44 - bw * 3) / 2;
    var bx = x + 22;
    ui.evoReplay = { x: bx, y: btnY, w: bw, h: 34 };
    ui.evoSave = { x: bx + bw + bgap, y: btnY, w: bw, h: 34 };
    ui.evoClose = { x: bx + (bw + bgap) * 2, y: btnY, w: bw, h: 34 };
    drawButton(ui.evoReplay, '重播', { ghost: true, size: 11.5 });
    drawButton(ui.evoSave, '存动图', { ghost: true, size: 11.5 });
    drawButton(ui.evoClose, '合上', { size: 11.5 });

    ctx.restore();

    text('金文 · 小篆字形取自汉典与维基共享资源', cx, y + h + 16, 9,
      'rgba(255,248,235,0.55)', 'center', 'middle');
  }

  /* ---------------- 弹层：字灵考校 ---------------- */

  function drawQuiz() {
    var q = state.quiz;
    if (!q) return;
    var ch = Data.char(q.charId);
    var cx = viewW / 2;
    var w = Math.min(layout.contentW - 20, 300);
    var h = 344;
    var x = cx - w / 2;
    var y = viewH / 2 - h / 2;

    var t = Math.min(1, q.t / 0.3);
    ctx.save();
    ctx.globalAlpha = t;
    drawCard(x, y, w, h);

    text('字灵考校', cx, y + 30, 12, C.gold, 'center', 'middle', 'bold');
    Glyphs.drawById(ctx, ch.glyph, cx, y + 92, 66, 2.4, C.ink, true);
    text('这个字是什么意思？', cx, y + 148, 13, C.ink, 'center', 'middle', 'bold');

    ui.optA = { x: cx - w / 2 + 26, y: y + 176, w: w - 52, h: 46 };
    ui.optB = { x: cx - w / 2 + 26, y: y + 234, w: w - 52, h: 46 };
    drawOption(ui.optA, q.options[0].text);
    drawOption(ui.optB, q.options[1].text);

    text('点中字灵 · 答对可添步数', cx, y + 308, 10,
      'rgba(90,74,52,0.5)', 'center', 'middle');
    ctx.restore();
  }

  function drawOption(rect, label) {
    rr(rect.x, rect.y, rect.w, rect.h, 12);
    ctx.fillStyle = 'rgba(255,250,238,0.85)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(158,126,82,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    text(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1, 14, C.ink, 'center', 'middle', 'bold');
  }

  /* ---------------- 弹层：结算 ---------------- */

  function drawResult() {
    var all = state.result === 'all';
    var quickFail = state.result === 'quickfail';
    var cx = viewW / 2;
    var w = Math.min(layout.contentW - 16, 320);
    var h = 386;
    var x = cx - w / 2;
    var y = viewH / 2 - h / 2;

    drawCard(x, y, w, h);

    drawSeal(cx, y + 58, 54, all ? '成' : quickFail ? '时' : '再');

    text(all ? LEVEL_COUNT + ' 契圆满' : quickFail ? '九十秒已尽' : '步数用尽',
      cx, y + 116, 23, C.ink, 'center', 'middle', 'bold');

    var sub = all
      ? '你已识得 ' + Data.CHARS.length + ' 个甲骨字'
      : quickFail
        ? '快契未成，再开一局'
        : '卜辞未验，再试一契';
    text(sub, cx, y + 144, 11.5, C.inkSoft, 'center', 'middle');

    text('已识 ' + progress.learned.length + ' / ' + Data.CHARS.length + ' 字',
      cx, y + 184, 17, all ? C.red : C.ink, 'center', 'middle', 'bold');

    var lv = levelConfig();
    text(all ? Data.CHARS.length + ' 字已入囊中'
      : quickFail
        ? '本契目标「' + Data.char(lv.char).kai + '」· 已收 ' + collectedTotal() + '/' + totalRequired()
        : '本契目标「' + Data.char(lv.char).kai + '」· 步数 ' + state.moves,
      cx, y + 208, 10.5, C.inkFaint, 'center', 'middle');

    ui.primary = { x: cx - 95, y: y + 244, w: 190, h: 46 };

    if (all) {
      ui.secondary = { x: cx - 100, y: y + 302, w: 94, h: 38 };
      ui.share = { x: cx + 6, y: y + 302, w: 94, h: 38 };
      drawButton(ui.primary, '进入字库 · 看 ' + Data.CHARS.length + ' 字');
      drawButton(ui.secondary, '再练一遍', { ghost: true, size: 12 });
      drawButton(ui.share, '回到首页', { ghost: true, size: 12 });
    } else {
      ui.secondary = { x: cx - 78, y: y + 302, w: 156, h: 38 };
      drawButton(ui.primary, quickFail ? '再开一局' : '重试此契');
      drawButton(ui.secondary, '回到首页', { ghost: true, size: 12 });
    }

    ui.library = { x: cx - 100, y: y + 348, w: 200, h: 30 };
    drawButton(ui.library, '字库 · 读辞 · 史官手记',
      { ghost: true, size: 11.5 });
  }

  function drawSeal(cx, cy, size, ch) {
    ctx.save();
    ctx.shadowColor = 'rgba(150,50,35,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    rr(cx - size / 2, cy - size / 2, size, size, size * 0.16);
    ctx.fillStyle = C.red;
    ctx.fill();
    ctx.restore();

    rr(cx - size / 2 + 4, cy - size / 2 + 4, size - 8, size - 8, size * 0.12);
    ctx.strokeStyle = 'rgba(251,243,226,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    text(ch, cx, cy + 1, size * 0.52, C.cream, 'center', 'middle', 'bold');
  }

  /* ---------------- 弹层：字库与读辞 ---------------- */

  function drawLibraryTab(rect, label, active) {
    rr(rect.x, rect.y, rect.w, rect.h, rect.h / 2);
    ctx.fillStyle = active ? C.red : 'rgba(255,250,238,0.72)';
    ctx.fill();
    ctx.strokeStyle = active ? 'rgba(150,50,35,0.5)' : 'rgba(140,106,63,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    text(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 0.5, 12,
      active ? C.cream : C.inkSoft, 'center', 'middle', 'bold');
  }

  function drawLibraryGrid(w, x, y, cellH) {
    var cols = 6;
    var cw = (w - 40) / cols;
    var gx = x + 20;
    var gy = y + 92;
    for (var i = 0; i < Data.CHARS.length; i++) {
      var ch = Data.CHARS[i];
      var col = i % cols;
      var row = Math.floor(i / cols);
      var cellX = gx + col * cw;
      var cellY = gy + row * cellH;
      var learned = progress.learned.indexOf(ch.id) >= 0;

      rr(cellX + 2, cellY + 2, cw - 4, cellH - 4, 10);
      ctx.fillStyle = C.tile;
      ctx.fill();
      ctx.strokeStyle = 'rgba(122,96,62,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      var ccx = cellX + cw / 2;
      var ccy = cellY + cellH * 0.4;
      var gs = Math.min(38, cellH * 0.58);
      Glyphs.drawById(ctx, ch.glyph, ccx, ccy, gs, learned ? 1.5 : 0,
        learned ? C.ink : 'rgba(58,45,30,0.16)', true);
      text(learned ? ch.kai : '·', ccx, cellY + cellH * 0.8, 9,
        learned ? C.inkSoft : 'rgba(58,45,30,0.3)', 'center', 'middle');

      ui.libraryCells.push({ x: cellX, y: cellY, w: cw, h: cellH, id: ch.id });
    }
  }

  function drawReadings(list, w, x, y) {
    var cardW = (w - 40) / 2;
    var cardH = 112;
    var gap = 10;
    var gx = x + 20;
    var gy = y + 92;
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      var col = i % 2;
      var row = Math.floor(i / 2);
      var rx = gx + col * (cardW + gap);
      var ry = gy + row * (cardH + gap);
      var unlocked = progress.learned.indexOf(r.id) >= 0;

      rr(rx, ry, cardW, cardH, 12);
      ctx.fillStyle = C.tile;
      ctx.fill();
      ctx.strokeStyle = 'rgba(122,96,62,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      text('「' + r.kai + '」· ' + r.meaning, rx + 10, ry + 18, 11,
        C.ink, 'left', 'middle', 'bold');

      var chipW = 34, chipH = 16;
      var chipX = rx + cardW - 10 - chipW;
      var chipY = ry + 10;
      rr(chipX, chipY, chipW, chipH, chipH / 2);
      ctx.fillStyle = unlocked ? 'rgba(168,58,42,0.1)' : 'rgba(58,45,30,0.06)';
      ctx.fill();
      text(unlocked ? '已释' : '未释', chipX + chipW / 2, chipY + chipH / 2 + 0.5, 9,
        unlocked ? C.red : C.inkFaint, 'center', 'middle', 'bold');

      var lines = wrap(r.text, cardW - 20, 12);
      if (lines.length > 2) lines = lines.slice(0, 2);
      drawLines(lines, rx + 10, ry + 40, 17, 12,
        unlocked ? C.ink : 'rgba(58,45,30,0.35)', 'left');

      if (unlocked) {
        var gl = wrap(r.gloss, cardW - 20, 10);
        if (gl.length > 2) gl = gl.slice(0, 2);
        drawLines(gl, rx + 10, ry + 40 + lines.length * 17 + 2, 14, 10, C.inkSoft, 'left');
      }

      ui.verseCells.push({
        x: rx, y: ry, w: cardW, h: cardH,
        id: r.id, kai: r.kai, gloss: r.gloss, locked: !unlocked
      });
    }
  }

  function drawNoteDetail(note) {
    if (!note) return;
    var cn = ['一', '二', '三', '四', '五', '六'];
    var idx = Data.NOTES.indexOf(note);

    ctx.fillStyle = 'rgba(42,32,20,0.44)';
    ctx.fillRect(0, 0, viewW, viewH);

    var dw = Math.min(viewW - 32, 320);
    var dh = Math.min(viewH - 40, 440);
    var dx = (viewW - dw) / 2;
    var dy = Math.max(safeTop + 8, (viewH - dh) / 2);
    drawCard(dx, dy, dw, dh);
    var dcx = dx + dw / 2;

    text('史官手记 · ' + (cn[idx] || ''), dcx, dy + 34, 10, C.gold, 'center', 'middle', 'bold');
    text(note.title, dcx, dy + 62, 20, C.ink, 'center', 'middle', 'bold');

    ctx.strokeStyle = 'rgba(150,120,80,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dx + 40, dy + 84);
    ctx.lineTo(dx + dw - 40, dy + 84);
    ctx.stroke();

    var all = [];
    for (var i = 0; i < note.body.length; i++) {
      var ls = wrap(note.body[i], dw - 60, 12);
      for (var j = 0; j < ls.length; j++) all.push(ls[j]);
      all.push(null);
    }
    if (all.length && all[all.length - 1] === null) all.pop();

    var ly = dy + 106;
    for (var k = 0; k < all.length && k < 10; k++) {
      if (all[k] === null) { ly += 6; continue; }
      text(all[k], dx + 30, ly, 12, 'rgba(58,45,30,0.8)', 'left', 'middle');
      ly += 20;
    }

    text('—— 史官 记', dx + dw - 34, dy + dh - 78, 10, C.inkFaint, 'right', 'middle');

    ui.noteClose = { x: dcx - 32, y: dy + dh - 52, w: 64, h: 28 };
    drawButton(ui.noteClose, '合上', { ghost: true, size: 12 });
    ui.libraryCells = [];
    ui.noteCells = [];
  }

  function drawNotes(w, x, y) {
    var cn = ['一', '二', '三', '四', '五', '六'];
    var cols = 2;
    var gap = 8;
    var cardW = (w - 40 - gap) / cols;
    var cardH = 132;
    var gx = x + 20;
    var gy = y + 92;

    for (var i = 0; i < Data.NOTES.length; i++) {
      var note = Data.NOTES[i];
      var col = i % cols;
      var row = Math.floor(i / cols);
      var rx = gx + col * (cardW + gap);
      var ry = gy + row * (cardH + gap);
      var open = noteOpen(note);

      rr(rx, ry, cardW, cardH, 12);
      ctx.fillStyle = C.tile;
      ctx.fill();
      ctx.strokeStyle = open ? 'rgba(122,96,62,0.2)' : 'rgba(122,96,62,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      text('手记 ' + cn[i], rx + 12, ry + 20, 10,
        open ? C.gold : 'rgba(58,45,30,0.28)', 'left', 'middle', 'bold');
      text(note.title, rx + 12, ry + 44, 13.5,
        open ? C.ink : 'rgba(58,45,30,0.42)', 'left', 'middle', 'bold');

      if (open) {
        var lines = wrap(note.body[0], cardW - 24, 10);
        if (lines.length > 3) lines = lines.slice(0, 3);
        drawLines(lines, rx + 12, ry + 66, 15, 10, C.inkSoft, 'left');
        text('阅', rx + cardW - 14, ry + cardH - 16, 9, C.red, 'right', 'middle');
      } else {
        text('未启', rx + 12, ry + 76, 10, 'rgba(58,45,30,0.45)', 'left', 'middle');
        text('识 ' + note.need + ' 字后开', rx + 12, ry + 96, 10,
          'rgba(58,45,30,0.38)', 'left', 'middle');
      }

      ui.noteCells.push({
        x: rx, y: ry, w: cardW, h: cardH,
        id: note.id, need: note.need, locked: !open
      });
    }

    var rows = Math.ceil(Data.NOTES.length / cols);
    var endY = gy + rows * (cardH + gap) - gap;
    return Math.min(y + (viewH - y - 12) - 26, endY + 28);
  }

  function drawLibraryDetail(ch) {
    if (!ch) return;
    var learned = progress.learned.indexOf(ch.id) >= 0;

    ctx.fillStyle = 'rgba(42,32,20,0.44)';
    ctx.fillRect(0, 0, viewW, viewH);

    var dw = 300;
    var dh = 400;
    var dx = Math.max(8, Math.min((viewW - dw) / 2, viewW - dw - 8));
    var dy = Math.max(safeTop + 8, Math.min((viewH - dh) / 2, viewH - dh - 8));
    drawCard(dx, dy, dw, dh);
    var dcx = dx + dw / 2;

    Glyphs.drawById(ctx, ch.glyph, dcx, dy + 76, 76, learned ? 2.4 : 0,
      learned ? C.ink : 'rgba(58,45,30,0.2)', true);

    if (!learned) {
      var idx = levelForChar(ch.id);
      var msg = idx >= 0
        ? '未识 · 完成「第 ' + (idx + 1) + ' 契」可识'
        : '未识 · 后续契中可识';
      var ml = wrap(msg, dw - 48, 12);
      drawLines(ml, dcx, dy + 200, 20, 12, C.inkSoft);

      ui.evoBtn = { x: dcx - 35, y: dy + 122, w: 70, h: 26 };
      drawButton(ui.evoBtn, '看演变', { ink: true, size: 10, play: true });
    } else {
      text(ch.kai, dcx, dy + 134, 30, C.red, 'center', 'middle', 'bold');
      text(ch.pinyin, dcx + 26, dy + 130, 12, C.inkSoft, 'left', 'middle');
      text(ch.meaning, dcx, dy + 158, 11, C.inkSoft, 'center', 'middle');

      ui.evoBtn = { x: dcx + 54, y: dy + 120, w: 70, h: 26 };
      drawButton(ui.evoBtn, '看演变', { ink: true, size: 10, play: true });

      var ky = dy + 182;
      var kid = wrap(ch.kid, dw - 44, 11.5);
      if (kid.length > 3) kid = kid.slice(0, 3);
      drawLines(kid, dcx, ky, 17, 11.5, 'rgba(58,45,30,0.78)');

      var ly = ky + kid.length * 17 + 2;
      var logic = wrap(ch.logic, dw - 44, 10.5);
      if (logic.length > 2) logic = logic.slice(0, 2);
      drawLines(logic, dcx, ly, 15, 10.5, C.inkFaint);
      ly += logic.length * 15 + 6;

      if (ch.bone) {
        text('「' + ch.bone + '」', dcx, ly + 6, 11, C.gold, 'center', 'middle');
        ly += 22;
      }
      if (ch.gloss) {
        var gl = wrap(ch.gloss, dw - 44, 10.5);
        if (gl.length > 2) gl = gl.slice(0, 2);
        drawLines(gl, dcx, ly + 6, 15, 10.5, C.inkSoft);
      }
    }

    ui.libraryClose = { x: dcx - 32, y: dy + dh - 46, w: 64, h: 28 };
    drawButton(ui.libraryClose, '关闭', { ghost: true, size: 12 });
    ui.libraryCells = [];
  }

  function drawLibraryToast(w, bottomY) {
    var t = state.toast;
    var alpha = t.t < 0.2 ? t.t / 0.2 : Math.max(0, 1 - (t.t - 1.4) / 0.5);
    var tw = Math.min(w - 40, 280);
    var th = 30;
    var tx = (viewW - tw) / 2;
    var ty = bottomY - 42;

    ctx.save();
    ctx.globalAlpha = alpha;
    rr(tx, ty, tw, th, 15);
    ctx.fillStyle = 'rgba(51,41,31,0.84)';
    ctx.fill();
    text(t.text, viewW / 2, ty + th / 2 + 0.5, 11, C.cream, 'center', 'middle');
    ctx.restore();
  }

  function drawLibrary() {
    var learnedCount = progress.learned.length;
    var list = readings();
    var unlockedCount = 0;
    for (var u = 0; u < list.length; u++) {
      if (progress.learned.indexOf(list[u].id) >= 0) unlockedCount++;
    }

    ctx.fillStyle = 'rgba(42,32,20,0.30)';
    ctx.fillRect(0, 0, viewW, viewH);

    var w = Math.min(layout.contentW, 400);
    var x = (viewW - w) / 2;
    var rows = Math.ceil(Data.CHARS.length / 6);
    var cellH = Math.min(66, Math.max(40, (viewH - 168) / rows));
    var charsH = 92 + rows * cellH + 44;
    var y = state.libraryTab === 'chars'
      ? Math.max(safeTop + 10, (viewH - charsH) / 2)
      : safeTop + 10;
    var h = state.libraryTab === 'chars' ? charsH : viewH - y - 12;
    drawCard(x, y, w, h);

    text('字库', x + 20, y + 30, 18, C.ink, 'left', 'middle', 'bold');
    ui.close = { x: x + w - 76, y: y + 16, w: 56, h: 28 };
    drawButton(ui.close, '返回', { ghost: true, size: 12 });

    var notesOn = notesUnlockedCount();
    var tabW = Math.min(104, (w - 40 - 16) / 3), tabH = 30, tabGap = 8;
    ui.tabChars = { x: x + 20, y: y + 48, w: tabW, h: tabH };
    ui.tabVerses = { x: x + 20 + tabW + tabGap, y: y + 48, w: tabW, h: tabH };
    ui.tabNotes = { x: x + 20 + (tabW + tabGap) * 2, y: y + 48, w: tabW, h: tabH };
    drawLibraryTab(ui.tabChars, '字库 ' + learnedCount + ' / ' + Data.CHARS.length,
      state.libraryTab === 'chars');
    drawLibraryTab(ui.tabVerses, '读辞 ' + unlockedCount + ' / ' + list.length,
      state.libraryTab === 'verses');
    drawLibraryTab(ui.tabNotes, '手记 ' + notesOn + ' / ' + Data.NOTES.length,
      state.libraryTab === 'notes');

    ui.libraryCells = [];
    ui.verseCells = [];
    ui.noteCells = [];

    if (state.libraryTab === 'verses') {
      drawReadings(list, w, x, y);
      text('每识一字，其身后的卜辞自明 · 已能释读 ' + unlockedCount + ' / ' + list.length,
        x + w / 2, y + 474, 10, C.inkFaint, 'center', 'middle');
    } else if (state.libraryTab === 'notes') {
      var footY = drawNotes(w, x, y);
      text('识得愈多，史官翻得愈多 · 已启 ' + notesOn + ' / ' + Data.NOTES.length,
        x + w / 2, footY, 10, C.inkFaint, 'center', 'middle');
    } else {
      drawLibraryGrid(w, x, y, cellH);
      text('完成一契，其字即收入字库 · 已识 ' + learnedCount + ' / ' + Data.CHARS.length,
        x + w / 2, y + h - 24, 10, C.inkFaint, 'center', 'middle');
    }

    if (state.noteSel) drawNoteDetail(noteById(state.noteSel));
    else if (state.librarySel) drawLibraryDetail(Data.char(state.librarySel));
    if (state.toast) drawLibraryToast(w, y + h);
  }

  function drawOverlay() {
    if (state.screen === 'play') return;
    ctx.fillStyle = 'rgba(42,32,20,0.44)';
    ctx.fillRect(0, 0, viewW, viewH);

    ui.primary = null;
    ui.secondary = null;
    ui.share = null;
    ui.fontPill = null;
    ui.hint = null;
    ui.cardSrc = null;
    ui.prev = null;
    ui.next = null;
    ui.optA = null;
    ui.optB = null;
    ui.library = null;
    ui.close = null;
    ui.tabChars = null;
    ui.tabVerses = null;
    ui.tabNotes = null;
    ui.libraryClose = null;
    ui.libraryCells = null;
    ui.pick = null;
    ui.levelCells = null;
    ui.levelPrev = null;
    ui.levelNext = null;
    ui.levelsClose = null;
    ui.verseCells = null;
    ui.noteCells = null;
    ui.noteClose = null;
    ui.poster = null;
    ui.evoBtn = null;
    ui.evo = null;
    ui.evoSave = null;

    if (state.screen === 'start') drawStart();
    else if (state.screen === 'card') drawSpellCard();
    else if (state.screen === 'quiz') drawQuiz();
    else if (state.screen === 'result') drawResult();
    else if (state.screen === 'library') drawLibrary();
    else if (state.screen === 'levels') drawLevels();
  }

  function drawFlash() {
    if (state.flash <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, state.flash) * 0.2;
    ctx.fillStyle = '#FFF4DC';
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.restore();
  }

  function draw() {
    drawBackground();
    drawHeader();
    if (state.screen !== 'start') {
      drawTargetPanel();
      ctx.save();
      if (state.shake > 0.05) {
        var sh = state.shake;
        ctx.translate((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh);
      }
      drawBoardPanel();
      drawTiles();
      drawRings();
      drawParticles();
      drawPops();
      ctx.restore();
      drawCombo();
      drawFlash();
      drawMilestone();
      drawFooter();
    }
    drawOverlay();
    drawPosterPreview();
    drawEvolution();
    /* 字库自带页底提示条，避免同一条 toast 画两遍 */
    if (state.screen !== 'library') drawToast();
  }

  /* ---------------- 输入 ---------------- */

  var pointer = null;

  function hitCell(x, y) {
    var b = layout.board;
    var bx = x - (b.x + b.pad);
    var by = y - (b.y + b.pad);
    if (bx < 0 || by < 0 || bx >= b.cell * SIZE || by >= b.cell * SIZE) return -1;
    var c = Math.floor(bx / b.cell);
    var r = Math.floor(by / b.cell);
    return r * SIZE + c;
  }

  function inRect(x, y, r) {
    return !!r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  }

  function onDown(x, y) {
    Sfx.unlock();
    if (state.screen !== 'play') {
      pointer = { x: x, y: y, idx: -1, moved: true, swipe: state.screen === 'start' };
      return;
    }
    if (state.phase !== 'idle') {
      pointer = null;
      return;
    }
    var index = hitCell(x, y);
    pointer = { x: x, y: y, idx: index, moved: false };
    if (index < 0) state.selected = -1;
  }

  function onMove(x, y) {
    if (!pointer || pointer.moved || state.screen !== 'play' || state.phase !== 'idle') return;
    if (pointer.idx < 0) return;

    var dx = x - pointer.x;
    var dy = y - pointer.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < layout.board.cell * 0.28) return;

    var r = Math.floor(pointer.idx / SIZE);
    var c = pointer.idx % SIZE;
    var dr = 0, dc = 0;
    if (Math.abs(dx) > Math.abs(dy)) dc = dx > 0 ? 1 : -1;
    else dr = dy > 0 ? 1 : -1;

    pointer.moved = true;
    var nr = r + dr;
    var nc = c + dc;
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) {
      state.selected = pointer.idx;
      return;
    }
    attemptSwap(pointer.idx, nr * SIZE + nc);
  }

  function onUp(x, y) {
    if (!pointer) return;
    var p = pointer;
    pointer = null;

    if (state.evo) {
      if (inRect(x, y, ui.evoReplay)) {
        state.evo.t = 0;
        Sfx.play('select');
        return;
      }
      if (inRect(x, y, ui.evoSave)) { exportEvoGif(); return; }
      if (inRect(x, y, ui.evoClose) || !inRect(x, y, ui.evoCard)) state.evo = null;
      return;
    }

    if (state.posterCanvas) {
      if (inRect(x, y, ui.posterSave)) { Sfx.play('tap'); downloadPoster(); return; }
      if (inRect(x, y, ui.posterClose) || !inRect(x, y, ui.posterImage)) {
        state.posterCanvas = null;
      }
      return;
    }

    /* 首页左右滑切契：位移够大且明显偏水平才认，避免点按钮时误触 */
    if (state.screen === 'start' && p.swipe && !state.evo && !state.posterCanvas) {
      var sdx = x - p.x, sdy = y - p.y;
      if (Math.abs(sdx) >= 40 && Math.abs(sdx) > Math.abs(sdy) * 1.2) {
        selectStartLevel(state.startSel + (sdx < 0 ? 1 : -1));
        return;
      }
    }

    if (inRect(x, y, ui.sound)) { Sfx.toggle(); Sfx.play('tap'); return; }

    var onButton = inRect(x, y, ui.primary) || inRect(x, y, ui.secondary) ||
      inRect(x, y, ui.share) ||
      inRect(x, y, ui.optA) || inRect(x, y, ui.optB) || inRect(x, y, ui.restart) ||
      inRect(x, y, ui.library) || inRect(x, y, ui.close) || inRect(x, y, ui.poster) ||
      inRect(x, y, ui.quick) || inRect(x, y, ui.evoBtn) ||
      inRect(x, y, ui.evo) ||
      inRect(x, y, ui.pick) || inRect(x, y, ui.levelsClose) ||
      inRect(x, y, ui.startEvo) || inRect(x, y, ui.exit) ||
      inRect(x, y, ui.fontPill) || inRect(x, y, ui.feedback) ||
      inRect(x, y, ui.prev) || inRect(x, y, ui.next) ||
      inRect(x, y, ui.hint) || inRect(x, y, ui.cardSrc);
    if (onButton) Sfx.play('tap');

    if (state.screen === 'start') {
      if (inRect(x, y, ui.prev)) { selectStartLevel(state.startSel - 1); return; }
      if (inRect(x, y, ui.next)) { selectStartLevel(state.startSel + 1); return; }
      if (inRect(x, y, ui.feedback)) { openFeedback(); return; }
      if (inRect(x, y, ui.startEvo)) {
        openEvolution(Data.char(Data.LEVELS[state.startSel].char));
        return;
      }
      if (inRect(x, y, ui.fontPill)) {
        progress.bigText = !progress.bigText;
        FONT_SCALE = progress.bigText ? 1.18 : 1;
        saveProgress();
        Sfx.play('select');
        return;
      }
      if (inRect(x, y, ui.library)) { openLibrary(); return; }
      if (inRect(x, y, ui.pick)) { openLevels(); return; }
      if (inRect(x, y, ui.quick)) { startQuick(); return; }
      if (inRect(x, y, ui.primary)) {
        var invited = challenge && !challenge.done ? challenge.level : -1;
        var idx = invited >= 0 ? invited : state.startSel;
        leaveQuick();
        startLevel(idx);
      }
      return;
    }

    if (state.screen === 'card') {
      if (inRect(x, y, ui.cardSrc)) { state.cardSrc = !state.cardSrc; Sfx.play('tap'); return; }
      if (inRect(x, y, ui.evoBtn) || inRect(x, y, ui.evo)) { openEvolution(Data.char(levelConfig().char)); return; }
      if (inRect(x, y, ui.share)) { shareChallenge(); return; }
      if (inRect(x, y, ui.poster)) { buildPoster(); return; }
      if (inRect(x, y, ui.primary)) {
        if (state.quick) { startQuick(); return; }
        if (challenge && challenge.done) challenge = null;
        advance();
      }
      return;
    }

    if (state.screen === 'quiz') {
      var q = state.quiz;
      if (!q) return;
      if (inRect(x, y, ui.optA)) { answerQuiz(q.options[0].ok); return; }
      if (inRect(x, y, ui.optB)) { answerQuiz(q.options[1].ok); return; }
      return;
    }

    if (state.screen === 'result') {
      if (state.result === 'all') {
        if (inRect(x, y, ui.primary)) { openLibrary(); return; }
        if (inRect(x, y, ui.secondary)) { leaveQuick(); startLevel(0); return; }
        if (inRect(x, y, ui.share)) { leaveQuick(); goHome(); return; }
        return;
      }
      if (inRect(x, y, ui.share)) { shareChallenge(true); return; }
      if (inRect(x, y, ui.library)) { openLibrary(); return; }
      if (inRect(x, y, ui.primary)) {
        if (state.quick) startQuick();
        else startLevel(state.levelIndex);
        return;
      }
      if (inRect(x, y, ui.secondary)) { goHome(); return; }
      return;
    }

    if (state.screen === 'levels') {
      if (inRect(x, y, ui.levelsClose)) { goHome(); return; }
      if (inRect(x, y, ui.levelPrev)) {
        if (state.levelPage > 0) state.levelPage--;
        return;
      }
      if (inRect(x, y, ui.levelNext)) {
        var lp = Math.ceil(LEVEL_COUNT / 10);
        if (state.levelPage < lp - 1) state.levelPage++;
        return;
      }
      var lcs = ui.levelCells || [];
      for (var li = 0; li < lcs.length; li++) {
        if (inRect(x, y, lcs[li])) {
          if (lcs[li].locked) showToast('先完成前一契，才开这一契');
          else { leaveQuick(); startLevel(lcs[li].index); }
          return;
        }
      }
      return;
    }

    if (state.screen === 'library') {
      if (inRect(x, y, ui.close)) { goHome(); return; }
      if (inRect(x, y, ui.tabChars)) {
        state.libraryTab = 'chars';
        state.librarySel = null;
        state.noteSel = null;
        return;
      }
      if (inRect(x, y, ui.tabVerses)) {
        state.libraryTab = 'verses';
        state.librarySel = null;
        state.noteSel = null;
        return;
      }
      if (inRect(x, y, ui.tabNotes)) {
        state.libraryTab = 'notes';
        state.librarySel = null;
        state.noteSel = null;
        return;
      }
      if (state.noteSel) {
        if (inRect(x, y, ui.noteClose)) state.noteSel = null;
        return;
      }
      if (state.librarySel) {
        if (inRect(x, y, ui.evoBtn)) { openEvolution(Data.char(state.librarySel)); return; }
        if (inRect(x, y, ui.libraryClose)) state.librarySel = null;
        return;
      }
      var notes = ui.noteCells || [];
      for (var ni = 0; ni < notes.length; ni++) {
        if (inRect(x, y, notes[ni])) {
          if (notes[ni].locked) {
            showToast('再识 ' + (notes[ni].need - progress.learned.length) + ' 字，史官才翻这一页');
          } else {
            state.noteSel = notes[ni].id;
          }
          return;
        }
      }
      var cells = ui.libraryCells || [];
      for (var ci = 0; ci < cells.length; ci++) {
        if (inRect(x, y, cells[ci])) {
          state.librarySel = cells[ci].id;
          return;
        }
      }
      var verses = ui.verseCells || [];
      for (var vi = 0; vi < verses.length; vi++) {
        if (inRect(x, y, verses[vi])) {
          if (verses[vi].locked) showToast('先识「' + verses[vi].kai + '」再读');
          return;
        }
      }
      return;
    }

    if (inRect(x, y, ui.exit)) { goHome(); return; }

    if (inRect(x, y, ui.hint)) { requestHint(); return; }

    if (inRect(x, y, ui.restart)) {
      if (state.quick) startQuick();
      else startLevel(state.levelIndex);
      return;
    }

    if (p.moved) return;
    var index = p.idx;
    if (index < 0) return;
    tapCell(index);
  }

  function bindInput() {
    if (isWx) {
      wx.onTouchStart(function (e) {
        var t = e.touches && e.touches[0];
        if (t) onDown(t.clientX, t.clientY);
      });
      wx.onTouchMove(function (e) {
        var t = e.touches && e.touches[0];
        if (t) onMove(t.clientX, t.clientY);
      });
      wx.onTouchEnd(function (e) {
        var t = e.changedTouches && e.changedTouches[0];
        onUp(t ? t.clientX : 0, t ? t.clientY : 0);
      });
      wx.onTouchCancel(function () {
        pointer = null;
      });
    } else {
      canvas.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        onDown(e.clientX, e.clientY);
      });
      canvas.addEventListener('pointermove', function (e) {
        onMove(e.clientX, e.clientY);
      });
      canvas.addEventListener('pointerup', function (e) {
        onUp(e.clientX, e.clientY);
      });
      canvas.addEventListener('pointercancel', function () {
        pointer = null;
      });
      window.addEventListener('resize', function () {
        resize();
      });
    }
  }

  /* ---------------- 主循环 ---------------- */

  var raf = isWx
    ? (canvas.requestAnimationFrame
      ? canvas.requestAnimationFrame.bind(canvas)
      : function (cb) { setTimeout(cb, 16); })
    : window.requestAnimationFrame.bind(window);

  var lastTime = Date.now();

  function loop() {
    var now = Date.now();
    var dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    draw();
    raf(loop);
  }

  /* ---------------- 书中拓影字形 ---------------- */

  /* 字形图片来源与字库同步：新增字只要在 Data.CHARS 里登记，图到即显示；
     图未到时先落楷体，避免错画成别的字 */
  function loadGlyphImages() {
    var seen = {};
    for (var i = 0; i < Data.CHARS.length; i++) {
      var ch = Data.CHARS[i];
      if (!ch.glyph || seen[ch.glyph]) continue;
      seen[ch.glyph] = 1;
      Glyphs.addKaiGlyph(ch.glyph, ch.kai);
      (function (id) {
        var img = isWx ? wx.createImage() : new Image();
        img.onload = function () {
          Glyphs.registerImage(id, img);
        };
        img.src = 'assets/glyphs/' + id + '.png';
      })(ch.glyph);
    }
  }

  /* ---------------- 启动 ---------------- */

  function setupShare() {
    if (!isWx) return;
    try {
      if (wx.showShareMenu) {
        wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
      }
      if (wx.onShareAppMessage) {
        wx.onShareAppMessage(function () {
          var lv = levelConfig();
          var used = state.steps || 0;
          var title = used > 0
            ? '甲骨消消乐 · 我在「' + lv.title + ' · ' + Data.char(lv.char).kai + '」用了 ' + used + ' 步'
            : '甲骨消消乐 · ' + lv.title + '，来认一个「' + Data.char(lv.char).kai + '」';
          return {
            title: title,
            query: 'lv=' + (state.levelIndex + 1) + '&step=' + used
          };
        });
      }
    } catch (e) { /* 忽略 */ }
  }

  resize();
  bindInput();
  loadGlyphImages();
  setupShare();
  watchShow();
  flushFeedback();

  raf(loop);
})();
