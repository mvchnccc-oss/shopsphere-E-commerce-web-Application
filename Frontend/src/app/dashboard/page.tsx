"use client";
import { TrendingUpIcon, ShoppingCartIcon, PackageIcon, UsersIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Nov", sales: 4200 },
  { month: "Dec", sales: 7800 },
  { month: "Jan", sales: 5100 },
  { month: "Feb", sales: 6300 },
  { month: "Mar", sales: 8900 },
  { month: "Apr", sales: 11200 },
];

const recentOrders = [
  { id: "#3921", customer: "Ahmed Hassan", product: "Wireless Headphones", amount: 850, status: "Delivered" },
  { id: "#3920", customer: "Sara Mohamed", product: "Smart Watch", amount: 1200, status: "Shipped" },
  { id: "#3919", customer: "Omar Ali", product: "Laptop Stand", amount: 320, status: "Processing" },
  { id: "#3918", customer: "Nour Ibrahim", product: "Mechanical Keyboard", amount: 650, status: "Delivered" },
  { id: "#3917", customer: "Youssef Khaled", product: "USB-C Hub", amount: 280, status: "Cancelled" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const stats = [
  { label: "Monthly Revenue", value: "EGP 11,200", change: "+26%", icon: TrendingUpIcon, color: "text-emerald-500" },
  { label: "Total Orders", value: "348", change: "+12%", icon: ShoppingCartIcon, color: "text-blue-500" },
  { label: "Products", value: "84", change: "+3", icon: PackageIcon, color: "text-purple-500" },
  { label: "Customers", value: "1,240", change: "+8%", icon: UsersIcon, color: "text-orange-500" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="border border-border rounded-xl p-4 flex flex-col gap-3 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
              <Icon className={`size-4 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{change} this month</p>
            </div>
          </div>
        ))}
      </div>


      <div className="border border-border rounded-xl p-6 bg-card">
        <h2 className="text-sm font-semibold mb-6">Revenue — Last 6 Months</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
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
      </div>


      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              <th className="text-left px-5 py-3 font-medium">Order</th>
              <th className="text-left px-5 py-3 font-medium">Customer</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Product</th>
              <th className="text-left px-5 py-3 font-medium">Amount</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{order.id}</td>
                <td className="px-5 py-3.5 font-medium">{order.customer}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{order.product}</td>
                <td className="px-5 py-3.5 font-semibold">EGP {order.amount}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}