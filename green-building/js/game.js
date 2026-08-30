// ── 綠建築換皮 — 遊戲邏輯 ────────────────────────────────
// 邏輯固定、內容在 data.js / achievements.js（規格核心：內容與邏輯分離）
//
// 兩頁式流程：
//   第一頁（施工）選建材 → 按「送出設計」→ 第二頁（結算）看評估與成就
//   → 按「再蓋一棟」→ 回第一頁，選擇清空、但已解鎖的成就保留
//
// 成就只在「送出設計」時判定一次，且不顯示解鎖條件 —— 玩家要自己摸索。

// 每個部位目前選了哪個建材（由 init() 依 data.js 的 PARTS 建立）
//   單選部位 → 存字串，null = 未選擇
//   複選部位（data.js 標 multi:true）→ 存陣列，[] = 未選擇
const selection = {};

let lastPicked = null;   // 最近點選的建材（給第一頁資訊框顯示用）
let warning = '';        // 提醒訊息（選到有效建材後自動清除）

// 送出設計後的結算結果；null = 還沒送出過
let result = null;       // { unlockedNow: Set<成就名> }

// 已解鎖成就的永久紀錄（跨場次累積，「再蓋一棟」不會清掉）
const SAVE_KEY = 'greenhouse.achievements';

// 快速查表
function getPart(partId) { return PARTS.find(p => p.id === partId); }
function getMat(partId, matId) {
  const p = getPart(partId);
  return p ? p.materials.find(m => m.id === matId) || null : null;
}

// 門檻部位（data.js 標 gate:true）：它沒選之前，其餘部位一律不能選
function gatePart() { return PARTS.find(p => p.gate) || null; }

// ── 單選／複選共用的存取層 ────────────────────────────────
// 其餘程式一律透過這幾個函式讀取選擇，就不必到處判斷是字串還是陣列
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

// 全屋已選的 "part:material" 集合
function ownedSet() {
  const owned = new Set();
  for (const part of PARTS)
    for (const m of pickedMats(part.id)) owned.add(part.id + ':' + m.id);
  return owned;
}

// ── 啟動 ───────────────────────────────────────────────
async function init() {
  PHOTO_MODE = await detectPhotoMode();
  document.getElementById('house-photo').hidden = !PHOTO_MODE;

  buildMenus();
  buildLayers();
  resetSelection();
  showPage('build');
}

// 把所有部位清成「未選擇」
function resetSelection() {
  for (const p of PARTS) clearPart(p.id);
  lastPicked = null;
  warning = '';
}

// ── 建立選單（依 data.js 自動生成，加部位不必改 HTML）──────
function buildMenus() {
  const host = document.getElementById('menus');
  host.innerHTML = '';

  for (const part of PARTS) {
    const box = document.createElement('div');
    box.className = 'menu';
    box.id = 'menu-' + part.id;

    const title = document.createElement('div');
    title.className = 'menu-title';
    title.textContent = part.menu;
    // 沒有 layer 的部位選了畫面不會變（素材未到位），要講清楚，
    // 否則玩家點了七種地板都長一樣，會當成壞掉
    if (part.layer == null) {
      const tag = document.createElement('span');
      tag.className = 'menu-tag';
      tag.textContent = '畫面不顯示';
      title.appendChild(tag);
    }
    box.appendChild(title);


    // 「未選擇」選項（複選部位＝一次清空全部）
    box.appendChild(makeItem(part, null, '未選擇'));
    // 各建材
    for (const m of part.materials) {
      box.appendChild(makeItem(part, m, m.en ? `${m.name}（${m.en}）` : m.name));
    }
    host.appendChild(box);
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

// ── 建立圖層（依 data.js 的 layer 欄位自動生成）─────────────
//   單選部位 → 一張 <img id="img-{part}">，z-index = part.layer
//   複選部位 → 每個建材各一張 <img id="img-{part}-{mat}">，z-index 由 part.layer 起算遞增
//   沒有 layer 的部位不產生圖層（畫面上看不到的室內構造，例如地板、隔間牆）
function buildLayers() {
  const stack = document.getElementById('house-photo');
  for (const part of PARTS) {
    if (part.layer == null) continue;
    if (part.multi) {
      // 複選：每個建材固定一層，src 在這裡就定下來，之後 renderHouse 只切 hidden
      part.materials.forEach((m, i) =>
        stack.appendChild(makeLayer(`img-${part.id}-${m.id}`, part.layer + i, m.img)));
    } else {
      // 單選：整個部位共用一層，src 由 renderHouse 依當前選到的建材替換
      stack.appendChild(makeLayer(`img-${part.id}`, part.layer));
    }
  }
}

function makeLayer(id, z, src) {
  const img = document.createElement('img');
  img.className = 'layer';
  img.id = id;
  img.alt = '';
  img.hidden = true;
  img.style.zIndex = z;
  if (src) img.src = src;     // 沒有圖的建材仍可被選取，只是畫面上不出現
  return img;
}

// ── 選擇一個建材（換皮核心）──────────────────────────────
function select(partId, matId, doRender) {
  const gate = gatePart();

  // 前提檢查（阻擋時不改變任何選擇）
  if (matId) {
    // 門檻部位（承重牆）未選時，不能選其他部位
    if (gate && partId !== gate.id && !hasPick(gate.id)) {
      warning = `請先選擇${gate.name}`;
      if (doRender) renderBuild();
      return;
    }
    // 建材宣告了 needs（例如太陽能板、採光井裝在屋頂上），該部位未選就不能選
    const need = getMat(partId, matId)?.needs;
    if (need && !hasPick(need)) {
      warning = `請先選擇${getPart(need).name}`;
      if (doRender) renderBuild();
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

  // 門檻部位改回「未選擇」→ 其餘部位一併清空（房子主體都沒了）
  if (gate && partId === gate.id && !matId) {
    for (const p of PARTS) if (p.id !== gate.id) clearPart(p.id);
  }
  // 某部位改回「未選擇」→ 依賴它的建材一併取消（屋頂沒了，太陽能板與採光井也留不住）
  if (!hasPick(partId)) clearDependents(partId);

  // 資訊框：選上→顯示該建材；取消單一項→說清楚取消的是哪一項；清空整個部位→未選擇
  const partName = getPart(partId).name;
  if (matId && !turnedOff) {
    lastPicked = getMat(partId, matId);
  } else if (matId && isMulti(partId)) {
    lastPicked = { name: `已取消 ${getMat(partId, matId).name}`, en: '', tokens: [],
                   _empty: true, partName, _partial: pickedMats(partId).length };
  } else {
    lastPicked = { name: '未選擇', en: '', tokens: [], _empty: true, partName };
  }
  if (doRender) renderBuild();
}

// ── 頁面切換 ───────────────────────────────────────────
//   兩個 <main> 切 hidden 即可，不需要路由
function showPage(which) {
  document.getElementById('page-build').hidden  = which !== 'build';
  document.getElementById('page-result').hidden = which !== 'result';
  scrollTo(0, 0);
  if (which === 'build') renderBuild(); else renderResult();
}

// 送出設計 → 結算
//   ⚠️ 不檢查「有沒有選東西」—— 全部維持未選擇正是「大地主」的解鎖條件
function submitDesign() {
  lensHide();
  result = settle();
  showPage('result');
}

// 再蓋一棟 → 選擇清空，已解鎖的成就保留
function restart() {
  resetSelection();
  result = null;
  showPage('build');
}

// ── 第一頁重繪 ─────────────────────────────────────────
function renderBuild() {
  renderHouse();
  renderMenuHighlight();
  renderInfo();
  renderProgress();
}

// 有沒有擬真圖可用？（img/site.webp 存在就切到圖片模式）
let PHOTO_MODE = false;

function detectPhotoMode() {
  return new Promise(resolve => {
    const probe = new Image();
    probe.onload  = () => resolve(true);
    probe.onerror = () => resolve(false);
    probe.src = 'img/site.webp';   // 基地背景圖存在 → 進擬真模式
  });
}

// 房子換皮（擬真圖）
//    圖層由下而上：z0 背景空地 → z1 房子主體 → z2 以上由 data.js 的 layer 決定
//    所有圖已統一對位到 2436x1524 的同一座標系。
//    ★ 這裡完全走 PARTS 迴圈 —— 新增部位只要在 data.js 給 layer 與 img 路徑就會出現，
//      素材還沒出圖時 img 留空，該層就不畫，程式不用改。
function renderHouse() {
  // z1 房子主體：選了門檻部位才出現（未選 → 只剩基地 site.webp）
  const gate = gatePart();
  document.getElementById('img-house').hidden = !(gate && hasPick(gate.id));

  for (const part of PARTS) {
    if (part.layer == null) continue;
    if (part.multi) {
      // 複選：每個建材各一層，選到且有圖才顯示
      for (const m of part.materials) {
        const el = document.getElementById(`img-${part.id}-${m.id}`);
        if (el) el.hidden = !(m.img && isPicked(part.id, m.id));
      }
    } else {
      // 單選：一層共用，換建材就換 src
      const el = document.getElementById(`img-${part.id}`);
      if (!el) continue;
      const mat = pickedMats(part.id)[0];
      if (mat && mat.img) { el.src = mat.img; el.hidden = false; }
      else el.hidden = true;
    }
  }

  syncLens();   // 所有圖層都定案後，才把鏡片內容同步過去
}

// 選單「已選」highlight ＋ 門檻部位未選時鎖住其他選單
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

  // 門檻部位未選 → 其餘選單全部呈停用外觀
  const gate = gatePart();
  const locked = !!gate && !hasPick(gate.id);
  for (const part of PARTS) {
    const box = document.getElementById('menu-' + part.id);
    if (box) box.classList.toggle('locked', locked && (!gate || part.id !== gate.id));
  }
}

// 中央資訊框：顯示最近點選的建材，或提醒訊息
function renderInfo() {
  const nameEl = document.getElementById('info-name');
  const box = document.getElementById('info-tokens');
  const gate = gatePart();

  // 有提醒時優先顯示（紅字）
  if (warning) {
    nameEl.textContent = '⚠️ ' + warning;
    nameEl.classList.add('warn');
    box.innerHTML = `<span class="muted">${gate ? gate.name : '承重牆'}是房子的主體，請先選定後再挑其他部位。</span>`;
    return;
  }
  nameEl.classList.remove('warn');

  const m = lastPicked;
  if (!m) {                       // 開場：還沒點過任何東西
    nameEl.textContent = '—';
    box.innerHTML = `<span class="muted">從左側選單開始，先選${gate ? gate.name : '承重牆'}</span>`;
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
  for (const code of m.tokens || []) {
    const t = TOKENS[code];
    if (t) box.appendChild(chip(t.text, t.kind));
  }
  if (m.desc) {
    const d = document.createElement('p');
    d.className = 'info-desc';
    d.textContent = m.desc;
    box.appendChild(d);
  }
}

function chip(text, kind) {
  const s = document.createElement('span');
  s.className = 'tok ' + kind;
  s.textContent = text;
  return s;
}

// ── 好處／壞處統計（兩頁共用）───────────────────────────
//   Token 依 data.js 的 TOKENS 分成 pro / con 兩堆，各自用「顯示文字」計數。
//   比例條用比例而不是絕對上限，所以不會出現「好處比壞處多、紅條卻更高」。
function tally() {
  const pros = new Map(), cons = new Map();
  const counts = new Map();          // 原始代號 → 次數，給五芒星用
  for (const part of PARTS) {
    for (const m of pickedMats(part.id)) {
      for (const code of m.tokens || []) {
        counts.set(code, (counts.get(code) || 0) + 1);
        const t = TOKENS[code];
        if (!t) continue;            // 資料有錯字時略過，不要整頁壞掉
        const map = t.kind === 'pro' ? pros : cons;
        map.set(t.text, (map.get(t.text) || 0) + 1);
      }
    }
  }
  const sum = map => [...map.values()].reduce((s, v) => s + v, 0);
  return { pros, cons, counts, nPros: sum(pros), nCons: sum(cons) };
}

// 把統計畫成一條比例條（兩頁的元素 id 前綴不同，所以傳進來）
function paintRatio(t, idPros, idCons, idBarPros, idBarCons) {
  const total = t.nPros + t.nCons;
  document.getElementById(idPros).textContent = t.nPros;
  document.getElementById(idCons).textContent = t.nCons;
  document.getElementById(idBarPros).style.width = total ? t.nPros / total * 100 + '%' : '0';
  document.getElementById(idBarCons).style.width = total ? t.nCons / total * 100 + '%' : '0';
  return total;
}

// 第一頁的簡版即時評估：完成度 ＋ 好壞比例條
//   完整的分項標籤留到第二頁，才有結算的意義。
//   完成度在這裡特別重要 —— 成就條件已經藏起來、五芒星也移到第二頁，
//   這是第一頁僅剩的「還沒做完」訊號。
function renderProgress() {
  const done = PARTS.filter(p => hasPick(p.id)).length;
  // 估算要五個結構部位都選齊，這件事在第一頁就要講，
  // 不能等玩家按了送出設計才在結算頁看到「還缺…」
  const missing = COMBO_KEY_PARTS.filter(p => !selection[p]).map(p => getPart(p).name);
  document.getElementById('sum-progress').textContent =
    `已選 ${done} / ${PARTS.length} 個部位`
    + (missing.length ? `　估算還缺 ${missing.join('、')}` : '');
  paintRatio(tally(), 'num-pros', 'num-cons', 'ratio-pros', 'ratio-cons');
}

// ── 第二頁：結算 ───────────────────────────────────────
// 判定成就，與永久紀錄比對算出「本次新解鎖」，然後存回去
function settle() {
  const owned = ownedSet();
  const anySelected = owned.size > 0;

  const got = ACHIEVEMENTS.filter(a => {
    if (a.rule.allEmpty) return !anySelected;
    if (a.rule.contains) return a.rule.contains.every(x => owned.has(x));
    return false;
  }).map(a => a.name);

  const before = loadUnlocked();
  const unlockedNow = new Set(got.filter(n => !before.has(n)));

  const after = new Set([...before, ...got]);
  saveUnlocked(after);

  return { unlockedNow };
}

// localStorage 讀寫。隱私模式或停用 storage 時會丟例外，包起來當作「沒有紀錄」。
function loadUnlocked() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function saveUnlocked(set) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify([...set])); } catch { /* 存不了就算了 */ }
}

// ── 碳排與造價估算 ─────────────────────────────────────
//   CONTRIB 是每個建材單獨的貢獻量，由 252 組合表反推（總計已驗證為各部位相加）。
//   所以選幾個部位就算幾個 —— 不必等五個選齊。
//   五個都選齊時，加總結果等於 COMBOS 裡的總計，誤差 0，
//   而且才有「檔位」與「排名」可以講（那兩個是相對於 252 種完整組合的位置）。
//
//   ⚠️ 一律不含加裝設備系統：試算表沒有那四項的碳排係數與單價（差異報告 §10-2）。
const COMBO_KEY_PARTS = ['wall', 'partition', 'slab', 'roof', 'floor'];

function estimate() {
  let co2 = 0, price = 0;
  const chosen = [];
  for (const p of COMBO_KEY_PARTS) {
    const c = CONTRIB[p + ':' + selection[p]];
    if (!c) continue;                       // 這個部位還沒選
    co2 += c[0]; price += c[1]; chosen.push(p);
  }
  const full = chosen.length === COMBO_KEY_PARTS.length;
  const row = full ? COMBOS[COMBO_KEY_PARTS.map(p => selection[p]).join('|')] : null;
  return { co2, price, n: chosen.length, full, row };
}

const fmt = n => Math.round(n).toLocaleString('en-US');

// 這一組贏過多少比例的可能組合（排序 1 = 最佳）
const betterThan = rank => Math.round((COMBO_TOTAL - rank) / (COMBO_TOTAL - 1) * 100);

// 數值在儀表上的位置（0% = 252 種組合裡最低，100% = 最高）
function gaugePct(value, st) {
  const pct = (value - st.min) / (st.max - st.min) * 100;
  return Math.max(0, Math.min(100, pct)).toFixed(1);
}

// 區域一的兩個總計 ＋ 區域二的碳足跡儀表
function renderTotals() {
  const e = estimate();
  const set = (id, v) => document.getElementById(id).textContent = v;
  const needle = document.getElementById('gauge-needle');
  const rank = document.getElementById('gauge-rank');
  const missing = COMBO_KEY_PARTS.filter(p => !selection[p]).map(p => getPart(p).name);

  set('stat-cost', '$ ' + fmt(e.price));
  set('stat-carbon', fmt(e.co2));
  set('stat-carbon-unit', 'kgCO₂e');
  set('gauge-carbon', fmt(e.co2));

  if (e.full) {
    // 選齊了才有排名 —— 檔位與名次是相對於 252 種完整組合算的
    const [, , co2Rank, , , priceRank] = e.row;
    set('stat-cost-unit', `贏過 ${betterThan(priceRank)}% 的組合`);
    needle.hidden = false;
    needle.style.left = gaugePct(e.co2, COMBO_STATS.co2) + '%';
    rank.textContent = `優於 ${betterThan(co2Rank)}% 的組合`;
    rank.className = 'pill rank' + (e.row[1] < 0 ? ' good' : '');
  } else {
    // 還沒選齊：數字照算，但講明是小計，也還不能排名
    set('stat-cost-unit', `小計 · 已選 ${e.n} / ${COMBO_KEY_PARTS.length} 個部位`);
    needle.hidden = true;
    rank.textContent = missing.length ? `還缺 ${missing.join('、')}` : '尚未估算';
    rank.className = 'pill rank none';
  }
}

function renderResult() {
  // 區域一 · 房子：整份複製第一頁的圖層堆疊，做法與放大鏡相同
  document.getElementById('result-photo').innerHTML =
    document.getElementById('house-photo').innerHTML;

  // 區域一 · 總成本與碳足跡 ＋ 區域二 · 碳足跡儀表
  renderTotals();

  // 區域二 · 五芒星
  renderPenta();

  // 區域二 · 成就
  renderAchievements();
}

// ── 五芒星 ─────────────────────────────────────────────
// 把全屋的標籤數成五個面向的淨值，再換算成 0～1 交給 penta.js 畫。
// AXES 的對照表在 data.js，換成正式 Token 時只要改那張表。
function axisValues() {
  const t = tally();
  return AXES.map(ax => ({
    label: ax.label,
    value: ax.rank ? rankScore(ax.rank) : tokenScore(t.counts, ax.token),
  }));
}

// Token 面向：數全屋的 XXX+ 與 XXX- 淨值
//   0.5 = 正負相抵；±AXIS_SPAN 個 token 打到底
function tokenScore(counts, code) {
  const net = (counts.get(code + '+') || 0) - (counts.get(code + '-') || 0);
  return Math.max(0, Math.min(1, 0.5 + net / (2 * AXIS_SPAN)));
}

// 數值面向：各部位在「同類別內」的名次，再平均
//   單位不可通約（kgCO2e/m3 vs /件 vs /m2），所以只能同類別比，不能相加。
//   最低者得 1 分、最高者得 0 分；該類別只有一種材料時給 0.5。
//   沒有數值的部位（加裝設備系統）不計入平均。
function rankScore(field) {
  const scores = [];
  for (const part of PARTS) {
    const vals = part.materials.map(m => m[field]).filter(v => typeof v === 'number');
    if (!vals.length) continue;
    const lo = Math.min(...vals), hi = Math.max(...vals);
    for (const m of pickedMats(part.id)) {
      if (typeof m[field] !== 'number') continue;
      scores.push(hi === lo ? 0.5 : 1 - (m[field] - lo) / (hi - lo));
    }
  }
  if (!scores.length) return 0.5;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function renderPenta() {
  const host = document.getElementById('penta');
  const anyPicked = PARTS.some(p => hasPick(p.id));
  // 一塊空地沒有任何面向可談，畫一張空的格線就好
  drawPenta(host, anyPicked
    ? axisValues()
    : AXES.map(ax => ({ label: ax.label, value: null })));

  document.getElementById('penta-note').textContent = anyPicked
    ? '環境影響為同類別碳排名次；正式版改查 252 組合表（§5-2）'
    : '這一棟什麼都沒選 —— 一塊空地';
}

// ── 成就（只在結算時判定，且不顯示解鎖條件）────────────────
//   條件藏起來是刻意的：成就名稱就是唯一的提示，靠玩家自己聯想。
//   顯示分三段：本次新解鎖（突顯）→ 以前就解鎖的 → 還沒解鎖的（只有名字）
function renderAchievements() {
  const unlockedAll = loadUnlocked();
  const now = result ? result.unlockedNow : new Set();

  document.getElementById('achv-count').textContent =
    `${unlockedAll.size} / ${ACHIEVEMENTS.length}`;

  // 本次新解鎖：獨立一區加一句話。
  //   沒有新解鎖時也要講清楚 —— 否則整排 🏆 會讓玩家以為都是這一棟賺到的，
  //   而清單其實是跨場次的累計。
  const newBox = document.getElementById('achv-new');
  newBox.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'achv-newhead' + (now.size ? '' : ' none');
  head.textContent = now.size
    ? `✨ 這一棟新解鎖 ${now.size} 項`
    : '這一棟沒有新解鎖　（以下為歷來累計）';
  newBox.appendChild(head);

  const list = document.getElementById('achv-list');
  list.innerHTML = '';
  for (const a of ACHIEVEMENTS) {
    const got = unlockedAll.has(a.name);
    const fresh = now.has(a.name);
    const row = document.createElement('div');
    row.className = 'achv' + (got ? ' got' : '') + (fresh ? ' fresh' : '');
    row.innerHTML =
      `<div class="achv-head">` +
      `<span class="achv-ic">${fresh ? '✨' : got ? '🏆' : '🔒'}</span>` +
      `<span class="achv-name">${a.name}` +
      (a.en ? `<span class="achv-en">${a.en}</span>` : '') + `</span>` +
      `</div>`;
    list.appendChild(row);
  }
}

// ── 放大鏡 ─────────────────────────────────────────────
//   原圖 2612px 在畫面上顯示成約 703px（縮小 3.72×），所以放大 3× 仍在
//   原生解析度內 —— 看到的是真實細節，不是模糊的放大。
//
//   鏡片內容 = 整個圖層堆疊的複本。用 innerHTML 整份複製而不是逐層維護，
//   好處是日後 data.js 新增任何建材，鏡片自動跟上，不必改這裡。
//   （hidden / src / z-index 都是會反映到 HTML 屬性的，複製得過去）
//
//   只掛在第一頁的房子上；第二頁的縮小房子不掛，避免兩套 pointer 事件打架。
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

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-submit').addEventListener('click', submitDesign);
  document.getElementById('btn-restart').addEventListener('click', restart);
  init();
  initLens();
});
