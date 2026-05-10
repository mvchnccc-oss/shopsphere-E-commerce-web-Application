import {
  TrendingUpIcon, ShoppingCartIcon, PackageIcon,
  UsersIcon, UserCheckIcon, UserIcon, CalendarIcon,
} from "lucide-react";
import { getAdminStatsAction, getAdminOrdersAction } from "@/lib/actions/admin.action";
import { RevenueChart } from "@/components/OverviewCharts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-EG", {
    year: "numeric", month: "short", day: "numeric",
  });
}

const CARD_COLORS = [
  { border: "border-violet-500/20", icon: "text-violet-400", bg: "bg-violet-500/10" },
  { border: "border-blue-500/20",   icon: "text-blue-400",   bg: "bg-blue-500/10"   },
  { border: "border-emerald-500/20",icon: "text-emerald-400",bg: "bg-emerald-500/10"},
  { border: "border-amber-500/20",  icon: "text-amber-400",  bg: "bg-amber-500/10"  },
  { border: "border-pink-500/20",   icon: "text-pink-400",   bg: "bg-pink-500/10"   },
  { border: "border-cyan-500/20",   icon: "text-cyan-400",   bg: "bg-cyan-500/10"   },
];

export default async function AdminOverviewPage() {
  // Fetch stats and recent orders in parallel
  const [statsResult, ordersResult] = await Promise.all([
    getAdminStatsAction(),
    getAdminOrdersAction(0, 5),
  ]);

  if (!statsResult.success) {
    return (
      <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
        {statsResult.error}
      </div>
    );
  }

  const stats = statsResult.data;

  // Build chart data from the revenueByMonth map returned by the backend
  const chartData = Object.entries(stats.revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  const statCards = [
    { label: "Total Revenue",   value: `EGP ${Number(stats.totalRevenue).toLocaleString()}`, icon: TrendingUpIcon,  color: CARD_COLORS[0] },
    { label: "Total Orders",    value: String(stats.numberOfOrders),                          icon: ShoppingCartIcon, color: CARD_COLORS[1] },
    { label: "Total Products",  value: String(stats.numberOfProducts),                        icon: PackageIcon,      color: CARD_COLORS[2] },
    { label: "Total Users",     value: String(stats.numberOfUsers),                           icon: UsersIcon,        color: CARD_COLORS[3] },
    { label: "Sellers",         value: String(stats.numberOfSellers),                         icon: UserCheckIcon,    color: CARD_COLORS[4] },
    { label: "Customers",       value: String(stats.numberOfCustomers),                       icon: UserIcon,         color: CARD_COLORS[5] },
  ];

  const recentOrders = ordersResult.success ? ordersResult.data.orders : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Platform-wide stats and activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
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

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          <div className="border border-white/5 rounded-xl p-6 bg-white/[0.02]">
            <h2 className="text-sm font-semibold text-white mb-6">Revenue Trend</h2>
            <RevenueChart data={chartData} />
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          <a href="/admin/orders" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            View all →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-500 text-center">
            {ordersResult.success ? "No orders yet." : ordersResult.error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs">
                  <th className="text-left px-5 py-3 font-medium">Order ID</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const total = order.orderItems.reduce(
                    (s, i) => s + i.pricePerUnit * i.quantity, 0
                  );
                  return (
                    <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">#{order.id}</td>
                      <td className="px-5 py-3.5 text-slate-300">
                        {order.address.firstname} {order.address.lastname}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="size-3" />
                          {formatDate(order.orderedAt)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        EGP {total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}