import { PRICING_TIERS, ALL_FEATURES } from "@/constants/plan";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PricingCard } from "@/components/pricing/pricing-card";
import { FAQSection } from "@/components/pricing/faq-section";

export function generateMetadata() {
    return {
        title: "Pricing - ReCoron",
        description: "Explore ReCoron's pricing plans. Choose from free to Pro plans to suit your needs.",
    };
}

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
            <FAQSection />

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