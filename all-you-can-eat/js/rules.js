// ── All You Can Eat — 規則引擎 ──────────────────────────────
// 純邏輯，完全不碰 DOM：可在 Node 下直接測試。
// 規則對照 Unity 版的 GameLayerScript / PlateScript / GamePlayerScript。

const MEALS = ['breakfast', 'lunch', 'dinner'];
const TOKENS = ['apple', 'meat', 'milk', 'oil', 'veg', 'grain'];
const BONUSES = ['gastro', 'appetite', 'irregular', 'nutrition', 'more', 'power'];
const DIGEST_MAX = 7;
const NUTRITION_MAX = 5;
const POWER_MAX = 5;
const POWER_TOKENS = ['veg', 'veg', 'veg', 'apple', 'apple'];   // PowerPanelScript.loadPowerTokens

// Node 測試用 require，把資料掛到 globalThis；瀏覽器下 cards.js / plates.js
// 已經用 <script> 依序載入成全域變數，不必也不能再用 var 宣告一次
// （var 會 hoist 到腳本頂層，與 CARDS/PLATES 的既有 const 宣告衝突，
//   導致整支 rules.js 因 SyntaxError 而完全無法執行）
if (typeof module !== 'undefined' && typeof CARDS === 'undefined') {
  globalThis.CARDS = require('./cards.js').CARDS;
  globalThis.PLATES = require('./plates.js').PLATES;
}

// 建立一副空盤：每類營養一個布林陣列，長度＝該類格位數
function emptyPlate(variant) {
  const slots = PLATES[variant].slots;
  const plate = {};
  for (const type of TOKENS) plate[type] = slots[type].map(() => false);
  return plate;
}

function createPlayer(name, variant) {
  return {
    name,
    score: 0,
    stars: 0,
    mealCnt: 0,            // 本回合已吃幾道
    plate: emptyPlate(variant),
    tokens: [],            // 所有吃下的代幣（含盤外）
    outside: [],           // 盤子放不下、溢出到盤外的代幣型別
    permanentBonus: [],    // 'appetite' | 'irregular'
    oneTimeBonus: null,    // 本回合的一次性 bonus
  };
}

function createGame({ variant, names, rng = Math.random }) {
  const state = {
    variant,
    lang: 'en',
    rng,
    deck: {
      breakfast: CARDS.filter((c) => c.meal === 'breakfast').slice(),
      lunch: CARDS.filter((c) => c.meal === 'lunch').slice(),
      dinner: CARDS.filter((c) => c.meal === 'dinner').slice(),
    },
    table: new Array(9).fill(null),
    players: names.filter((n) => n !== '').map((n) => createPlayer(n, variant)),
    activeIdx: 0,
    action: null,
    digestedCount: 0,
    bonusTokensLeft: 0,
    bonusTokenPool: null,  // power of vegan：剩餘的代幣池（按索引消耗，見 applyBonus）
    finalRound: false,
    lastMealType: -1,
    ended: false,
  };
  refillTable(state);
  return state;
}

// 從指定餐別的牌堆隨機抽一張；抽完回傳 null
// 原版是 Random.Range(0, count-1)（上界不含），最後一張幾乎抽不到；此處改為均勻隨機
function drawCard(state, meal) {
  const pile = state.deck[meal];
  if (pile.length === 0) return null;
  const idx = Math.floor(state.rng() * pile.length);
  return pile.splice(Math.min(idx, pile.length - 1), 1)[0];
}

// 補滿桌面空格。若某一列的牌抽光且該列三格全空 → 遊戲結束
function refillTable(state) {
  for (let row = 0; row < 3; row++) {
    let failed = 0;
    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      if (state.table[i] !== null) continue;
      const card = drawCard(state, MEALS[row]);
      if (card === null) failed++;
      else state.table[i] = card;
    }
    if (failed >= 3) {
      state.ended = true;
      return { ended: true };
    }
  }
  return { ended: false };
}

function plateCount(player) {
  return player.tokens.length - player.outside.length;
}

function stomachLeft(state) {
  const p = state.players[state.activeIdx];
  return PLATES[state.variant].capacity - p.tokens.length;
}

function capacity(state) {
  return PLATES[state.variant].capacity;
}

function activePlayer(state) {
  return state.players[state.activeIdx];
}

// 這名玩家是否持有某個 bonus（一次性與永久都算）
function hasBonus(player, key) {
  return player.oneTimeBonus === key || player.permanentBonus.includes(key);
}

// 這張牌現在能不能吃（對照 GameLayerScript.onCardClick）
function canEat(state, slot) {
  if (state.action !== 'eat') return false;
  const card = state.table[slot];
  if (!card) return false;
  const p = activePlayer(state);
  if (p.tokens.length + card.tokens.length > capacity(state)) return false;

  const row = MEALS.indexOf(card.meal);
  if (p.mealCnt === row && !hasBonus(p, 'appetite')) return true;
  if (p.mealCnt < 3 && hasBonus(p, 'irregular')) return true;
  if (p.mealCnt < 4 && hasBonus(p, 'appetite')) {
    const rowOk = p.mealCnt === row || p.mealCnt === row + 1;
    return rowOk && (row - state.lastMealType) < 2;
  }
  return false;
}

// 「吃」按鈕是否啟用（對照 GameLayerScript.checkMealToEat）
// 注意：原版沒有 irregular 時只檢查前 3 格，不是檢查該吃的那一列
function canEatAny(state) {
  const left = stomachLeft(state);
  if (left <= 0) return false;
  const p = activePlayer(state);
  const checkCnt = hasBonus(p, 'irregular') ? 9 : 3;
  for (let i = 0; i < checkCnt; i++) {
    const card = state.table[i];
    if (card && card.tokens.length <= left) return true;
  }
  return false;
}

// 放一個代幣：先找該類型第一個空格，全滿則溢出到盤外
function placeToken(state, player, type) {
  const slots = player.plate[type];
  for (let i = 0; i < slots.length; i++) {
    if (!slots[i]) {
      slots[i] = true;
      return { type, where: 'plate', index: i };
    }
  }
  player.outside.push(type);
  return { type, where: 'outside', index: player.outside.length - 1 };
}

// 吃掉桌上第 slot 張牌
function eatCard(state, slot) {
  if (!canEat(state, slot)) return { ok: false, placements: [] };
  const card = state.table[slot];
  const p = activePlayer(state);

  p.mealCnt++;
  p.score += card.score;
  state.lastMealType = MEALS.indexOf(card.meal);
  state.table[slot] = null;

  const placements = card.tokens.map((type) => {
    p.tokens.push(type);
    return placeToken(state, p, type);
  });
  return { ok: true, card, placements };
}

// 「消化」按鈕是否啟用
function canDigest(state) {
  return activePlayer(state).tokens.length > 0;
}

// 本回合還能消化幾個（有 gastro 則無上限）
function digestLeft(state) {
  if (hasBonus(activePlayer(state), 'gastro')) return Infinity;
  return Math.max(0, DIGEST_MAX - state.digestedCount);
}

// 現在點代幣有沒有效
function canDigestNow(state) {
  if (hasBonus(activePlayer(state), 'gastro')) return true;
  return state.action === 'digest' && digestLeft(state) > 0;
}

// 從 tokens 陣列移掉第一個指定型別的代幣
function removeOneToken(player, type) {
  const i = player.tokens.indexOf(type);
  if (i >= 0) player.tokens.splice(i, 1);
}

// 盤外代幣重新找位：能進盤的進盤，其餘留在盤外並保持順序
function reflowOutside(state, player) {
  const pending = player.outside.slice();
  player.outside = [];
  for (const type of pending) placeToken(state, player, type);
}

// 消化一個代幣。ref = {where:'plate', type, index} | {where:'outside', index}
function digestToken(state, ref) {
  if (!canDigestNow(state)) return false;
  const p = activePlayer(state);

  if (ref.where === 'outside') {
    const type = p.outside[ref.index];
    if (type === undefined) return false;
    p.outside.splice(ref.index, 1);
    removeOneToken(p, type);
  } else {
    if (!p.plate[ref.type] || !p.plate[ref.type][ref.index]) return false;
    p.plate[ref.type][ref.index] = false;
    removeOneToken(p, ref.type);
  }
  reflowOutside(state, p);
  state.digestedCount++;
  return true;
}

// 「平衡」按鈕是否啟用：盤內代幣剛好等於容量的一半
function canBalance(state) {
  return plateCount(activePlayer(state)) === capacity(state) / 2;
}

// 抽一個該玩家尚未持有的 bonus
function drawBonus(state) {
  const p = activePlayer(state);
  const pool = BONUSES.filter((b) => !hasBonus(p, b));
  if (pool.length === 0) return null;
  const idx = Math.min(Math.floor(state.rng() * pool.length), pool.length - 1);
  return pool[idx];
}

// 套用 bonus：兩張永久的進 permanentBonus，其餘是本回合的一次性效果
function applyBonus(state, key) {
  const p = activePlayer(state);
  if (key === 'appetite' || key === 'irregular') {
    if (!p.permanentBonus.includes(key)) p.permanentBonus.push(key);
    return;
  }
  p.oneTimeBonus = key;
  if (key === 'nutrition') {
    state.bonusTokensLeft = NUTRITION_MAX;
    state.bonusTokenPool = null;
  } else if (key === 'power') {
    state.bonusTokensLeft = POWER_MAX;
    // 原版 PowerPanelScript.loadPowerTokens 生出 5 顆實體代幣（3 蔬 2 蘋果），
    // TokenScript.onTokenClick 拿過一顆就消耗掉那一顆——不是「這個種類還能拿」。
    // 用陣列模擬同一顆一次性代幣池，拿一顆從池裡移除一顆。
    state.bonusTokenPool = POWER_TOKENS.slice();
  } else if (key === 'more') {
    // 本回合重來：動作、消化計數、已吃道數全部歸零
    state.action = null;
    state.digestedCount = 0;
    p.mealCnt = 0;
    state.lastMealType = -1;
  }
}

// 平衡：清掉盤內所有代幣（盤外保留並重新找位）→ 加一顆星 → 抽 bonus
//
// 與原版的差異：原版 removeBalanceTokens 對每個格位索引都呼叫一次 removeToken，
// 不管該格是否被佔用，導致同類代幣在盤外時會多扣。這裡只清實際被佔用的格位。
function balance(state) {
  if (!canBalance(state)) return { ok: false, bonus: null };
  const p = activePlayer(state);

  for (const type of TOKENS) {
    p.plate[type].forEach((used, i) => {
      if (!used) return;
      p.plate[type][i] = false;
      removeOneToken(p, type);
    });
  }
  reflowOutside(state, p);

  p.stars++;
  state.action = 'balance';
  const bonus = drawBonus(state);
  if (bonus) applyBonus(state, bonus);
  return { ok: true, bonus };
}

// Nutrition boost 給六種代幣任選、同一種可以重複拿（只計次到 5，不消耗個別代幣物件，
// 對照原版 loadNutritionTokens／putNutritionToken）；
// Power of vegan 給固定 3 蔬 2 蘋果、每顆是一次性代幣，拿過就沒了（見 applyBonus 註解）。
function bonusTokenChoices(state) {
  const p = activePlayer(state);
  if (p.oneTimeBonus === 'power') return state.bonusTokenPool ? state.bonusTokenPool.slice() : [];
  if (p.oneTimeBonus === 'nutrition') return TOKENS.slice();
  return [];
}

// 吃下一個 bonus 給的代幣
function takeBonusToken(state, type) {
  if (state.bonusTokensLeft <= 0) return false;
  if (stomachLeft(state) <= 0) return false;
  const p = activePlayer(state);

  if (p.oneTimeBonus === 'power') {
    const pool = state.bonusTokenPool || [];
    const idx = pool.indexOf(type);
    if (idx < 0) return false;      // 這個種類的代幣池已經拿完
    pool.splice(idx, 1);            // 按索引消耗掉那一顆，不是整個種類的資格
  } else if (p.oneTimeBonus === 'nutrition') {
    if (!TOKENS.includes(type)) return false;
  } else {
    return false;
  }

  p.tokens.push(type);
  placeToken(state, p, type);
  state.bonusTokensLeft--;
  return true;
}

// 開始一個回合：重置回合狀態並補滿桌面
function startTurn(state) {
  const p = activePlayer(state);
  p.mealCnt = 0;
  p.oneTimeBonus = null;
  state.action = null;
  state.digestedCount = 0;
  state.bonusTokensLeft = 0;
  state.bonusTokenPool = null;
  state.lastMealType = -1;
  return refillTable(state);
}

// 結束目前玩家的回合，換下一位
function nextPlayer(state) {
  if (activePlayer(state).stars >= 3) state.finalRound = true;

  const next = state.activeIdx + 1;
  if (next > state.players.length - 1) {
    if (state.finalRound) {
      state.ended = true;
      return { ended: true };
    }
    state.activeIdx = 0;
  } else {
    state.activeIdx = next;
  }
  const r = startTurn(state);
  return { ended: r.ended };
}

// 任一牌堆抽光時，原版會顯示「牌快用完了」的提示
function deckEmptyWarning(state) {
  return MEALS.some((m) => state.deck[m].length === 0);
}

// 結算：總分＝料理分 −未消化代幣數；與最高分同分者一起戴皇冠
function results(state) {
  const rows = state.players.map((p) => ({
    name: p.name,
    cuisine: p.score,
    undigested: p.tokens.length,
    total: p.score - p.tokens.length,
    crown: false,
  }));
  rows.sort((a, b) => b.total - a.total);
  if (rows.length > 0) {
    const best = rows[0].total;
    for (const r of rows) r.crown = r.total === best;
  }
  return rows;
}

if (typeof module !== 'undefined') {
  module.exports = {
    MEALS, TOKENS, BONUSES, DIGEST_MAX, NUTRITION_MAX, POWER_MAX, POWER_TOKENS,
    emptyPlate, createGame, drawCard, refillTable,
    plateCount, stomachLeft, capacity, activePlayer,
    hasBonus, canEat, canEatAny, placeToken, eatCard,
    canDigest, canDigestNow, digestLeft, digestToken, reflowOutside,
    canBalance, balance, drawBonus, applyBonus, bonusTokenChoices, takeBonusToken,
    startTurn, nextPlayer, deckEmptyWarning, results,
  };
}
