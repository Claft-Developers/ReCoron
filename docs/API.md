# ReCoron API Documentation

## 概要

ReCoron APIは、Cron Jobの管理とAPIキーの管理を提供するRESTful APIです。

**Base URL:** `https://your-domain.com/api`

## 認証

すべてのAPIエンドポイントは認証が必要です。以下の2つの認証方法がサポートされています：

### 1. セッション認証
ブラウザベースのアクセスで使用されます。自動的にCookieで管理されます。

### 2. APIキー認証
プログラマティックアクセスで使用されます。

```http
Authorization: Bearer <your-api-token>
```

## レスポンス形式

すべてのAPIレスポンスは統一された形式で返されます。

### 成功レスポンス

```json
{
  "success": true,
  "message": "success",
  "data": { ... }
}
```

### エラーレスポンス

```json
{
  "success": false,
  "message": "エラーメッセージ",
  "data": null
}
```

### HTTPステータスコード

- `200` - 成功
- `201` - 作成成功
- `400` - バリデーションエラー
- `401` - 認証エラー
- `403` - 権限エラー
- `404` - リソースが見つからない
- `500` - サーバーエラー

---

## Jobs API

Cron Jobの管理を行うAPIです。

### ジョブ一覧の取得

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

### ジョブの作成

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

### 特定のジョブの取得

指定したIDのジョブを取得します。

**Endpoint:** `GET /api/jobs/{jobId}`

**必要なスコープ:** `read:jobs`

**リクエスト例:**
```bash
curl -X GET https://your-domain.com/api/jobs/cm2u8n9a50000xxxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス:** ジョブ一覧と同じ形式

---

### ジョブの更新

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

---

### ジョブの削除

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

### ジョブの手動実行

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

---

### ジョブの一括作成

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

## API Keys API

APIキーの管理を行うAPIです。

### APIキー一覧の取得

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

### APIキーの作成

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

### 特定のAPIキーの取得

指定したIDのAPIキーを取得します。

**Endpoint:** `GET /api/keys/{keyId}`

**必要なスコープ:** `read:keys`

**リクエスト例:**
```bash
curl -X GET https://your-domain.com/api/keys/key_xxxxx \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

---

### APIキーの削除

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

## レート制限

プランによって異なるレート制限が適用されます：

| プラン | 最小実行間隔 | 最大ジョブ数 |
|--------|------------|------------|
| HOBBY | 60分 | 5 |
| STARTER | 30分 | 20 |
| PRO | 15分 | 50 |
| BUSINESS | 5分 | 100 |

---

## セキュリティ

### APIキーの保護

- APIキーは環境変数に保存してください
- コードリポジトリにコミットしないでください
- 定期的にローテーションしてください
- 必要最小限のスコープのみを付与してください

### HTTPS必須

本番環境ではすべてのAPIリクエストにHTTPSを使用してください。

---

## サンプルコード

### Node.js

```javascript
const API_TOKEN = process.env.RECORON_API_TOKEN;
const BASE_URL = 'https://your-domain.com/api';

// レスポンスハンドラー
async function handleResponse(response) {
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'リクエストに失敗しました');
  }
  
  return data.data;
}

// ジョブ一覧を取得
async function getJobs() {
  const response = await fetch(`${BASE_URL}/jobs`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  return handleResponse(response);
}

// ジョブを作成
async function createJob(jobData) {
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  });
  return handleResponse(response);
}

// 複数のジョブを一括作成
async function createJobsBatch(jobsData) {
  const response = await fetch(`${BASE_URL}/jobs/batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobsData)
  });
  return handleResponse(response);
}

// ジョブを実行
async function executeJob(jobId) {
  const response = await fetch(`${BASE_URL}/jobs/${jobId}/execute`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  return handleResponse(response);
}

// ジョブを削除
async function deleteJob(jobId) {
  const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  return handleResponse(response);
}
```

### Python

```python
import requests
import os

API_TOKEN = os.environ['RECORON_API_TOKEN']
BASE_URL = 'https://your-domain.com/api'

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

def handle_response(response):
    """レスポンスハンドラー"""
    data = response.json()
    
    if not data.get('success'):
        raise Exception(data.get('message', 'リクエストに失敗しました'))
    
    return data.get('data')

# ジョブ一覧を取得
def get_jobs():
    response = requests.get(f'{BASE_URL}/jobs', headers=headers)
    return handle_response(response)

# ジョブを作成
def create_job(job_data):
    response = requests.post(
        f'{BASE_URL}/jobs',
        headers=headers,
        json=job_data
    )
    return handle_response(response)

# 複数のジョブを一括作成
def create_jobs_batch(jobs_data):
    response = requests.post(
        f'{BASE_URL}/jobs/batch',
        headers=headers,
        json=jobs_data
    )
    return handle_response(response)

# ジョブを実行
def execute_job(job_id):
    response = requests.post(
        f'{BASE_URL}/jobs/{job_id}/execute',
        headers=headers
    )
    return handle_response(response)

# ジョブを削除
def delete_job(job_id):
    response = requests.delete(
        f'{BASE_URL}/jobs/{job_id}',
        headers=headers
    )
    return handle_response(response)
```

### cURL

```bash
# ジョブ一覧を取得
curl -X GET https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# ジョブを作成
curl -X POST https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Job",
    "url": "https://api.example.com/endpoint",
    "method": "POST",
    "schedule": "0 9 * * *"
  }'

# 複数のジョブを一括作成
curl -X POST https://your-domain.com/api/jobs/batch \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Job 1",
      "url": "https://api.example.com/endpoint1",
      "method": "GET",
      "schedule": "0 9 * * *"
    },
    {
      "name": "Job 2",
      "url": "https://api.example.com/endpoint2",
      "method": "POST",
      "schedule": "0 * * * *"
    }
  ]'

# ジョブを実行
curl -X POST https://your-domain.com/api/jobs/JOB_ID/execute \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# ジョブを更新
curl -X PATCH https://your-domain.com/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false
  }'

# ジョブを削除
curl -X DELETE https://your-domain.com/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

---

## サポート

質問や問題が発生した場合は、以下のチャンネルでサポートを受けることができます：

- GitHub Issues: https://github.com/Claft-Developers/ReCoron/issues
- Email: support@recoron.example.com

---

## 変更履歴

### v1.1.0 (2025-11-04)
- レスポンス形式を統一 (`success`, `message`, `data` フィールド)
- バッチジョブ作成API (`POST /api/jobs/batch`) を追加
- エラーハンドリングの改善
- サンプルコードにエラーハンドリングを追加

### v1.0.0 (2025-11-04)
- 初回リリース
- Jobs API
- API Keys API
- 認証とスコープシステム
