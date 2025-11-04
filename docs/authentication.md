# 認証

すべてのAPIエンドポイントは認証が必要です。以下の2つの認証方法がサポートされています。

## 1. セッション認証

ブラウザベースのアクセスで使用されます。自動的にCookieで管理されます。

## 2. APIキー認証

プログラマティックアクセスで使用されます。

```http
Authorization: Bearer <your-api-token>
```

### 使用例

```bash
curl -X GET https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## スコープシステム

APIキーには特定のスコープを付与できます。スコープは、APIキーがアクセスできるリソースと操作を制限します。

### 利用可能なスコープ

| スコープ | 説明 |
|---------|------|
| `read:jobs` | ジョブ情報の取得 |
| `write:jobs` | ジョブの作成・更新・削除・実行 |
| `read:logs` | 実行ログ情報の取得 |
| `write:logs` | 実行ログの作成・削除 |
| `read:keys` | APIキー情報の取得 |
| `write:keys` | APIキーの作成・削除 |

### スコープの使用例

```json
{
  "name": "Production API Key",
  "scopes": ["read:jobs", "write:jobs", "read:logs"]
}
```

## セキュリティのベストプラクティス

### APIキーの保護

- ✅ APIキーは環境変数に保存してください
- ✅ コードリポジトリにコミットしないでください
- ✅ 定期的にローテーションしてください
- ✅ 必要最小限のスコープのみを付与してください

### 環境変数の例

```bash
# .env
RECORON_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### HTTPS必須

本番環境ではすべてのAPIリクエストにHTTPSを使用してください。

## エラーレスポンス

### 認証エラー (401)

```json
{
  "success": false,
  "message": "認証が必要です",
  "data": null
}
```

### 権限エラー (403)

```json
{
  "success": false,
  "message": "このリソースにアクセスする権限がありません",
  "data": null
}
```

### 無効なトークン

```json
{
  "success": false,
  "message": "無効なトークンです",
  "data": null
}
```
