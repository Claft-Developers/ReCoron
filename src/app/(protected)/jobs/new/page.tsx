import { CreateJobForm } from "@/components/job/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Link 
                            href="/jobs"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            ジョブ一覧に戻る
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">新しいジョブを作成</h1>
                        <p className="text-sm text-gray-400">
                            定期実行するHTTPリクエストを設定します
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
                <div className="max-w-3xl mx-auto">
                    <CreateJobForm />
                </div>
            </div>
        </div>
    );
}
