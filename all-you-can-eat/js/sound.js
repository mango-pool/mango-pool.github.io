// ── 音效 ──────────────────────────────────────────────────
const Sound = (() => {
  const FILES = {
    button: 'sound/ButtonClickSound.wav',
    digest: 'sound/Digest.wav',
    token: 'sound/Token.wav',
    bonus: 'sound/Balance and Bonus Card.mp3',
    end: 'sound/End of Game.wav',
  };
  const cache = {};
  let muted = false;

  function play(name) {
    if (muted || !FILES[name]) return;
    // 每次都用新的 Audio，讓同一個音效可以重疊播放
    const a = cache[name] ? cache[name].cloneNode() : new Audio(FILES[name]);
    if (!cache[name]) cache[name] = a;
    a.play().catch(() => { /* 使用者尚未互動過，瀏覽器會擋，忽略即可 */ });
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  const isMuted = () => muted;

  return { play, toggleMute, isMuted };
})();
