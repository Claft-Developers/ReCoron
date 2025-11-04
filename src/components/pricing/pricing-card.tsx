import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ALL_FEATURES } from "@/constants/plan";
import Link from "next/link";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    cta: string;
    popular?: boolean;
    features: Record<string, { included: boolean; value?: string }>;
}

export function PricingCard({
    title,
    price,
    description,
    cta,
    popular = false,
    features,
}: PricingCardProps) {
    return (
        <div
            className={`relative rounded-2xl border ${popular
                    ? "border-white/20 bg-white/5"
                    : "border-white/10 bg-white/[0.02]"
                } p-8 hover:border-white/30 transition-colors flex flex-col`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-sm font-medium px-4 py-1 rounded-full">
                    人気
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <div className="text-4xl font-bold mb-2">{price}</div>
                <p className="text-sm text-gray-400">{description}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
                {ALL_FEATURES.map((feature) => {
                    const tierFeature = features[feature.id];
                    return (
                        <li key={feature.id} className="flex items-start gap-3">
                            {tierFeature.included ? (
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                                <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={tierFeature.included ? "text-gray-300" : "text-gray-600"}>
                                {feature.label}
                                {"value" in tierFeature && tierFeature.value && (
                                    <span className="text-sm ml-1">({tierFeature.value})</span>
                                )}
                            </span>
                        </li>
                    );
                })}
            </ul>

            <Link href={`/login`}>
                <Button
                    className={`w-full cursor-pointer font-semibold transition-all ${popular
                            ? "bg-black text-white hover:bg-white hover:text-black hover:shadow-lg hover:scale-[1.02] border border-white/20"
                            : "bg-black text-white hover:bg-white hover:text-black hover:shadow-lg hover:scale-[1.02] border border-white/20"
                        }`}
                >
                    {cta}
                </Button>
            </Link>

        </div>
    );
}
