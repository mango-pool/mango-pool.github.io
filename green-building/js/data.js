// ── 建材資料表（可編輯內容）──────────────────────────────
// 對應設計規格 §2：3 個可換部位（單選），每個部位可「未選擇」。
// 每個建材:id / 中文名 / 英文名 / 佔位色 / 擬真圖 / 優點token / 缺點token
// ★ 擬真圖：把 img 填上圖片路徑（例如 'img/roof_warm.webp'）即自動改用圖片，
//   img 留空('')就退回 color 色塊。程式邏輯完全不用改。
const PARTS = [
  {
    id: 'roof', name: '屋頂', menu: 'Chose roof 選擇屋頂',
    materials: [
      { id: 'warm',  name: '平頂陽台', en: 'warm roof',           color: '#5CB85C', img: 'img/roof/warm_roof.webp',
        pros: ['導熱低', '低碳', '節能', '耐候'], cons: ['貴', '維護難'] },
      { id: 'metal', name: '鐵皮加蓋', en: 'Metal Roof Overbuild', color: '#9AA7B0', img: 'img/roof/metal_roof.webp',
        pros: ['輕', '易安裝', '俗'],            cons: ['熱傳導高', '易噪'] },
    ]
  },
  {
    id: 'wall', name: '外牆', menu: 'Chose main materials 選擇主要建材',
    materials: [
      { id: 'brick',    name: '紅磚',     en: 'blocks',         color: '#C0673F', img: 'img/wall/blocks.webp',
        pros: ['防火', '耐用', '耐候'], cons: ['熱傳導高', '重'] },
      { id: 'clt',      name: '交錯壓木板', en: 'CLT',           color: '#D8B27A', img: 'img/wall/clt.webp',
        pros: ['低碳', '輕', '導熱低'], cons: ['易燃', '貴'] },
      { id: 'concrete', name: '水泥磚',   en: 'Concrete block',  color: '#B9B6AD', img: 'img/wall/concrete_block.webp',
        pros: ['防火', '俗', '耐用'],   cons: ['熱傳導高', '重'] },
    ]
  },
  {
    // multi:true → 此部位可複選（其餘部位單選）
    id: 'extra', name: '額外設備', menu: 'Additional equip 額外設備', multi: true,
    materials: [
      // 排列順序 = 疊圖順序（越後面越上層）
      // needs:'roof' → 裝在屋頂上，屋頂未選時不能選；屋頂改回未選擇時會一併取消
      { id: 'solar',     name: '太陽能板',      en: 'solar panel',             color: '#15355C', img: 'img/extra/solar_panel.webp', needs: 'roof',
        pros: ['節能', '低碳'], cons: ['貴', '維護難'] },
      { id: 'skyvent',   name: '採光井+通風扇', en: 'sky vent',                color: '#CFE8F5', img: 'img/extra/sky_vent.webp',     needs: 'roof',
        pros: ['舒適', '節能'], cons: ['光汙'] },
      { id: 'window',    name: '採光落地窗',    en: 'Floor-to-Ceiling Window', color: '#7FC4E6', img: 'img/extra/floor_window.webp',
        pros: ['舒適', '節能'], cons: ['熱傳導高', '貴'] },
      // 放最後 → 最上層。儲能櫃在屋前草地、離鏡頭最近，本來就該擋住後面的東西
      { id: 'microgrid', name: '區域電網',      en: 'microgrid',               color: '#3A6EA5', img: 'img/extra/microgrid.webp',
        pros: ['節能', '低碳'], cons: ['貴', '維護難'] },
    ]
  },
];
