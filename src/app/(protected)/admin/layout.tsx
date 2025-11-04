import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-middleware";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    // 管理者権限チェック（データベースベース）
    const adminStatus = await isAdmin(session.user.id);
    if (!adminStatus) {
        redirect("/jobs");
    }

    return <>{children}</>;
}
