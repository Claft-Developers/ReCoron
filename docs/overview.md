# 概要

## ReCoron APIとは

ReCoron APIは、Cron Jobの管理とAPIキーの管理を提供するRESTful APIです。

**Base URL:** `https://your-domain.com/api`

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

## HTTPステータスコード

| ステータスコード | 説明 |
|----------------|------|
| `200` | 成功 |
| `201` | 作成成功 |
| `400` | バリデーションエラー |
| `401` | 認証エラー |
| `403` | 権限エラー |
| `404` | リソースが見つからない |
| `500` | サーバーエラー |

## プランと制限

プランによって異なるレート制限が適用されます：

| プラン | 最小実行間隔 | 最大ジョブ数 |
|--------|------------|------------|
| HOBBY | 60分 | 5 |
| STARTER | 30分 | 20 |
| PRO | 15分 | 50 |
| BUSINESS | 5分 | 100 |

## サポート

質問や問題が発生した場合は、以下のチャンネルでサポートを受けることができます：

- GitHub Issues: https://github.com/Claft-Developers/ReCoron/issues
- Email: support@recoron.example.com

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
