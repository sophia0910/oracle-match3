/* 字源演变可用阶段清单（b = 金文，s = 小篆；甲骨与楷书恒有） */
(function (root) {
  var EVO = {
    sun: 'bs',
    moon: 'bs',
    mountain: 'bs',
    water: 'bs',
    tree: 'bs',
    field: 'bs',
    fire: 'bs',
    person: 'bs',
    big: 'bs',
    eye: 'bs',
    mouth: 'bs',
    rain: 'bs',
    cloud: 's',
    river: 'bs',
    stone: 'bs',
    soil: 'bs',
    ox: 'bs',
    sheep: 'bs',
    bird: 'bs',
    fish: 'bs',
    bamboo: 'bs',
    woods: 'bs',
    forest: 's',
    bright: 'bs',
    rest: 'bs',
    peace: 'bs',
    good: 'bs',
    wade: 'b',
    pick: 'bs',
    prison: 's'
  };
  if (typeof module === 'object' && module.exports) module.exports = EVO;
  if (root) root.OracleEvo = EVO;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
