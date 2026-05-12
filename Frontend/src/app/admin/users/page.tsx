import UsersList from "@/components/admin/UsersList";
import { getAdminUsersAction } from "@/lib/actions/admin.action";
import { UserCheckIcon, UserIcon, UsersIcon } from "lucide-react";

export default async function AdminUsersPage() {
  const result = await getAdminUsersAction();

  if (!result.success) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
        </div>
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {result.error}
        </div>
      </div>
    );
  }

  const users = result.data;
  const stats = [
    {
      label: "Total",
      value: users.length,
      icon: UsersIcon,
      color: "text-violet-400",
    },
    {
      label: "Sellers",
      value: users.filter((u) => u.role === "ROLE_SELLER").length,
      icon: UserCheckIcon,
      color: "text-blue-400",
    },
    {
      label: "Customers",
      value: users.filter((u) => u.role === "ROLE_CUSTOMER").length,
      icon: UserIcon,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 text-sm mt-1">{users.length} total users</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-white/5 rounded-xl p-4 bg-white/2 flex items-center gap-3"
          >
            <s.icon className={`size-4 ${s.color}`} />
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xl font-bold text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <UsersList initialUsers={users} />
    </div>
  );
}
