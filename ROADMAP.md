# StockMemo ロードマップ

投資家向け AI リサーチプラットフォーム。「決算資料を読む時間を、60秒に。」

- **本番**: https://stockmemo.io
- **方針**: シンプル・保守性重視・LP/Waitlist を壊さない・UI 日本語・米国株+日本株の両軸（将来）

---

## Phase 1 — 米国株 MVP（機能を先に積む）

シンプルな1カラム UI のまま、銘柄ページに表示する**中身**を順に追加する。
UI の大改修は Phase 2（中身が揃ってから）。

| Phase | 内容 | 状態 |
|-------|------|------|
| **1a** | ルート分離 `(marketing)` / `(platform)` | ✅ |
| **1b** | Supabase（`stocks`, `ai_stock_summaries`）+ seed 5銘柄 | ✅ |
| **1c** | 銘柄検索 UI + `GET /api/stocks` | ✅ |
| **1d** | 株価・チャート（Finnhub + Yahoo フォールバック） | ✅ |
| **1e** | 関連ニュース（Finnhub `/company-news` + Yahoo フォールバック） | ✅ |
| **1f** | AI 要約（Bull / Bear / Key Risks / What to Watch） | ✅ |
| **1g** | 日本株 MVP（主要銘柄 seed、7203 等） | 次 |

### Phase 1 の API ルート

```
/                          → LP (marketing)
/app                       → 銘柄検索
/app/stocks/[symbol]       → 銘柄ページ
/api/waitlist              → 触らない
/api/stocks                → 一覧・検索
/api/stocks/[symbol]/quote → 株価
/api/stocks/[symbol]/chart → チャート
/api/stocks/[symbol]/news  → ニュース
/api/stocks/[symbol]/summary → AI要約（1f）
```

---

## Phase 2 — プラットフォーム UI（中身が揃ったら再配置）

Phase 1 で quote / chart / news / AI が揃ったあと、参考デザインに近い**ダッシュボード型レイアウト**へ移行する。
`(platform)` 配下のみ変更。LP / Waitlist は触らない。

| Phase | 内容 | タイミング |
|-------|------|-----------|
| **2a** | **ダッシュボードシェル** — 左サイドバー、ヘッダー常設検索、マルチカラム（概況 / チャート / ニュース+AI） | 1f 完了後 |
| **2b** | **チャート強化** — ローソク足、期間タブ拡張（1日 / 3か月 / 6か月）、RSI / MACD | 2a 完了後 |
| **2c** | **グローバル概況** — 主要指数（S&P / NASDAQ / DOW）、市場オープン表示、世界時計 | 2b 完了後 |

### UI 移行の考え方

1. **1f まで**: 既存コンポーネント（`StockChartPanel`, `StockNewsPanel`, AI パネル）をそのまま使い、縦積みで動作確認
2. **2a**: 同じコンポーネントをグリッドに再配置（ロジック変更なし、レイアウトのみ）
3. **2b–2c**: 見た目・データ密度を参考デザインに近づける

---

## Phase 3 — ユーザー機能

| Phase | 内容 |
|-------|------|
| **3a** | Watchlist（銘柄保存・一覧） |
| **3b** | Portfolio（保有銘柄・損益概算） |
| **3c** | 認証（Supabase Auth） |

---

## Phase 4 — 課金

| Phase | 内容 |
|-------|------|
| **4a** | Stripe 連携（Free / Pro プラン） |
| **4b** | AI 要約の利用制限・Pro 機能 |

---

## Phase 5 — 日本株本格化

| Phase | 内容 |
|-------|------|
| **5a** | J-Quants API 連携 |
| **5b** | 決算短信・適時開示の要約 |
| **5c** | 日本株向けニュース・チャート最適化 |

---

## データソース

| 用途 | プライマリ | フォールバック |
|------|-----------|---------------|
| 株価 | Finnhub `/quote` | — |
| チャート | Finnhub `/stock/candle` | Yahoo Finance |
| ニュース | Finnhub `/company-news` | Yahoo Finance |
| AI 要約 | OpenAI (`gpt-4o-mini`) + Supabase キャッシュ | — |

---

## 開発ルール

- 実装前: 目的・変更内容・影響範囲を共有
- 実装後: 変更ファイル・理由・確認方法を共有
- LP / Waitlist 変更禁止（明示指示がある場合を除く）
- 不要なライブラリ追加禁止
- UI 文言は `lib/i18n/ja.ts` に集約

---

## 次のアクション

**Phase 1g** — 日本株 MVP（主要銘柄 seed）。完了後 **Phase 2a** でダッシュボード UI に移行。
