# ReCoron

**ReCoron** は、開発者のための次世代Cron Job as a Serviceプラットフォームです。シンプルなAPIで簡単にスケジュールタスクを管理し、確実に実行できます。

## ✨ 特徴

- 🚀 **簡単なセットアップ** - 数分でスケジュールタスクを開始
- ⏰ **柔軟なスケジューリング** - Cron式で自由にスケジュール設定
- 📊 **詳細なログ** - 実行履歴と結果を保存・確認可能
- 🔑 **APIキー認証** - セキュアなプログラマティックアクセス
- 🔐 **セキュアな認証** - GitHub/Google OAuth + メール/パスワード
- 📈 **使用量追跡** - 削除されたリソースも含む完全な使用履歴
- 🌐 **RESTful API** - 完全なAPI仕様でプログラマブル

## � ドキュメント

- **[API Documentation](https://your-domain.com/docs/api)** - 完全なAPI仕様
  - [概要](https://your-domain.com/docs/api/overview) - API の基本情報とレスポンス形式
  - [認証](https://your-domain.com/docs/api/authentication) - 認証方法とセキュリティ
  - [Jobs API](https://your-domain.com/docs/api/jobs) - ジョブ管理API
  - [Keys API](https://your-domain.com/docs/api/keys) - APIキー管理API
  - [Usage API](https://your-domain.com/docs/api/usage) - 使用量追跡と統計情報
  - [サンプルコード](https://your-domain.com/docs/api/examples) - Node.js、Python、cURL、TypeScriptの実装例

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **認証**: Better Auth with Prisma
- **データベース**: PostgreSQL (Neon)
- **ORM**: Prisma with Accelerate
- **スタイリング**: Tailwind CSS v4
- **UI コンポーネント**: shadcn/ui
- **デプロイ**: Vercel

## 📋 料金プラン

### Hobby - 無料
- 登録可能ジョブ: 5個
- 最小実行間隔: 60分
- ログ保存: 7日間

### Starter - $5/月
- 登録可能ジョブ: 20個
- 最小実行間隔: 30分
- ログ保存: 14日間

### Pro - $15/月
- 登録可能ジョブ: 50個
- 最小実行間隔: 15分
- ログ保存: 30日間
- 優先サポート

### Business - $50/月
- 登録可能ジョブ: 100個
- 最小実行間隔: 5分
- ログ保存: 90日間
- 専任サポート
- SLA保証

## 🚀 Getting Started

### 前提条件

- Node.js 20.x以上
- PostgreSQLデータベース
- Better Auth用のOAuth認証情報（GitHub/Google）

### クイックスタート（ユーザー向け）

1. **アカウント作成**
   - [ReCoron](https://your-domain.com)にアクセス
   - GitHub/Google、またはメールでサインアップ

2. **APIキーを作成**
   - ダッシュボードの[APIキー管理](https://your-domain.com/keys)ページへ
   - 新しいAPIキーを作成し、トークンを保存

3. **ジョブを作成**
   ```bash
   curl -X POST https://your-domain.com/api/jobs \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Daily Report",
       "url": "https://api.example.com/report",
       "method": "POST",
       "schedule": "0 9 * * *",
       "timezone": "Asia/Tokyo"
     }'
   ```

4. **実行を確認**
   - ダッシュボードの[ログページ](https://your-domain.com/logs)で実行結果を確認

詳細は[APIドキュメント](https://your-domain.com/docs/api)をご覧ください。

---

### 開発環境のセットアップ（開発者向け）

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/Claft-Developers/ReCoron.git
cd ReCoron

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.localを編集して必要な環境変数を設定

# データベースマイグレーション
npx prisma migrate dev

# 開発サーバーを起動
npm run dev
```

### 環境変数

`.env.local`に以下の環境変数を設定してください：

```bash
# Better Auth
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://...

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 開発サーバーの起動

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📁 プロジェクト構造

```
recoron/
├── docs/                      # APIドキュメント (Markdown)
│   ├── API.md                 # API目次
│   ├── overview.md            # API概要
│   ├── authentication.md      # 認証ドキュメント
│   ├── jobs-api.md            # Jobs API仕様
│   ├── keys-api.md            # Keys API仕様
│   └── examples.md            # サンプルコード
├── prisma/
│   └── schema.prisma          # データベーススキーマ
├── src/
│   ├── app/
│   │   ├── (main)/            # 公開ページ
│   │   │   ├── page.tsx       # ランディングページ
│   │   │   ├── docs/          # ドキュメントページ
│   │   │   │   ├── page.tsx   # ドキュメント目次
│   │   │   │   └── api/       # APIドキュメント
│   │   │   │       ├── page.tsx           # API目次
│   │   │   │       ├── overview/          # 概要ページ
│   │   │   │       ├── authentication/    # 認証ページ
│   │   │   │       ├── jobs/              # Jobs APIページ
│   │   │   │       ├── keys/              # Keys APIページ
│   │   │   │       └── examples/          # サンプルコードページ
│   │   │   ├── pricing/       # 料金ページ
│   │   │   ├── login/         # ログインページ
│   │   │   └── signup/        # サインアップページ
│   │   ├── (protected)/       # 認証が必要なページ
│   │   │   ├── jobs/          # ジョブ管理
│   │   │   ├── keys/          # APIキー管理
│   │   │   └── logs/          # 実行ログ
│   │   └── api/               # APIルート
│   │       ├── auth/          # Better Auth
│   │       ├── jobs/          # Jobs API
│   │       │   ├── route.ts           # ジョブ一覧・作成
│   │       │   ├── [jobId]/route.ts   # ジョブ取得・更新・削除
│   │       │   └── batch/route.ts     # バッチ作成
│   │       ├── keys/          # Keys API
│   │       └── admin/cron/    # Cron実行エンドポイント
│   ├── components/
│   │   ├── layout/            # レイアウトコンポーネント
│   │   ├── pricing/           # 料金関連コンポーネント
│   │   ├── job/               # ジョブ関連コンポーネント
│   │   ├── keys/              # APIキー関連コンポーネント
│   │   └── ui/                # shadcn/ui コンポーネント
│   ├── lib/
│   │   ├── auth.ts            # Better Auth サーバー設定
│   │   ├── auth-client.ts     # Better Auth クライアント
│   │   ├── prisma.ts          # Prisma クライアント
│   │   └── job.ts             # ジョブ実行ロジック
│   ├── constants/
│   │   └── plan.ts            # 料金プラン定義
│   ├── utils/
│   │   ├── token.ts           # トークン生成・検証
│   │   ├── date.ts            # 日付処理
│   │   └── response.ts        # APIレスポンス統一
│   └── styles/
│       └── globals.css        # グローバルスタイル
└── package.json
```

## 🔐 認証フロー

ReCoronはBetter Authを使用した認証システムを実装しています：

1. **ソーシャルログイン**: GitHub/Google OAuth
2. **メール/パスワード**: 従来の認証方式
3. **セッション管理**: Prismaアダプターでデータベースに保存
4. **保護されたルート**: `(protected)`グループでSSR認証チェック

## 🗄️ データベーススキーマ

### 主要なモデル

- **User**: ユーザー情報とプラン管理
- **Job**: スケジュールされたジョブ（URL、メソッド、Cron式など）
- **RunningLog**: ジョブ実行履歴（ステータス、レスポンス、実行時間など）
- **ApiKey**: APIキーとスコープ管理
- **Session/Account**: 認証セッション管理

詳細は[Prisma Schema](./prisma/schema.prisma)を参照してください。

## 📝 API エンドポイント

完全なAPI仕様は[APIドキュメント](https://your-domain.com/docs/api)をご覧ください。

### 認証 (Better Auth)
- `POST /api/auth/sign-up/email` - メールサインアップ
- `POST /api/auth/sign-in/email` - メールログイン
- `GET /api/auth/sign-in/social` - ソーシャルログイン
- `POST /api/auth/sign-out` - ログアウト

### Jobs API
- `GET /api/jobs` - ジョブ一覧取得
- `POST /api/jobs` - ジョブ作成
- `POST /api/jobs/batch` - ジョブ一括作成
- `GET /api/jobs/:id` - ジョブ詳細取得
- `PATCH /api/jobs/:id` - ジョブ更新
- `DELETE /api/jobs/:id` - ジョブ削除
- `POST /api/jobs/:id/execute` - ジョブ手動実行

### Keys API
- `GET /api/keys` - APIキー一覧取得
- `POST /api/keys` - APIキー作成
- `GET /api/keys/:id` - APIキー詳細取得
- `DELETE /api/keys/:id` - APIキー削除

### Usage API
- `GET /api/usage` - 使用量統計取得

### 管理
- `POST /api/admin/cron` - Cron実行エンドポイント（内部用）

詳細な仕様、リクエスト/レスポンス例、サンプルコードは[APIドキュメント](https://your-domain.com/docs/api)をご覧ください。

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📖 Learn More

### ReCoron
- [API Documentation](https://your-domain.com/docs/api) - 完全なAPI仕様とサンプルコード
- [Pricing](https://your-domain.com/pricing) - 料金プランの詳細

### Technologies
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Better Auth Documentation](https://www.better-auth.com/docs) - authentication library documentation.
- [Prisma Documentation](https://www.prisma.io/docs) - database ORM guide.
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework.
- [shadcn/ui](https://ui.shadcn.com/) - re-usable components built with Radix UI and Tailwind CSS.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚢 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### デプロイ前のチェックリスト

- [ ] 環境変数を設定（`BETTER_AUTH_URL`, `DATABASE_URL`, OAuth認証情報）
- [ ] データベースマイグレーションを実行
- [ ] `NEXT_PUBLIC_BETTER_AUTH_URL`を本番URLに設定
- [ ] OAuth認証のリダイレクトURIを本番URLに追加

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

コントリビューションを歓迎します！以下の手順でご協力ください：

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 License

このプロジェクトは MIT ライセンスの下で公開されています。

## 👥 Authors

- **Claft Developers** - [GitHub](https://github.com/Claft-Developers)

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) - ホスティングプラットフォーム
- [Neon](https://neon.tech) - サーバーレスPostgresデータベース
- [Better Auth](https://www.better-auth.com) - 認証ライブラリ
- [Resend](https://resend.com) - デザインインスピレーション