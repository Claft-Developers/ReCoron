// 全プランで比較する機能リスト
const ALL_FEATURES = [
    { id: "jobs", label: "登録可能ジョブ数" },
    { id: "executions", label: "月間実行数" },
    { id: "scheduling", label: "スケジューリング間隔" },
    { id: "api", label: "APIアクセス" },
    { id: "logs", label: "ログ保存期間" },
    { id: "webhook", label: "Webhook通知" },
    { id: "support", label: "サポート" },
] as const;

const PRICING_TIERS = [
    {
        title: "Free",
        price: "$0",
        description: "小規模プロジェクトに最適",
        cta: "無料で始める",
        features: {
            jobs: { included: true, value: "5個" },
            executions: { included: true, value: "30回/月" },
            scheduling: { included: true, value: "60分毎" },
            api: { included: true, value: "制限あり" },
            logs: { included: false },
            webhook: { included: false },
            support: { included: true, value: "コミュニティ" },
        },
    },
    {
        title: "Basic",
        price: "$5/月",
        description: "成長中のプロジェクト向け",
        cta: "今すぐアップグレード",
        popular: true,
        features: {
            jobs: { included: true, value: "10個" },
            executions: { included: true, value: "50回/月" },
            scheduling: { included: true, value: "30分毎" },
            api: { included: true, value: "制限あり" },
            logs: { included: true, value: "7日間" },
            webhook: { included: false },
            support: { included: true, value: "コミュニティ" },
        },
    },
    {
        title: "Pro",
        price: "$20/月 + 従量課金",
        description: "大規模運用向けプラン",
        cta: "Proを始める",
        features: {
            jobs: { included: true, value: "無制限" },
            executions: { included: true, value: "1,000回無料 + $0.005/実行" },
            scheduling: { included: true, value: "5分毎" },
            api: { included: true, value: "フルアクセス" },
            logs: { included: true, value: "30日間" },
            webhook: { included: true },
            support: { included: true, value: "優先メール" },
        },
    }
];

export { PRICING_TIERS, ALL_FEATURES };