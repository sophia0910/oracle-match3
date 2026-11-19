/* 极简 GIF89a 编码器（无依赖）· 纸墨红金固定调色板 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OracleGif = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  var PAPER = [246, 237, 218];

  /* 所有颜色都是「纸色 → 某基色」的混色，按此建坡道即可覆盖抗锯齿 */
  var RAMPS = [
    { base: [252, 246, 232], steps: 8 },
    { base: [51, 41, 31], steps: 64 },
    { base: [168, 58, 42], steps: 48 },
    { base: [180, 145, 78], steps: 32 }
  ];

  var palette = null;
  var lut = null;
  var dict = new Int16Array(4096 * 256);

  function build() {
    if (palette) return;
    palette = new Uint8Array(768);
    var n = 0;
    for (var r = 0; r < RAMPS.length; r++) {
      var base = RAMPS[r].base;
      var steps = RAMPS[r].steps;
      for (var s = 0; s < steps; s++) {
        var t = s / (steps - 1);
        palette[n * 3] = Math.round(PAPER[0] + (base[0] - PAPER[0]) * t);
        palette[n * 3 + 1] = Math.round(PAPER[1] + (base[1] - PAPER[1]) * t);
        palette[n * 3 + 2] = Math.round(PAPER[2] + (base[2] - PAPER[2]) * t);
        n++;
      }
    }

    /* RGB565 查表：32768 项，每项最近调色板下标 */
    lut = new Int16Array(32768);
    for (var rr = 0; rr < 32; rr++) {
      for (var gg = 0; gg < 32; gg++) {
        for (var bb = 0; bb < 32; bb++) {
          var cr = rr * 8 + 4, cg = gg * 8 + 4, cb = bb * 8 + 4;
          var best = 0, bestD = Infinity;
          for (var i = 0; i < n; i++) {
            var dr = cr - palette[i * 3];
            var dg = cg - palette[i * 3 + 1];
            var db = cb - palette[i * 3 + 2];
            var d = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
            if (d < bestD) { bestD = d; best = i; }
          }
          lut[(rr << 10) | (gg << 5) | bb] = best;
        }
      }
    }
  }

  /* RGBA 像素 → 调色板索引 */
  function quantize(rgba) {
    build();
    var len = rgba.length >> 2;
    var out = new Uint8Array(len);
    for (var i = 0, p = 0; i < len; i++, p += 4) {
      out[i] = lut[((rgba[p] >> 3) << 10) | ((rgba[p + 1] >> 3) << 5) | (rgba[p + 2] >> 3)];
    }
    return out;
  }

  /* GIF LZW（8 位最小码长） */
  function lzw(indices) {
    dict.fill(-1);
    var codeSize = 9;
    var nextCode = 258;
    var out = [];
    var cur = 0, bits = 0;

    function emit(code) {
      cur |= code << bits;
      bits += codeSize;
      while (bits >= 8) {
        out.push(cur & 0xFF);
        cur >>= 8;
        bits -= 8;
      }
    }

    emit(256);
    var prefix = indices[0];
    for (var i = 1; i < indices.length; i++) {
      var k = indices[i];
      var key = (prefix << 8) | k;
      var code = dict[key];
      if (code >= 0) { prefix = code; continue; }
      emit(prefix);
      if (nextCode < 4096) {
        dict[key] = nextCode++;
        if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
      } else {
        emit(256);
        dict.fill(-1);
        codeSize = 9;
        nextCode = 258;
      }
      prefix = k;
    }
    emit(prefix);
    emit(257);
    if (bits > 0) out.push(cur & 0xFF);

    /* 分块：每块最多 255 字节，末尾 0 收束 */
    var blocks = [];
    for (var p = 0; p < out.length; p += 255) {
      var n = Math.min(255, out.length - p);
      blocks.push(n);
      for (var q = 0; q < n; q++) blocks.push(out[p + q]);
    }
    blocks.push(0);
    return blocks;
  }

  function Writer() { this.buf = []; }
  Writer.prototype.byte = function (v) { this.buf.push(v & 0xFF); };
  Writer.prototype.short = function (v) {
    this.buf.push(v & 0xFF, (v >> 8) & 0xFF);
  };
  Writer.prototype.str = function (s) {
    for (var i = 0; i < s.length; i++) this.buf.push(s.charCodeAt(i));
  };
  Writer.prototype.bytes = function (a) {
    for (var i = 0; i < a.length; i++) this.buf.push(a[i]);
  };

  /* frames: Uint8Array[]（索引帧）；delays: 毫秒[] */
  function encode(frames, w, h, delays) {
    build();
    var W = new Writer();
    W.str('GIF89a');
    W.short(w);
    W.short(h);
    W.byte(0xF7);          /* 全局色表 · 256 色 */
    W.byte(0);
    W.byte(0);
    W.bytes(palette);

    /* NETSCAPE2.0 无限循环 */
    W.byte(0x21); W.byte(0xFF); W.byte(0x0B);
    W.str('NETSCAPE2.0');
    W.byte(0x03); W.byte(0x01); W.short(0); W.byte(0);

    for (var i = 0; i < frames.length; i++) {
      var cs = Math.max(2, Math.round((delays[i] || 500) / 10));
      W.byte(0x21); W.byte(0xF9); W.byte(0x04);
      W.byte(0x04);        /* 处置方式 1：保留上一帧 */
      W.short(cs);
      W.byte(0);
      W.byte(0);

      W.byte(0x2C);
      W.short(0); W.short(0); W.short(w); W.short(h);
      W.byte(0);
      W.byte(8);
      W.bytes(lzw(frames[i]));
    }
    W.byte(0x3B);
    return new Uint8Array(W.buf);
  }

  return { quantize: quantize, encode: encode };
});
