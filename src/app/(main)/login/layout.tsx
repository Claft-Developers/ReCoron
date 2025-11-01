import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export function generateMetadata() {
    return {
        title: "Login - ReCoron",
        description: "Log in to ReCoron to easily manage your scheduled tasks.",
    };
}

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (session) {
        redirect("/jobs");
    }

    return <>{children}</>;
}