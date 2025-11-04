import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <nav className="flex items-center justify-between px-6 py-3 bg-card/80 backdrop-blur-lg border border-border rounded-full shadow-lg">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">R</span>
                    </div>
                    <span className="font-bold text-xl">ReCoron</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        機能
                    </Link>
                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        料金
                    </Link>
                    <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ドキュメント
                    </Link>
                    <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ブログ
                    </Link>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3">
                    <Link href={`/login`}>
                        <Button variant="ghost" size="sm" className="hidden sm:flex cursor-pointer">
                            ログイン
                        </Button>
                    </Link>
                    <Link href={`/signup`}>
                        <Button size="sm" className="cursor-pointer">
                            無料で始める
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    )
}