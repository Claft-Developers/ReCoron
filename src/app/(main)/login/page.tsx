"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

const redirectURL = "/jobs";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await signIn.email({
                email,
                password,
                callbackURL: redirectURL,
            });
            toast.success("ログインしました！");
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "ログインに失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "github" | "google") => {
        try {
            await signIn.social({
                provider,
                callbackURL: redirectURL,
            });
        } catch (error: any) {
            console.error("Social login error:", error);
            toast.error(error.message || "ソーシャルログインに失敗しました");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="flex flex-col justify-center px-6 py-12 lg:px-20">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo & Home Link */}
                    <div className="mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Home
                        </Link>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">R</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-3">
                            ReCoronにログイン
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            アカウントをお持ちでないですか？{" "}
                            <Link href="/signup" className="text-foreground font-medium underline underline-offset-4 hover:text-primary">
                                新規登録
                            </Link>
                        </p>
                    </div>

                    {/* Social Buttons */}
                    <div className="space-y-3 mb-6">
                        <Button
                            variant="outline"
                            className="w-full h-12 justify-start text-base font-normal"
                            onClick={() => handleSocialLogin("google")}
                        >
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Login with Google
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 justify-start text-base font-normal"
                            onClick={() => handleSocialLogin("github")}
                        >
                            <Github className="mr-3 h-5 w-5" />
                            Login with GitHub
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-background px-2 text-muted-foreground">or</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
                                    パスワードを忘れた場合
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    処理中...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>

                    {/* Terms */}
                    <p className="mt-6 text-xs text-muted-foreground">
                        By logging in, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
                            Terms
                        </Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>

            {/* Right side - Background Image */}
            <div className="hidden lg:block relative bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <div className="inline-flex h-16 w-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-2xl">R</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold">おかえりなさい</h2>
                        <p className="text-muted-foreground max-w-md">
                            シンプルなAPIで簡単にスケジュールタスクを管理。
                            数分で統合、確実に実行。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
