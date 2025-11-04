# Usage API

使用量の追跡と確認を行うAPIです。

## エンドポイント一覧

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| GET | `/api/usage` | 使用量統計の取得 | 必須 |

---

## 使用量統計の取得

現在の使用量と統計情報を取得します。削除されたリソースも含めた完全な使用履歴が確認できます。

**Endpoint:** `GET /api/usage`

**認証:** 必須（セッションまたはAPIキー）

**リクエスト例:**
```bash
curl -X GET https://your-domain.com/api/usage \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**レスポンス例:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "current": {
      "jobs": 5,
      "apiKeys": 2
    },
    "monthly": {
      "year": 2025,
      "month": 11,
      "executions": 234,
      "apiCalls": 1567,
      "billedAmount": 0,
      "paid": false
    },
    "daily": {
      "date": "2025-11-04T00:00:00.000Z",
      "executions": 12,
      "apiCalls": 45,
      "peakJobCount": 5,
      "peakApiKeyCount": 2
    },
    "todayActivity": {
      "jobsCreated": 2,
      "jobsDeleted": 1,
      "apiKeysCreated": 0,
      "apiKeysDeleted": 0
    }
  }
}
```

**レスポンスフィールド説明:**

### `current` - 現在の状態
| フィールド | 型 | 説明 |
|-----------|------|------|
| jobs | number | 現在のジョブ数 |
| apiKeys | number | 現在のAPIキー数 |

### `monthly` - 今月の使用量
| フィールド | 型 | 説明 |
|-----------|------|------|
| year | number | 年 |
| month | number | 月 (1-12) |
| executions | number | 総実行回数（削除されたジョブも含む） |
| apiCalls | number | 総API呼び出し回数（削除されたAPIキーも含む） |
| billedAmount | number | 課金額（従量課金プランの場合） |
| paid | boolean | 支払い済みかどうか |

### `daily` - 今日の使用量
| フィールド | 型 | 説明 |
|-----------|------|------|
| date | string | 日付 (ISO 8601形式) |
| executions | number | 今日の実行回数 |
| apiCalls | number | 今日のAPI呼び出し回数 |
| peakJobCount | number | 今日の最大ジョブ数 |
| peakApiKeyCount | number | 今日の最大APIキー数 |

### `todayActivity` - 今日のリソース活動
| フィールド | 型 | 説明 |
|-----------|------|------|
| jobsCreated | number | 今日作成したジョブ数 |
| jobsDeleted | number | 今日削除したジョブ数 |
| apiKeysCreated | number | 今日作成したAPIキー数 |
| apiKeysDeleted | number | 今日削除したAPIキー数 |

---

## 使用量追跡システム

ReCoronは、リソースの削除による制限回避を防ぐため、包括的な使用量追跡システムを実装しています。

### 追跡される情報

#### 1. 月次使用量（MonthlyUsage）
- **総実行回数**: 削除されたジョブの実行も含む
- **総API呼び出し回数**: 削除されたAPIキーの呼び出しも含む
- **課金情報**: 従量課金プランの場合の課金額

#### 2. 日次使用量（DailyUsage）
- **実行回数**: その日の実行回数
- **API呼び出し回数**: その日のAPI呼び出し回数
- **ピークリソース数**: その日の最大ジョブ数・APIキー数

#### 3. リソース履歴（ResourceHistory）
- **作成・削除履歴**: すべてのジョブとAPIキーの作成・削除を記録
- **タイムスタンプ**: いつ作成・削除されたか

### 制限の仕組み

#### ジョブ作成制限
```
現在のジョブ数 + 今日の作成・削除活動 < プラン制限 × 2
```

例: Freeプラン（最大5ジョブ）の場合
- 現在5ジョブ所有している → 新規作成不可
- 今日3回作成・3回削除している → 活動上限に達するまで作成可能

#### API呼び出し制限
```
今日のAPI呼び出し回数 < プランの日次制限
```

例: Freeプラン（最大100回/日）の場合
- 今日99回呼び出し済み → あと1回のみ可能
- 翌日0時にリセット

#### 実行回数制限
```
今月の実行回数 < プランの月次制限
```

例: Freeプラン（最大500回/月）の場合
- 今月499回実行済み → あと1回のみ可能
- 翌月1日にリセット

### 制限回避の防止

従来のシステムでは、リソースを削除することで制限をリセットできる問題がありましたが、新システムでは：

1. **削除しても履歴が残る**: `ResourceHistory`テーブルにすべての操作が記録される
2. **活動量も制限される**: 今日の作成・削除の合計回数も制限される
3. **累積カウント**: 削除されたリソースの使用量も累積される

**例:**
```
# 従来システム（回避可能）
1. 5ジョブ作成（上限到達）
2. 5ジョブ削除（制限リセット）
3. 再び5ジョブ作成可能 ← 問題！

# 新システム（回避不可）
1. 5ジョブ作成（上限到達）
2. 5ジョブ削除（履歴に記録）
3. 今日の活動: 作成5回 + 削除5回 = 10回
4. 新規作成不可 ← 活動上限により制限
```

---

## ユースケース

### 使用量の監視

```javascript
async function checkUsage() {
  const response = await fetch('https://your-domain.com/api/usage', {
    headers: {
      'Authorization': `Bearer ${apiToken}`
    }
  });
  
  const { data } = await response.json();
  
  // 月次実行回数を確認
  const usagePercent = (data.monthly.executions / planLimit.maxExecutions) * 100;
  
  if (usagePercent > 80) {
    console.warn(`使用量が${usagePercent}%に達しています`);
  }
  
  // 今日のAPI呼び出しを確認
  console.log(`今日のAPI呼び出し: ${data.daily.apiCalls}回`);
}
```

### アラートの設定

```javascript
async function checkAndAlert() {
  const { data } = await fetch('https://your-domain.com/api/usage', {
    headers: { 'Authorization': `Bearer ${apiToken}` }
  }).then(r => r.json());
  
  // 上限に近い場合アラート
  if (data.monthly.executions > planLimit.maxExecutions * 0.9) {
    await sendAlert('実行回数が上限の90%を超えました');
  }
  
  // 異常な活動を検知
  if (data.todayActivity.jobsCreated + data.todayActivity.jobsDeleted > 20) {
    await sendAlert('本日のジョブ作成・削除活動が異常に多いです');
  }
}
```

---

## エラーレスポンス

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
  "message": "使用量の取得に失敗しました",
  "data": null
}
```
