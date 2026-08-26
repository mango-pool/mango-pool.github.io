// ── 畫面層：只讀 state 畫畫面，不含任何規則 ──────────────────
const UI = (() => {
  let lang = 'en';

  const ST = LAYOUT.stage;          // 舞台座標（2048×1536，原點置中、y 軸向上）
  const G = ST.game;
  const SC = ST.screens;
  const HW = ST.width / 2;
  const HH = ST.height / 2;

  // bonus key → 圖檔名（沿用原版 Resources/bonus 的檔名）
  const BONUS_IMG = {
    gastro: 'Gastrointestinal medicine.png',
    appetite: 'Good appetite.png',
    irregular: 'Irregular eating.png',
    nutrition: 'Nutrition boost.png',
    more: 'One more!.png',
    power: 'Power of vegan.png',
  };

  // ── 版面：把 layout.js 的舞台座標寫進 DOM ────────────────────
  // 舞台座標 (x,y) 原點置中、y 軸向上；CSS 用 left/top 且 y 軸向下，所以要翻號。
  // 元素本身帶 translate(-50%,-50%)，因此 left/top 指的是「中心點」。
  const $ = (id) => document.getElementById(id);

  function at(el, pos, size) {
    if (!el) return;
    el.style.left = `${HW + pos[0]}px`;
    el.style.top = `${HH - pos[1]}px`;
    if (size) { el.style.width = `${size[0]}px`; el.style.height = `${size[1]}px`; }
  }

  // box = {pos, size, font?}
  function put(id, box) {
    const el = typeof id === 'string' ? $(id) : id;
    if (!el || !box) return;
    at(el, box.pos, box.size);
    if (box.font) el.style.fontSize = `${box.font}px`;
  }

  // 相對某個 0×0 原點容器的擺放（玩家區、結算列、代幣都用這個）
  function offset(el, off, size, font) {
    el.style.left = `${off[0]}px`;
    el.style.top = `${-off[1]}px`;
    if (size) { el.style.width = `${size[0]}px`; el.style.height = `${size[1]}px`; }
    if (font) el.style.fontSize = `${font}px`;
  }

  function applyLayout() {
    // 開場
    put('logo', SC.start.logo);
    put('start-hint', SC.start.hint);

    // 選地區
    put('variant-title', SC.variant.title);
    for (const key of ['tw', 'bn', 'ru']) {
      const el = $(`variant-${key}`);
      put(el, SC.variant[key]);
      el.style.fontSize = `${SC.variant.btnFont}px`;
    }

    // 輸入玩家（四列標籤與輸入框由 app.js 建好後才擺）
    put('players-title', SC.playersScreen.title);
    put('players-min', SC.playersScreen.min);
    put('btn-start-game', SC.playersScreen.start);
    $('btn-start-game').style.fontSize = `${SC.playersScreen.startFont}px`;

    // 遊戲畫面
    put('plate-bg', G.plateBg);
    document.querySelectorAll('.meal-header').forEach((el, i) => {
      at(el, [G.headers.x, G.headers.ys[i]], G.headers.size);
    });
    put('stomach', G.stomach.border);
    put('stomach-left', G.stomach.left);
    put('stomach-max', G.stomach.max);
    put('choose-txt', G.choose);
    put('active-player', G.activePlayer);
    put('final-hint', G.final);
    put('big-card', G.bigCard);
    for (const [id, key] of [['btn-eat', 'eat'], ['btn-digest', 'digest'],
                             ['btn-balance', 'balance'], ['btn-next', 'next']]) {
      put(id, G.buttons[key]);
      $(id).style.fontSize = `${G.btnFont}px`;
    }

    // 結算
    put('result-bg', SC.results.bg);
    put('results-title', SC.results.title);
    put('head-cuisine', SC.results.head.cuisine);
    put('head-undig', SC.results.head.undig);
    put('head-score', SC.results.head.score);
    put('result-line', SC.results.line);
    put('btn-rematch', SC.results.rematch);
    put('btn-newgame', SC.results.newgame);
    $('btn-rematch').style.fontSize = `${SC.results.btnFont}px`;
    $('btn-newgame').style.fontSize = `${SC.results.btnFont}px`;

    // 右上角常駐。
    // 原版把喇叭與首頁鈕擺在語言列上方（y 644 對語言列的 600.6），看起來是浮的；
    // 這裡改成與語言列同一條水平中線。但原本的 x 會壓在「Bahasa Melayu」上（那顆
    // 按鈕寬 260），所以依語言列的實際右緣往右接著排，不寫死座標。
    const lang = Object.values(SC.settings.lang);
    const topY = lang[0].pos[1];
    const langRight = Math.max(...lang.map((b) => b.pos[0] + b.size[0] / 2));
    const GAP = 8;
    const home = SC.settings.home;
    const sound = SC.settings.sound;
    const homeX = langRight + GAP + home.size[0] / 2;
    const soundX = homeX + home.size[0] / 2 + GAP + sound.size[0] / 2;
    at($('btn-home'), [homeX, topY], home.size);
    at($('btn-sound'), [soundX, topY], sound.size);
  }

  // 「輸入玩家」的四列與語言鈕都是 app.js 動態生出來的，建好後呼叫這兩個
  function layoutPlayerInputs() {
    SC.playersScreen.rows.forEach((row, i) => {
      const label = document.querySelector(`[data-player-label="${i + 1}"]`);
      const input = $(`player-${i + 1}`);
      if (label) { at(label, row.label.pos, row.label.size); label.style.fontSize = `${row.label.font}px`; }
      // 輸入的字刻意與「玩家 N」標籤同字級（原版 InputField 是 36，比標籤小一截）。
      // 標籤結尾那串「____」是底線，字放在標籤的垂直中心會正好壓在底線上，
      // 所以往上抬 0.42 個字高，讓名字坐在底線上方。
      if (input) {
        const lift = Math.round(row.label.font * 0.42);
        at(input, [row.input.pos[0], row.label.pos[1] + lift], row.input.size);
        input.style.fontSize = `${row.label.font}px`;
      }
    });
  }

  function layoutLangButtons() {
    for (const btn of document.querySelectorAll('#lang-btns button')) {
      const box = SC.settings.lang[btn.dataset.lang];
      if (!box) continue;
      at(btn, box.pos, box.size);
      btn.style.fontSize = `${SC.settings.langFont}px`;
    }
  }

  // 舞台等比縮放並置中
  function fitStage() {
    const stage = $('stage');
    const scale = Math.min(window.innerWidth / ST.width, window.innerHeight / ST.height);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function showScreen(name) {
    for (const el of document.querySelectorAll('.screen')) {
      el.classList.toggle('screen--on', el.id === `screen-${name}`);
    }
  }

  // 取目前語言的介面字串
  function t(key) {
    const entry = LANG.ui[key];
    return entry ? entry[lang] : '';
  }

  // 切換語言：換字型、重寫所有 data-t 的文字
  function setLang(code) {
    lang = code;
    document.body.dataset.lang = code;
    for (const el of document.querySelectorAll('[data-t]')) {
      el.textContent = t(el.dataset.t);
    }
    for (const btn of document.querySelectorAll('#lang-btns button')) {
      btn.classList.toggle('lang--on', btn.dataset.lang === code);
    }
    document.dispatchEvent(new CustomEvent('langchange'));
  }

  function getLang() { return lang; }

  // 依語言取國名／菜名／bonus 文案
  const countryName = (c) => LANG.country[c][lang];
  const mealName = (c) => LANG.meal[c][lang];
  const bonusTitle = (k) => LANG.bonus[k].title[lang];
  const bonusDesc = (k) => LANG.bonus[k].desc[lang];

  // Unity 座標（y 軸向上、原點置中）→ CSS 位置（y 軸向下）
  function place(el, x, y) {
    el.style.left = `${x}px`;
    el.style.top = `${-y}px`;
  }

  // 桌面 9 張卡 + 三張餐別標頭
  function renderTable(state) {
    const box = $('table-cards');
    box.innerHTML = '';
    state.table.forEach((card, i) => {
      if (!card) return;
      const row = Math.floor(i / 3), col = i % 3;
      const el = document.createElement('button');
      el.className = 'at card';
      el.dataset.slot = String(i);
      at(el, [G.cards.origin[0] + col * G.cards.delta[0],
              G.cards.origin[1] + row * G.cards.delta[1]], G.cards.size);
      el.innerHTML =
        `<img class="card-art" src="img/cards/${card.meal}/${card.country}.png" alt="">` +
        `<span class="card-country"></span><span class="card-meal"></span>`;
      const color = CONTINENT_COLOR[CONTINENT[card.country]];
      const country = el.querySelector('.card-country');
      const meal = el.querySelector('.card-meal');
      // 卡片內部座標以卡片中心為原點；+size/2 換成相對左上角的 CSS 位置
      const inner = (node, spec) => {
        node.style.left = `${G.cards.size[0] / 2 + spec.off[0]}px`;
        node.style.top = `${G.cards.size[1] / 2 - spec.off[1]}px`;
        node.style.width = `${spec.size[0]}px`;
        node.style.height = `${spec.size[1]}px`;
        node.style.fontSize = `${spec.font}px`;
      };
      inner(country, G.cards.country);
      inner(meal, G.cards.meal);
      country.textContent = countryName(card.country);
      meal.textContent = mealName(card.country);
      country.style.color = meal.style.color = color;
      el.disabled = !canEat(state, i);   // rules.js 在瀏覽器下是全域函式
      box.appendChild(el);
    });

    // 該列的牌抽光時隱藏對應的餐別標頭（原版 GameLayerScript.loadCard 的 cardsLeft==0）
    const MEALS = ['breakfast', 'lunch', 'dinner'];
    for (const el of document.querySelectorAll('.meal-header')) {
      const row = MEALS.indexOf(el.dataset.meal);
      const rowHasCard = [0, 1, 2].some((c) => state.table[row * 3 + c]);
      const deckLeft = state.deck[el.dataset.meal].length > 0;
      el.hidden = !(rowHasCard || deckLeft);
    }
  }

  // 盤子與代幣
  function renderPlate(state) {
    const plate = PLATES[state.variant];
    // bonus 代幣面板出現時盤子整組往下讓位（原版 PlateScript.setDelta）
    const shift = $('bonus-tokens').hidden ? 0 : plate.panelShift;
    const center = [plate.pos[0], plate.pos[1] - shift];
    const img = $('plate-img');
    img.src = plate.img;
    at(img, center, plate.size);
    at($('tokens'), center);         // 代幣容器是 0×0 原點，對齊盤子圖中心

    const box = $('tokens');
    box.innerHTML = '';
    const p = state.players[state.activeIdx];
    const size = G.tokenSize;

    for (const type of TOKENS) {
      p.plate[type].forEach((used, i) => {
        if (!used) return;
        const [x, y] = plate.slots[type][i];
        const el = document.createElement('button');
        el.className = 'token';
        el.dataset.where = 'plate';
        el.dataset.type = type;
        el.dataset.index = String(i);
        el.style.width = el.style.height = `${size}px`;
        el.innerHTML = `<img src="img/tokens/${type}.png" alt="">`;
        place(el, x, y);
        box.appendChild(el);
      });
    }

    // 盤外代幣：原版 PlateScript.findPlaceOutside，每列 9 個、共 3 列
    p.outside.forEach((type, i) => {
      const el = document.createElement('button');
      el.className = 'token token--outside';
      el.dataset.where = 'outside';
      el.dataset.index = String(i);
      el.style.width = el.style.height = `${size}px`;
      el.innerHTML = `<img src="img/tokens/${type}.png" alt="">`;
      const pt = outsidePoint(state, i);
      place(el, pt.x, -pt.y);
      box.appendChild(el);
    });
  }

  // 盤外第 i 顆代幣在 #tokens 容器內的 CSS 座標（y 已翻成向下）
  function outsidePoint(state, i) {
    const o = PLATES[state.variant].outside;
    return {
      x: o.origin[0] + (i % 9) * o.delta[0],
      y: -(o.origin[1] + Math.floor(i / 9) * o.delta[1]),
    };
  }

  // 胃容量：數字 + 計量條（stomach.png 由下往上填滿，過半轉紅）
  function renderStomach(state) {
    const cap = PLATES[state.variant].capacity;
    const ate = state.players[state.activeIdx].tokens.length;
    $('stomach-left').textContent = String(cap - ate);
    $('stomach-max').textContent = `/ ${cap}`;
    const bar = $('stomach');
    bar.style.setProperty('--fill', String(ate / cap));
    bar.classList.toggle('stomach--full', ate >= cap / 2);
  }

  // 玩家區：名字、分數、三顆星、永久 bonus 小卡
  // 星星計分卡整排的擺法：
  //   1. 左移，讓第一張的左緣對齊桌面（餐別標頭）的左緣 —— 原版擺在偏中間，會壓到語言列
  //   2. 四人局時整排放不下（會撞到語言列），等比縮小到剛好塞得下；三人以下維持原尺寸
  // 每個 .player 是 0×0 的原點 div，scale 的基準點就是那個原點，所以縮放只影響
  // 卡片自身與它相對原點的偏移，位置仍由這裡算好的原點決定。
  function playersRow(count) {
    const P = G.players;
    const tableLeft = G.headers.x - G.headers.size[0] / 2;
    const langLeft = Math.min(...Object.values(SC.settings.lang).map((b) => b.pos[0] - b.size[0] / 2));
    const GAP = 24;                                   // 與語言列之間留的空隙
    const rowWidth = (count - 1) * P.delta + P.bg.size[0];
    const scale = Math.min(1, (langLeft - GAP - tableLeft) / rowWidth);
    return {
      scale,
      // 第一張卡左緣貼齊桌面左緣
      originX: tableLeft + scale * (P.bg.size[0] / 2 - P.bg.off[0]),
      // 縮放後卡片會往原點靠，補回來讓整排維持原本的高度
      originY: P.origin[1] + P.bg.off[1] - scale * P.bg.off[1],
      delta: scale * P.delta,
    };
  }

  function renderPlayers(state) {
    const box = $('players');
    box.innerHTML = '';
    const P = G.players;
    const row = playersRow(state.players.length);
    state.players.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'player' + (i === state.activeIdx ? ' player--active' : '');
      at(el, [row.originX + i * row.delta, row.originY]);
      if (row.scale !== 1) el.style.transform = `scale(${row.scale})`;

      const bg = document.createElement('img');
      bg.className = 'player-bg';
      bg.src = 'img/bg_sm.png';
      offset(bg, P.bg.off, P.bg.size);
      el.appendChild(bg);

      const name = document.createElement('span');
      name.className = 'player-name';
      name.textContent = p.name;
      name.style.color = P.colors[i] || '#323232';
      offset(name, P.name.off, P.name.size, P.name.font);
      el.appendChild(name);

      const score = document.createElement('span');
      score.className = 'player-score';
      score.textContent = String(p.score);
      offset(score, P.score.off, P.score.size, P.score.font);
      el.appendChild(score);

      P.stars.forEach((off, n) => {
        const s = document.createElement('img');
        s.className = 'star';
        s.src = n < p.stars ? 'img/Star.png' : 'img/Star Outline.png';
        offset(s, off, P.starSize);
        el.appendChild(s);
      });

      p.permanentBonus.forEach((k, n) => {
        const b = document.createElement('button');
        b.className = 'bonus-mini';
        b.dataset.bonus = k;
        b.innerHTML = `<img src="img/bonus/${BONUS_IMG[k]}" alt="">`;
        offset(b, [P.bonus.off[0] + n * P.bonus.delta, P.bonus.off[1]], P.bonus.size);
        el.appendChild(b);
      });

      box.appendChild(el);
    });

    // 目前輪到誰（原版 txt_activePlayer 會沿用該玩家的名字顏色）
    const active = $('active-player');
    active.textContent = state.players[state.activeIdx].name;
    active.style.color = P.colors[state.activeIdx] || '#323232';
  }

  // 三個動作鈕與提示文字
  function renderActions(state) {
    const enabled = {
      eat: canEatAny(state),
      digest: canDigest(state),
      balance: canBalance(state),
    };
    for (const btn of document.querySelectorAll('.action')) {
      btn.disabled = !enabled[btn.dataset.action] || state.action !== null;
    }
    const choose = $('choose-txt');
    if (state.action === null) {
      choose.textContent = `${t('choose')}:`;
    } else if (state.action === 'digest') {
      const left = digestLeft(state);
      choose.textContent = `${t('choose')}: ${t('digest')} (${left === Infinity ? '∞' : left})`;
    } else {
      choose.textContent = `${t('choose')}: ${t(state.action)}`;
    }
    $('final-hint').hidden = !(state.finalRound || deckEmptyWarning(state));
    $('final-hint').textContent = state.finalRound ? t('final') : t('gameover');

    // 平衡揭示大卡尚未收起時（見 app.js state.bonusRevealPending 註解），
    // 「下一位」鈕要保持 disabled；狀態一改回來，下一次 renderAll 就會自動恢復，
    // 不會有殘留卡死的問題。
    $('btn-next').disabled = !!state.bonusRevealPending;
  }

  function renderAll(state) {
    renderTable(state);
    renderPlate(state);
    renderStomach(state);
    renderPlayers(state);
    renderActions(state);
  }

  // 動畫起點：卡片中心 → .tokens 容器內的座標
  // 兩者都在同一個縮放層裡，用 rect 相減再除掉縮放倍率即可
  function tokenStartPoint(cardEl) {
    const box = $('tokens');
    const a = cardEl.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const scale = cardEl.offsetWidth ? a.width / cardEl.offsetWidth : 1;
    return {
      x: (a.left + a.width / 2 - b.left) / scale,
      y: (a.top + a.height / 2 - b.top) / scale,
    };
  }

  // 動畫終點：代幣要落在哪一格（盤內用格位座標、盤外用每列 9 個的排列）
  function tokenTargetPoint(state, placement) {
    if (placement.where === 'outside') return outsidePoint(state, placement.index);
    const [x, y] = PLATES[state.variant].slots[placement.type][placement.index];
    return { x, y: -y };
  }

  // 結算表
  function renderResults(rows) {
    const box = $('result-rows');
    box.innerHTML = '';
    const R = SC.results;
    rows.forEach((r, i) => {
      const row = document.createElement('div');
      row.className = 'result-row';
      at(row, [0, R.rowY[i]]);
      const cell = (cls, off, text) => {
        const s = document.createElement('span');
        s.className = cls;
        s.textContent = text;
        offset(s, off, R.cellSize, R.cellFont);
        row.appendChild(s);
      };
      if (r.crown) {
        const c = document.createElement('img');
        c.className = 'crown';
        c.src = 'img/Crown.png';
        offset(c, R.crown.off, R.crown.size);
        row.appendChild(c);
      }
      cell('res-name', R.cols.name, r.name);
      cell('res-cuisine', R.cols.cuisine, String(r.cuisine));
      cell('res-undig', R.cols.undig, `- ${r.undigested}`);
      cell('res-score', R.cols.score, `= ${r.total}`);
      box.appendChild(row);
    });
  }

  window.addEventListener('resize', fitStage);

  return {
    fitStage, showScreen, setLang, getLang, t, countryName, mealName, bonusTitle, bonusDesc,
    applyLayout, layoutPlayerInputs, layoutLangButtons, at, offset, stage: ST,
    renderTable, renderPlate, renderStomach, renderPlayers, renderActions, renderAll,
    renderResults, tokenStartPoint, tokenTargetPoint, bonusImg: (key) => BONUS_IMG[key],
  };
})();
