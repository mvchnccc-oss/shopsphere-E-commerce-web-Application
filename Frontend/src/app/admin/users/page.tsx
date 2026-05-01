"use client";
import { useEffect, useState } from "react";
import {
  SearchIcon, Trash2Icon, LoaderIcon, UsersIcon,
  UserCheckIcon, UserIcon, AlertTriangleIcon, CheckCircle2Icon,
} from "lucide-react";
import { getAdminUsersAction, deleteAdminUserAction, AdminUser } from "@/lib/actions/admin.action";

function ConfirmDeleteModal({
  user, onConfirm, onCancel, isPending,
}: {
  user: AdminUser; onConfirm: () => void; onCancel: () => void; isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertTriangleIcon className="size-7 text-red-400" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-center text-white mb-1">Delete User?</h2>
        <p className="text-slate-400 text-sm text-center mb-1">You're about to delete</p>
        <p className="text-sm font-semibold text-center text-white mb-5 px-4 truncate">"{user.name}"</p>
        <p className="text-xs text-slate-500 text-center mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? <><LoaderIcon className="size-4 animate-spin" /> Deleting...</> : <><Trash2Icon className="size-4" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500", "bg-pink-500", "bg-cyan-500",
];

function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "seller" | "customer">("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isPending, setPending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    const res = await getAdminUsersAction();
    if (res.success) setUsers(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setPending(true);
    const res = await deleteAdminUserAction(deleteTarget.id);
    setPending(false);
    setDeleteTarget(null);
    if (res.success) { showToast("User deleted."); load(); }
    else showToast("Failed to delete user.");
  }

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "seller" ? u.isSeller : !u.isSeller);
    return matchSearch && matchFilter;
  });

  const sellers   = users.filter((u) => u.isSeller).length;
  const customers = users.filter((u) => !u.isSeller).length;

  return (
    <div className="flex flex-col gap-6">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0d1424] border border-white/10 rounded-xl px-4 py-3 shadow-lg text-sm text-white animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 text-sm mt-1">{loading ? "Loading..." : `${users.length} total users`}</p>
      </div>

      {/* Summary mini-cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",     value: users.length, icon: UsersIcon,      color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Sellers",   value: sellers,       icon: UserCheckIcon,  color: "text-blue-400",   bg: "bg-blue-500/10" },
          { label: "Customers", value: customers,     icon: UserIcon,       color: "text-emerald-400",bg: "bg-emerald-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="border border-white/5 rounded-xl p-4 bg-white/[0.02] flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`size-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <LoaderIcon className="size-6 animate-spin" />
            <span className="text-sm">Loading users...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <UsersIcon className="size-8 opacity-30" />
            <span className="text-sm">No users found.</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-xs">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} index={i} />
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 hidden sm:table-cell">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.isSeller
                        ? "bg-violet-500/15 text-violet-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}>
                      {user.isSeller ? <UserCheckIcon className="size-3" /> : <UserIcon className="size-3" />}
                      {user.isSeller ? "Seller" : "Customer"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={isPending}
        />
      )}
    </div>
  );
}