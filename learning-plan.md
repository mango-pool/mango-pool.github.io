# AI 學習計劃(5 個月實戰路線)

> 建立日期:2026-08-16
> 學習者:有多語言開發經驗的工程師(.NET / TS 等),Python 需速成
> 投入:每週 12–15 小時
> 目標:① 作品集 4 個 AI 專案 ② 一個上線的真實產品 ③ 全程 $0 部署成本

---

## 總覽

| 週次 | 階段 | 產出 | 狀態 |
|------|------|------|------|
| W1–2 | 階段 0:Python 速成 + 環境建置 | 練習小工具 | ⬜ |
| W3–6 | 專案 1:LLM CLI 工具(API 基礎) | 作品集 #1 | ⬜ |
| W7–11 | 專案 2:RAG 知識庫應用 | 作品集 #2 | ⬜ |
| W12–16 | 專案 3:Agent 應用 | 作品集 #3 | ⬜ |
| W17–22 | 專案 4:真實產品 MVP → 上線 | 你的產品 🚀 | ⬜ |

**三條並行線**(貫穿全程):

- **AI 工具流**(每週 ~1h):日常開發全程使用 Claude Code / Copilot,累積個人提示詞庫
- **學理深水區**(選修,每週 ~2h):Karpathy《Neural Networks: Zero to Hero》,從反向傳播親手做到 GPT
- **作品集包裝**(每專案收尾 ~2h):README + 線上 demo + 一篇短文

**已完成里程碑**:

- ✅ 2026-08-16 GitHub Pages 作品集首頁上線:https://mango-pool.github.io/(repo:`mango-pool.github.io`)

---

## 部署策略($0 方案)

| 用途 | 平台 | 備註 |
|------|------|------|
| 作品集首頁 | GitHub Pages | 已上線,之後把 index.html 長成作品集 |
| 專案 1(CLI) | 不需網站 | GitHub repo + README + asciinema 終端機錄影 |
| 專案 2、3(RAG / Agent) | Hugging Face Spaces | 跑 Python(Gradio/Streamlit),API key 放 Space secrets |
| 專案 4(產品) | Render / Fly.io 免費層 | 有真實流量再考慮付費 |

⚠️ 鐵則:**API key 永遠不進前端、不進 git**。用環境變數 + secrets 管理。

---

## 階段 0:Python 速成 + 環境建置(W1–2)

**目標**:以現有多語言經驗快速對映 Python 慣用法,建好之後五個月的開發環境。

### 實作

- [ ] 安裝 `uv`(Python 版本 + 套件管理,一支工具搞定)
- [ ] Python 核心速成(對照你熟的語言學):型別提示、dataclass、comprehension、context manager、async/await、例外處理
- [ ] 專案結構慣例:`pyproject.toml`、虛擬環境、`ruff`(lint/format)、`pytest`
- [ ] 練習:寫一個小 CLI(如批次改檔名、csv 統計),用 Claude Code 輔助但**逐行看懂**

### 必修學理(~3h)

- [ ] 3Blue1Brown〈But what is a GPT?〉+〈Attention in transformers〉(視覺化直覺)
- [ ] Karpathy〈Intro to Large Language Models〉演講(1h,建立全局觀)

### 完成定義

練習 CLI 放上 GitHub(repo + README),能口頭解釋「LLM 是在做 next-token prediction」給朋友聽。

---

## 專案 1:LLM CLI 工具(W3–6)

**題目建議**:終端機文件助手——餵它檔案,可翻譯/摘要/改寫,支援串流輸出。

### 技術清單

- [ ] Claude API / OpenAI API:訊息結構、system prompt、多輪對話
- [ ] 串流輸出(streaming)
- [ ] 結構化輸出(JSON mode / tool schema)
- [ ] Function calling 初體驗
- [ ] Token 計算與成本估算(做一個 `--cost` 旗標顯示本次花費)
- [ ] 錯誤處理:rate limit、重試、超時

### 必修學理(~4h)

- [ ] Tokenization 是什麼(為何 LLM 數不清 strawberry 有幾個 r)
- [ ] 取樣參數:temperature、top-p 實驗(同一 prompt 跑 10 次觀察)
- [ ] Prompt engineering 原則(Anthropic prompt engineering 文件)

### 深水區(選修)

- [ ] Karpathy〈Let's build the GPT Tokenizer〉

### 完成定義

GitHub repo + README(含安裝/使用說明)+ asciinema 錄影 demo + 短文一篇(學到什麼)。

---

## 專案 2:RAG 知識庫應用(W7–11)

**題目建議**:把自己的技術筆記/某領域文件變成可問答的知識庫 Web 應用。

### 技術清單

- [ ] Embedding API、向量相似度(cosine)
- [ ] 向量資料庫(chromadb 或 sqlite-vec 起步)
- [ ] Chunking 策略:大小、重疊、按結構切
- [ ] 檢索 → 增強 → 生成的完整管線
- [ ] 引用來源(回答附出處)
- [ ] 檢索品質評估:準備 20 題測試集,量測命中率
- [ ] 進階(時間允許):hybrid search、reranking
- [ ] UI:Gradio 或 Streamlit,部署到 Hugging Face Spaces

### 必修學理(~5h)

- [ ] Embedding 原理與向量空間直覺
- [ ] 為什麼需要 RAG(context 窗口、幻覺、知識時效)
- [ ] 檢索評估指標:precision / recall / MRR
- [ ] DeepLearning.AI 短課程(RAG 相關,免費,挑一門)

### 完成定義

Hugging Face Spaces 上可公開試玩 + repo + README(含架構圖與評估數據)+ 短文。

---

## 專案 3:Agent 應用(W12–16)

**題目建議**:能自主完成多步驟任務的助理(如:研究一個主題→彙整→產報告;或查 API→分析→行動)。

### 技術清單

- [ ] Agent loop:LLM 決策 → 執行工具 → 觀察結果 → 再決策
- [ ] 工具設計:schema 定義、錯誤回饋給模型
- [ ] MCP(Model Context Protocol)概念與實作一個簡單 MCP server
- [ ] 多步驟規劃與中間狀態管理
- [ ] Guardrails:預算上限、迴圈上限、危險操作確認
- [ ] Agent 評估:任務成功率測試集

### 必修學理(~4h)

- [ ] Anthropic〈Building Effective Agents〉(何時該用 workflow、何時才用 agent)
- [ ] ReAct 論文(讀 blog 導讀版即可)
- [ ] 工具呼叫的底層:模型輸出的其實是文字,執行是你的程式做的

### 完成定義

Hugging Face Spaces demo + repo + README + 短文。

⚠️ **W12 起**:開一個 `產品點子.md`,記錄日常撞到的痛點,W17 從中選產品題目。

---

## 專案 4:真實產品 MVP → 上線(W17–22)

**題目**:從 `產品點子.md` 挑一個**你自己真的會用**的痛點。前三個專案的技術任意組合。

### 里程碑

- [ ] W17:定題,寫一頁 spec(解決誰的什麼問題、MVP 範圍、成功指標)
- [ ] W18–20:MVP 開發(砍功能,只留核心路徑)
- [ ] W21:部署上線 + 找 5 個真人試用,收集回饋
- [ ] W22:迭代一輪 + 寫上線覆盤文

### 必修學理(~4h)

- [ ] LLMOps 基礎:線上監控、成本控制、錯誤追蹤
- [ ] 線上評估:怎麼知道改 prompt 之後變好還是變壞
- [ ] 安全:prompt injection 防護、輸出過濾、使用量限制

### 完成定義

公開網址 + 至少 5 個真實使用者用過 + 覆盤文。

---

## 每週儀式(週日 30 分鐘)

1. 本週實際投入時數?產出了什麼(commit / demo / 筆記)?
2. 對照本階段檢核表,打勾進度
3. 寫下週的 3 個具體目標(小到一定做得完)
4. 卡住超過 2 小時的問題 → 記下來,問 AI 或社群

**彈性規則**:每階段最多延 1 週;但不允許跳過「完成定義」直接進下一階段。

---

## 資源總表

| 類型 | 資源 |
|------|------|
| 視覺化直覺 | 3Blue1Brown Neural Networks 系列(YouTube) |
| 全局觀 | Karpathy〈Intro to LLMs〉演講 |
| 深水區 | Karpathy《Neural Networks: Zero to Hero》系列 |
| Prompt | Anthropic Prompt Engineering 文件 |
| Agent | Anthropic〈Building Effective Agents〉 |
| 短課程 | DeepLearning.AI short courses(免費) |
| API 文件 | docs.anthropic.com、platform.openai.com |
| 部署 | Hugging Face Spaces 文件、GitHub Pages 文件 |

---

## 作品集連結(隨進度更新)

- 首頁:https://mango-pool.github.io/
- 專案 1:(待補)
- 專案 2:(待補)
- 專案 3:(待補)
- 產品:(待補)
