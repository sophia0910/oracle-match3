/* 甲骨消消乐 · 消除核心逻辑（纯逻辑，无渲染依赖） */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OracleCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  var SIZE = 8;
  var TYPES = 6;

  function idx(r, c) {
    return r * SIZE + c;
  }

  /* 找出所有三连及以上的格子索引 */
  function findMatches(grid) {
    var marked = new Set();
    var r, c, k, v, end;

    for (r = 0; r < SIZE; r++) {
      c = 0;
      while (c < SIZE) {
        v = grid[idx(r, c)];
        end = c + 1;
        while (end < SIZE && grid[idx(r, end)] === v) end++;
        if (v >= 0 && end - c >= 3) {
          for (k = c; k < end; k++) marked.add(idx(r, k));
        }
        c = end;
      }
    }

    for (c = 0; c < SIZE; c++) {
      r = 0;
      while (r < SIZE) {
        v = grid[idx(r, c)];
        end = r + 1;
        while (end < SIZE && grid[idx(end, c)] === v) end++;
        if (v >= 0 && end - r >= 3) {
          for (k = r; k < end; k++) marked.add(idx(k, c));
        }
        r = end;
      }
    }

    return marked;
  }

  function swapCells(grid, a, b) {
    var t = grid[a];
    grid[a] = grid[b];
    grid[b] = t;
  }

  /* 是否还存在可消除的一步（交换相邻格子后能形成三连） */
  function findPossibleMove(grid) {
    var r, c, a, b, i, ok;
    var pairs = [];

    for (r = 0; r < SIZE; r++) {
      for (c = 0; c < SIZE; c++) {
        a = idx(r, c);
        pairs.length = 0;
        if (c + 1 < SIZE) pairs.push(idx(r, c + 1));
        if (r + 1 < SIZE) pairs.push(idx(r + 1, c));
        for (i = 0; i < pairs.length; i++) {
          b = pairs[i];
          swapCells(grid, a, b);
          ok = findMatches(grid).size > 0;
          swapCells(grid, a, b);
          if (ok) return [a, b];
        }
      }
    }
    return null;
  }

  /* 生成一个开局无三连、且至少有一步可走的棋盘
     pool 为可选的字形序号数组，可重复以加权 */
  function createGrid(rand, pool) {
    rand = rand || Math.random;
    var attempt, r, c, v, guard, grid, i;

    if (!pool || !pool.length) {
      pool = [];
      for (i = 0; i < TYPES; i++) pool.push(i);
    }

    for (attempt = 0; attempt < 160; attempt++) {
      grid = new Array(SIZE * SIZE);
      for (r = 0; r < SIZE; r++) {
        for (c = 0; c < SIZE; c++) {
          guard = 0;
          do {
            v = pool[Math.floor(rand() * pool.length)];
            guard++;
          } while (guard < 40 && (
            (c >= 2 && grid[idx(r, c - 1)] === v && grid[idx(r, c - 2)] === v) ||
            (r >= 2 && grid[idx(r - 1, c)] === v && grid[idx(r - 2, c)] === v)
          ));
          grid[idx(r, c)] = v;
        }
      }
      if (findMatches(grid).size > 0) continue;
      if (!findPossibleMove(grid)) continue;
      return grid;
    }
    return null;
  }

  return {
    SIZE: SIZE,
    TYPES: TYPES,
    idx: idx,
    findMatches: findMatches,
    swapCells: swapCells,
    findPossibleMove: findPossibleMove,
    createGrid: createGrid
  };
});
