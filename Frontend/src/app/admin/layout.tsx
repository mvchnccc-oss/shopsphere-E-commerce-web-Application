"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboardIcon, PackageIcon, ShoppingBagIcon,
  LogOutIcon, MenuIcon, XIcon, UsersIcon, ShoppingCartIcon, ShieldIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { path: "/admin", label: "Overview", icon: LayoutDashboardIcon },
  { path: "/admin/users", label: "Users", icon: UsersIcon },
  { path: "/admin/products", label: "Products", icon: PackageIcon },
  { path: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = (session as any)?.isSeller ?? false;

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
    else if (status === "authenticated" && !isAdmin) router.replace("/");
  }, [status, isAdmin]);

  if (status === "loading" || (status === "authenticated" && !isAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Verifying access...</span>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-3 gap-1">
      {/* Logo */}
      <Link
        href="/"
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-2 px-3 mb-8"
      >
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <ShieldIcon className="size-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">ShopSphere</p>
          <p className="text-violet-400 text-[10px] font-medium tracking-widest uppercase">Admin Panel</p>
        </div>
      </Link>

      <p className="text-[10px] uppercase font-semibold text-slate-500 px-3 mb-2 tracking-widest">
        Navigation
      </p>

      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            href={path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-medium text-white truncate">{session?.user?.name ?? "Admin"}</p>
          <p className="text-[11px] text-slate-500 truncate">{session?.user?.email ?? ""}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
        >
          <LogOutIcon className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0f1a]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 border-r border-white/5 flex-col sticky top-0 h-screen bg-[#0d1424]">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 bg-[#0d1424] border-r border-white/5 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-white/5 text-slate-400 transition-colors"
        >
          <XIcon className="size-4" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 sticky top-0 bg-[#0d1424] z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 transition-colors"
          >
            <MenuIcon className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
              <ShieldIcon className="size-3 text-white" />
            </div>
            <span className="text-white font-bold text-sm">Admin Panel</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}