// ── 流程串接 ──────────────────────────────────────────────
let state = null;
let variant = 'tw';
// Anim.showBigCard 只有一個共用計時器，同一時間只能有一個 onHide 排隊。
// 平衡抽到 bonus 後、大卡收起前這段期間，有兩種點擊會出問題：
// 1. 點永久 bonus 小卡（無 onHide）會把待執行的 onHide 頂掉。
// 2. 按「下一位」會讓 nextPlayer -> startTurn 提前把 oneTimeBonus／bonusTokensLeft
//    重置成下一位玩家的狀態，等稍後 onHide 才跑時讀到的就是錯的人，
//    bonus 代幣面板因此不會出現。
// 這件事本質上是「這一局遊戲目前是否卡在揭示動畫中」，屬於畫面暫態、但要跟著
// 遊戲生命週期走，所以放進 state.bonusRevealPending（純畫面層欄位，rules.js
// 不需要也不應該知道它），而不是模組層級變數：
// - .action 三顆鈕、bonus-mini、btn-next 的可點擊與否都改成從 state 推導
//   （UI.renderActions 依 state 重畫 #btn-next.disabled），每次 renderAll
//   都會自我修正，不會跟 DOM 漂移。
// - startGame 產生新 state 時這個欄位自然是 undefined（視同 false），
//   所以不論上一局在哪個狀態離開，新遊戲一定是乾淨的，不會有殘留卡死。

// 開場 3 秒後自動進入選地區（原版 GameManagerScript.Update 的 startTime>3）
function boot() {
  UI.fitStage();
  UI.applyLayout();          // 先把 layout.js 的舞台座標寫進 DOM，再填字
  UI.setLang('en');
  buildLangButtons();
  buildPlayerInputs();
  bindEvents();
  UI.showScreen('start');
  setTimeout(() => UI.showScreen('variant'), 3000);
}

function buildLangButtons() {
  const box = document.getElementById('lang-btns');
  box.innerHTML = '';
  for (const code of LANGS) {
    const b = document.createElement('button');
    b.dataset.lang = code;
    b.textContent = LANG.ui.lang[code];
    b.addEventListener('click', () => {
      Sound.play('button');
      UI.setLang(code);
      if (state) UI.renderAll(state);
    });
    box.appendChild(b);
  }
  UI.layoutLangButtons();
}

// 進「輸入玩家」畫面時一律清空欄位（原版 PlayersLayerScript.onShow 也是這樣做），
// 否則從遊戲中按首頁退出來、或玩完一局再開新遊戲，上一批玩家的名字會留在欄位裡。
function showPlayersScreen() {
  for (let i = 1; i <= 4; i++) document.getElementById(`player-${i}`).value = '';
  UI.showScreen('players');
}

function buildPlayerInputs() {
  const box = document.getElementById('player-inputs');
  box.innerHTML = '';
  for (let i = 1; i <= 4; i++) {
    box.insertAdjacentHTML('beforeend',
      `<label class="at txt t-ur" data-player-label="${i}"></label>` +
      `<input type="text" id="player-${i}" maxlength="12">`);
  }
  UI.layoutPlayerInputs();
  updatePlayerLabels();
}

// 「輸入玩家」畫面的四個標籤是動態組字串烘進 innerHTML 的（不是 data-t），
// UI.setLang 只會重寫 data-t 節點，切語言後不會自動更新，所以另外監聽
// setLang 發出的 langchange 事件，用目前語言重新填字。
// 原版 PlayersLayerScript.reloadLang 的標籤文字是「Player N: _________」，
// 那串底線就是輸入框的底線，輸入框本身是透明的、剛好疊在底線上。
function updatePlayerLabels() {
  for (const label of document.querySelectorAll('[data-player-label]')) {
    label.textContent = `${UI.t('player')} ${label.dataset.playerLabel}: _________`;
  }
}
document.addEventListener('langchange', updatePlayerLabels);

function bindEvents() {
  // 選地區
  for (const btn of document.querySelectorAll('.variant')) {
    btn.addEventListener('click', () => {
      Sound.play('button');
      variant = btn.dataset.variant;
      showPlayersScreen();
    });
  }

  // 開始遊戲：至少兩位玩家
  document.getElementById('btn-start-game').addEventListener('click', () => {
    const names = [1, 2, 3, 4].map((i) => document.getElementById(`player-${i}`).value.trim());
    if (names.filter((n) => n !== '').length < 2) return;
    Sound.play('button');
    startGame(names);
  });

  // 桌面卡片
  document.getElementById('table-cards').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card || card.disabled) return;
    onEatCard(Number(card.dataset.slot));
  });

  // 動作鈕
  for (const btn of document.querySelectorAll('.action')) {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'balance') {
        Sound.play('bonus');
        onBalance();
      } else {
        Sound.play('button');
        state.action = action;
        UI.renderAll(state);
      }
    });
  }

  // 代幣：消化或吃下 bonus 代幣
  document.getElementById('tokens').addEventListener('click', (e) => {
    const el = e.target.closest('.token');
    if (!el) return;
    const ref = el.dataset.where === 'outside'
      ? { where: 'outside', index: Number(el.dataset.index) }
      : { where: 'plate', type: el.dataset.type, index: Number(el.dataset.index) };
    if (digestToken(state, ref)) {
      Sound.play('digest');
      UI.renderAll(state);
    }
  });

  // bonus 面板的代幣
  document.getElementById('bonus-tokens').addEventListener('click', (e) => {
    const el = e.target.closest('.token');
    if (!el) return;
    if (takeBonusToken(state, el.dataset.type)) {
      Sound.play('token');
      renderBonusTokens();
      UI.renderAll(state);
    }
  });

  // 永久 bonus 小卡：再看一次說明
  document.getElementById('players').addEventListener('click', (e) => {
    const el = e.target.closest('.bonus-mini');
    if (!el) return;
    if (state.bonusRevealPending) return; // 平衡揭示大卡尚未收起，避免蓋掉待執行的 onHide
    showBonusCard(el.dataset.bonus);
  });

  // 下一位
  document.getElementById('btn-next').addEventListener('click', () => {
    // 平衡揭示大卡尚未收起：nextPlayer -> startTurn 會重置 oneTimeBonus／bonusTokensLeft，
    // 若此時換人，稍後才跑的 onHide 讀到的就是下一位玩家的狀態，bonus 代幣面板會憑空消失。
    if (state.bonusRevealPending) return;
    Sound.play('button');
    const r = nextPlayer(state);
    if (r.ended) return endGame();
    document.getElementById('bonus-tokens').hidden = true;
    UI.renderAll(state);
  });

  // 結算頁
  document.getElementById('btn-rematch').addEventListener('click', () => {
    Sound.play('button');
    startGame(state.players.map((p) => p.name));
  });
  document.getElementById('btn-newgame').addEventListener('click', () => {
    Sound.play('button');
    UI.showScreen('variant');
  });

  // 音效與回首頁
  document.getElementById('btn-sound').addEventListener('click', (e) => {
    const muted = Sound.toggleMute();
    e.currentTarget.querySelector('img').src = muted ? 'img/Sound_Mute.png' : 'img/Sound.png';
  });
  document.getElementById('btn-home').addEventListener('click', () => {
    Sound.play('button');
    if (confirm(UI.t('alertHome'))) {
      UI.showScreen('variant');
      document.getElementById('btn-home').hidden = true; // 只有 endGame() 會收回，這裡補上
    }
  });
}

function startGame(names) {
  state = createGame({ variant, names, rng: Math.random });
  state.lang = UI.getLang();
  if (state.ended) return endGame(); // 保險：一開局桌面就補不滿（極端牌堆組合）時直接結算
  UI.showScreen('game');
  document.getElementById('btn-home').hidden = false;
  UI.renderAll(state);
}

// 吃一張牌：代幣逐一飛進盤子，全部抵達後才把盤面重畫出來
function onEatCard(slot) {
  const cardEl = document.querySelector(`.card[data-slot="${slot}"]`);
  const from = UI.tokenStartPoint(cardEl);      // 卡片位置換算成 .tokens 容器內的座標
  const r = eatCard(state, slot);
  if (!r.ok) return;
  Sound.play('button');

  // 先把桌面與玩家區更新（卡片消失、分數變動），盤面等動畫跑完再畫
  UI.renderTable(state);
  UI.renderPlayers(state);
  UI.renderStomach(state);
  UI.renderActions(state);

  let landed = 0;
  r.placements.forEach((pl) => {
    const to = UI.tokenTargetPoint(state, pl);
    Anim.flyToken(pl.type, from, to, () => {
      landed++;
      if (landed === r.placements.length) UI.renderPlate(state);
    });
  });

  const card = r.card;
  Anim.showBigCard(
    `<img src="img/cards/${card.meal}/${card.country}.png" alt="">` +
    `<div class="big-card-name" style="color:${CONTINENT_COLOR[CONTINENT[card.country]]}">` +
    `${UI.countryName(card.country)}<br>${UI.mealName(card.country)}</div>`,
    3);
}

// 平衡：清盤、加星、抽 bonus，並依 bonus 種類決定後續互動
function onBalance() {
  const r = balance(state);
  if (!r.ok) return;
  UI.renderAll(state);
  if (!r.bonus) return;
  const s = state; // 記住這一局的 state 物件本身，而非之後可能被換掉的模組變數 state，
                    // 避免玩家離開後開新局，onHide 才跑時把新局的 state 弄髒
  s.bonusRevealPending = true;
  UI.renderAll(state); // 立刻依 state 重畫，讓「下一位」鈕跟著 disabled
  showBonusCard(r.bonus, () => {
    s.bonusRevealPending = false;
    if (s === state) {
      // 仍是同一局才需要補畫面：bonus 代幣面板、重新渲染
      if (r.bonus === 'nutrition' || r.bonus === 'power') renderBonusTokens();
      UI.renderAll(state);
    }
  });
}

function showBonusCard(key, onHide) {
  // power／nutrition 要等 3 秒到才會叫出代幣選擇面板，原版不允許點掉跳過
  // （BigCardScript.hideOnClick 的例外）；其餘 bonus 大卡都可以點掉提前收起。
  const canDismiss = key !== 'power' && key !== 'nutrition';
  Anim.showBigCard(
    `<img src="img/bonus/${UI.bonusImg(key)}" alt="">` +
    `<div class="big-card-name">${UI.bonusTitle(key)}</div>` +
    `<div class="big-card-desc">${UI.bonusDesc(key)}</div>`,
    3, onHide, canDismiss);
}

// bonus 代幣面板（Nutrition boost / Power of vegan）
// 排法照原版：PowerPanelScript.loadPowerTokens 是 -215+i*37、
// PlateScript.loadNutritionTokens 是 -246+i*42（座標已由 extract-scene.js 換算成舞台像素）
function renderBonusTokens() {
  const box = document.getElementById('bonus-tokens');
  const choices = bonusTokenChoices(state);
  box.hidden = choices.length === 0 || state.bonusTokensLeft <= 0;
  box.innerHTML = '';
  const panel = UI.stage.game.bonusPanel[
    activePlayer(state).oneTimeBonus === 'power' ? 'power' : 'nutrition'];
  choices.forEach((type, i) => {
    const el = document.createElement('button');
    el.className = 'at token';
    el.dataset.type = type;
    el.innerHTML = `<img src="img/tokens/${type}.png" alt="">`;
    UI.at(el, [panel.origin[0] + i * panel.delta, panel.origin[1]], [panel.size, panel.size]);
    box.appendChild(el);
  });
}

function endGame() {
  Sound.play('end');
  UI.renderResults(results(state));
  UI.showScreen('results');
  document.getElementById('btn-home').hidden = true;
}

document.addEventListener('DOMContentLoaded', boot);
