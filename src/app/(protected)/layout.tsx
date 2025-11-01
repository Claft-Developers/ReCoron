import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signup");
    }

    return (
        <html lang="ja" className="dark">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Sidebar />
                <main className="ml-64">
                    {children}
                </main>
            </body>

            <Toaster position="bottom-right" />
        </html>
    );
}