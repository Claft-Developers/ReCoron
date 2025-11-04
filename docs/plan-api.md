# Plan Management API

プラン管理と変更を行うAPIです。

## エンドポイント一覧

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| GET | `/api/plan/simulate` | プラン変更のシミュレーション | 必須 |
| POST | `/api/plan` | プランの変更 | 必須 |
| GET | `/api/admin/plan` | プラン変更のシミュレーション（管理者用） | 管理者 |
| POST | `/api/admin/plan` | プランの変更（管理者用） | 管理者 |

---

## プラン変更のシミュレーション

プランを変更した場合の影響を事前に確認します。実際にはプランを変更しません。

**Endpoint:** `GET /api/plan/simulate?plan=HOBBY`

**認証:** 必須（セッションまたはAPIキー）

**クエリパラメータ:**

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| plan | string | ✓ | 新しいプラン (FREE, HOBBY, PRO) |

**リクエスト例:**
```bash
curl -X GET "https://your-domain.com/api/plan/simulate?plan=FREE" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例（ダウングレード時）:**
```json
{
  "success": true,
  "message": "プラン変更のシミュレーション結果",
  "data": {
    "currentPlan": "HOBBY",
    "newPlan": "FREE",
    "isDowngrade": true,
    "jobs": {
      "current": 8,
      "limit": 5,
      "willBeDisabled": 4,
      "jobsToDisable": [
        {
          "id": "job_1",
          "name": "High Frequency Job",
          "reason": "実行間隔 5分 < 最小 30分"
        },
        {
          "id": "job_2",
          "name": "Old Job 1",
          "reason": "ジョブ数制限超過（上限: 5個）"
        },
        {
          "id": "job_3",
          "name": "Old Job 2",
          "reason": "ジョブ数制限超過（上限: 5個）"
        },
        {
          "id": "job_4",
          "name": "Old Job 3",
          "reason": "ジョブ数制限超過（上限: 5個）"
        }
      ]
    },
    "apiKeys": {
      "current": 3,
      "limit": 10,
      "willBeDisabled": 0,
      "keysToDisable": []
    }
  }
}
```

**レスポンス例（アップグレード時）:**
```json
{
  "success": true,
  "message": "プラン変更のシミュレーション結果",
  "data": {
    "currentPlan": "FREE",
    "newPlan": "HOBBY",
    "isDowngrade": false,
    "jobs": {
      "current": 5,
      "limit": 20,
      "willBeDisabled": 0,
      "jobsToDisable": []
    },
    "apiKeys": {
      "current": 2,
      "limit": 10,
      "willBeDisabled": 0,
      "keysToDisable": []
    }
  }
}
```

---

## プランの変更

ユーザーのプランを変更します。ダウングレードの場合、制限を超えるリソースが自動的に無効化されます。

**Endpoint:** `POST /api/plan`

**認証:** 必須（セッションまたはAPIキー）

**リクエストボディ:**
```json
{
  "plan": "HOBBY"
}
```

**フィールド説明:**

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| plan | string | ✓ | 新しいプラン (FREE, HOBBY, PRO) |

**リクエスト例:**
```bash
curl -X POST https://your-domain.com/api/plan \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "FREE"
  }'
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "プランを HOBBY から FREE に変更しました",
  "data": {
    "changed": true,
    "oldPlan": "HOBBY",
    "newPlan": "FREE",
    "restrictions": {
      "plan": {
        "old": "HOBBY",
        "new": "FREE"
      },
      "jobs": {
        "total": 8,
        "disabled": 4,
        "disabledByCount": 3,
        "disabledByInterval": 1,
        "disabledJobIds": [
          "job_1",
          "job_2",
          "job_3",
          "job_4"
        ]
      },
      "apiKeys": {
        "total": 3,
        "disabled": 0,
        "disabledKeyIds": []
      }
    },
    "disabledResources": {
      "jobs": [
        {
          "id": "job_1",
          "name": "High Frequency Job",
          "schedule": "*/5 * * * *",
          "url": "https://api.example.com/endpoint",
          "updatedAt": "2025-11-04T10:00:00.000Z"
        },
        {
          "id": "job_2",
          "name": "Old Job 1",
          "schedule": "0 * * * *",
          "url": "https://api.example.com/endpoint",
          "updatedAt": "2025-11-04T10:00:00.000Z"
        }
      ],
      "apiKeys": []
    }
  }
}
```

---

## プラン降格時の動作

### 自動無効化の条件

プランをダウングレードした場合、以下のリソースが自動的に無効化されます：

#### 1. ジョブの無効化

以下の条件のいずれかに該当するジョブが無効化されます：

**a) 実行間隔の制限**
- 新しいプランの最小実行間隔を満たさないジョブ
- 例: HOBBYからFREEにダウングレード（30分未満の間隔のジョブが無効化）

**b) ジョブ数の制限**
- 新しいプランのジョブ数上限を超える場合
- 古い順に自動選択されて無効化
- 実行間隔で無効化されるジョブは除外してカウント

**無効化の優先順位:**
1. 実行間隔が短すぎるジョブ
2. 作成日時が古いジョブ

#### 2. APIキーの無効化

- APIキー数が上限（10個）を超える場合
- 古い順に自動選択されて無効化

### プラン別の制限

| プラン | ジョブ数 | 最小実行間隔 | API呼び出し |
|--------|---------|------------|------------|
| FREE | 5個 | 30分 | 100回/日 |
| HOBBY | 20個 | 5分 | 500回/日 |
| PRO | 100個 | 1分 | 2,000回/日 |

### 無効化されたリソースの確認

無効化されたリソースは以下の方法で確認できます：

```bash
# ジョブ一覧を取得（enabled: false のジョブを確認）
curl -X GET https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# APIキー一覧を取得（enabled: false のキーを確認）
curl -X GET https://your-domain.com/api/keys \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### 無効化されたリソースの再有効化

プランをアップグレードしても、自動的には再有効化されません。手動で再有効化する必要があります：

```bash
# ジョブを有効化
curl -X PATCH https://your-domain.com/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

---

## 管理者用API

### プラン変更のシミュレーション（管理者）

**Endpoint:** `GET /api/admin/plan?userId=xxx&plan=HOBBY`

**認証:** 管理者権限（`X-Admin-Token` ヘッダー）

**リクエスト例:**
```bash
curl -X GET "https://your-domain.com/api/admin/plan?userId=user_123&plan=FREE" \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN"
```

### プランの変更（管理者）

**Endpoint:** `POST /api/admin/plan`

**認証:** 管理者権限（`X-Admin-Token` ヘッダー）

**リクエストボディ:**
```json
{
  "userId": "user_123",
  "plan": "HOBBY"
}
```

**リクエスト例:**
```bash
curl -X POST https://your-domain.com/api/admin/plan \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "plan": "FREE"
  }'
```

---

## ユースケース

### プラン変更前の確認

```javascript
// プラン変更の影響を確認
async function checkPlanChange(newPlan) {
  const response = await fetch(
    `https://your-domain.com/api/plan/simulate?plan=${newPlan}`,
    {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    }
  );
  
  const { data } = await response.json();
  
  if (data.isDowngrade) {
    console.log(`警告: ${data.jobs.willBeDisabled} 個のジョブが無効化されます`);
    
    data.jobs.jobsToDisable.forEach(job => {
      console.log(`- ${job.name}: ${job.reason}`);
    });
    
    // ユーザーに確認を求める
    const confirmed = confirm('プランをダウングレードしますか？');
    if (!confirmed) return;
  }
  
  // プランを変更
  await changePlan(newPlan);
}
```

### プランの変更

```javascript
async function changePlan(newPlan) {
  const response = await fetch('https://your-domain.com/api/plan', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ plan: newPlan })
  });
  
  const { data } = await response.json();
  
  if (data.changed) {
    console.log(`プランを変更しました: ${data.oldPlan} → ${data.newPlan}`);
    
    if (data.restrictions.jobs.disabled > 0) {
      console.log(`${data.restrictions.jobs.disabled} 個のジョブが無効化されました`);
      
      // 無効化されたジョブの一覧を表示
      data.disabledResources.jobs.forEach(job => {
        console.log(`- ${job.name} (${job.schedule})`);
      });
    }
  }
}
```

### 無効化されたジョブの再有効化

```javascript
async function reEnableJobs() {
  // すべてのジョブを取得
  const response = await fetch('https://your-domain.com/api/jobs', {
    headers: { 'Authorization': `Bearer ${apiToken}` }
  });
  
  const { data: jobs } = await response.json();
  
  // 無効化されているジョブを抽出
  const disabledJobs = jobs.filter(job => !job.enabled);
  
  console.log(`${disabledJobs.length} 個の無効化されたジョブが見つかりました`);
  
  // 再有効化するジョブを選択
  for (const job of disabledJobs) {
    const shouldEnable = confirm(`"${job.name}" を有効化しますか？`);
    
    if (shouldEnable) {
      await fetch(`https://your-domain.com/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: true })
      });
      
      console.log(`"${job.name}" を有効化しました`);
    }
  }
}
```

---

## エラーレスポンス

### 400 Bad Request
無効なプランが指定されました。

```json
{
  "success": false,
  "message": "有効なプランを指定してください: FREE, HOBBY, PRO",
  "data": null
}
```

### 401 Unauthorized
認証が必要です。

```json
{
  "success": false,
  "message": "認証が必要です",
  "data": null
}
```

### 500 Internal Server Error
サーバーエラーが発生しました。

```json
{
  "success": false,
  "message": "プラン変更に失敗しました",
  "data": null
}
```
