"use client";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { lockAdminUserAction } from "@/lib/actions/admin.action";
import type { AdminUser, UserRole } from "@/lib/interfaces/admin.interface";
import {
  CheckCircle2Icon,
  LockIcon,
  SearchIcon,
  UnlockIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmModal from "./confirm-modal";

export default function UsersList({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "seller" | "customer">("all");
  const [lockTarget, setLockTarget] = useState<{ user: AdminUser; lock: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(message: string, error: boolean) {
    toast(message, {
      icon: error ? (
        <XCircleIcon className="size-4 text-red-400 shrink-0" />
      ) : (
        <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
      ),
      style: error
        ? { background: "#1a0d0d", border: "1px solid rgb(239 68 68 / 0.2)", color: "white" }
        : { background: "#0d1424", border: "1px solid rgb(255 255 255 / 0.1)", color: "white" },

      position: "top-center",
    });
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "seller" ? u.role === "ROLE_SELLER" : u.role === "ROLE_CUSTOMER");
    return matchSearch && matchFilter;
  });

  function handleLockClick(user: AdminUser) {
    setLockTarget({ user, lock: !user.isLocked });
  }

  function handleConfirm() {
    if (!lockTarget) return;
    const { user, lock } = lockTarget;

    startTransition(async () => {
      const result = await lockAdminUserAction(user.id, lock);
      setLockTarget(null);

      if (result.success) {
        // Optimistic update — flip isLocked in local state
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isLocked: lock } : u)));
        showToast(`${user.name} has been ${lock ? "locked" : "unlocked"}.`, false);
      } else {
        showToast(result.error, false);
      }
    });
  }

  const roleBadge: Record<UserRole, string> = {
    ROLE_SELLER: "bg-violet-500/15 text-violet-400",
    ROLE_CUSTOMER: "bg-emerald-500/15 text-emerald-400",
    ROLE_ADMIN: "bg-amber-500/15 text-amber-400",
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {(["all", "seller", "customer"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                filter === f ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <UsersIcon className="size-8 opacity-30" />
            <span className="text-sm">
              {search ? "No users match your search." : "No users found."}
            </span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-xs">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                          user.isLocked ? "bg-slate-600" : "bg-violet-500"
                        }`}
                      >
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span
                        className={`font-medium ${user.isLocked ? "text-slate-500 line-through" : "text-white"}`}
                      >
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 hidden sm:table-cell">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge[user.role] ?? "bg-white/5 text-slate-400"}`}
                    >
                      {user.role.substring(5, 6) + user.role.substring(6).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    {user.isLocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                        <LockIcon className="size-3" /> Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        <UnlockIcon className="size-3" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleLockClick(user)}
                      title={user.isLocked ? "Unlock user" : "Lock user"}
                      className={`p-1.5 rounded-md transition-all ${
                        user.isLocked
                          ? "hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400"
                          : "hover:bg-amber-500/10 text-slate-500 hover:text-amber-400"
                      }`}
                    >
                      {user.isLocked ? (
                        <UnlockIcon className="size-4" />
                      ) : (
                        <LockIcon className="size-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm Modal */}
      {lockTarget && (
        <ConfirmModal
          user={lockTarget.user}
          nextLockState={lockTarget.lock}
          onConfirm={handleConfirm}
          onCancel={() => setLockTarget(null)}
          isPending={isPending}
        />
      )}
      <ScrollToTopButton />
    </>
  );
}
