// ── 動畫：代幣飛行與大卡計時 ────────────────────────────────
const Anim = (() => {
  const SPEED = 900;            // 舞台單位／秒，對應原版 MoveTowards 的等速感
  let bigCardTimer = null;
  let pendingOnHide = null;     // 目前這張大卡收起時要補跑的回呼（尚未執行）
  let dismissible = true;       // 這張大卡是否允許玩家點掉提前收起

  // 代幣自 from 等速飛到 to（座標皆為 .tokens 容器內的 px）
  function flyToken(type, from, to, done) {
    const el = document.createElement('div');
    el.className = 'token token--flying';
    el.innerHTML = `<img src="img/tokens/${type}.png" alt="">`;
    el.style.width = el.style.height = `${LAYOUT.stage.game.tokenSize}px`;
    el.style.left = `${from.x}px`;
    el.style.top = `${from.y}px`;
    document.getElementById('tokens').appendChild(el);

    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const ms = Math.max(120, (dist / SPEED) * 1000);
    el.style.transition = `left ${ms}ms linear, top ${ms}ms linear`;

    requestAnimationFrame(() => {
      el.style.left = `${to.x}px`;
      el.style.top = `${to.y}px`;
    });
    setTimeout(() => { el.remove(); if (done) done(); }, ms + 20);
  }

  // 收起大卡並補跑 onHide：計時到期、被下一張大卡取代、或玩家點掉都走這裡，
  // 確保 onHide 一定會被呼叫恰好一次，不會因為 clearTimeout 而憑空消失。
  function settleBigCard() {
    clearTimeout(bigCardTimer);
    document.getElementById('big-card').hidden = true;
    const cb = pendingOnHide;
    pendingOnHide = null;
    if (cb) cb();
  }

  // 顯示大卡，seconds 秒後自動收起（原版是 3 秒）。
  // canDismiss：是否允許玩家點掉提前收起。原版 BigCardScript.hideOnClick 一般
  // 大卡都可以點掉，但 power／nutrition 的 bonus 大卡例外，要等時間到才會
  // 叫出代幣選擇面板，玩家點了也不能跳過。
  function showBigCard(html, seconds, onHide, canDismiss = true) {
    // 前一張大卡若還在等收尾（onHide 還沒跑），代表它是被這次呼叫直接蓋掉的——
    // 例如平衡揭示 bonus 大卡還沒收起、玩家已經吃了下一張牌觸發新的大卡。
    // 過去用同一個 bigCardTimer，clearTimeout 會連同待執行的 onHide 一起吃掉，
    // 使依賴 onHide 才會清除的旗標（如 app.js 的 bonusRevealPending）永遠卡住。
    // 這裡先把它結清掉（补跑 onHide）再顯示新的大卡，而不是讓它憑空消失。
    if (pendingOnHide) settleBigCard();

    const box = document.getElementById('big-card');
    box.innerHTML = html;
    box.hidden = false;
    dismissible = canDismiss;
    pendingOnHide = onHide || null;
    bigCardTimer = setTimeout(settleBigCard, seconds * 1000);
  }

  function hideBigCard() {
    settleBigCard();
  }

  // 一般大卡可以點掉提前收起；power／nutrition 的例外（見 showBigCard 說明）
  document.getElementById('big-card').addEventListener('click', () => {
    const box = document.getElementById('big-card');
    if (box.hidden || !dismissible) return;
    settleBigCard();
  });

  return { flyToken, showBigCard, hideBigCard };
})();
