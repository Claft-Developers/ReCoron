"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  Clock, 
  Settings, 
  CreditCard, 
  HelpCircle,
  KeyRound,
  LogOut,
  ArrowUpDown,
  Logs
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

const navigation = [
  { name: "Home", href: "/jobs", icon: Home },
  { name: "Jobs", href: "/jobs", icon: Clock },
  { name: "API Keys", href: "/keys", icon: KeyRound },
  { name: "Logs", href: "/logs", icon: Logs },
  { name: "Webhooks", href: "/webhooks", icon: ArrowUpDown },
  { name: "Settings", href: "/settings", icon: Settings },
];

const bottomNavigation = [
  { name: "料金プラン", href: "/pricing", icon: CreditCard },
  { name: "ヘルプ", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const userEmail = session?.user?.email || "user@example.com";
  const userName = session?.user?.name || "ユーザー";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-3 bg-gray-1">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-3 px-6">
          <Link href="/jobs" className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-gray-12" />
            <span className="text-xl font-semibold text-gray-12">ReCoron</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-4 text-gray-12"
                    : "text-gray-11 hover:bg-gray-3 hover:text-gray-12"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-3 px-3 py-4">
          <div className="space-y-1">
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="mt-4 border-t border-gray-3 pt-4">
            <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-4 text-xs font-semibold text-gray-12">
                {userInitial}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <div className="truncate text-sm font-medium text-gray-12">{userName}</div>
                <div className="truncate text-xs text-gray-11">{userEmail}</div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="mt-2 w-full justify-start gap-3 text-gray-11 hover:bg-gray-3 hover:text-gray-12"
            >
              <LogOut className="h-5 w-5" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
