"use client";
import { useEffect, useState } from "react";
import {
  SearchIcon, LoaderIcon, ShoppingCartIcon,
  CalendarIcon, MapPinIcon, ChevronDownIcon,
} from "lucide-react";
import { getAdminOrdersAction, AdminOrder } from "@/lib/actions/admin.action";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric", month: "short", day: "numeric",
  hour: "2-digit", minute: "2-digit",
});

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    getAdminOrdersAction().then((res) => {
      if (res.success) setOrders(res.data);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);

  const filtered = orders.filter((o) =>
    String(o.id).includes(search) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 text-sm mt-1">{loading ? "Loading..." : `${orders.length} total orders`}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Orders", value: orders.length,                       color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Total Items",  value: orders.reduce((s,o) => s + o.itemCount, 0), color: "text-blue-400",   bg: "bg-blue-500/10" },
          { label: "Total Revenue",value: `EGP ${totalRevenue.toLocaleString()}`,     color: "text-emerald-400",bg: "bg-emerald-500/10" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <input
          placeholder="Search orders, customers, cities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="border border-white/5 rounded-xl p-12 flex flex-col items-center gap-3 text-slate-500 bg-white/[0.02]">
            <LoaderIcon className="size-6 animate-spin" />
            <span className="text-sm">Loading orders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-white/5 rounded-xl p-12 flex flex-col items-center gap-3 text-slate-500 bg-white/[0.02]">
            <ShoppingCartIcon className="size-8 opacity-30" />
            <span className="text-sm">No orders found.</span>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="font-mono text-xs text-slate-500 shrink-0">#{order.id}</span>
                  <span className="font-medium text-white truncate">{order.customerName}</span>
                  <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs shrink-0">
                    <MapPinIcon className="size-3 text-slate-500" />{order.city}
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-slate-500 text-xs shrink-0">
                    <CalendarIcon className="size-3" />
                    {dateFormatter.format(new Date(order.orderedAt))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-slate-400">{order.itemCount} items</span>
                  <span className="font-semibold text-white">EGP {order.totalAmount.toLocaleString()}</span>
                  <ChevronDownIcon
                    className={`size-4 text-slate-500 transition-transform ${expanded === order.id ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {/* Order Items (expanded) */}
              {expanded === order.id && (
                <div className="border-t border-white/5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.02] text-slate-500 text-xs">
                        <th className="text-left px-5 py-2.5 font-medium">Product</th>
                        <th className="text-left px-5 py-2.5 font-medium">Qty</th>
                        <th className="text-left px-5 py-2.5 font-medium">Unit Price</th>
                        <th className="text-right px-5 py-2.5 font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-5 py-3 text-slate-300">{item.productTitle}</td>
                          <td className="px-5 py-3 text-slate-400">{item.quantity}</td>
                          <td className="px-5 py-3 text-slate-400">EGP {item.pricePerUnit.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right font-medium text-white">
                            EGP {(item.quantity * item.pricePerUnit).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex justify-end">
                    <span className="text-sm font-bold text-white">
                      Total: EGP {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}