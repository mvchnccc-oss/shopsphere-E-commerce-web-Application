"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboardIcon, PackageIcon, ShoppingBagIcon, LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboardIcon },
  { path: "/dashboard/products", label: "Products", icon: PackageIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSeller = (session as any)?.isSeller ?? false;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    } else if (status === "authenticated" && !isSeller) {
      router.replace("/profile");
    }
  }, [status, isSeller]);

  // Loading state while session resolves
  if (status === "loading" || (status === "authenticated" && !isSeller)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4 gap-2">
      <Link
        href="/"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold text-xl mb-6 px-2"
      >
        <ShoppingBagIcon className="size-6" />
        <span>ShopSphere</span>
      </Link>

      <p className="text-[10px] uppercase font-semibold text-muted-foreground px-2 mb-1 tracking-widest">Menu</p>

      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          href={path}
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === path
              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOutIcon className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <XIcon className="size-4" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <MenuIcon className="size-5" />
          </button>
          <Link href="/" className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">
            <ShoppingBagIcon className="size-5" />
            <span>ShopSphere</span>
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
