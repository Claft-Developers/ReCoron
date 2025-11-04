# ReCoron API Documentation

ReCoron APIは、Cron Jobの管理とAPIキーの管理を提供するRESTful APIです。

## ドキュメント目次

このドキュメントは以下のセクションに分かれています：

- **[概要 (overview.md)](./overview.md)** - API の基本情報、レスポンス形式、HTTPステータスコード、プラン制限
- **[認証 (authentication.md)](./authentication.md)** - 認証方法、スコープシステム、セキュリティのベストプラクティス
- **[Jobs API (jobs-api.md)](./jobs-api.md)** - ジョブ管理のための全エンドポイント
- **[Keys API (keys-api.md)](./keys-api.md)** - APIキー管理のための全エンドポイント
- **[Usage API (usage-api.md)](./usage-api.md)** - 使用量追跡と統計情報
- **[サンプルコード (examples.md)](./examples.md)** - Node.js、Python、cURL、TypeScript のサンプルコード

## クイックスタート

### 1. APIキーの作成

まず、ダッシュボードでAPIキーを作成します：

```bash
curl -X POST https://your-domain.com/api/keys \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First API Key",
    "scopes": ["read:jobs", "write:jobs"]
  }'
```

### 2. ジョブの作成

APIキーを使用してジョブを作成します：

```bash
curl -X POST https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Report",
    "url": "https://api.example.com/report",
    "method": "POST",
    "schedule": "0 9 * * *"
  }'
```

### 3. ジョブの実行

作成したジョブを手動で実行します：

```bash
curl -X POST https://your-domain.com/api/jobs/JOB_ID/execute \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### 4. 使用量の確認

現在の使用量を確認します：

```bash
curl -X GET https://your-domain.com/api/usage \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## 主な機能

- ✅ **Cron Jobの管理** - 定期的なHTTPリクエストをスケジュール
- ✅ **APIキー認証** - セキュアなプログラマティックアクセス
- ✅ **バッチ作成** - 複数のジョブを一度に作成
- ✅ **実行ログ** - すべてのジョブ実行の詳細な履歴
- ✅ **スコープシステム** - 細かい権限管理
- ✅ **使用量追跡** - 削除されたリソースも含む完全な使用履歴
- ✅ **複数プラン** - 用途に応じたプランを選択可能

## API仕様

**Base URL:** `https://your-domain.com/api`

**認証方法:**
- セッション認証 (ブラウザ)
- APIキー認証 (プログラマティックアクセス)

**レスポンス形式:** JSON

詳細は各ドキュメントページをご覧ください。

