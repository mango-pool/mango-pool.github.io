// ── 綠建築換皮 — 遊戲邏輯 ────────────────────────────────
// 邏輯固定、內容在 data.js / achievements.js（規格核心：內容與邏輯分離）

// 每個部位目前選了哪個建材
//   單選部位（外牆、屋頂）→ 存字串，null = 未選擇
//   複選部位（額外設備，data.js 標 multi:true）→ 存陣列，[] = 未選擇
const selection = { roof: null, wall: null, extra: [] };

// 初始：三個部位皆「未選擇」→ 畫面只顯示 base.webp
const DEFAULT = { roof: null, wall: null, extra: [] };

let lastPicked = null; // 最近點選的建材（給資訊框顯示用）

// 快速查表
function getPart(partId) { return PARTS.find(p => p.id === partId); }
function getMat(partId, matId) {
  const p = getPart(partId);
  return p ? p.materials.find(m => m.id === matId) || null : null;
}

// ── 單選／複選共用的存取層 ────────────────────────────────
// 其餘程式一律透過這三個函式讀取選擇，就不必到處判斷是字串還是陣列
function isMulti(partId) { return !!getPart(partId)?.multi; }

// 這個部位目前選了哪些建材（一律回傳陣列，未選則為空陣列）
function pickedMats(partId) {
  const v = selection[partId];
  const ids = isMulti(partId) ? v : (v ? [v] : []);
  return ids.map(id => getMat(partId, id)).filter(Boolean);
}

// 這個建材是否已被選中
function isPicked(partId, matId) {
  const v = selection[partId];
  return isMulti(partId) ? v.includes(matId) : v === matId;
}

// 把某部位清成「未選擇」
function clearPart(partId) { selection[partId] = isMulti(partId) ? [] : null; }

// 這個部位有沒有選任何東西
function hasPick(partId) { return pickedMats(partId).length > 0; }

// 某部位被清空 → 把「依賴它」的建材一併取消（needs 欄位由 data.js 宣告）
function clearDependents(partId) {
  for (const part of PARTS) {
    for (const m of part.materials) {
      if (m.needs !== partId || !isPicked(part.id, m.id)) continue;
      if (isMulti(part.id)) selection[part.id] = selection[part.id].filter(x => x !== m.id);
      else selection[part.id] = null;
    }
  }
}

// ── 啟動 ───────────────────────────────────────────────
async function init() {
  PHOTO_MODE = await detectPhotoMode();
  document.getElementById('house-photo').hidden = !PHOTO_MODE;

  buildMenus();
  buildExtraLayers();
  for (const p of PARTS) {
    selection[p.id] = isMulti(p.id) ? [...DEFAULT[p.id]] : DEFAULT[p.id];
  }
  lastPicked = null;
  renderAll();
}

// ── 建立左右選單（依 data.js 自動生成）─────────────────────
function buildMenus() {
  for (const part of PARTS) {
    const box = document.getElementById('menu-' + part.id);
    box.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'menu-title';
    title.textContent = part.menu;
    box.appendChild(title);

    // 「未選擇」選項（複選部位＝一次清空全部）
    box.appendChild(makeItem(part, null, '未選擇'));
    // 各建材
    for (const m of part.materials) {
      box.appendChild(makeItem(part, m, m.en ? `${m.name}（${m.en}）` : m.name));
    }
  }
}

function makeItem(part, mat, label) {
  const el = document.createElement('button');
  el.className = 'menu-item' + (part.multi && mat ? ' multi' : '');
  el.dataset.part = part.id;
  el.dataset.mat = mat ? mat.id : '';
  el.textContent = label;
  el.addEventListener('click', () => select(part.id, mat ? mat.id : null, true));
  return el;
}

// 複選部位的圖層：每個建材各產生一張 <img>
//   z-index 依 data.js 的排列順序遞增（4, 5, 6…），所以「排越後面＝疊越上層」
function buildExtraLayers() {
  const stack = document.getElementById('house-photo');
  for (const part of PARTS) {
    if (!part.multi) continue;
    part.materials.forEach((m, i) => {
      const img = document.createElement('img');
      img.className = 'layer';
      img.id = `img-${part.id}-${m.id}`;
      img.alt = '';
      img.hidden = true;
      img.style.zIndex = 4 + i;   // 一律疊在屋頂（z3）之上
      if (m.img) img.src = m.img;
      stack.appendChild(img);
    });
  }
}

// 提醒訊息（顯示於中央資訊框，選到有效建材後自動清除）
let warning = '';

// ── 選擇一個建材（換皮核心）──────────────────────────────
function select(partId, matId, doRender) {
  // 前提檢查（阻擋時不改變任何選擇）
  if (matId) {
    // 主要建材（外牆）未選時，不能選屋頂與額外設備
    if (partId !== 'wall' && !selection.wall) {
      warning = '請先選擇主要建材';
      if (doRender) renderAll();
      return;
    }
    // 建材宣告了 needs（例如太陽能板、採光井裝在屋頂上），該部位未選就不能選
    const need = getMat(partId, matId)?.needs;
    if (need && !hasPick(need)) {
      warning = `請先選擇${getPart(need).name}`;
      if (doRender) renderAll();
      return;
    }
  }

  warning = '';

  let turnedOff = false;
  if (isMulti(partId)) {
    if (!matId) {
      clearPart(partId);            // 按「未選擇」＝一次清空全部
      turnedOff = true;
    } else if (selection[partId].includes(matId)) {
      selection[partId] = selection[partId].filter(x => x !== matId);   // 再按一次＝取消
      turnedOff = true;
    } else {
      // 依 data.js 的順序插入，讓疊圖與計票順序穩定
      const order = getPart(partId).materials.map(m => m.id);
      selection[partId] = [...selection[partId], matId]
        .sort((a, b) => order.indexOf(a) - order.indexOf(b));
    }
  } else {
    selection[partId] = matId;
    turnedOff = !matId;
  }

  // 主要建材改回「未選擇」→ 屋頂與額外設備一併清空（房子主體都沒了）
  if (partId === 'wall' && !matId) {
    clearPart('roof');
    clearPart('extra');
  }
  // 某部位改回「未選擇」→ 依賴它的建材一併取消（屋頂沒了，太陽能板與採光井也留不住）
  if (!hasPick(partId)) clearDependents(partId);

  // 資訊框：選上→顯示該建材；取消單一項→說清楚取消的是哪一項；清空整個部位→未選擇
  const partName = getPart(partId).name;
  if (matId && !turnedOff) {
    lastPicked = getMat(partId, matId);
  } else if (matId && isMulti(partId)) {
    lastPicked = { name: `已取消 ${getMat(partId, matId).name}`, en: '', pros: [], cons: [],
                   _empty: true, partName, _partial: pickedMats(partId).length };
  } else {
    lastPicked = { name: '未選擇', en: '', pros: [], cons: [], _empty: true, partName };
  }
  if (doRender) renderAll();
}

// ── 重繪整個畫面 ───────────────────────────────────────
function renderAll() {
  renderHouse();
  renderMenuHighlight();
  renderInfo();
  renderTally();
  renderAchievements();
}

// 有沒有擬真圖可用？（img/base.webp 存在就切到圖片模式）
let PHOTO_MODE = false;

function detectPhotoMode() {
  return new Promise(resolve => {
    const probe = new Image();
    probe.onload  = () => resolve(true);
    probe.onerror = () => resolve(false);
    probe.src = 'img/base.webp';   // 背景空地圖存在 → 進擬真模式
  });
}

// 房子換皮（擬真圖）
//    圖層由下而上：z0 背景空地 → z1 房子主體 → z2 外牆 → z3 屋頂 → z4 額外設備
//    所有圖已統一對位到 2436x1524 的同一座標系。
function renderHouse() {
  // z0 背景空地：永遠顯示（img/base.webp，寫在 HTML 裡不需更動）

  // z1 房子主體 + z2 外牆材質：選了主要建材才出現
  const wallMat = getMat('wall', selection.wall);
  const houseEl = document.getElementById('img-house');
  const wallEl  = document.getElementById('img-wall');
  if (wallMat) {
    houseEl.hidden = false;                       // 疊上 base house.webp
    if (wallMat.img) { wallEl.src = wallMat.img; wallEl.hidden = false; }
    else { wallEl.hidden = true; }
  } else {
    houseEl.hidden = true;                        // 未選建材 → 只剩空地
    wallEl.hidden = true;
  }

  // z4 以上 額外設備（可複選）：每項各一層，已對位到與屋頂相同的座標系
  //   沒有圖的建材（例如尚未出圖的區域電網）仍可被選取，只是畫面上不出現
  for (const part of PARTS) {
    if (!part.multi) continue;
    for (const m of part.materials) {
      const el = document.getElementById(`img-${part.id}-${m.id}`);
      if (el) el.hidden = !(m.img && isPicked(part.id, m.id));
    }
  }

  // 屋頂：疊在整棟底圖上
  //   ⚠️ 底圖已自帶灰色平屋頂，目前只有「鐵皮加蓋」有圖，選它才會蓋上去。
  const roofEl = document.getElementById('img-roof');
  const roofMat = getMat('roof', selection.roof);
  if (roofEl) {
    if (roofMat && roofMat.img) { roofEl.src = roofMat.img; roofEl.hidden = false; }
    else { roofEl.hidden = true; }
  }

  syncLens();   // 所有圖層都定案後，才把鏡片內容同步過去
}

// 選單「已選」highlight ＋ 未選主要建材時鎖住其他選單
function renderMenuHighlight() {
  document.querySelectorAll('.menu-item').forEach(el => {
    const part = el.dataset.part, mat = el.dataset.mat;
    // 「未選擇」那一列：該部位完全沒選東西才亮起
    const on = mat ? isPicked(part, mat) : pickedMats(part).length === 0;
    el.classList.toggle('selected', on);
    // 前置條件還沒滿足的單項（例如屋頂未選時的太陽能板）呈停用外觀
    const need = mat ? getMat(part, mat)?.needs : null;
    el.classList.toggle('need-unmet', !!need && !hasPick(need));
  });
  // 主要建材未選 → 屋頂與額外設備選單呈停用外觀
  const locked = !selection.wall;
  ['menu-roof', 'menu-extra'].forEach(id => {
    document.getElementById(id)?.classList.toggle('locked', locked);
  });
}

// 中央資訊框：顯示最近點選的建材，或提醒訊息
function renderInfo() {
  const nameEl = document.getElementById('info-name');
  const box = document.getElementById('info-tokens');

  // 有提醒時優先顯示（紅字）
  if (warning) {
    nameEl.textContent = '⚠️ ' + warning;
    nameEl.classList.add('warn');
    box.innerHTML = '<span class="muted">主要建材是房子的主體，請先選定後再挑屋頂與額外設備。</span>';
    return;
  }
  nameEl.classList.remove('warn');

  const m = lastPicked;
  if (!m) {                       // 開場：還沒點過任何東西
    nameEl.textContent = '—';
    box.innerHTML = '<span class="muted">從左側選單開始，先選主要建材</span>';
    return;
  }
  nameEl.textContent =
    m._empty ? `${m.partName}：${m.name}` : (m.en ? `${m.name}（${m.en}）` : m.name);
  box.innerHTML = '';
  if (m._empty) {
    box.innerHTML = m._partial
      ? `<span class="muted">此部位還選著 ${m._partial} 項</span>`
      : '<span class="muted">此部位空著，不計 token</span>';
    return;
  }
  m.pros.forEach(t => box.appendChild(chip(t, 'pro')));
  m.cons.forEach(t => box.appendChild(chip(t, 'con')));
}

function chip(text, kind) {
  const s = document.createElement('span');
  s.className = 'tok ' + kind;
  s.textContent = text;
  return s;
}

// 整棟房子累計：比例條 ＋ 性質標籤
//   舊版是兩條各自對上限（pros 上限 15、cons 上限 11），刻度不同卻並排，
//   會出現「好處 9 比壞處 7 多，紅條卻更高」。改成比例後不需要上限。
function renderTally() {
  const pros = new Map(), cons = new Map();
  const bump = (map, t) => map.set(t, (map.get(t) || 0) + 1);
  for (const part of PARTS) {
    for (const m of pickedMats(part.id)) {
      m.pros.forEach(t => bump(pros, t));
      m.cons.forEach(t => bump(cons, t));
    }
  }
  const sum = map => [...map.values()].reduce((s, v) => s + v, 0);
  const nPros = sum(pros), nCons = sum(cons), total = nPros + nCons;

  document.getElementById('num-pros').textContent = nPros;
  document.getElementById('num-cons').textContent = nCons;
  document.getElementById('ratio-pros').style.width = total ? nPros / total * 100 + '%' : '0';
  document.getElementById('ratio-cons').style.width = total ? nCons / total * 100 + '%' : '0';

  // 同一個性質重複出現就標 ×N，讓「重複」看得見，而不是藏在總數裡
  const box = document.getElementById('sum-toks');
  box.innerHTML = '';
  if (!total) {
    box.innerHTML = '<span class="muted">還沒有選任何建材</span>';
    return;
  }
  for (const [map, kind] of [[pros, 'pro'], [cons, 'con']]) {
    if (!map.size) continue;
    const row = document.createElement('div');
    row.className = 'tok-row';
    // 數量多的排前面：節能×4 比「輕」更能說明這棟房子的特性
    for (const [t, n] of [...map].sort((a, b) => b[1] - a[1]))
      row.appendChild(chip(n > 1 ? `${t} ×${n}` : t, kind));
    box.appendChild(row);
  }
}

// 把 rule.contains 的每一項翻成一顆標籤：{ 顯示文字, 是否已滿足 }
//   直接由 rule 生成 → 規則改了清單會跟著改，不會對不上
function achvConds(a, owned) {
  return (a.rule.contains || []).map(key => {
    const [pid, mid] = key.split(':');
    const m = getMat(pid, mid);
    return { text: m ? m.name : `${key}（未實作）`, met: owned.has(key) };
  });
}

// ── 成就判定 ───────────────────────────────────────────
function renderAchievements() {
  // 目前全屋已選的 "part:material" 集合
  const owned = new Set();
  let anySelected = false;
  for (const part of PARTS) {
    for (const m of pickedMats(part.id)) { owned.add(part.id + ':' + m.id); anySelected = true; }
  }

  const list = document.getElementById('achv-list');
  list.innerHTML = '';
  let unlocked = 0;

  for (const a of ACHIEVEMENTS) {
    let ok = false;
    if (a.rule.allEmpty) ok = !anySelected;
    else if (a.rule.contains) ok = a.rule.contains.every(x => owned.has(x));

    if (ok) unlocked++;
    const row = document.createElement('div');
    row.className = 'achv' + (ok ? ' got' : '') + (a.tbd ? ' tbd' : '');

    const conds = achvConds(a, owned);
    const done = conds.filter(c => c.met).length;

    // 標題列：圖示 ＋ 名稱 ＋（未解鎖且需多項時）進度計數
    let html =
      `<div class="achv-head">` +
      `<span class="achv-ic">${ok ? '🏆' : '🔒'}</span>` +
      `<span class="achv-name">${a.name}${a.tbd ? ' <span class="tag">TBD</span>' : ''}` +
      (a.en ? `<span class="achv-en">${a.en}</span>` : '') + `</span>` +
      (!ok && conds.length > 1 ? `<span class="achv-count">${done} / ${conds.length}</span>` : '') +
      `</div>`;

    // 條件清單：只在「還沒達成」時展開；已達成的收起來，省版面
    if (!ok) {
      html += a.rule.allEmpty
        ? `<div class="achv-cond"><span class="cond plain">三個部位都維持「未選擇」</span></div>`
        : `<div class="achv-cond">` +
          conds.map(c => `<span class="cond${c.met ? ' met' : ''}">${c.met ? '✓ ' : ''}${c.text}</span>`).join('') +
          `</div>`;
    }

    row.innerHTML = html;
    list.appendChild(row);
  }
  document.getElementById('achv-count').textContent = `${unlocked} / ${ACHIEVEMENTS.length}`;
}

// ── 放大鏡 ─────────────────────────────────────────────
//   原圖 2612px 在畫面上顯示成約 703px（縮小 3.72×），所以放大 3× 仍在
//   原生解析度內 —— 看到的是真實細節，不是模糊的放大。
//
//   鏡片內容 = 整個圖層堆疊的複本。用 innerHTML 整份複製而不是逐層維護，
//   好處是日後 data.js 新增任何建材，鏡片自動跟上，不必改這裡。
//   （hidden / src / z-index 都是會反映到 HTML 屬性的，複製得過去）
const LENS_SIZE = 220;    // 鏡片直徑（px）
const LENS_ZOOM = 3;      // 放大倍率，上限約 3.7× 再高就會糊

let lensOn = true;        // 開關（右上角按鈕）
let lensPinned = false;   // 觸控模式：點一下釘住，再點一下收起

function syncLens() {
  const inner = document.getElementById('lens-inner');
  if (!inner) return;
  inner.innerHTML = document.getElementById('house-photo').innerHTML;
}

function lensMoveTo(clientX, clientY) {
  const lens  = document.getElementById('lens');
  const inner = document.getElementById('lens-inner');
  const wrap  = document.querySelector('.house-wrap');
  const photo = document.getElementById('house-photo');
  const pb = photo.getBoundingClientRect(), wb = wrap.getBoundingClientRect();

  // 游標在圖片內的座標
  const px = clientX - pb.left, py = clientY - pb.top;
  if (px < 0 || py < 0 || px > pb.width || py > pb.height) { lensHide(); return; }

  // 絕對定位是以 padding box 為基準，getBoundingClientRect 給的是 border box，
  // 用 clientLeft/clientTop 扣掉邊框寬度才會完全對齊
  lens.hidden = false;
  lens.style.left = (clientX - wb.left - wrap.clientLeft - LENS_SIZE / 2) + 'px';
  lens.style.top  = (clientY - wb.top  - wrap.clientTop  - LENS_SIZE / 2) + 'px';

  // 內層是放大後的整張圖，平移讓游標指到的點落在鏡片正中央
  inner.style.width = (pb.width * LENS_ZOOM) + 'px';
  inner.style.left  = (LENS_SIZE / 2 - px * LENS_ZOOM) + 'px';
  inner.style.top   = (LENS_SIZE / 2 - py * LENS_ZOOM) + 'px';
}

function lensHide() {
  const lens = document.getElementById('lens');
  if (lens) lens.hidden = true;
  lensPinned = false;
}

function initLens() {
  const photo  = document.getElementById('house-photo');
  const toggle = document.getElementById('lens-toggle');
  const hint   = document.getElementById('lens-hint');
  if (!photo || !toggle) return;

  // 觸控裝置沒有 hover，改成點一下放大；提示文字跟著換
  const touch = matchMedia('(hover: none)').matches;
  hint.textContent = touch ? '點一下放大' : '滑過放大';

  toggle.addEventListener('click', () => {
    lensOn = !lensOn;
    toggle.classList.toggle('off', !lensOn);
    if (!lensOn) lensHide();
  });

  // 滑鼠：移到哪、鏡片跟到哪
  photo.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !lensOn) return;
    lensMoveTo(e.clientX, e.clientY);
  });
  photo.addEventListener('pointerleave', e => {
    if (e.pointerType === 'mouse') lensHide();
  });

  // 觸控：點一下釘在該處，點同一處附近再收起
  photo.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || !lensOn) return;
    const lens = document.getElementById('lens');
    if (lensPinned && !lens.hidden) {
      const b = lens.getBoundingClientRect();
      const near = Math.hypot(e.clientX - (b.left + b.width / 2),
                              e.clientY - (b.top + b.height / 2)) < LENS_SIZE / 2;
      if (near) { lensHide(); return; }        // 點在鏡片上 → 收起
    }
    lensPinned = true;
    lensMoveTo(e.clientX, e.clientY);
  });

  // 捲動或視窗縮放後座標會跑掉，直接收起比較不會出錯
  addEventListener('scroll', lensHide, { passive: true });
  addEventListener('resize', lensHide);
}

window.addEventListener('DOMContentLoaded', () => { init(); initLens(); });
