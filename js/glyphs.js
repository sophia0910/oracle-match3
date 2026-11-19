/* 甲骨文字形 · 以笔画路径绘制，无需字体或图片资源 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OracleGlyphs = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  /* 拓影轮廓数据（若有则优先按原字形填充，未覆盖的字回退到手绘笔画） */
  var Trace = null;
  try {
    Trace = (typeof module === 'object' && module.exports)
      ? require('./trace-data.js')
      : (typeof window !== 'undefined' ? window.OracleTrace : null);
  } catch (e) { Trace = null; }

  function px(cx, s) {
    return function (n) { return cx + (n - 50) * s / 100; };
  }
  function py(cy, s) {
    return function (n) { return cy + (n - 50) * s / 100; };
  }

  /* 日：厚重方框，中横一画 */
  function sun(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    var x0 = X(10), y0 = Y(15), x1 = X(90), y1 = Y(83);
    var r = s * 0.09;
    ctx.save();
    ctx.lineWidth = Math.max(2, s * 0.095);
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x1 - r, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
    ctx.lineTo(x1, y1 - r);
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
    ctx.lineTo(x0 + r, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(30), Y(49));
    ctx.quadraticCurveTo(X(50), Y(42), X(70), Y(49));
    ctx.quadraticCurveTo(X(50), Y(56), X(30), Y(49));
    ctx.fill();
    ctx.restore();
  }

  /* 月：右直左弯的缺月，内一竖，两端尖角外突 */
  function moon(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    var pts = [
      [72.5, 1.5], [61.5, 5], [50, 11], [40, 17.5], [31.5, 26.5], [26, 38],
      [24, 50], [27.5, 63], [34, 75], [44, 84], [56.5, 91.5], [68, 97.5]
    ];
    ctx.save();
    ctx.lineWidth = Math.max(1.6, s * 0.058);
    ctx.beginPath();
    ctx.moveTo(X(pts[0][0]), Y(pts[0][1]));
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2;
      var my = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(X(pts[i][0]), Y(pts[i][1]), X(mx), Y(my));
    }
    ctx.lineTo(X(pts[pts.length - 1][0]), Y(pts[pts.length - 1][1]));
    ctx.stroke();

    ctx.lineWidth = Math.max(1.5, s * 0.055);
    ctx.beginPath();
    ctx.moveTo(X(59), Y(12.5));
    ctx.lineTo(X(58), Y(85));
    ctx.stroke();

    ctx.lineWidth = Math.max(1.2, s * 0.045);
    ctx.beginPath();
    ctx.moveTo(X(44), Y(25));
    ctx.lineTo(X(44), Y(68));
    ctx.stroke();
    ctx.restore();
  }

  /* 山：三座宽峰连成一体，下承满宽实地（依拓影实心之形） */
  function mountain(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.beginPath();
    ctx.moveTo(X(3), Y(90));
    ctx.lineTo(X(8), Y(18));
    ctx.lineTo(X(29), Y(44));
    ctx.lineTo(X(48), Y(6));
    ctx.lineTo(X(66), Y(44));
    ctx.lineTo(X(89), Y(18));
    ctx.lineTo(X(97), Y(90));
    ctx.closePath();
    ctx.fill();
  }

  /* 水：中央水脉蜿蜒而下，底部收成小分叉，两侧散落短水点 */
  function water(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.055);
    /* 中央主脉：明显左右摆动 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(4));
    ctx.quadraticCurveTo(X(37), Y(17), X(51), Y(31));
    ctx.quadraticCurveTo(X(65), Y(45), X(50), Y(59));
    ctx.quadraticCurveTo(X(40), Y(68), X(48), Y(78));
    ctx.stroke();
    /* 底部收束成小分叉 */
    ctx.beginPath();
    ctx.moveTo(X(48), Y(78));
    ctx.quadraticCurveTo(X(41), Y(86), X(37), Y(95));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(48), Y(78));
    ctx.quadraticCurveTo(X(55), Y(86), X(60), Y(94));
    ctx.stroke();
    /* 两侧水点：散落短杠 */
    ctx.lineWidth = Math.max(1.5, s * 0.042);
    var marks = [
      [31, 13, 24, 19], [28, 31, 22, 37], [31, 48, 25, 54], [29, 64, 23, 69],
      [70, 17, 77, 23], [72, 35, 79, 41], [69, 52, 76, 58], [72, 67, 78, 72]
    ];
    for (var i = 0; i < marks.length; i++) {
      ctx.beginPath();
      ctx.moveTo(X(marks[i][0]), Y(marks[i][1]));
      ctx.lineTo(X(marks[i][2]), Y(marks[i][3]));
      ctx.stroke();
    }
    ctx.restore();
  }

  /* 木：树干、上枝与下根 */
  function tree(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.8, s * 0.07);
    ctx.beginPath();
    ctx.moveTo(X(50), Y(6));
    ctx.lineTo(X(50), Y(94));
    ctx.stroke();

    ctx.lineWidth = Math.max(1.5, s * 0.055);
    ctx.beginPath();
    ctx.moveTo(X(50), Y(52));
    ctx.quadraticCurveTo(X(40), Y(36), X(30), Y(18));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(50), Y(46));
    ctx.quadraticCurveTo(X(62), Y(32), X(72), Y(16));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(50), Y(74));
    ctx.quadraticCurveTo(X(42), Y(86), X(34), Y(94));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(50), Y(74));
    ctx.quadraticCurveTo(X(60), Y(86), X(68), Y(94));
    ctx.stroke();
    ctx.restore();
  }

  /* 田：井字九宫，外框加两竖两横（粗笔，依拓影） */
  function field(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(2, s * 0.085);
    ctx.beginPath();
    ctx.rect(X(16), Y(4), X(84) - X(16), Y(94) - Y(4));
    ctx.stroke();
    /* 内部两竖 */
    ctx.beginPath();
    ctx.moveTo(X(39), Y(4));
    ctx.lineTo(X(38), Y(94));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(66), Y(4));
    ctx.lineTo(X(65), Y(94));
    ctx.stroke();
    /* 内部两横 */
    ctx.beginPath();
    ctx.moveTo(X(16), Y(35));
    ctx.lineTo(X(84), Y(34));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(16), Y(64));
    ctx.lineTo(X(84), Y(63));
    ctx.stroke();
    ctx.restore();
  }

  /* 火：中焰上扬，两侧分叉大焰，底部一道长地平线（依拓影） */
  function fire(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(2, s * 0.06);
    /* 左焰：外笔自底斜上至峰，峰后下落，与底部连成一气 */
    ctx.beginPath();
    ctx.moveTo(X(6), Y(72));
    ctx.quadraticCurveTo(X(9), Y(38), X(18), Y(6));
    ctx.lineTo(X(34), Y(54));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(12), Y(44));
    ctx.lineTo(X(24), Y(14));
    ctx.stroke();
    /* 中焰：细长舌，自底上扬，末端右弯 */
    ctx.beginPath();
    ctx.moveTo(X(41), Y(2));
    ctx.lineTo(X(41), Y(24));
    ctx.quadraticCurveTo(X(45), Y(40), X(51), Y(56));
    ctx.stroke();
    /* 右焰：高耸外笔，内笔分叉，下端接底 */
    ctx.beginPath();
    ctx.moveTo(X(69), Y(8));
    ctx.lineTo(X(73), Y(32));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(74), Y(10));
    ctx.quadraticCurveTo(X(90), Y(34), X(92), Y(70));
    ctx.stroke();
    /* 底部地平线（粗，两端上收与焰脚相接） */
    ctx.lineWidth = Math.max(2, s * 0.075);
    ctx.beginPath();
    ctx.moveTo(X(6), Y(74));
    ctx.quadraticCurveTo(X(50), Y(94), X(93), Y(71));
    ctx.stroke();
    ctx.restore();
  }

  /* 人：竖身而立近垂直，单臂一笔弧下 */
  function person(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    /* 竖身：自顶而下，微微内倾 */
    ctx.beginPath();
    ctx.moveTo(X(54), Y(4));
    ctx.lineTo(X(50), Y(92));
    ctx.stroke();
    /* 单臂：一笔弧下 */
    ctx.beginPath();
    ctx.moveTo(X(52), Y(20));
    ctx.quadraticCurveTo(X(38), Y(36), X(28), Y(58));
    ctx.stroke();
  }

  /* 大：正面立人，中轴长竖，双臂自中段贯通而出，双腿下端张开（依拓影） */
  function big(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(2, s * 0.06);
    /* 头与躯干连成中轴 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(2));
    ctx.lineTo(X(48), Y(66));
    ctx.stroke();
    /* 左右臂：自躯干中段向外下，与轴相接 */
    ctx.beginPath();
    ctx.moveTo(X(48), Y(40));
    ctx.quadraticCurveTo(X(32), Y(48), X(18), Y(60));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(48), Y(40));
    ctx.quadraticCurveTo(X(64), Y(48), X(78), Y(60));
    ctx.stroke();
    /* 双腿：自躯干下端张开 */
    ctx.beginPath();
    ctx.moveTo(X(48), Y(64));
    ctx.lineTo(X(30), Y(98));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(48), Y(64));
    ctx.lineTo(X(66), Y(98));
    ctx.stroke();
    ctx.restore();
  }

  /* 目：横长之目，上下眼睑微弯，中间一道横向瞳线 */
  function eye(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.052);
    /* 目眶：横长，两端圆钝不相尖，上下睑微微拱起 */
    ctx.beginPath();
    ctx.moveTo(X(6), Y(46));
    ctx.quadraticCurveTo(X(50), Y(25), X(94), Y(45));
    ctx.quadraticCurveTo(X(97), Y(51), X(93), Y(58));
    ctx.quadraticCurveTo(X(50), Y(76), X(7), Y(58));
    ctx.quadraticCurveTo(X(4), Y(51), X(6), Y(46));
    ctx.stroke();
    /* 瞳：圆点 */
    ctx.lineWidth = Math.max(1.5, s * 0.048);
    ctx.beginPath();
    ctx.moveTo(X(50), Y(45));
    ctx.quadraticCurveTo(X(61), Y(51), X(50), Y(57));
    ctx.quadraticCurveTo(X(39), Y(51), X(50), Y(45));
    ctx.stroke();
    ctx.restore();
  }

  /* 口：素净的方圆框，略宽于高，四角圆润 */
  function mouth(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.055);
    var x0 = X(9), y0 = Y(17), x1 = X(91), y1 = Y(83), r = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x1 - r, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
    ctx.lineTo(x1, y1 - r);
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
    ctx.lineTo(x0 + r, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.stroke();
    ctx.restore();
  }

  /* 雨：顶两道天幕横杠，下承向外斜散的雨滴两排（依拓影） */
  function rain(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(2, s * 0.07);
    /* 天幕横杠一（上） */
    ctx.beginPath();
    ctx.moveTo(X(31), Y(3));
    ctx.lineTo(X(64), Y(3));
    ctx.stroke();
    /* 天幕横杠二（下） */
    ctx.beginPath();
    ctx.moveTo(X(28), Y(22));
    ctx.lineTo(X(70), Y(22));
    ctx.stroke();
    /* 上排雨滴：自杠下向外斜散，长短不一 */
    ctx.lineWidth = Math.max(1.6, s * 0.05);
    var drops = [
      [24, 28, 14, 60],
      [38, 32, 32, 62],
      [51, 28, 53, 50],
      [63, 32, 69, 60],
      [74, 28, 82, 56]
    ];
    for (var i = 0; i < drops.length; i++) {
      ctx.beginPath();
      ctx.moveTo(X(drops[i][0]), Y(drops[i][1]));
      ctx.lineTo(X(drops[i][2]), Y(drops[i][3]));
      ctx.stroke();
    }
    /* 下排两长滴 */
    ctx.beginPath();
    ctx.moveTo(X(35), Y(70));
    ctx.lineTo(X(31), Y(94));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(71), Y(74));
    ctx.lineTo(X(76), Y(96));
    ctx.stroke();
    ctx.restore();
  }

  /* 云：上下两道横向云带，卷曲之端，左下另作垂卷（依拓影） */
  function cloud(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(2, s * 0.06);
    /* 上云带：自左下勾起，向右上挑，末端上翘 */
    ctx.beginPath();
    ctx.moveTo(X(15), Y(28));
    ctx.quadraticCurveTo(X(17), Y(9), X(32), Y(6));
    ctx.quadraticCurveTo(X(46), Y(4), X(58), Y(1));
    ctx.stroke();
    /* 上带左端下垂短勾 */
    ctx.beginPath();
    ctx.moveTo(X(15), Y(28));
    ctx.lineTo(X(19), Y(36));
    ctx.stroke();
    /* 下云带：横向铺开 */
    ctx.lineWidth = Math.max(2, s * 0.07);
    ctx.beginPath();
    ctx.moveTo(X(11), Y(37));
    ctx.lineTo(X(12), Y(46));
    ctx.quadraticCurveTo(X(30), Y(40), X(50), Y(44));
    ctx.quadraticCurveTo(X(72), Y(48), X(92), Y(43));
    ctx.stroke();
    /* 下带右端小挑 */
    ctx.beginPath();
    ctx.moveTo(X(92), Y(43));
    ctx.lineTo(X(94), Y(36));
    ctx.stroke();
    /* 带下垂茎 */
    ctx.lineWidth = Math.max(1.6, s * 0.05);
    ctx.beginPath();
    ctx.moveTo(X(52), Y(44));
    ctx.lineTo(X(52), Y(60));
    ctx.stroke();
    /* 左下卷曲 */
    ctx.beginPath();
    ctx.moveTo(X(26), Y(58));
    ctx.lineTo(X(26), Y(80));
    ctx.quadraticCurveTo(X(28), Y(92), X(40), Y(90));
    ctx.quadraticCurveTo(X(47), Y(89), X(45), Y(80));
    ctx.stroke();
    ctx.restore();
  }

  /* 川：三条水流并流，左右略短，中流最长，右流带一小枝 */
  function river(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.052);
    /* 左流：短，微微右拱 */
    ctx.beginPath();
    ctx.moveTo(X(24), Y(19));
    ctx.quadraticCurveTo(X(19), Y(44), X(24), Y(71));
    ctx.stroke();
    /* 中流：长而曲折 */
    ctx.beginPath();
    ctx.moveTo(X(51), Y(4));
    ctx.quadraticCurveTo(X(46), Y(32), X(51), Y(58));
    ctx.quadraticCurveTo(X(55), Y(78), X(50), Y(94));
    ctx.stroke();
    /* 右流：中等长度，略向左收 */
    ctx.beginPath();
    ctx.moveTo(X(78), Y(13));
    ctx.quadraticCurveTo(X(82), Y(42), X(77), Y(68));
    ctx.quadraticCurveTo(X(75), Y(80), X(78), Y(88));
    ctx.stroke();
    /* 右流小枝 */
    ctx.lineWidth = Math.max(1.5, s * 0.042);
    ctx.beginPath();
    ctx.moveTo(X(81), Y(47));
    ctx.quadraticCurveTo(X(86), Y(44), X(90), Y(39));
    ctx.stroke();
    ctx.restore();
  }

  /* 石：左上「厂」形崖壁，崖下右侧一块圆润之石 */
  function stone(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.055);
    /* 厂：上横崖线，微微上拱，左端略低 */
    ctx.beginPath();
    ctx.moveTo(X(9), Y(24));
    ctx.quadraticCurveTo(X(50), Y(11), X(91), Y(15));
    ctx.stroke();
    /* 崖壁：自左端垂落 */
    ctx.beginPath();
    ctx.moveTo(X(9), Y(24));
    ctx.quadraticCurveTo(X(11), Y(46), X(13), Y(63));
    ctx.stroke();
    /* 石：右下圆角方块 */
    ctx.lineWidth = Math.max(1.5, s * 0.05);
    var x0 = X(45), y0 = Y(38), x1 = X(89), y1 = Y(86), r = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x1 - r, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
    ctx.lineTo(x1, y1 - r);
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
    ctx.lineTo(x0 + r, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.stroke();
    ctx.restore();
  }

  /* 土：地平线上一堆隆起之土，上窄下宽，中贯一竖出顶 */
  function soil(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.052);
    /* 地平线 */
    ctx.beginPath();
    ctx.moveTo(X(7), Y(85));
    ctx.quadraticCurveTo(X(50), Y(81), X(93), Y(85));
    ctx.stroke();
    /* 土堆：低而宽的一堆，左右略不对称，顶圆钝 */
    ctx.beginPath();
    ctx.moveTo(X(18), Y(84));
    ctx.quadraticCurveTo(X(21), Y(67), X(34), Y(57));
    ctx.quadraticCurveTo(X(42), Y(50), X(49), Y(50));
    ctx.quadraticCurveTo(X(57), Y(50), X(66), Y(58));
    ctx.quadraticCurveTo(X(79), Y(69), X(82), Y(84));
    ctx.stroke();
    /* 中贯一竖，上出堆顶 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(27));
    ctx.lineTo(X(50), Y(82));
    ctx.stroke();
    ctx.restore();
  }

  /* 牛：窄高牛首，双角近乎平行上竖而端外撇，头杠之下脸竖吻杠连属 */
  function ox(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(2, s * 0.062);
    /* 左角：近乎竖直上竖，仅微收 */
    ctx.beginPath();
    ctx.moveTo(X(37), Y(42));
    ctx.lineTo(X(35), Y(8));
    ctx.lineTo(X(32), Y(3));
    ctx.stroke();
    /* 右角：镜像 */
    ctx.beginPath();
    ctx.moveTo(X(63), Y(42));
    ctx.lineTo(X(65), Y(8));
    ctx.lineTo(X(68), Y(3));
    ctx.stroke();
    /* 两角间额毛短竖 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(22));
    ctx.lineTo(X(50), Y(42));
    ctx.stroke();
    /* 头横杠 */
    ctx.beginPath();
    ctx.moveTo(X(34), Y(42));
    ctx.lineTo(X(66), Y(42));
    ctx.stroke();
    /* 脸竖画 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(42));
    ctx.lineTo(X(50), Y(64));
    ctx.stroke();
    /* 吻部横杠 */
    ctx.beginPath();
    ctx.moveTo(X(40), Y(64));
    ctx.lineTo(X(60), Y(64));
    ctx.stroke();
    /* 其下单竖 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(64));
    ctx.lineTo(X(50), Y(94));
    ctx.stroke();
    ctx.restore();
  }

  /* 羊：正面兽首，双角自额头外伸而下卷，横耳，竖脸与吻 */
  function sheep(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.052);
    /* 左角：先向左横出，再上拱、外翻、向下回卷成钩 */
    ctx.beginPath();
    ctx.moveTo(X(39), Y(37));
    ctx.quadraticCurveTo(X(31), Y(31), X(23), Y(21));
    ctx.quadraticCurveTo(X(14), Y(7), X(9), Y(19));
    ctx.quadraticCurveTo(X(5), Y(32), X(16), Y(35));
    ctx.stroke();
    /* 右角：镜像 */
    ctx.beginPath();
    ctx.moveTo(X(61), Y(37));
    ctx.quadraticCurveTo(X(69), Y(31), X(77), Y(21));
    ctx.quadraticCurveTo(X(86), Y(7), X(91), Y(19));
    ctx.quadraticCurveTo(X(95), Y(32), X(84), Y(35));
    ctx.stroke();
    /* 双耳：额角横张，末端略垂 */
    ctx.beginPath();
    ctx.moveTo(X(38), Y(44));
    ctx.quadraticCurveTo(X(29), Y(44), X(21), Y(47));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(62), Y(44));
    ctx.quadraticCurveTo(X(71), Y(44), X(79), Y(47));
    ctx.stroke();
    /* 额横与竖脸 */
    ctx.beginPath();
    ctx.moveTo(X(35), Y(39));
    ctx.quadraticCurveTo(X(50), Y(35), X(65), Y(39));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(37));
    ctx.lineTo(X(50), Y(68));
    ctx.stroke();
    /* 吻：横画，末端一短竖 */
    ctx.beginPath();
    ctx.moveTo(X(39), Y(68));
    ctx.quadraticCurveTo(X(50), Y(72), X(61), Y(68));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(70));
    ctx.lineTo(X(50), Y(90));
    ctx.stroke();
    ctx.restore();
  }

  /* 鸟：侧视之鸟，小圆头尖喙朝左，椭圆身，背上一撇为翅，双爪，尾羽右分 */
  function bird(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.048);
    /* 头：小圆 */
    ctx.beginPath();
    ctx.arc(X(33), Y(17), s * 0.08, 0, Math.PI * 2);
    ctx.stroke();
    /* 喙：朝左之尖 */
    ctx.beginPath();
    ctx.moveTo(X(26), Y(12));
    ctx.quadraticCurveTo(X(18), Y(15), X(10), Y(19));
    ctx.quadraticCurveTo(X(19), Y(23), X(27), Y(23));
    ctx.stroke();
    /* 颈 */
    ctx.beginPath();
    ctx.moveTo(X(32), Y(25));
    ctx.lineTo(X(35), Y(31));
    ctx.stroke();
    /* 身：椭圆 */
    ctx.beginPath();
    ctx.moveTo(X(38), Y(30));
    ctx.quadraticCurveTo(X(27), Y(38), X(29), Y(50));
    ctx.quadraticCurveTo(X(32), Y(62), X(45), Y(66));
    ctx.quadraticCurveTo(X(58), Y(68), X(66), Y(60));
    ctx.quadraticCurveTo(X(73), Y(51), X(70), Y(40));
    ctx.quadraticCurveTo(X(66), Y(31), X(55), Y(29));
    ctx.quadraticCurveTo(X(46), Y(28), X(38), Y(30));
    ctx.stroke();
    /* 翅：背上一撇 */
    ctx.beginPath();
    ctx.moveTo(X(42), Y(38));
    ctx.quadraticCurveTo(X(53), Y(38), X(62), Y(47));
    ctx.stroke();
    /* 双爪 */
    ctx.beginPath();
    ctx.moveTo(X(43), Y(65));
    ctx.lineTo(X(41), Y(83));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(56), Y(67));
    ctx.lineTo(X(59), Y(84));
    ctx.stroke();
    /* 尾羽：向右下分叉 */
    ctx.beginPath();
    ctx.moveTo(X(67), Y(48));
    ctx.quadraticCurveTo(X(78), Y(47), X(89), Y(42));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(68), Y(55));
    ctx.quadraticCurveTo(X(78), Y(62), X(85), Y(72));
    ctx.stroke();
    ctx.restore();
  }

  /* 鱼：头在上，身略鼓，尾端分叉；中脊一竖，身内短横纹，两侧各一鳍 */
  function fish(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.052);
    /* 鱼身：尖头 → 鼓腹 → 收腰 → 分叉尾，一笔围成 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(5));
    ctx.quadraticCurveTo(X(33), Y(13), X(26), Y(35));
    ctx.quadraticCurveTo(X(25), Y(52), X(40), Y(70));
    ctx.lineTo(X(31), Y(94));
    ctx.lineTo(X(50), Y(76));
    ctx.lineTo(X(68), Y(94));
    ctx.lineTo(X(57), Y(70));
    ctx.quadraticCurveTo(X(74), Y(53), X(74), Y(35));
    ctx.quadraticCurveTo(X(67), Y(13), X(50), Y(5));
    ctx.stroke();
    /* 中脊一竖 */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(7));
    ctx.lineTo(X(50), Y(72));
    ctx.stroke();
    /* 身内短横纹 */
    ctx.lineWidth = Math.max(1.5, s * 0.042);
    ctx.beginPath();
    ctx.moveTo(X(40), Y(30));
    ctx.quadraticCurveTo(X(50), Y(28), X(60), Y(30));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(36), Y(45));
    ctx.quadraticCurveTo(X(50), Y(43), X(64), Y(45));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(42), Y(58));
    ctx.quadraticCurveTo(X(50), Y(57), X(58), Y(58));
    ctx.stroke();
    /* 两侧短鳍 */
    ctx.lineWidth = Math.max(1.5, s * 0.048);
    ctx.beginPath();
    ctx.moveTo(X(26), Y(47));
    ctx.quadraticCurveTo(X(19), Y(49), X(13), Y(54));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(74), Y(43));
    ctx.quadraticCurveTo(X(81), Y(45), X(87), Y(50));
    ctx.stroke();
    ctx.restore();
  }

  /* 竹：双竿并立有节，中段叶片向左右横披，叶尖略垂 */
  function bamboo(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.052);
    /* 两竿并立，微微内倾 */
    ctx.beginPath();
    ctx.moveTo(X(37), Y(7));
    ctx.quadraticCurveTo(X(35), Y(50), X(37), Y(93));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(64), Y(7));
    ctx.quadraticCurveTo(X(66), Y(50), X(64), Y(93));
    ctx.stroke();
    /* 竹节：短横 */
    ctx.lineWidth = Math.max(1.5, s * 0.042);
    var nodes = [[36, 26], [36, 52], [36, 78], [65, 20], [65, 46], [65, 72]];
    for (var i = 0; i < nodes.length; i++) {
      ctx.beginPath();
      ctx.moveTo(X(nodes[i][0] - 4), Y(nodes[i][1]));
      ctx.lineTo(X(nodes[i][0] + 4), Y(nodes[i][1]));
      ctx.stroke();
    }
    /* 竹叶：自中段横向披出，叶身微拱、叶尖下垂 */
    ctx.lineWidth = Math.max(1.5, s * 0.042);
    var leaves = [
      [36, 24, 14, 26, 3, 52],
      [36, 42, 12, 44, 2, 72],
      [36, 58, 16, 60, 6, 88],
      [65, 18, 87, 20, 98, 46],
      [65, 36, 89, 38, 98, 66],
      [65, 52, 87, 54, 96, 80]
    ];
    for (var j = 0; j < leaves.length; j++) {
      var L = leaves[j];
      ctx.beginPath();
      ctx.moveTo(X(L[0]), Y(L[1]));
      ctx.quadraticCurveTo(X(L[2]), Y(L[3]), X(L[4]), Y(L[5]));
      ctx.stroke();
    }
    ctx.restore();
  }

  /* 女：跪坐交臂之人 */
  function woman(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.beginPath();
    ctx.arc(X(50), Y(16), Math.max(1.5, s * 0.06), 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(X(50), Y(26));
    ctx.quadraticCurveTo(X(42), Y(46), X(46), Y(64));
    ctx.quadraticCurveTo(X(48), Y(78), X(30), Y(84));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(44), Y(56));
    ctx.quadraticCurveTo(X(58), Y(68), X(76), Y(70));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(58), Y(72));
    ctx.quadraticCurveTo(X(70), Y(84), X(84), Y(80));
    ctx.stroke();
  }

  /* 子：大头举臂之幼儿 */
  function child(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.beginPath();
    ctx.arc(X(50), Y(16), Math.max(1.5, s * 0.085), 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(50), Y(28));
    ctx.lineTo(X(50), Y(64));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(50), Y(38));
    ctx.quadraticCurveTo(X(34), Y(30), X(22), Y(24));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(38));
    ctx.quadraticCurveTo(X(66), Y(30), X(78), Y(24));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(50), Y(64));
    ctx.lineTo(X(28), Y(90));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(64));
    ctx.lineTo(X(72), Y(90));
    ctx.stroke();
  }

  /* 止：足形 */
  function foot(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.beginPath();
    ctx.moveTo(X(30), Y(88));
    ctx.lineTo(X(30), Y(46));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(88));
    ctx.lineTo(X(50), Y(36));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(70), Y(88));
    ctx.lineTo(X(70), Y(46));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(22), Y(88));
    ctx.lineTo(X(80), Y(88));
    ctx.stroke();
  }

  /* 宀：屋盖 */
  function roof(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.beginPath();
    ctx.moveTo(X(10), Y(56));
    ctx.quadraticCurveTo(X(50), Y(8), X(90), Y(56));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(10), Y(56));
    ctx.lineTo(X(10), Y(68));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(90), Y(56));
    ctx.lineTo(X(90), Y(68));
    ctx.stroke();
  }

  /* 爪：三指之手 */
  function claw(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.beginPath();
    ctx.moveTo(X(50), Y(18));
    ctx.lineTo(X(50), Y(48));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(30), Y(40));
    ctx.quadraticCurveTo(X(26), Y(62), X(32), Y(78));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(46));
    ctx.lineTo(X(50), Y(82));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(70), Y(40));
    ctx.quadraticCurveTo(X(74), Y(62), X(68), Y(78));
    ctx.stroke();
  }

  /* ---------------- 合体字 ---------------- */

  function woods(ctx, cx, cy, s) {
    /* 两树并立，左矮右高：各有干、上下各两枝/根，笔画带弧不取直线 */
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.055);
    /* 左树：矮，干居中，上枝长而斜，下根外撇 */
    ctx.beginPath();
    ctx.moveTo(X(31), Y(20));
    ctx.quadraticCurveTo(X(29), Y(52), X(29), Y(82));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(30), Y(40));
    ctx.quadraticCurveTo(X(24), Y(33), X(17), Y(26));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(30), Y(50));
    ctx.quadraticCurveTo(X(37), Y(43), X(43), Y(36));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(29), Y(80));
    ctx.quadraticCurveTo(X(24), Y(86), X(19), Y(93));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(29), Y(80));
    ctx.quadraticCurveTo(X(34), Y(86), X(38), Y(93));
    ctx.stroke();
    /* 右树：高 */
    ctx.beginPath();
    ctx.moveTo(X(67), Y(10));
    ctx.quadraticCurveTo(X(69), Y(48), X(68), Y(86));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(67), Y(28));
    ctx.quadraticCurveTo(X(61), Y(21), X(55), Y(14));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(67), Y(38));
    ctx.quadraticCurveTo(X(74), Y(32), X(80), Y(26));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(68), Y(84));
    ctx.quadraticCurveTo(X(62), Y(90), X(57), Y(96));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(68), Y(84));
    ctx.quadraticCurveTo(X(73), Y(90), X(77), Y(96));
    ctx.stroke();
    ctx.restore();
  }

  function forest(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    /* 顶部小树：干、上枝、下根俱全（与下两树同法，仅小号） */
    ctx.save();
    ctx.lineWidth = Math.max(1.4, s * 0.045);
    ctx.beginPath();
    ctx.moveTo(X(50), Y(6));
    ctx.lineTo(X(50), Y(42));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(26));
    ctx.quadraticCurveTo(X(44), Y(18), X(40), Y(10));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(26));
    ctx.quadraticCurveTo(X(56), Y(18), X(60), Y(10));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(34));
    ctx.quadraticCurveTo(X(45), Y(40), X(42), Y(46));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(34));
    ctx.quadraticCurveTo(X(55), Y(40), X(58), Y(46));
    ctx.stroke();
    ctx.restore();
    /* 下承双树（收拢以求窄高之形） */
    tree(ctx, cx - s * 0.17, cy + s * 0.2, s * 0.52);
    tree(ctx, cx + s * 0.17, cy + s * 0.2, s * 0.52);
  }

  function bright(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    /* 月居左，占左半，满高 */
    moon(ctx, cx - s * 0.23, cy, s * 0.94);
    /* 日居右：圆角方框，内一短横（依拓影） */
    ctx.save();
    ctx.lineWidth = Math.max(1.8, s * 0.058);
    var x0 = X(57), y0 = Y(23), x1 = X(95), y1 = Y(73);
    var r = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x1 - r, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
    ctx.lineTo(x1, y1 - r);
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
    ctx.lineTo(x0 + r, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.stroke();
    ctx.lineWidth = Math.max(1.6, s * 0.05);
    ctx.beginPath();
    ctx.moveTo(X(64), Y(49));
    ctx.lineTo(X(88), Y(49));
    ctx.stroke();
    ctx.restore();
  }

  function rest(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.05);
    /* 人（左）：环首，身向后倚，背贴树干 */
    ctx.beginPath();
    ctx.arc(X(32), Y(17), s * 0.072, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(34), Y(25));
    ctx.quadraticCurveTo(X(41), Y(40), X(45), Y(54));
    ctx.quadraticCurveTo(X(47), Y(62), X(46), Y(66));
    ctx.stroke();
    /* 腿：自腰下折出，落地 */
    ctx.beginPath();
    ctx.moveTo(X(46), Y(65));
    ctx.quadraticCurveTo(X(43), Y(78), X(39), Y(89));
    ctx.stroke();
    /* 臂：向左前伸出 */
    ctx.beginPath();
    ctx.moveTo(X(38), Y(36));
    ctx.quadraticCurveTo(X(31), Y(42), X(24), Y(48));
    ctx.stroke();
    /* 树（右）：干满高 */
    ctx.beginPath();
    ctx.moveTo(X(55), Y(5));
    ctx.quadraticCurveTo(X(56), Y(50), X(55), Y(95));
    ctx.stroke();
    /* 上枝：左右各一 */
    ctx.beginPath();
    ctx.moveTo(X(55), Y(15));
    ctx.quadraticCurveTo(X(51), Y(12), X(45), Y(8));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(55), Y(26));
    ctx.quadraticCurveTo(X(63), Y(21), X(69), Y(16));
    ctx.stroke();
    /* 下根：向下外撇 */
    ctx.beginPath();
    ctx.moveTo(X(55), Y(82));
    ctx.quadraticCurveTo(X(50), Y(88), X(47), Y(94));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(55), Y(82));
    ctx.quadraticCurveTo(X(61), Y(88), X(65), Y(94));
    ctx.stroke();
    ctx.restore();
  }

  function peace(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.8, s * 0.055);
    /* 屋顶：尖顶高坡，近底处转为直壁（人字形大屋顶） */
    ctx.beginPath();
    ctx.moveTo(X(50), Y(2));
    ctx.quadraticCurveTo(X(37), Y(14), X(22), Y(34));
    ctx.lineTo(X(22), Y(78));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(50), Y(2));
    ctx.quadraticCurveTo(X(63), Y(14), X(74), Y(32));
    ctx.lineTo(X(74), Y(80));
    ctx.stroke();

    /* 跪坐女子：颈、环首、屈臂、跪腿，居中偏下 */
    ctx.lineWidth = Math.max(1.5, s * 0.045);
    /* 颈 */
    ctx.beginPath();
    ctx.moveTo(X(57), Y(24));
    ctx.lineTo(X(57), Y(34));
    ctx.stroke();
    /* 环首 */
    var hx0 = X(47), hy0 = Y(34), hx1 = X(69), hy1 = Y(49), hr = s * 0.03;
    ctx.beginPath();
    ctx.moveTo(hx0 + hr, hy0);
    ctx.lineTo(hx1 - hr, hy0);
    ctx.quadraticCurveTo(hx1, hy0, hx1, hy0 + hr);
    ctx.lineTo(hx1, hy1 - hr);
    ctx.quadraticCurveTo(hx1, hy1, hx1 - hr, hy1);
    ctx.lineTo(hx0 + hr, hy1);
    ctx.quadraticCurveTo(hx0, hy1, hx0, hy1 - hr);
    ctx.lineTo(hx0, hy0 + hr);
    ctx.quadraticCurveTo(hx0, hy0, hx0 + hr, hy0);
    ctx.stroke();
    /* 屈臂 */
    ctx.beginPath();
    ctx.moveTo(X(48), Y(46));
    ctx.lineTo(X(37), Y(56));
    ctx.lineTo(X(39), Y(68));
    ctx.stroke();
    /* 躯干 */
    ctx.beginPath();
    ctx.moveTo(X(57), Y(49));
    ctx.lineTo(X(56), Y(64));
    ctx.stroke();
    /* 大腿与左胫（跪地） */
    ctx.beginPath();
    ctx.moveTo(X(56), Y(64));
    ctx.lineTo(X(44), Y(74));
    ctx.lineTo(X(44), Y(88));
    ctx.stroke();
    /* 横画贯至右胫，右胫落地 */
    ctx.beginPath();
    ctx.moveTo(X(44), Y(85));
    ctx.lineTo(X(63), Y(78));
    ctx.lineTo(X(63), Y(91));
    ctx.stroke();
    ctx.restore();
  }

  /* 好：左「子」右「女」，依书中字形 */
  function good(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.048);

    /* 子：方头、长身、横臂 */
    ctx.beginPath();
    ctx.rect(X(17.5), Y(13), X(42.5) - X(17.5), Y(36.5) - Y(13));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(29), Y(36.5));
    ctx.lineTo(X(29), Y(60));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(11.5), Y(61));
    ctx.lineTo(X(46), Y(61));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(27.5), Y(63));
    ctx.lineTo(X(27.5), Y(86));
    ctx.stroke();

    /* 女：颈、方环首、屈臂、折腿 */
    ctx.beginPath();
    ctx.moveTo(X(68.5), Y(0));
    ctx.lineTo(X(68.5), Y(15));
    ctx.stroke();

    ctx.beginPath();
    var lx0 = X(68.5), ly0 = Y(13), lx1 = X(84), ly1 = Y(36), lr = s * 0.045;
    ctx.moveTo(lx0 + lr, ly0);
    ctx.lineTo(lx1 - lr, ly0);
    ctx.quadraticCurveTo(lx1, ly0, lx1, ly0 + lr);
    ctx.lineTo(lx1, ly1 - lr);
    ctx.quadraticCurveTo(lx1, ly1, lx1 - lr, ly1);
    ctx.lineTo(lx0 + lr, ly1);
    ctx.quadraticCurveTo(lx0, ly1, lx0, ly1 - lr);
    ctx.lineTo(lx0, ly0 + lr);
    ctx.quadraticCurveTo(lx0, ly0, lx0 + lr, ly0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(63), Y(18));
    ctx.lineTo(X(58), Y(36.5));
    ctx.lineTo(X(50), Y(52));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(X(68.5), Y(36.5));
    ctx.lineTo(X(57), Y(39));
    ctx.lineTo(X(50), Y(47));
    ctx.stroke();

    /* 跪坐之形：躯干自环首垂下，大腿斜至膝，左胫垂直跪地；
       一斜画自左胫下段贯至右胫顶，右胫垂直落地，下体成开口方形 */
    ctx.beginPath();
    ctx.moveTo(X(71), Y(36.5));
    ctx.lineTo(X(71), Y(57));
    ctx.lineTo(X(47), Y(76));
    ctx.lineTo(X(47), Y(91));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(47), Y(87));
    ctx.lineTo(X(72), Y(77));
    ctx.lineTo(X(72), Y(92.5));
    ctx.stroke();
    ctx.restore();
  }

  function wade(ctx, cx, cy, s) {
    water(ctx, cx - s * 0.24, cy, s * 0.56);
    foot(ctx, cx + s * 0.24, cy, s * 0.48);
  }

  /* 采：爪在左上（三指下垂），木在右下，两者相靠而不重叠 */
  function pick(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.save();
    ctx.lineWidth = Math.max(1.5, s * 0.046);
    /* 爪：掌在上，三指下垂微向内钩，伸向树冠 */
    ctx.beginPath();
    ctx.moveTo(X(25), Y(22));
    ctx.quadraticCurveTo(X(34), Y(16), X(44), Y(25));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(28), Y(24));
    ctx.quadraticCurveTo(X(26), Y(37), X(30), Y(48));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(35), Y(24));
    ctx.quadraticCurveTo(X(36), Y(38), X(36), Y(52));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(42), Y(26));
    ctx.quadraticCurveTo(X(45), Y(36), X(42), Y(47));
    ctx.stroke();
    /* 木：干在右下，一笔自冠至根 */
    ctx.lineWidth = Math.max(1.5, s * 0.055);
    ctx.beginPath();
    ctx.moveTo(X(66), Y(42));
    ctx.quadraticCurveTo(X(64), Y(72), X(65), Y(96));
    ctx.stroke();
    /* 上枝左右 */
    ctx.beginPath();
    ctx.moveTo(X(66), Y(56));
    ctx.quadraticCurveTo(X(59), Y(51), X(52), Y(46));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(66), Y(54));
    ctx.quadraticCurveTo(X(73), Y(49), X(79), Y(44));
    ctx.stroke();
    /* 下根外撇 */
    ctx.beginPath();
    ctx.moveTo(X(65), Y(86));
    ctx.quadraticCurveTo(X(60), Y(91), X(55), Y(97));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(65), Y(86));
    ctx.quadraticCurveTo(X(71), Y(91), X(75), Y(97));
    ctx.stroke();
    ctx.restore();
  }

  function prison(ctx, cx, cy, s) {
    var X = px(cx, s), Y = py(cy, s);
    ctx.beginPath();
    ctx.rect(X(12), Y(10), X(88) - X(12), Y(90) - Y(10));
    ctx.stroke();
    person(ctx, cx, cy, s * 0.44);
  }

  var GLYPHS = [
    { id: 'sun', label: '日', name: '日', draw: sun },
    { id: 'moon', label: '月', name: '月', draw: moon },
    { id: 'mountain', label: '山', name: '山', draw: mountain },
    { id: 'water', label: '水', name: '水', draw: water },
    { id: 'tree', label: '木', name: '木', draw: tree },
    { id: 'field', label: '田', name: '田', draw: field },
    { id: 'fire', label: '火', name: '火', draw: fire },
    { id: 'person', label: '人', name: '人', draw: person },
    { id: 'big', label: '大', name: '大', draw: big },
    { id: 'eye', label: '目', name: '目', draw: eye },
    { id: 'mouth', label: '口', name: '口', draw: mouth },
    { id: 'rain', label: '雨', name: '雨', draw: rain },
    { id: 'cloud', label: '云', name: '云', draw: cloud },
    { id: 'river', label: '川', name: '川', draw: river },
    { id: 'stone', label: '石', name: '石', draw: stone },
    { id: 'soil', label: '土', name: '土', draw: soil },
    { id: 'ox', label: '牛', name: '牛', draw: ox },
    { id: 'sheep', label: '羊', name: '羊', draw: sheep },
    { id: 'bird', label: '鸟', name: '鸟', draw: bird },
    { id: 'fish', label: '鱼', name: '鱼', draw: fish },
    { id: 'bamboo', label: '竹', name: '竹', draw: bamboo },
    { id: 'woods', label: '林', name: '林', draw: woods },
    { id: 'forest', label: '森', name: '森', draw: forest },
    { id: 'bright', label: '明', name: '明', draw: bright },
    { id: 'rest', label: '休', name: '休', draw: rest },
    { id: 'peace', label: '安', name: '安', draw: peace },
    { id: 'good', label: '好', name: '好', draw: good },
    { id: 'wade', label: '涉', name: '涉', draw: wade },
    { id: 'pick', label: '采', name: '采', draw: pick },
    { id: 'prison', label: '囚', name: '囚', draw: prison }
  ];

  var BY_ID = {};
  for (var i = 0; i < GLYPHS.length; i++) BY_ID[GLYPHS[i].id] = i;

  /* 书中拓影字形：注册后优先于矢量绘制，未注册时自动回退 */
  var GLOBAL = typeof globalThis !== 'undefined' ? globalThis
    : (typeof window !== 'undefined' ? window : {});
  var IMAGES = {};
  var tintCache = {};
  var INK = '#33291F';

  function registerImage(id, img) {
    if (BY_ID[id] == null) return;
    IMAGES[id] = img;
  }

  function imageReady(img) {
    if (!img) return false;
    if (typeof img.complete === 'boolean' && !img.complete) return false;
    return (img.naturalWidth || img.width) > 0;
  }

  function tintImage(id, img, color) {
    var key = id + '|' + color;
    if (tintCache[key]) return tintCache[key];
    var cv = null;
    try {
      if (GLOBAL.document && GLOBAL.document.createElement) {
        cv = GLOBAL.document.createElement('canvas');
      } else if (GLOBAL.wx && GLOBAL.wx.createCanvas) {
        cv = GLOBAL.wx.createCanvas();
      }
    } catch (e) { cv = null; }
    if (!cv) return img;
    var w = img.naturalWidth || img.width || 120;
    var h = img.naturalHeight || img.height || 120;
    cv.width = w;
    cv.height = h;
    var c2 = cv.getContext('2d');
    c2.clearRect(0, 0, w, h);
    c2.drawImage(img, 0, 0, w, h);
    c2.globalCompositeOperation = 'source-in';
    c2.fillStyle = color;
    c2.fillRect(0, 0, w, h);
    tintCache[key] = cv;
    return cv;
  }

  function paint(ctx, g, cx, cy, size, lineWidth, color, photo) {
    var img = photo ? IMAGES[g.id] : null;
    if (img && imageReady(img)) {
      var s = size * 1.12;
      var src = color === INK ? img : tintImage(g.id, img, color);
      ctx.save();
      ctx.drawImage(src, cx - s / 2, cy - s / 2, s, s);
      ctx.restore();
      return;
    }

    var paths = Trace && Trace.TRACE ? Trace.TRACE[g.id] : null;
    if (paths) {
      var k = size / 100;
      ctx.save();
      ctx.beginPath();
      for (var i = 0; i < paths.length; i++) {
        var p = paths[i];
        for (var j = 0; j < p.length; j++) {
          var x = cx + (p[j][0] - 50) * k;
          var y = cy + (p[j][1] - 50) * k;
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
      ctx.fillStyle = color;
      ctx.fill('evenodd');
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    g.draw(ctx, cx, cy, size);
    ctx.restore();
  }

  function draw(ctx, type, cx, cy, size, lineWidth, color, photo) {
    paint(ctx, GLYPHS[type] || GLYPHS[0], cx, cy, size, lineWidth, color, photo);
  }

  function drawById(ctx, id, cx, cy, size, lineWidth, color, photo) {
    var idx = BY_ID[id];
    paint(ctx, GLYPHS[idx == null ? 0 : idx], cx, cy, size, lineWidth, color, photo);
  }

  return {
    GLYPHS: GLYPHS,
    BY_ID: BY_ID,
    registerImage: registerImage,
    draw: draw,
    drawById: drawById
  };
});
