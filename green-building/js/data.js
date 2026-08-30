// ── 建材資料表 ────────────────────────────────────────────
// ★ 由 tools/gen_data.py 依 doc/GreenHouse建材Tokenlevelcarbonprice及成就.xlsx
//   的「v2 正式Token清單」頁籤產生。定名、Token、參考數值與簡介文案
//   一律以試算表為單一真實來源 —— 不要手改這個檔案。
//
// 建材欄位：
//   id / name / en       程式代號與中英文顯示名
//   img                  擬真圖路徑。留空('')＝這一層不畫。
//                        間隔牆、層板、地板的素材尚未出圖，先留空；
//                        日後填上路徑就自動生效，程式完全不用改。
//   tokens               五面向 Token（COM / DUR / CST / SUS / OPS × 正負）
//   co2 / unit / life / price
//                        試算表的碳排係數／單位／使用年限／原始單價；
//                        加裝設備系統四項尚未提供（差異報告 §10-2）
//   needs                前置部位，該部位未選時不能選
//   desc                 資訊框的材質說明
//
// 部位欄位：
//   menu   選單標題
//   layer  圖層 z-index（複選部位＝起始層，往後遞增）
//          不給 layer ＝ 這個部位不產生圖層，選了畫面不會變
//   multi  可複選        gate   門檻部位，它沒選之前其餘部位一律不能選

// Token 顯示文字。
// ★ CST+ 是「便宜」不是「成本高」—— 代號很容易讀反，顯示文字務必寫白話。
const TOKENS = {
  'COM+': { text: '舒適',     kind: 'pro' }, 'COM-': { text: '不舒適',   kind: 'con' },
  'DUR+': { text: '耐久',     kind: 'pro' }, 'DUR-': { text: '不耐久',   kind: 'con' },
  'CST+': { text: '便宜',     kind: 'pro' }, 'CST-': { text: '較貴',     kind: 'con' },
  'SUS+': { text: '永續',     kind: 'pro' }, 'SUS-': { text: '不永續',   kind: 'con' },
  'OPS+': { text: '後續效益', kind: 'pro' }, 'OPS-': { text: '後續負擔', kind: 'con' },
};

// PARTS 的排列順序 = 左欄選單由上而下的順序（＝試算表的類別順序）
const PARTS = [
  {
    id: 'wall', name: '承重牆', en: 'Load-bearing Wall',
    menu: 'Choose load-bearing wall 選擇承重牆',
    gate: true, layer: 4,
    materials: [
      { id: 'concrete', name: '混凝土磚', en: 'Concrete Block',
        img: 'img/wall/concrete_block.webp', tokens: ['DUR+', 'CST+'],
        co2: 243.78, unit: 'kgCO2e/m3', life: 50, price: 4200,
        desc: '以水泥、砂與骨材製成的砌塊，質地厚重、耐火且承重穩定；孔隙與接縫需搭配適當的防水與隔熱設計。' },
      { id: 'brick', name: '紅磚', en: 'Clay Brick / Block',
        img: 'img/wall/blocks.webp', tokens: ['DUR+'],
        co2: 473.7, unit: 'kgCO2e/m3', life: 150, price: 15000,
        desc: '以黏土成形後高溫燒製的砌體，具有良好耐火性與蓄熱性，表面質樸；重量較高，施工需以砂漿逐塊砌築。' },
      { id: 'clt', name: '交叉層壓木', en: 'CLT',
        img: 'img/wall/clt.webp', tokens: ['COM+', 'SUS+', 'CST-'],
        co2: 214.3, unit: 'kgCO2e/m3', life: 60, price: 18500,
        desc: '將多層實木板以纖維方向交錯膠合而成的結構材，質量較輕、剛性佳且適合預製；木材仍需注意防潮與防火細節。' },
    ]
  },
  {
    id: 'partition', name: '間隔牆', en: 'Partition Wall',
    menu: 'Choose partition wall 選擇間隔牆',
    layer: 3,
    materials: [
      { id: 'plasterboard', name: '石膏板', en: 'Plasterboard',
        img: 'img/partition/plasterboard.webp', tokens: ['COM+', 'CST+', 'DUR-'],
        co2: 205.33, unit: 'kgCO2e/m3', life: 60, price: 6000,
        desc: '以石膏芯材搭配紙面製成的輕質板材，切割與乾式施工快速，表面平整易裝修；一般板材較怕水與強烈撞擊。' },
      { id: 'hemp', name: '工業麻混凝土', en: 'Hempcrete',
        img: 'img/partition/hemp.webp', tokens: ['COM+', 'DUR+', 'SUS+'],
        co2: -0.567, unit: 'kgCO2e/m3', life: 100, price: 15250,
        desc: '由工業麻芯與石灰系黏結料製成的多孔複合材，質量輕、具隔熱與調濕特性；通常作為非承重填充，需搭配結構骨架。' },
      { id: 'wpc', name: '合成木', en: 'Composite Wood / WPC',
        img: 'img/partition/wpc.webp', tokens: ['CST-', 'DUR-', 'SUS-'],
        co2: 71.93, unit: 'kgCO2e/m3', life: 25, price: 55500,
        desc: '由木粉或木纖維與塑膠混合成形，外觀近似木材，耐潮且尺寸一致；受溫度影響可能伸縮，複合結構也較難分離回收。' },
    ]
  },
  {
    id: 'slab', name: '層板', en: 'Floor Slab',
    menu: 'Choose floor slab 選擇層板',
    materials: [
      { id: 'clt', name: '交叉層壓木層板', en: 'CLT Slab',
        img: '', tokens: ['COM+', 'SUS+', 'CST-'],
        co2: 3260.1, unit: 'kgCO2e/層', life: 60, price: 281385,
        desc: '以交叉膠合的實木板構成樓層板，質量較輕、可預製並保留木質表面；接縫、振動、隔音與防潮需在系統設計中處理。' },
      { id: 'rc', name: '鋼筋混凝土層板', en: 'RC Slab',
        img: '', tokens: ['DUR+', 'CST+'],
        co2: 3632, unit: 'kgCO2e/層', life: 60, price: 81315,
        desc: '由鋼筋承受拉力、混凝土承受壓力的樓板系統，剛性、耐火與蓄熱能力佳；自重較大，通常需要模板與濕式施工。' },
    ]
  },
  {
    id: 'roof', name: '屋頂', en: 'Roof',
    menu: 'Choose roof 選擇屋頂',
    layer: 5,
    materials: [
      { id: 'warm', name: '溫頂屋', en: 'Warm Roof',
        img: 'img/roof/warm_roof.webp', tokens: ['COM+', 'DUR+', 'SUS+', 'CST-'],
        co2: 1325, unit: 'kgCO2e/件', life: 40, price: 94380,
        desc: '將連續保溫層設在屋面結構上方的多層屋頂系統，可減少熱橋並讓屋面結構維持較穩定溫度；防水層與節點施工十分重要。' },
      { id: 'metal', name: '金屬覆蓋屋', en: 'Metal Roof Overbuild',
        img: 'img/roof/metal_roof.webp', tokens: ['DUR+', 'CST+', 'SUS+', 'COM-'],
        co2: 613, unit: 'kgCO2e/件', life: 30, price: 54257,
        desc: '在既有屋頂上方加設輕質金屬覆面，能快速形成耐候外殼並利於排水；金屬導熱與傳聲明顯，需搭配隔熱、隔音與防結露層。' },
    ]
  },
  {
    id: 'floor', name: '地板', en: 'Flooring',
    menu: 'Choose flooring 選擇地板',
    layer: 2,
    materials: [
      { id: 'screed', name: '水泥平舖', en: 'Cement Screed (30mm)',
        img: '', tokens: ['DUR+', 'CST+', 'COM-'],
        co2: 10.98, unit: 'kgCO2e/m2', life: 50, price: 605,
        desc: '以水泥砂漿鋪設的整平層，可形成平整、硬實且無明顯接縫的表面；觸感偏冷硬，基層處理不當時可能產生裂紋。' },
      { id: 'ceramic', name: '陶瓷磚', en: 'Ceramic / Porcelain Tile',
        img: 'img/floor/ceramic.webp', tokens: ['DUR+', 'CST+', 'COM-'],
        co2: 15, unit: 'kgCO2e/m2', life: 50, price: 800,
        desc: '以黏土與礦物原料燒製的硬質板材，耐磨、易清潔且抗潮；表面與縫隙需注意防滑、填縫及局部破損問題。' },
      { id: 'stone', name: '大理石／花崗石／人造石', en: 'Marble / Granite / Engineered Stone',
        img: 'img/floor/stone.webp', tokens: ['DUR+', 'CST-', 'COM-'],
        co2: 3.68, unit: 'kgCO2e/m2', life: 50, price: 4200,
        desc: '天然石材或礦物與樹脂製成的人造石，質地緻密、紋理鮮明且耐磨；材料較重、腳感冷硬，部分石材需定期封護。' },
      { id: 'wood', name: '實木／超耐磨／海島型地板', en: 'Solid Wood',
        img: 'img/floor/wood.webp', tokens: ['COM+', 'SUS+', 'DUR-'],
        co2: 4.56, unit: 'kgCO2e/m2', life: 25, price: 1500,
        desc: '包含實木、表面耐磨層地板與多層木質複合板，具有溫潤外觀與較柔和腳感；各類結構不同，但普遍需控制潮濕與刮磨。' },
      { id: 'pvc', name: '塑膠地板', en: 'PVC / SPC / LVT',
        img: 'img/floor/pvc.webp', tokens: ['CST+', 'DUR-', 'SUS-'],
        co2: 22.5, unit: 'kgCO2e/m2', life: 15, price: 605,
        desc: '以塑膠或石塑複合芯材製成的多層地板，花色多、耐潮且易清潔；腳感、尺寸穩定性與可修復性會隨產品結構而異。' },
      { id: 'epoxy', name: '自流平地坪', en: 'Epoxy / PU Self-leveling',
        img: '', tokens: ['CST+', 'DUR-', 'COM-'],
        co2: 6, unit: 'kgCO2e/m2', life: 10, price: 1000,
        desc: '將環氧樹脂或聚氨酯塗料流平成連續地坪，表面無縫、易清潔並可耐磨耐化學品；基層含水與施工品質會影響附著及裂損。' },
      { id: 'carpet', name: '捲毯／方塊毯／羊毛毯', en: 'Broadloom / Carpet Tile / Wool',
        img: 'img/floor/carpet.webp', tokens: ['COM+', 'DUR-', 'SUS-'],
        co2: 24.1, unit: 'kgCO2e/m2', life: 15, price: 1800,
        desc: '由羊毛或合成纖維表層搭配背材構成，觸感柔軟並能吸音保溫；較易累積灰塵與污漬，方塊毯則可局部拆換。' },
    ]
  },
  {
    id: 'extra', name: '加裝設備系統', en: 'Additional Equipment',
    menu: 'Choose additional equipment systems 選擇加裝設備系統',
    multi: true, layer: 6,
    materials: [
      { id: 'solar', name: '太陽能板', en: 'Solar Panel',
        img: 'img/extra/solar_panel.webp', tokens: ['SUS+', 'CST-', 'OPS+'],
        co2: null, unit: '', life: null, price: null,   // 試算表未提供（差異報告 §10-2）
        needs: 'roof',
        desc: '由光伏電池與封裝玻璃、背板組成的模組，可把日照轉換成電力；發電表現受日照、朝向、遮蔭與系統配置影響。' },
      { id: 'skyvent', name: '採光井及通風扇', en: 'Skylight & Ventilation Fan',
        img: 'img/extra/sky_vent.webp', tokens: ['COM+', 'CST-'],
        co2: null, unit: '', life: null, price: null,   // 試算表未提供（差異報告 §10-2）
        needs: 'roof',
        desc: '由屋頂採光開口與機械通風設備組成，可引入自然光並排出熱氣、濕氣與室內污濁空氣；需重視防水、氣密與噪音控制。' },
      { id: 'window', name: '落地窗及隔熱貼', en: 'Floor-to-ceiling Window & Insulation Film',
        img: 'img/extra/floor_window.webp', tokens: ['COM+', 'SUS+', 'CST-'],
        co2: null, unit: '', life: null, price: null,   // 試算表未提供（差異報告 §10-2）
        desc: '以大面積玻璃擴大採光與視野，隔熱貼可調節部分日射與熱傳；玻璃規格、氣密、遮陽及防撞安全會影響實際表現。' },
      { id: 'microgrid', name: '微型電網系統', en: 'Microgrid System',
        img: 'img/extra/microgrid.webp', tokens: ['SUS+', 'CST-', 'OPS+'],
        co2: null, unit: '', life: null, price: null,   // 試算表未提供（差異報告 §10-2）
        desc: '整合在地發電、儲能、用電設備與控制系統的小型能源網路，可協調供需並提升備援能力；需完善保護、通訊與能源管理。' },
    ]
  },
];

// ── 五芒星的五個面向 ─────────────────────────────────────
// 排列順序 = 雷達圖由正上方順時針，與客戶手繪圖
// doc/img/新增 點陣圖影像.bmp 的軸標一致。
//
//   token: 'DUR' → 數全屋 DUR+ 與 DUR- 的淨值
//   rank:  'co2' → 各部位在「同類別內」的碳排名次（低碳＝高分）再平均
//
// ⚠️ 環境影響與經濟性的最終版本應改查 252 組合表的碳排檔位與價格檔位
//    （差異報告 §5-2）—— 那才有跨部位相加的物理意義。
//    碳排在此先用同類別名次，理由與試算表把 CST 定義為「同類別內比價」一致；
//    加裝設備系統沒有碳排數值，不計入平均。
const AXES = [
  { key: 'env',  label: '環境影響', rank: 'co2' },
  { key: 'cost', label: '經濟性',   token: 'CST' },
  { key: 'dur',  label: '耐久性',   token: 'DUR' },
  { key: 'sus',  label: '永續性',   token: 'SUS' },
  { key: 'com',  label: '舒適性',   token: 'COM' },
];

// Token 淨值換算成 0～1 的刻度：0.5 = 正負相抵，±AXIS_SPAN 個 token 打到底
const AXIS_SPAN = 4;
