# API Keys API

APIキーの管理を行うAPIです。

## エンドポイント一覧

| メソッド | エンドポイント | 説明 | スコープ |
|---------|---------------|------|---------|
| GET | `/api/keys` | APIキー一覧の取得 | `read:keys` |
| POST | `/api/keys` | APIキーの作成 | `write:keys` |
| GET | `/api/keys/{keyId}` | 特定のAPIキーの取得 | `read:keys` |
| PUT | `/api/keys/{keyId}` | APIキーの更新 | `write:keys` |
| DELETE | `/api/keys/{keyId}` | APIキーの削除 | `write:keys` |

---

## APIキー一覧の取得

すべてのAPIキーを取得します。

**Endpoint:** `GET /api/keys`

**必要なスコープ:** `read:keys`

**リクエスト例:**
```bash
curl -X GET https://your-domain.com/api/keys \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "success",
  "data": [
    {
      "id": "key_xxxxx",
      "name": "Production API Key",
      "keyHash": "hash_xxxxx",
      "scopes": ["read:jobs", "write:jobs"],
      "enabled": true,
      "expiresAt": "2026-11-04T00:00:00.000Z",
      "lastUsed": "2025-11-04T09:30:00.000Z",
      "createdAt": "2025-11-01T00:00:00.000Z",
      "userId": "user_xxxxx"
    }
  ]
}
```

---

## APIキーの作成

新しいAPIキーを作成します。

**Endpoint:** `POST /api/keys`

**必要なスコープ:** `write:keys`

**リクエストボディ:**
```json
{
  "name": "Production API Key",
  "scopes": ["read:jobs", "write:jobs", "read:logs"]
}
```

**フィールド説明:**

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| name | string | ✓ | APIキー名 |
| scopes | string[] | ✓ | 付与するスコープのリスト |

**利用可能なスコープ:**
- `read:jobs` - ジョブ情報の取得
- `write:jobs` - ジョブの作成・更新・削除・実行
- `read:logs` - 実行ログ情報の取得
- `write:logs` - 実行ログの作成・削除
- `read:keys` - APIキー情報の取得
- `write:keys` - APIキーの作成・削除

**リクエスト例:**
```bash
curl -X POST https://your-domain.com/api/keys \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "scopes": ["read:jobs", "write:jobs", "read:logs"]
  }'
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "created",
  "data": {
    "apiKey": {
      "id": "key_xxxxx",
      "name": "Production API Key",
      "keyHash": "hash_xxxxx",
      "scopes": ["read:jobs", "write:jobs", "read:logs"],
      "enabled": true,
      "expiresAt": "2026-11-04T00:00:00.000Z",
      "lastUsed": null,
      "createdAt": "2025-11-04T10:00:00.000Z",
      "userId": "user_xxxxx"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

⚠️ **重要:** `token` はこのレスポンスでのみ返されます。必ず安全な場所に保存してください。

---

## 特定のAPIキーの取得

指定したIDのAPIキーを取得します。

**Endpoint:** `GET /api/keys/{keyId}`

**必要なスコープ:** `read:keys`

**リクエスト例:**
```bash
curl -X GET https://your-domain.com/api/keys/key_xxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "key_xxxxx",
    "name": "Production API Key",
    "keyHash": "hash_xxxxx",
    "scopes": ["read:jobs", "write:jobs"],
    "enabled": true,
    "expiresAt": "2026-11-04T00:00:00.000Z",
    "lastUsed": "2025-11-04T09:30:00.000Z",
    "createdAt": "2025-11-01T00:00:00.000Z",
    "userId": "user_xxxxx"
  }
}
```

---

## APIキーの更新

既存のAPIキーの名前と権限を更新します。

**Endpoint:** `PUT /api/keys/{keyId}`

**必要なスコープ:** `write:keys`

**リクエストボディ:**
```json
{
  "name": "Updated API Key",
  "scopes": ["read:jobs", "write:jobs"]
}
```

**フィールド説明:**

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| name | string | ✓ | 新しいAPIキー名 |
| scopes | string[] | ✓ | 新しいスコープのリスト |

**リクエスト例:**
```bash
curl -X PUT https://your-domain.com/api/keys/key_xxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Production API Key",
    "scopes": ["read:jobs", "write:jobs"]
  }'
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "APIキーが更新されました",
  "data": null
}
```

⚠️ **注意:** APIキーの更新では、トークン自体は変更されません。トークンを再生成したい場合は、新しいキーを作成して古いキーを削除してください。

---

## APIキーの削除

指定したAPIキーを削除します。

**Endpoint:** `DELETE /api/keys/{keyId}`

**必要なスコープ:** `write:keys`

**リクエスト例:**
```bash
curl -X DELETE https://your-domain.com/api/keys/key_xxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "APIキーが削除されました",
  "data": null
}
```

---

## APIキーの管理ベストプラクティス

### キーのローテーション

定期的にAPIキーを再生成することをお勧めします：

1. 新しいAPIキーを作成
2. アプリケーションを新しいキーで更新
3. 動作を確認
4. 古いキーを削除

### 最小権限の原則

必要最小限のスコープのみを付与してください：

```json
// ❌ 悪い例: すべてのスコープを付与
{
  "name": "My Key",
  "scopes": ["read:jobs", "write:jobs", "read:logs", "write:logs", "read:keys", "write:keys"]
}

// ✅ 良い例: 必要なスコープのみ
{
  "name": "Read-only Key",
  "scopes": ["read:jobs", "read:logs"]
}
```

### キーの命名

APIキーには用途を示す明確な名前を付けてください：

- ✅ `Production Server API Key`
- ✅ `CI/CD Pipeline Key`
- ✅ `Monitoring Service Key`
- ❌ `Key 1`
- ❌ `Test`
