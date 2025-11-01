# ReCoron

**ReCoron** は、開発者のための次世代Cron Job as a Serviceプラットフォームです。シンプルなAPIで簡単にスケジュールタスクを管理し、確実に実行できます。

## ✨ 特徴

- 🚀 **簡単なセットアップ** - 数分でスケジュールタスクを開始
- ⏰ **柔軟なスケジューリング** - 1分から60分毎まで対応
- 📊 **詳細なログ** - 実行履歴と結果を最大30日間保存
- 🔔 **Webhook通知** - ジョブの成功/失敗を即座に通知
- 🔐 **セキュアな認証** - GitHub/Google OAuth + メール/パスワード
- 💰 **従量課金制** - 使った分だけお支払い

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **認証**: Better Auth with Prisma
- **データベース**: PostgreSQL (Neon)
- **ORM**: Prisma with Accelerate
- **スタイリング**: Tailwind CSS v4
- **UI コンポーネント**: shadcn/ui
- **デプロイ**: Vercel

## 📋 料金プラン

### Free - $0/月
- 登録可能ジョブ: 3個
- 月間実行数: 100回
- スケジューリング: 60分毎
- ログ保存: 24時間

### Hobby - $3/月
- 登録可能ジョブ: 15個
- 月間実行数: 無制限
- スケジューリング: 15分毎
- ログ保存: 7日間
- Webhook通知対応

### Pro - $10/月 + 従量課金
- 50個無料 + $0.10/追加ジョブ
- 1,000回実行無料 + $0.005/実行
- スケジューリング: 1分毎
- ログ保存: 30日間
- Webhook通知対応
- 高度な監視とアラート

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### 前提条件

- Node.js 20.x以上
- PostgreSQLデータベース
- Better Auth用のOAuth認証情報（GitHub/Google）

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

## 📁 プロジェクト構造

```
recoron/
├── prisma/
│   └── schema.prisma          # データベーススキーマ
├── src/
│   ├── app/
│   │   ├── (main)/            # 公開ページ（ホーム、価格、認証）
│   │   │   ├── page.tsx       # ランディングページ
│   │   │   ├── pricing/       # 料金ページ
│   │   │   ├── login/         # ログインページ
│   │   │   └── signup/        # サインアップページ
│   │   ├── (protected)/       # 認証が必要なページ
│   │   │   └── jobs/          # ジョブ管理ダッシュボード
│   │   └── (api)/             # APIルート
│   │       └── auth/          # Better Auth エンドポイント
│   ├── components/
│   │   ├── layout/            # レイアウトコンポーネント
│   │   ├── pricing/           # 料金関連コンポーネント
│   │   └── ui/                # shadcn/ui コンポーネント
│   ├── lib/
│   │   ├── auth.ts            # Better Auth サーバー設定
│   │   ├── auth-client.ts     # Better Auth クライアント
│   │   └── prisma.ts          # Prisma クライアント
│   ├── constants/
│   │   └── plan.ts            # 料金プラン定義
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
- **Job**: スケジュールされたジョブ
- **RunningLog**: ジョブ実行履歴
- **Session/Account**: 認証セッション管理

## 📝 API エンドポイント

### Better Auth
- `POST /api/auth/sign-up/email` - メールサインアップ
- `POST /api/auth/sign-in/email` - メールログイン
- `GET /api/auth/sign-in/social` - ソーシャルログイン
- `POST /api/auth/sign-out` - ログアウト

### ジョブ管理（計画中）
- `GET /api/jobs` - ジョブ一覧取得
- `POST /api/jobs` - ジョブ作成
- `PUT /api/jobs/:id` - ジョブ更新
- `DELETE /api/jobs/:id` - ジョブ削除
- `GET /api/jobs/:id/logs` - 実行ログ取得

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js and the technologies used in ReCoron:

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