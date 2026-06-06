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
└────────────────────┬────────────────────────────┘
                     │ API (GROQ)
┌────────────────────▼────────────────────────────┐
│  Astro (Static Site Generator)                  │
│  ・output: static                               │
│  ・TypeScript                                   │
│  ・@astrojs/cloudflare アダプター               │
└────────────────────┬────────────────────────────┘
                     │ git push
┌────────────────────▼────────────────────────────┐
│  GitHub (tsubaki87/03_my-portfolio)             │
│  ・ソースコード管理                              │
│  ・push で自動デプロイ                           │
└────────────────────┬────────────────────────────┘
                     │ 自動ビルド
┌────────────────────▼────────────────────────────┐
│  Cloudflare Workers                             │
│  ・ホスティング（無料プラン）                    │
│  ・SESSION: KV Namespace                        │
│  ・URL: my-portfolio.hanada87.workers.dev       │
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
- name / avatar / bio / skills

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

`main` ブランチへの push で Cloudflare Workers に自動デプロイされます。

```bash
git add .
git commit -m "コミットメッセージ"
git push origin main
```

---

## 今後の予定

- [ ] Tailwind CSS の導入（デザイン改善）
- [ ] 制作実績にリッチテキスト（Portable Text）対応
- [ ] 制作実績にメイン画像表示
- [ ] OGP / SEO メタタグ対応
- [ ] カスタムドメイン設定
- [ ] Sanity Webhook による自動再デプロイ

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | [Astro](https://astro.build/) v6 |
| CMS | [Sanity](https://www.sanity.io/) |
| ホスティング | [Cloudflare Workers](https://workers.cloudflare.com/) |
| 言語 | TypeScript |
| ソース管理 | GitHub |
