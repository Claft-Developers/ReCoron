// 全プランで比較する機能リスト
const ALL_FEATURES = [
    { id: "jobs", label: "登録可能ジョブ数" },
    { id: "executions", label: "月間実行数" },
    { id: "scheduling", label: "スケジューリング間隔" },
    { id: "dynamicJobs", label: "API経由の動的ジョブ登録" },
    { id: "apiCalls", label: "API呼び出し制限" },
    { id: "logs", label: "ログ保存期間" },
    { id: "webhook", label: "Webhook通知" },
    { id: "monitoring", label: "リアルタイム監視" },
    { id: "support", label: "サポート" },
] as const;

const PRICING_TIERS = [
    {
        title: "Free",
        price: "$0",
        description: "まずは試してみたい方に",
        cta: "無料で始める",
        features: {
            jobs: { included: true, value: "3個" },
            executions: { included: true, value: "100回/月" },
            scheduling: { included: true, value: "60分毎" },
            dynamicJobs: { included: true, value: "完全対応" },
            apiCalls: { included: true, value: "50回/日" },
            logs: { included: true, value: "24時間" },
            webhook: { included: false },
            monitoring: { included: false },
            support: { included: true, value: "GitHub Issue" },
        },
    },
    {
        title: "Hobby",
        price: "$3/月",
        description: "個人開発者向けお手頃プラン",
        cta: "Hobbyを始める",
        popular: true,
        features: {
            jobs: { included: true, value: "15個" },
            executions: { included: true, value: "無制限" },
            scheduling: { included: true, value: "5分毎" },
            dynamicJobs: { included: true, value: "完全対応" },
            apiCalls: { included: true, value: "500回/日" },
            logs: { included: true, value: "7日間" },
            webhook: { included: true },
            monitoring: { included: true, value: "基本監視" },
            support: { included: true, value: "Discord" },
        },
    },
    {
        title: "Pro",
        price: "$10/月 + 従量課金",
        description: "本格的なサービス運用向け",
        cta: "Proを始める",
        features: {
            jobs: { included: true, value: "50個無料 + $0.10/追加ジョブ" },
            executions: { included: true, value: "1,000回無料 + $0.005/実行" },
            scheduling: { included: true, value: "1分毎" },
            dynamicJobs: { included: true, value: "完全対応 + バッチ登録" },
            apiCalls: { included: true, value: "5,000回/日無料 + $1/1,000回" },
            logs: { included: true, value: "30日間" },
            webhook: { included: true },
            monitoring: { included: true, value: "高度な監視 + アラート" },
            support: { included: true, value: "メールサポート" },
        },
    }
];

export { PRICING_TIERS, ALL_FEATURES };