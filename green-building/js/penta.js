// ── 五芒星（雷達圖）─────────────────────────────────────
// 純繪圖元件：給它五個 0～1 的值，它畫出一張 SVG。
// 不認識建材、不認識 Token —— 資料怎麼算是 game.js 的事，
// 這樣日後把暫用對照換成試算表的正式 Token，這個檔案完全不用動。
//
// 版面依客戶手繪圖 doc/img/新增 點陣圖影像.bmp：
//   五個頂點由正上方順時針 → 環境影響／經濟性／耐久性／永續性／舒適性

const PENTA_RINGS = 4;      // 背景格線圈數
const PENTA_R     = 78;     // 最外圈半徑
const PENTA_CX    = 150;    // 畫布中心
const PENTA_CY    = 116;

// 第 i 個頂點在半徑 r 上的座標（正上方起算，順時針）
function pentaPoint(i, n, r) {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
  return [PENTA_CX + r * Math.cos(a), PENTA_CY + r * Math.sin(a)];
}

const pts = arr => arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// axes: [{ label, value }]，value 為 0～1；value 為 null 代表「這一軸還沒有資料」
function drawPenta(host, axes) {
  const n = axes.length;
  const hasData = axes.every(a => typeof a.value === 'number');
  let svg = `<svg viewBox="0 0 300 232" class="penta-svg" role="img" aria-label="五個面向的雷達圖">`;

  // 背景格線：由外而內的同心五邊形
  for (let ring = PENTA_RINGS; ring >= 1; ring--) {
    const r = PENTA_R * ring / PENTA_RINGS;
    svg += `<polygon class="penta-ring" points="${pts([...Array(n)].map((_, i) => pentaPoint(i, n, r)))}"/>`;
  }
  // 由中心射向每個頂點的軸線
  for (let i = 0; i < n; i++) {
    const [x, y] = pentaPoint(i, n, PENTA_R);
    svg += `<line class="penta-axis" x1="${PENTA_CX}" y1="${PENTA_CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  }

  // 資料多邊形
  if (hasData) {
    const dataPts = axes.map((a, i) => pentaPoint(i, n, PENTA_R * Math.max(0, Math.min(1, a.value))));
    svg += `<polygon class="penta-area" points="${pts(dataPts)}"/>`;
    for (const [x, y] of dataPts)
      svg += `<circle class="penta-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4"/>`;
  }

  // 軸標籤：推到頂點外側，左右兩側再依方向微調對齊
  axes.forEach((a, i) => {
    const [x, y] = pentaPoint(i, n, PENTA_R + 20);
    const dx = x - PENTA_CX;
    const anchor = Math.abs(dx) < 6 ? 'middle' : (dx > 0 ? 'start' : 'end');
    svg += `<text class="penta-label" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}">${a.label}</text>`;
  });

  svg += `</svg>`;
  host.innerHTML = svg;
}
