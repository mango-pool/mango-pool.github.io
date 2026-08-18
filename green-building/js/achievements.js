// ── 成就系統（對應設計規格 §5，TBD）──────────────────────
// 觸發規則：
//   allEmpty  → 所有部位都「未選擇」才成立（大地主）
//   contains  → 整棟房子「包含」清單中每個建材（part:material）才成立
// tbd:true    → 需要本版尚未實作的部位，暫時無法觸發（目前七個成就都可達成，無人使用）
// 註：額外設備已改為複選，原本卡住的成就現在都可達成。
const ACHIEVEMENTS = [
  { name: '大地主',        en: 'One With Nothing',
    rule: { allEmpty: true } },

  { name: '台灣最美的風景',  en: 'Where Chaos Becomes a Skyline',
    rule: { contains: ['wall:brick', 'roof:metal'] } },

  { name: '台電漲價我不怕',  en: "My Energy Bill Can't Hurt Me",
    rule: { contains: ['extra:solar'] } },

  // note 只寫「規則本身看不出來」的補充；達成條件由 game.js 的 achvHint() 依 rule 自動生成
  { name: '我家就是台電',    en: '',
    rule: { contains: ['extra:solar', 'extra:microgrid'] } },

  { name: '每天看日出日落',  en: '',
    rule: { contains: ['extra:window', 'extra:skyvent'] } },

  { name: '我全都要！',      en: '',
    rule: { contains: ['extra:solar', 'extra:skyvent', 'extra:window', 'extra:microgrid'] } },

  { name: '豬二哥的小木屋',  en: "The Second Little Pig's Wooden House",
    rule: { contains: ['wall:clt'] } },
];
