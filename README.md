# My Portfolio

Sanity + Astro + Cloudflare Workers で構築したポートフォリオサイト。

**本番URL**: https://my-portfolio.hanada87.workers.dev  
**CMS管理画面**: https://tsubaki87-portfolio.sanity.studio/

---

## システム構成

```
┌─────────────────────────────────────────────────┐
│  Sanity (Headless CMS)                          │
│  ・コンテンツ管理（制作実績・プロフィール）      │
│  ・Studio: tsubaki87-portfolio.sanity.studio    │
└────────┬───────────────────────────┬────────────┘
         │ API (GROQ)                │ Webhook
         │                           │（コンテンツ更新時に自動発火）
┌────────▼────────────────┐ ┌────────▼────────────────────────┐
│  Astro (SSG)            │ │  Cloudflare Workers             │
│  ・output: static       │ │  ・ホスティング（無料プラン）    │
│  ・TypeScript           │ │  ・自動ビルド＆デプロイ          │
│  ・Tailwind CSS v4      │ │  ・URL: my-portfolio.hanada87   │
│  ・@astrojs/cloudflare  │ │        .workers.dev             │
└────────────────────┬────┘ └─────────────────────────────────┘
                     │ git push
┌────────────────────▼────────────────────────────┐
│  GitHub (tsubaki87/03_my-portfolio)             │
│  ・ソースコード管理                              │
│  ・main ブランチ保護（削除・force push 禁止）    │
└─────────────────────────────────────────────────┘
```

---

## ページ構成

| URL | 内容 |
|-----|------|
| `/` | トップ（プロフィール概要 + 最新3件の実績） |
| `/projects` | 制作実績一覧 |
| `/projects/[slug]` | 制作実績詳細 |
| `/about` | プロフィール詳細 |

---

## コンテンツ型（Sanity スキーマ）

**project（制作実績）**
- title / slug / mainImage / description / tags / publishedAt

**about（プロフィール）**
- name / bio / skills

---

## 環境構築（新しいマシンでの手順）

### 必要環境
- Node.js v22 以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/tsubaki87/03_my-portfolio.git
cd 03_my-portfolio

# 依存パッケージをインストール
npm install

# 環境変数ファイルを作成
echo "PUBLIC_SANITY_PROJECT_ID=zrdvidgx" > .env
echo "PUBLIC_SANITY_DATASET=production" >> .env

# ローカル起動
npm run dev
# http://localhost:4321 で確認
```

---

## 開発コマンド

```bash
npm run dev      # ローカル開発サーバー起動
npm run build    # 本番ビルド
npm run preview  # ビルド結果のプレビュー
```

---

## デプロイ

### コード変更時
`git push` 後、手動で `wrangler deploy` を実行してください（GitHub Actions 未設定）。

```bash
git add .
git commit -m "コミットメッセージ"
git push origin main

npm run build
npx wrangler deploy
```

### コンテンツ更新時
Sanity Studio でコンテンツを更新・公開するだけで自動デプロイされます（git push 不要）。

```
Sanity でコンテンツを更新・保存
        ↓ Webhook が自動発火
Cloudflare が自動ビルド＆デプロイ（2〜3分）
        ↓
本番サイトに反映
```

---

## 今後の予定

- [x] Tailwind CSS の導入（デザイン改善）
- [x] 制作実績にメイン画像表示
- [x] Sanity Webhook による自動再デプロイ
- [x] OGP / Twitter Card メタタグ対応（※現在 noindex 設定中。コンテンツ整備後に解除）
- [ ] カスタムドメイン設定（新規ドメイン取得時）
- [ ] 制作実績にリッチテキスト（Portable Text）対応

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | [Astro](https://astro.build/) v6 |
| CMS | [Sanity](https://www.sanity.io/) |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) v4 |
| ホスティング | [Cloudflare Workers](https://workers.cloudflare.com/) |
| 言語 | TypeScript |
| ソース管理 | GitHub |
