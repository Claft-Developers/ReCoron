import { PRICING_TIERS, ALL_FEATURES } from "@/constants/plan";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PricingCard } from "@/components/pricing/pricing-card";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    シンプルで明確な料金体系
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    無料から始めて、成長に合わせてスケール。<br />
                    すべてのプランで、信頼性の高いCronジョブ実行を提供します。
                </p>
            </section>

            {/* Pricing Cards */}
            <section className="container mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PRICING_TIERS.map((tier) => (
                        <PricingCard
                            key={tier.title}
                            title={tier.title}
                            price={tier.price}
                            description={tier.description}
                            cta={tier.cta}
                            popular={tier.popular}
                            features={tier.features}
                        />
                    ))}
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="container mx-auto px-4 pb-24">
                <h2 className="text-3xl font-bold text-center mb-12">機能比較</h2>
                
                <div className="max-w-6xl mx-auto overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-6 font-medium text-gray-400">機能</th>
                                {PRICING_TIERS.map((tier) => (
                                    <th key={tier.title} className="text-center py-4 px-6 font-medium">
                                        {tier.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ALL_FEATURES.map((feature) => (
                                <tr key={feature.id} className="border-b border-white/5">
                                    <td className="py-4 px-6 text-gray-300">{feature.label}</td>
                                    {PRICING_TIERS.map((tier) => {
                                        const tierFeature = tier.features[feature.id];
                                        return (
                                            <td key={tier.title} className="text-center py-4 px-6">
                                                {tierFeature.included ? (
                                                    "value" in tierFeature && tierFeature.value ? (
                                                        tierFeature.value
                                                    ) : (
                                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                                    )
                                                ) : (
                                                    <X className="w-5 h-5 text-gray-600 mx-auto" />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-4 pb-24">
                <h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
                
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                        <h3 className="text-xl font-semibold mb-3">無料プランでどのくらい使えますか？</h3>
                        <p className="text-gray-400">
                            無料プランでは、月間30回のジョブ実行と5つのジョブ登録が可能です。
                            60分毎のスケジューリング間隔で、小規模なプロジェクトに最適です。
                        </p>
                    </div>

                    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                        <h3 className="text-xl font-semibold mb-3">Proプランの従量課金はどのように計算されますか？</h3>
                        <p className="text-gray-400">
                            Proプランでは、月額$10の基本料金で1,000回の実行が含まれます。
                            それを超えた場合、1実行あたり$0.005が追加で課金されます。
                            例: 1,500回実行の場合 = $10 + (500 × $0.005) = $12.50/月
                        </p>
                    </div>

                    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                        <h3 className="text-xl font-semibold mb-3">プランはいつでも変更できますか？</h3>
                        <p className="text-gray-400">
                            はい、プランはいつでも変更可能です。アップグレードは即座に反映され、
                            ダウングレードは次の請求サイクルから適用されます。
                        </p>
                    </div>

                    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                        <h3 className="text-xl font-semibold mb-3">支払い方法は何がありますか？</h3>
                        <p className="text-gray-400">
                            クレジットカード（Visa、MasterCard、American Express）に対応しています。
                            すべての支払いはStripeを通じて安全に処理されます。
                        </p>
                    </div>

                    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                        <h3 className="text-xl font-semibold mb-3">ジョブ実行が失敗した場合も課金されますか？</h3>
                        <p className="text-gray-400">
                            いいえ、実際に成功したジョブ実行のみが課金対象となります。
                            リトライや失敗したジョブは課金されません。
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 pb-24 text-center">
                <div className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-12 bg-white/[0.02]">
                    <h2 className="text-4xl font-bold mb-4">
                        今すぐReCoronを始めましょう
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        無料プランで今すぐ開始。クレジットカード不要。
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                            無料で始める
                        </Button>
                        <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                            ドキュメントを見る
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}