# Webhooks API

## 概要

ReCoronのWebhook機能を使用すると、ジョブの実行結果をリアルタイムで指定したエンドポイントに通知できます。各ジョブに対してWebhookを設定することで、実行の成功・失敗、レスポンスデータ、実行時間などの詳細情報を自動的に受信できます。

## セキュリティ

### 署名検証

すべてのWebhookリクエストには、HMAC-SHA256署名が含まれています。これにより、リクエストが本当にReCoronから送信されたものであることを検証できます。

**検証方法:**

1. リクエストボディ（JSON文字列）を取得
2. Webhook作成時に返された`secret`を使用してHMAC-SHA256ハッシュを計算
3. 計算した署名と`X-Signature`ヘッダーの値を比較

**Node.js検証例:**

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// Express.jsの例
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.headers['x-signature'];
    const secret = process.env.RECORON_WEBHOOK_SECRET; // Webhook作成時に取得したsecret
    
    if (!verifyWebhookSignature(req.body.toString(), signature, secret)) {
        return res.status(401).send('Invalid signature');
    }
    
    const payload = JSON.parse(req.body.toString());
    // Webhookペイロードを処理
    console.log('Job executed:', payload.job.name);
    console.log('Status:', payload.result.status);
    
    res.status(200).send('OK');
});
```

**Python検証例:**

```python
import hmac
import hashlib
import json

def verify_webhook_signature(payload: str, signature: str, secret: str) -> bool:
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

# Flask の例
from flask import Flask, request

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Signature')
    secret = 'your_webhook_secret'  # Webhook作成時に取得したsecret
    payload = request.get_data(as_text=True)
    
    if not verify_webhook_signature(payload, signature, secret):
        return 'Invalid signature', 401
    
    data = json.loads(payload)
    # Webhookペイロードを処理
    print(f"Job executed: {data['job']['name']}")
    print(f"Status: {data['result']['status']}")
    
    return 'OK', 200
```

## Webhookペイロード

ジョブが実行されると、以下の形式のJSONペイロードが指定されたエンドポイントにPOSTされます。

### リクエストヘッダー

| ヘッダー | 説明 |
|---------|------|
| `Content-Type` | `application/json` |
| `X-Webhook-ID` | このWebhook配信の一意なID（重複検出に使用可能） |
| `X-Signature` | HMAC-SHA256署名（ペイロードの検証に使用） |
| カスタムヘッダー | Webhook作成時に指定したヘッダー |

### ペイロード構造

```typescript
{
  // Webhook配信ID（べき等性の確保に使用可能）
  id: string;
  
  // 実行されたジョブの詳細
  job: {
    id: string;
    name: string;
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    schedule: string;      // Cron式
    timezone: string;
    headers: object | null;
    body: string | null;
    enabled: boolean;
    count: number;         // 累計実行回数
    lastRunAt: Date;
    nextRunAt: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
  
  // 実行結果
  result: {
    status: "success" | "failure";  // 実行の成功/失敗
    code: number;                    // HTTPステータスコード（0=失敗）
    
    // ターゲットURLからのレスポンス
    response: {
      headers: object;  // レスポンスヘッダー
      body: string;     // レスポンスボディ
    };
    
    // タイミング情報
    startedAt: Date;    // 実行開始時刻
    finishedAt: Date;   // 実行終了時刻
    durationMs: number; // 実行時間（ミリ秒）
    
    // トリガータイプ
    trigger: "AUTO" | "MANUAL";  // AUTO=スケジュール実行, MANUAL=手動実行
  };
  
  // Webhook送信情報
  webhook: {
    sendAt: Date;  // Webhook送信時刻
  };
}
```

### ペイロード例

```json
{
  "id": "wh_abc123def456",
  "job": {
    "id": "job_xyz789",
    "name": "API Health Check",
    "url": "https://api.example.com/health",
    "method": "GET",
    "schedule": "*/5 * * * *",
    "timezone": "Asia/Tokyo",
    "headers": {
      "Authorization": "Bearer token123"
    },
    "body": null,
    "enabled": true,
    "count": 42,
    "lastRunAt": "2025-11-05T10:30:00Z",
    "nextRunAt": "2025-11-05T10:35:00Z",
    "createdAt": "2025-11-01T00:00:00Z",
    "updatedAt": "2025-11-05T10:30:00Z",
    "userId": "user_123"
  },
  "result": {
    "status": "success",
    "code": 200,
    "response": {
      "headers": {
        "content-type": "application/json",
        "x-response-time": "25ms"
      },
      "body": "{\"status\":\"ok\",\"uptime\":12345}"
    },
    "startedAt": "2025-11-05T10:30:00.000Z",
    "finishedAt": "2025-11-05T10:30:00.150Z",
    "durationMs": 150,
    "trigger": "AUTO"
  },
  "webhook": {
    "sendAt": "2025-11-05T10:30:00.200Z"
  }
}
```

## API エンドポイント

### Webhook一覧の取得

```
GET /api/webhooks
```

**必要なスコープ:** `read:logs`

**レスポンス例:**

```json
{
  "success": true,
  "data": [
    {
      "id": "webhook_123",
      "userId": "user_123",
      "jobId": "job_xyz789",
      "endpoint": "https://your-server.com/webhook",
      "secret": "whsec_abc123...",
      "headers": {
        "X-Custom-Header": "value"
      },
      "createdAt": "2025-11-05T10:00:00Z",
      "updatedAt": "2025-11-05T10:00:00Z"
    }
  ]
}
```

### Webhookの作成

```
POST /api/webhooks
```

**必要なスコープ:** `write:logs`

**リクエストボディ:**

```json
{
  "jobId": "job_xyz789",
  "endpoint": "https://your-server.com/webhook",
  "headers": {
    "Authorization": "Bearer your-token",
    "X-Custom-Header": "value"
  }
}
```

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": "webhook_123",
    "userId": "user_123",
    "jobId": "job_xyz789",
    "endpoint": "https://your-server.com/webhook",
    "secret": "whsec_a1b2c3d4e5f6...",
    "headers": {
      "Authorization": "Bearer your-token",
      "X-Custom-Header": "value"
    },
    "createdAt": "2025-11-05T10:00:00Z",
    "updatedAt": "2025-11-05T10:00:00Z"
  }
}
```

> ⚠️ **重要**: `secret`はWebhook作成時のレスポンスでのみ返されます。署名検証に必要なため、安全に保存してください。

### 特定ジョブのWebhook取得

```
GET /api/webhooks/:jobId
```

**必要なスコープ:** `read:logs`

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": "webhook_123",
    "userId": "user_123",
    "jobId": "job_xyz789",
    "endpoint": "https://your-server.com/webhook",
    "secret": "whsec_abc123...",
    "headers": {
      "X-Custom-Header": "value"
    },
    "createdAt": "2025-11-05T10:00:00Z",
    "updatedAt": "2025-11-05T10:00:00Z"
  }
}
```

### Webhookの更新

```
PATCH /api/webhooks/:jobId
```

**必要なスコープ:** `write:logs`

**リクエストボディ:**

```json
{
  "endpoint": "https://new-server.com/webhook",
  "headers": {
    "Authorization": "Bearer new-token"
  }
}
```

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": "webhook_123",
    "userId": "user_123",
    "jobId": "job_xyz789",
    "endpoint": "https://new-server.com/webhook",
    "secret": "whsec_abc123...",
    "headers": {
      "Authorization": "Bearer new-token"
    },
    "createdAt": "2025-11-05T10:00:00Z",
    "updatedAt": "2025-11-05T11:00:00Z"
  }
}
```

### Webhookの削除

```
DELETE /api/webhooks/:jobId
```

**必要なスコープ:** `write:logs`

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "message": "Webhookが削除されました"
  }
}
```

## ベストプラクティス

### 1. べき等性の確保

同じWebhookが複数回配信される可能性があるため、`X-Webhook-ID`ヘッダーを使用して重複を検出することを推奨します。

```javascript
const processedWebhooks = new Set();

app.post('/webhook', (req, res) => {
    const webhookId = req.headers['x-webhook-id'];
    
    // 既に処理済みの場合はスキップ
    if (processedWebhooks.has(webhookId)) {
        return res.status(200).send('Already processed');
    }
    
    // 処理
    processWebhook(req.body);
    processedWebhooks.add(webhookId);
    
    res.status(200).send('OK');
});
```

### 2. タイムアウト処理

Webhookエンドポイントは迅速に応答する必要があります（推奨: 5秒以内）。時間のかかる処理は非同期で実行してください。

```javascript
app.post('/webhook', async (req, res) => {
    // すぐに200を返す
    res.status(200).send('OK');
    
    // 非同期で処理
    setImmediate(async () => {
        try {
            await processWebhook(req.body);
        } catch (error) {
            console.error('Webhook processing error:', error);
        }
    });
});
```

### 3. エラーハンドリング

Webhookエンドポイントは常に有効なHTTP応答を返す必要があります。

```javascript
app.post('/webhook', async (req, res) => {
    try {
        await processWebhook(req.body);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error:', error);
        // エラーが発生してもWebhookの受信は成功として扱う
        res.status(200).send('Error logged');
    }
});
```

### 4. セキュリティ

- **必ず署名を検証**してください
- `secret`は環境変数として安全に保存
- HTTPSエンドポイントのみを使用
- 必要に応じてIPホワイトリストを設定

### 5. ログとモニタリング

- Webhook受信を記録
- 失敗したWebhookを追跡
- 処理時間をモニタリング

## トラブルシューティング

### Webhookが届かない

1. **エンドポイントの確認**: URLが正しく、HTTPSを使用しているか確認
2. **ファイアウォール**: エンドポイントが外部からアクセス可能か確認
3. **タイムアウト**: エンドポイントが5秒以内に応答しているか確認
4. **エラーログ**: ReCoronのジョブログでWebhook送信エラーを確認

### 署名検証エラー

1. **Secret**: 正しいsecretを使用しているか確認
2. **ペイロード**: リクエストボディを変更せずに検証に使用
3. **エンコーディング**: ペイロードを文字列として扱う（パース前）

### 重複配信

- `X-Webhook-ID`を使用して重複を検出
- データベースまたはキャッシュに処理済みIDを記録

## サンプルコード

### Next.js API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.RECORON_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(payload);
    const expected = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get('x-signature');
    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }
    
    const payload = await req.text();
    if (!verifySignature(payload, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const data = JSON.parse(payload);
    
    // Webhookを処理
    console.log(`Job ${data.job.name} executed:`, data.result.status);
    
    return NextResponse.json({ received: true });
}
```

### Express.js

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
const WEBHOOK_SECRET = process.env.RECORON_WEBHOOK_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.headers['x-signature'];
    const payload = req.body.toString();
    
    // 署名検証
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(payload);
    const expected = hmac.digest('hex');
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(401).send('Invalid signature');
    }
    
    const data = JSON.parse(payload);
    
    // Webhookを処理
    console.log(`Job executed: ${data.job.name}`);
    console.log(`Status: ${data.result.status}`);
    console.log(`Duration: ${data.result.durationMs}ms`);
    
    res.status(200).send('OK');
});

app.listen(3000, () => {
    console.log('Webhook receiver listening on port 3000');
});
```

## まとめ

ReCoronのWebhook機能を使用することで:

- ✅ ジョブ実行をリアルタイムで監視
- ✅ 自動的なアラートと通知システムの構築
- ✅ 他のサービスとの統合
- ✅ カスタムログと分析の実装

詳細については、[メインAPI ドキュメント](./API.md)も参照してください。
