"use client";
import { useEffect, useState } from "react";
import {
  TrendingUpIcon, ShoppingCartIcon, PackageIcon,
  UsersIcon, UserCheckIcon, UserIcon, CalendarIcon,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { getAdminStatsAction, AdminStats } from "@/lib/actions/admin.action";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-EG", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return iso; }
}

function buildChartData(recentOrders: AdminStats["recentOrders"]) {
  const monthMap: Record<string, number> = {};
  recentOrders.forEach((order) => {
    try {
      const month = new Date(order.orderedAt).toLocaleDateString("en-US", { month: "short" });
      monthMap[month] = (monthMap[month] ?? 0) + order.totalAmount;
    } catch {}
  });
  if (!Object.keys(monthMap).length)
    return ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m) => ({ month: m, revenue: 0 }));
  return Object.entries(monthMap).map(([month, revenue]) => ({ month, revenue }));
}

const CARD_COLORS = [
  { border: "border-violet-500/20", icon: "text-violet-400", bg: "bg-violet-500/10" },
  { border: "border-blue-500/20",   icon: "text-blue-400",   bg: "bg-blue-500/10" },
  { border: "border-emerald-500/20",icon: "text-emerald-400",bg: "bg-emerald-500/10" },
  { border: "border-amber-500/20",  icon: "text-amber-400",  bg: "bg-amber-500/10" },
  { border: "border-pink-500/20",   icon: "text-pink-400",   bg: "bg-pink-500/10" },
  { border: "border-cyan-500/20",   icon: "text-cyan-400",   bg: "bg-cyan-500/10" },
];

const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#10b981"];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStatsAction().then((res) => {
      if (res.success) setStats(res.data);
      setLoading(false);
    });
  }, []);

  const statCards = stats
    ? [
        { label: "Total Revenue",   value: `EGP ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUpIcon,  color: CARD_COLORS[0] },
        { label: "Total Orders",    value: String(stats.totalOrders),                    icon: ShoppingCartIcon,color: CARD_COLORS[1] },
        { label: "Total Products",  value: String(stats.totalProducts),                  icon: PackageIcon,     color: CARD_COLORS[2] },
        { label: "Total Users",     value: String(stats.totalUsers),                     icon: UsersIcon,       color: CARD_COLORS[3] },
        { label: "Sellers",         value: String(stats.totalSellers),                   icon: UserCheckIcon,   color: CARD_COLORS[4] },
        { label: "Customers",       value: String(stats.totalCustomers),                 icon: UserIcon,        color: CARD_COLORS[5] },
      ]
    : [];

  const chartData = stats ? buildChartData(stats.recentOrders) : [];

  const pieData = stats
    ? [
        { name: "Sellers",   value: stats.totalSellers },
        { name: "Customers", value: stats.totalCustomers },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Platform-wide stats and activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-white/5 rounded-xl p-4 bg-white/[0.02] animate-pulse h-24" />
            ))
          : statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`border ${color.border} rounded-xl p-4 bg-white/[0.02] flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{label}</span>
                  <div className={`p-1.5 rounded-lg ${color.bg}`}>
                    <Icon className={`size-3.5 ${color.icon}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
        {/* Area Chart */}
        <div className="border border-white/5 rounded-xl p-6 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white mb-6">Revenue Trend</h2>
          {loading ? (
            <div className="h-[200px] animate-pulse bg-white/5 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#0d1424", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px", fontSize: "12px", color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#adminGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="border border-white/5 rounded-xl p-6 bg-white/[0.02] flex flex-col">
          <h2 className="text-sm font-semibold text-white mb-4">User Split</h2>
          {loading ? (
            <div className="flex-1 animate-pulse bg-white/5 rounded-lg" />
          ) : (
            <div className="flex flex-col items-center gap-4 flex-1 justify-center">
              <PieChart width={160} height={160}>
                <Pie data={pieData} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-2 w-full">
                {pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                    <span className="text-white font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          <a href="/admin/orders" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            View all →
          </a>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm animate-pulse">Loading...</div>
        ) : !stats || stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-xs">
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Customer</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">#{order.id}</td>
                  <td className="px-5 py-3.5 text-slate-300 hidden md:table-cell">{order.customerName}</td>
                  <td className="px-5 py-3.5 text-slate-400 hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="size-3" />{formatDate(order.orderedAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 hidden sm:table-cell">{order.itemCount} items</td>
                  <td className="px-5 py-3.5 font-semibold text-white">EGP {order.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}