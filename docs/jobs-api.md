# Jobs API

Cron Jobの管理を行うAPIです。

## エンドポイント一覧

| メソッド | エンドポイント | 説明 | スコープ |
|---------|---------------|------|---------|
| GET | `/api/jobs` | ジョブ一覧の取得 | `read:jobs` |
| POST | `/api/jobs` | ジョブの作成 | `write:jobs` |
| POST | `/api/jobs/batch` | ジョブの一括作成 | `write:jobs` |
| GET | `/api/jobs/{jobId}` | 特定のジョブの取得 | `read:jobs` |
| PATCH | `/api/jobs/{jobId}` | ジョブの更新 | `write:jobs` |
| DELETE | `/api/jobs/{jobId}` | ジョブの削除 | `write:jobs` |
| POST | `/api/jobs/{jobId}/execute` | ジョブの手動実行 | `write:jobs` |

---

## ジョブ一覧の取得

すべてのジョブを取得します。

**Endpoint:** `GET /api/jobs`

**必要なスコープ:** `read:jobs`

**リクエスト例:**
```bash
curl -X GET https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "success",
  "data": [
    {
      "id": "cm2u8n9a50000xxxxxx",
      "name": "Daily Report",
      "url": "https://api.example.com/report",
      "method": "POST",
      "schedule": "0 9 * * *",
      "timezone": "Asia/Tokyo",
      "enabled": true,
      "headers": {
        "Content-Type": "application/json"
      },
      "body": "{\"type\":\"daily\"}",
      "nextRunAt": "2025-11-05T09:00:00.000Z",
      "lastRunAt": "2025-11-04T09:00:00.000Z",
      "createdAt": "2025-11-01T00:00:00.000Z",
      "updatedAt": "2025-11-04T09:00:00.000Z",
      "userId": "user_xxxxx"
    }
  ]
}
```

---

## ジョブの作成

新しいジョブを作成します。

**Endpoint:** `POST /api/jobs`

**必要なスコープ:** `write:jobs`

**リクエストボディ:**
```json
{
  "name": "Daily Report",
  "url": "https://api.example.com/report",
  "method": "POST",
  "schedule": "0 9 * * *",
  "timezone": "Asia/Tokyo",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer xxx"
  },
  "body": "{\"type\":\"daily\"}"
}
```

**フィールド説明:**

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| name | string | ✓ | ジョブ名 |
| url | string | ✓ | 実行先のURL |
| method | string | ✓ | HTTPメソッド (GET, POST, PUT, PATCH, DELETE) |
| schedule | string | ✓ | Cron式 (5フィールド形式) |
| timezone | string | - | タイムゾーン (デフォルト: Asia/Tokyo) |
| headers | object | - | カスタムHTTPヘッダー |
| body | string | - | リクエストボディ (POST/PUT/PATCH時) |

**Cron式の例:**
- `0 9 * * *` - 毎日午前9時
- `*/5 * * * *` - 5分ごと
- `0 0 * * 0` - 毎週日曜日の午前0時
- `0 0 1 * *` - 毎月1日の午前0時

**リクエスト例:**
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

**レスポンス例:**
```json
{
  "success": true,
  "message": "created",
  "data": {
    "id": "cm2u8n9a50000xxxxxx",
    "name": "Daily Report",
    "url": "https://api.example.com/report",
    "method": "POST",
    "schedule": "0 9 * * *",
    "timezone": "Asia/Tokyo",
    "enabled": true,
    "headers": null,
    "body": null,
    "nextRunAt": "2025-11-05T09:00:00.000Z",
    "lastRunAt": null,
    "createdAt": "2025-11-04T10:00:00.000Z",
    "updatedAt": "2025-11-04T10:00:00.000Z",
    "userId": "user_xxxxx"
  }
}
```

---

## ジョブの一括作成

複数のジョブを一度に作成します。

**Endpoint:** `POST /api/jobs/batch`

**必要なスコープ:** `write:jobs`

**リクエストボディ:**
```json
[
  {
    "name": "Daily Report",
    "url": "https://api.example.com/report",
    "method": "POST",
    "schedule": "0 9 * * *",
    "timezone": "Asia/Tokyo"
  },
  {
    "name": "Hourly Check",
    "url": "https://api.example.com/check",
    "method": "GET",
    "schedule": "0 * * * *",
    "timezone": "Asia/Tokyo"
  }
]
```

**リクエスト例:**
```bash
curl -X POST https://your-domain.com/api/jobs/batch \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Daily Report",
      "url": "https://api.example.com/report",
      "method": "POST",
      "schedule": "0 9 * * *"
    },
    {
      "name": "Hourly Check",
      "url": "https://api.example.com/check",
      "method": "GET",
      "schedule": "0 * * * *"
    }
  ]'
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "2 件のジョブを作成しました",
  "data": {
    "count": 2,
    "jobs": [
      {
        "id": "cm2u8n9a50000xxxxxx",
        "name": "Daily Report",
        "url": "https://api.example.com/report",
        "method": "POST",
        "schedule": "0 9 * * *",
        "timezone": "Asia/Tokyo",
        "enabled": true,
        "nextRunAt": "2025-11-05T09:00:00.000Z",
        "createdAt": "2025-11-04T10:00:00.000Z"
      },
      {
        "id": "cm2u8n9a50001xxxxxx",
        "name": "Hourly Check",
        "url": "https://api.example.com/check",
        "method": "GET",
        "schedule": "0 * * * *",
        "timezone": "Asia/Tokyo",
        "enabled": true,
        "nextRunAt": "2025-11-04T11:00:00.000Z",
        "createdAt": "2025-11-04T10:00:00.000Z"
      }
    ]
  }
}
```

**エラーレスポンス例:**

プラン上限を超える場合:
```json
{
  "success": false,
  "message": "リクエストされたジョブ数 (10 件) を作成すると、プランの上限 (5 件) を超えてしまいます。現在のジョブ数: 3 件",
  "data": null
}
```

---

## 特定のジョブの取得

指定したIDのジョブを取得します。

**Endpoint:** `GET /api/jobs/{jobId}`

**必要なスコープ:** `read:jobs`

**リクエスト例:**
```bash
curl -X GET https://your-domain.com/api/jobs/cm2u8n9a50000xxxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス:** ジョブ一覧と同じ形式の単一ジョブオブジェクト

---

## ジョブの更新

既存のジョブを更新します。

**Endpoint:** `PATCH /api/jobs/{jobId}`

**必要なスコープ:** `write:jobs`

**リクエストボディ:**
```json
{
  "name": "Updated Job Name",
  "enabled": false
}
```

**更新可能なフィールド:**
- `name` - ジョブ名
- `url` - URL
- `method` - HTTPメソッド
- `schedule` - Cron式
- `timezone` - タイムゾーン
- `headers` - カスタムヘッダー
- `body` - リクエストボディ
- `enabled` - 有効/無効

**リクエスト例:**
```bash
curl -X PATCH https://your-domain.com/api/jobs/cm2u8n9a50000xxxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "ジョブを更新しました",
  "data": {
    "id": "cm2u8n9a50000xxxxxx",
    "name": "Updated Job Name",
    "enabled": false,
    ...
  }
}
```

---

## ジョブの削除

指定したジョブを削除します。

**Endpoint:** `DELETE /api/jobs/{jobId}`

**必要なスコープ:** `write:jobs`

**リクエスト例:**
```bash
curl -X DELETE https://your-domain.com/api/jobs/cm2u8n9a50000xxxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "ジョブを削除しました",
  "data": null
}
```

---

## ジョブの手動実行

指定したジョブを即座に実行します。

**Endpoint:** `POST /api/jobs/{jobId}/execute`

**必要なスコープ:** `write:jobs`

**リクエスト例:**
```bash
curl -X POST https://your-domain.com/api/jobs/cm2u8n9a50000xxxxxx/execute \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "job": {
      "id": "cm2u8n9a50000xxxxxx",
      "name": "Daily Report",
      "url": "https://api.example.com/report",
      "method": "POST",
      "schedule": "0 9 * * *",
      "enabled": true
    },
    "result": {
      "id": "log_xxxxx",
      "jobId": "cm2u8n9a50000xxxxxx",
      "url": "https://api.example.com/report",
      "status": 200,
      "successful": true,
      "type": "MANUAL",
      "durationMs": 234,
      "responseBody": "{\"status\":\"ok\"}",
      "responseHeaders": {
        "content-type": "application/json"
      },
      "startedAt": "2025-11-04T10:00:00.000Z",
      "finishedAt": "2025-11-04T10:00:00.234Z"
    }
  }
}
```
