// ── 成就系統（對應設計規格 §5）──────────────────────────
// 觸發規則：
//   allEmpty  → 所有部位都「未選擇」才成立（大地主）
//   contains  → 整棟房子「包含」清單中每個建材（part:material）才成立
//
// ★ 規則只用來判定，不再拿來生成畫面文字 ——
//   成就面板刻意不顯示解鎖條件，成就名稱就是玩家唯一的提示。
// ★ 判定時機是「送出設計」，不是即時。取消選擇不會讓已解鎖的成就消失
//   （已解鎖的成就以 localStorage 永久累積，見 game.js 的 settle()）。
//
// 英文名以 doc/GreenHouse建材Tokenlevelcarbonprice及成就.xlsx 的「組合成就」表為準。
// 該表另有 9 個成就要等 21 建材換版才能做（含赤腳也敢亂走、實驗室在我家），
// 完整版備份在 doc/_21建材版備份/achievements.js。
const ACHIEVEMENTS = [
  { name: '大地主',        en: 'One With Nothing',
    rule: { allEmpty: true } },

  { name: '台灣最美的風景',  en: 'Where Chaos Becomes a Skyline',
    rule: { contains: ['wall:brick', 'roof:metal'] } },

  { name: '台電漲價我不怕',  en: "My Energy Bill Can't Hurt Me",
    rule: { contains: ['extra:solar'] } },

  { name: '我家就是台電',    en: 'The Grid Starts at My Front Door',
    rule: { contains: ['extra:solar', 'extra:microgrid'] } },

  { name: '每天看日出日落',  en: 'Front-Row Seat to the Sun',
    rule: { contains: ['extra:window', 'extra:skyvent'] } },

  // 試算表的「組合成就」表只列了這一組的材料組合，沒寫成就名，暫時沿用現行名稱
  { name: '我全都要！',      en: '',
    rule: { contains: ['extra:solar', 'extra:skyvent', 'extra:window', 'extra:microgrid'] } },

  // 試算表的完整條件是 CLT + 合成木隔間牆 + 實木地板，
  // 但那兩個部位還沒進遊戲，先維持只需 CLT
  { name: '豬二哥的小木屋',  en: "The Second Little Pig's Wooden House",
    rule: { contains: ['wall:clt'] } },
];
