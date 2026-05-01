"use client";
import React, { useEffect, useState } from "react";
import { TrendingUpIcon, ShoppingCartIcon, PackageIcon, CalendarIcon } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { getSellerOrdersAction } from "@/lib/actions/seller.actions";
import { getSellerProductsAction } from "@/lib/actions/seller.actions";
import { SellerOrder } from "@/lib/interfaces/seller.interface";
import { InvoiceModal } from "@/components/InvoiceModal";
import { MapPinIcon, ClockIcon, Banknote, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-EG", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return iso; }
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [ordersRes, productsRes] = await Promise.all([
        getSellerOrdersAction(),
        getSellerProductsAction(),
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (productsRes.success) setProductCount(productsRes.data.length);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = order.orderItems.reduce((s, item) => s + (item.pricePerUnit * item.quantity), 0);
    return sum + orderTotal;
  }, 0);

  const chartData = [...orders]
    .sort((a, b) => new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime())
    .map(order => ({
      month: new Date(order.orderedAt).toLocaleDateString("en-US", { month: "short" }),
      sales: order.orderItems.reduce((s, item) => s + (item.pricePerUnit * item.quantity), 0)
    }));
  const statCards = [
    { label: "Total Revenue", value: `EGP ${totalRevenue.toLocaleString()}`, icon: TrendingUpIcon, color: "text-emerald-500" },
    { label: "Total Orders", value: String(totalOrders), icon: ShoppingCartIcon, color: "text-blue-500" },
    { label: "My Products", value: String(productCount), icon: PackageIcon, color: "text-purple-500" },
  ];
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);


  const toggleRow = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your seller dashboard.</p>
      </div>


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


      <div className="border border-border rounded-xl p-6 bg-card">
        <h2 className="text-sm font-semibold mb-6">Revenue — by Orders</h2>
        {loading ? (
          <div className="h-55 animate-pulse bg-muted rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Area type="monotone" dataKey="sales" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>


      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Orders</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-sm">No orders yet.</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs bg-muted/30">
                <th className="text-left px-5 py-3 w-10"></th> {/* عمود السهم */}
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">City</th>
                <th className="text-right px-5 py-3">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const total = order.orderItems.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0);
                const isExpanded = expandedOrderId === order.id;

                return (
                  <React.Fragment key={order.id}>
                    {/* الصف الرئيسي */}
                    <tr
                      onClick={() => toggleRow(order.id)}
                      className={`border-b border-border hover:bg-muted/40 cursor-pointer transition-colors ${isExpanded ? "bg-muted/30" : ""
                        }`}
                    >
                      <td className="px-5 py-3.5">
                        {isExpanded ? (
                          <ChevronUpIcon className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDownIcon className="size-4 text-muted-foreground" />
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold">#{order.id}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="size-3" /> {formatDate(order.orderedAt)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        {order.orderItems.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="px-5 py-3.5 font-semibold">
                        EGP {total.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                        {order.address.city}
                      </td>
                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        {/* stopPropagation عشان لما تضغط على الفاتورة ميروحش يقفل الـ Row */}
                        <InvoiceModal order={order} total={total} />
                      </td>
                    </tr>

                    {/* الصف الإضافي الذي يظهر عند الضغط */}
                    {isExpanded && (
                      <tr className="border-b border-border bg-muted/20">
                        <td colSpan={7} className="p-0">
                          <div className="p-5 flex flex-col gap-4 bg-muted/10">
                            {/* جدول المنتجات الداخلي */}
                            <div className="border rounded-lg overflow-hidden bg-card">
                              <table className="w-full text-xs">
                                <thead className="bg-muted text-muted-foreground uppercase font-medium">
                                  <tr>
                                    <th className="text-left p-3">Product</th>
                                    <th className="text-left p-3">Qty</th>
                                    <th className="text-left p-3">Unit Price</th>
                                    <th className="text-right p-3">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {order.orderItems.map((item, i) => (
                                    <tr key={i}>
                                      <td className="p-3 font-medium">{item.productTitle}</td>
                                      <td className="p-3">{item.quantity}</td>
                                      <td className="p-3">EGP {item.pricePerUnit.toLocaleString()}</td>
                                      <td className="p-3 text-right font-medium">
                                        EGP {(item.quantity * item.pricePerUnit).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* تفاصيل التوصيل والوقت */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm p-4 bg-card border rounded-lg">
                              <div className="flex items-start gap-2">
                                <MapPinIcon className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                                <div>
                                  <p className="text-xs text-muted-foreground">Delivery Address</p>
                                  <p className="font-medium">
                                    {order.address?.city || "No City"}, {order.address?.street || "No Street"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <ClockIcon className="text-blue-400 mt-0.5 flex-shrink-0" size={18} />
                                <div>
                                  <p className="text-xs text-muted-foreground">Ordered At</p>
                                  <p className="font-medium">
                                    {new Date(order.orderedAt).toLocaleString("en-EG", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}