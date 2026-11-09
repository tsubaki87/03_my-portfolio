# My Portfolio

Sanity + Astro + Cloudflare Workers で構築したポートフォリオサイト。

**本番URL**: https://hanada87.com/ （さくらのレンタルサーバ。2026-11-09〜）  
**予備URL**: https://my-portfolio.hanada87.workers.dev （Cloudflare Workers。同じ内容）  
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
│  ・push で Cloudflare が自動ビルド＆デプロイ     │
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
- title / slug / mainImage / youtubeUrl / description / tags / featured（トップに表示） / publishedAt

**about（プロフィール）**
- name / avatar / bio / skills / companyProfile（会社概要の表） / address / tel / mapEmbed（Google マップ）

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
`main` ブランチに `git push` するだけで自動デプロイされます（`wrangler deploy` の手動実行は不要）。

```bash
git add .
git commit -m "コミットメッセージ"
git push origin main
```

```
main ブランチに git push
        ↓ Cloudflare Workers Builds が検知（GitHub App「Cloudflare Workers and Pages」経由）
Cloudflare が自動ビルド＆デプロイ
        ↓
本番サイトに反映
```

- 仕組みは GitHub Actions ではなく、Cloudflare ダッシュボード側の **Workers Builds**（Worker `my-portfolio` と GitHub リポジトリの連携）です。
- ビルド結果は GitHub のコミットの Checks（`Workers Builds: my-portfolio`）、または Cloudflare ダッシュボードの Workers & Pages → my-portfolio → Builds で確認できます。

#### 手動デプロイ（緊急時のみ）
自動デプロイが使えない場合は、ローカルから直接デプロイすることもできます（事前に `npx wrangler login` が必要）。

```bash
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

### hanada87.com（さくらのレンタルサーバ）への自動アップロード

2026-11-09 から、同じ内容を **https://hanada87.com/** にも置いています（GitHub Actions `.github/workflows/deploy-sakura.yml`）。

```
main に push ／ Sanity で公開（Webhook → GitHub の repository_dispatch「sanity-publish」）／ Actions 画面から手動
        ↓ GitHub Actions がビルド（npm ci → npm run build）
dist/client を tar.gz にして SSH で送る
        ↓ さくら側の ~/bin/deploy-portfolio.sh（このリポジトリの deploy/sakura/ と同じもの）が受け取る
~/www/hanada87/ のポートフォリオのファイルだけを置き換える
```

- **同じ場所に 87website・persona・boat_race・w_accounting02 などのサイトがある。** スクリプトが置き換えるのは `index.html`・`about`・`projects`・`_astro`・favicon・`og-default.png` だけ。知らない名前が届いたら何も置かずに止まる
- **新しいページ（例: `src/pages/contact.astro`）を足したとき**は、さくらの `~/bin/deploy-portfolio.sh` の `ITEMS` にも名前を足す（足さないと Actions が「知らない名前」で失敗する）。`deploy/sakura/deploy-portfolio.sh` も同じに直して commit する
- 直前の版はさくらの `~/portfolio-deploy/prev/` に控えてある（戻すときは、その中身を `~/www/hanada87/` に写す）
- 送るための SSH 鍵は GitHub の Secret `SAKURA_DEPLOY_KEY`（さくら側で `deploy-portfolio.sh` しか動かせない制限付き。`authorized_keys` の `restrict,command=...`）。さくらのサーバーの公開鍵は Variable `SAKURA_KNOWN_HOSTS`
- Sanity の Webhook「GitHub Actions (hanada87.com)」は GitHub のトークン（fine-grained、`03_my-portfolio` の Contents: Read and write のみ）を使う。**トークンの期限は 2027-11-09**。期限前に作り直して、Sanity の Webhook の `Authorization: Bearer …` を差し替える
- Cloudflare 用の Webhook・Workers Builds はそのまま（workers.dev も今まで通り更新される）
- 結果は GitHub の Actions タブ「Deploy to sakura (hanada87.com)」で見られる

---

## 今後の予定

- [x] Tailwind CSS の導入（デザイン改善）
- [x] 制作実績にメイン画像表示
- [x] Sanity Webhook による自動再デプロイ
- [x] git push による自動デプロイ（Cloudflare Workers Builds）
- [x] OGP / Twitter Card メタタグ対応（※現在 noindex 設定中。コンテンツ整備後に解除）
- [x] hanada87.com で公開（さくらへ自動アップロード、2026-11-09）
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
