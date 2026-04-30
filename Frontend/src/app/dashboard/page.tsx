"use client";
import { useEffect, useState } from "react";
import { TrendingUpIcon, ShoppingCartIcon, PackageIcon, CalendarIcon } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { getSellerStatsAction, SellerStats } from "@/lib/actions/seller.actions";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-EG", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return iso; }
}

function buildMonthlyChart(recentOrders: SellerStats["recentOrders"]) {
   const monthMap: Record<string, number> = {};
  recentOrders.forEach((order) => {
    try {
      const month = new Date(order.orderedAt).toLocaleDateString("en-US", { month: "short" });
      monthMap[month] = (monthMap[month] ?? 0) + order.totalAmount;
    } catch {}
  });

 
  if (Object.keys(monthMap).length === 0) {
    const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
    return months.map((month) => ({ month, sales: 0 }));
  }

  return Object.entries(monthMap).map(([month, sales]) => ({ month, sales }));
}

export default function DashboardPage() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSellerStatsAction().then((res) => {
      if (res.success) setStats(res.data);
      setLoading(false);
    });
  }, []);

  const statCards = stats
    ? [
        { label: "Total Revenue", value: `EGP ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUpIcon, color: "text-emerald-500" },
        { label: "Total Orders",  value: String(stats.totalOrders),                    icon: ShoppingCartIcon, color: "text-blue-500" },
        { label: "My Products",   value: String(stats.totalProducts),                  icon: PackageIcon,      color: "text-purple-500" },
      ]
    : [];

  const chartData = stats ? buildMonthlyChart(stats.recentOrders) : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-border rounded-xl p-4 bg-card animate-pulse h-24" />
            ))
          : statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="border border-border rounded-xl p-4 flex flex-col gap-3 bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  <Icon className={`size-4 ${color}`} />
                </div>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
      </div>

      {/* Area Chart */}
      <div className="border border-border rounded-xl p-6 bg-card">
        <h2 className="text-sm font-semibold mb-6">Revenue — by Orders</h2>
        {loading ? (
          <div className="h-[220px] animate-pulse bg-muted rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Orders</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm animate-pulse">
            Loading orders...
          </div>
        ) : !stats || stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No orders yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">City</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">#{order.id}</td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      {formatDate(order.orderedAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">{order.itemCount} items</td>
                  <td className="px-5 py-3.5 font-semibold">EGP {order.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{order.address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
