/* 音效 · 用 WebAudio 实时合成，无需音频文件 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OracleSfx = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  var isWx = typeof wx !== 'undefined' && typeof wx.createCanvas === 'function';
  var ac = null, master = null;
  var MUTE_KEY = 'oracle_sfx_muted';
  var muted = false;

  try {
    if (isWx && wx.getStorageSync) muted = !!wx.getStorageSync(MUTE_KEY);
    else if (typeof localStorage !== 'undefined') muted = localStorage.getItem(MUTE_KEY) === '1';
  } catch (e) { muted = false; }

  function saveMuted() {
    try {
      if (isWx && wx.setStorageSync) wx.setStorageSync(MUTE_KEY, muted ? 1 : 0);
      else if (typeof localStorage !== 'undefined') {
        if (muted) localStorage.setItem(MUTE_KEY, '1');
        else localStorage.removeItem(MUTE_KEY);
      }
    } catch (e) { /* 存储不可用时忽略 */ }
  }

  function ensure() {
    if (ac) return ac;
    try {
      if (isWx) {
        if (typeof wx.createWebAudioContext === 'function') ac = wx.createWebAudioContext();
      } else {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ac = new AC();
      }
      if (ac) {
        master = ac.createGain();
        master.gain.value = 0.5;
        master.connect(ac.destination);
      }
    } catch (e) { ac = null; }
    return ac;
  }

  function unlock() {
    ensure();
    if (ac && ac.state === 'suspended' && ac.resume) {
      try { ac.resume(); } catch (e) { /* 忽略 */ }
    }
  }

  function tone(freq, dur, type, gain, delay, slideTo) {
    if (!ac) return;
    var t0 = ac.currentTime + (delay || 0);
    var osc = ac.createOscillator();
    var g = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) {
      try { osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur); } catch (e) { /* 忽略 */ }
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  function noiseBurst(dur, gain, freq) {
    if (!ac || !ac.createBuffer) return;
    try {
      var len = Math.max(1, Math.floor(ac.sampleRate * dur));
      var buf = ac.createBuffer(1, len, ac.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      var src = ac.createBufferSource();
      src.buffer = buf;
      var f = ac.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = freq || 1700;
      f.Q.value = 0.9;
      var g = ac.createGain();
      g.gain.value = gain;
      src.connect(f);
      f.connect(g);
      g.connect(master);
      src.start();
    } catch (e) { /* 忽略 */ }
  }

  function play(name, opt) {
    if (muted) return;
    if (!ensure()) return;
    if (ac.state === 'suspended' && ac.resume) {
      try { ac.resume(); } catch (e) { /* 忽略 */ }
    }
    opt = opt || {};
    var combo = Math.max(1, Math.min(6, opt.combo || 1));

    if (name === 'tap' || name === 'select') {
      tone(760, 0.045, 'sine', 0.035);
    } else if (name === 'swap') {
      tone(430, 0.085, 'triangle', 0.06, 0, 640);
    } else if (name === 'bad') {
      tone(210, 0.16, 'sawtooth', 0.035, 0, 150);
      tone(150, 0.16, 'sine', 0.045, 0.02, 120);
    } else if (name === 'match') {
      var scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
      var f = scale[combo - 1];
      tone(f, 0.16, 'sine', 0.075);
      tone(f * 1.5, 0.14, 'triangle', 0.045, 0.05);
      if (combo > 1) tone(f * 2, 0.12, 'sine', 0.03, 0.1);
      noiseBurst(0.1, 0.022 + combo * 0.008, 1500 + combo * 220);
    } else if (name === 'milestone') {
      tone(523.25, 0.14, 'triangle', 0.07);
      tone(659.25, 0.14, 'triangle', 0.065, 0.08);
      tone(783.99, 0.16, 'triangle', 0.06, 0.16);
      tone(1046.5, 0.28, 'sine', 0.05, 0.24);
      noiseBurst(0.26, 0.022, 2600);
    } else if (name === 'spirit') {
      tone(1046.5, 0.12, 'triangle', 0.06);
      tone(1318.5, 0.12, 'triangle', 0.05, 0.07);
      tone(1568.0, 0.18, 'sine', 0.045, 0.14);
    } else if (name === 'right') {
      tone(659.25, 0.12, 'triangle', 0.07);
      tone(987.77, 0.18, 'sine', 0.06, 0.09);
    } else if (name === 'wrong') {
      tone(311.13, 0.14, 'sine', 0.07);
      tone(233.08, 0.2, 'sine', 0.06, 0.1);
    } else if (name === 'win') {
      var fan = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < fan.length; i++) {
        tone(fan[i], i === fan.length - 1 ? 0.35 : 0.16, 'triangle', 0.07, i * 0.1);
      }
      tone(1046.5, 0.3, 'sine', 0.04, 0.42);
    } else if (name === 'fail') {
      tone(392.0, 0.16, 'triangle', 0.06);
      tone(329.63, 0.16, 'triangle', 0.055, 0.14);
      tone(261.63, 0.26, 'sine', 0.05, 0.28);
    } else if (name === 'start') {
      tone(392.0, 0.12, 'triangle', 0.05);
      tone(523.25, 0.2, 'sine', 0.05, 0.08);
    }
  }

  return {
    play: play,
    unlock: unlock,
    isMuted: function () { return muted; },
    setMuted: function (v) { muted = !!v; saveMuted(); },
    toggle: function () { muted = !muted; saveMuted(); return muted; }
  };
});
