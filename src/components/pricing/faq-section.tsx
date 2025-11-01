type FAQ = {
    question: string;
    answer: string;
};

const FAQS: FAQ[] = [
    {
        question: "無料プランでどのくらい使えますか？",
        answer: "無料プランでは、月間100回のジョブ実行と3つのジョブ登録が可能です。\n60分毎のスケジューリング間隔で、まずは機能を試したい方に最適です。\n本格的に使いたい場合は、月額$3のHobbyプランがおすすめです。",
    },
    {
        question: "Proプランの従量課金はどのように計算されますか？",
        answer: "Proプランでは、月額$10の基本料金に以下が含まれます：\n• 50個のジョブ\n• 1,000回の実行\n• 5,000回/日のAPI呼び出し\n\n超過時の従量課金：\n• 追加ジョブ: $0.10/個\n• 追加実行: $0.005/回\n• 追加API呼び出し: $1/1,000回\n\n例: 1,500回実行の場合 = $10 + (500 × $0.005) = $12.50/月",
    },
    {
        question: "プランはいつでも変更できますか？",
        answer: "はい、プランはいつでも変更可能です。アップグレードは即座に反映され、\nダウングレードは次の請求サイクルから適用されます。",
    },
    {
        question: "HobbyとProの違いは何ですか？",
        answer: "Hobbyプランは月額$3で実行回数無制限、15個のジョブ、5分毎のスケジューリングが可能です。\n個人開発や小規模サービスに最適です。\n\nProプランは月額$10から始まり、50個のジョブ、1分毎のスケジューリング、\nバッチ登録機能、高度な監視とアラートが利用でき、スケールに応じて従量課金されます。\n本格的なサービス運用に最適です。",
    },
    {
        question: "支払い方法は何がありますか？",
        answer: "クレジットカード（Visa、MasterCard、American Express）に対応しています。\nすべての支払いはStripeを通じて安全に処理されます。",
    },
    {
        question: "ジョブ実行が失敗した場合も課金されますか？",
        answer: "いいえ、実際に成功したジョブ実行のみが課金対象となります。\nリトライや失敗したジョブは課金されません。",
    },
];

export function FAQSection() {
    return (
        <section className="container mx-auto px-4 pb-24">
            <h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
                {FAQS.map((faq, index) => (
                    <div key={index} className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                        <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                        <p className="text-gray-400 whitespace-pre-line">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
