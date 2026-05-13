"use client";

import ScrollToTopButton from "@/components/ScrollToTopButton";
import type { AdminOrders } from "@/lib/interfaces/admin.interface";
import {
  CalendarIcon,
  ChevronDownIcon,
  MapPinIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface Props {
  initialData: AdminOrders;
  currentPage: number;
}

export default function OrdersList({ initialData, currentPage }: Readonly<Props>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = initialData.orders.filter(
    (o) =>
      String(o.id).includes(search) ||
      o.address.firstname.toLowerCase().includes(search.toLowerCase()) ||
      o.address.lastname.toLowerCase().includes(search.toLowerCase()) ||
      o.address.city.toLowerCase().includes(search.toLowerCase()),
  );

  function goToPage(page: number) {
    router.push(`/admin/orders?page=${page}`);
  }

  return (
    <>
      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <input
          placeholder="Search orders, customers, cities..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setExpanded(null);
          }}
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="border border-white/5 rounded-xl p-12 flex flex-col items-center gap-3 text-slate-500 bg-white/2">
            <ShoppingCartIcon className="size-8 opacity-30" />
            <span className="text-sm">
              {search ? "No orders match your search." : "No orders found."}
            </span>
          </div>
        ) : (
          filtered.map((order) => {
            const total = order.orderItems.reduce(
              (acc, item) => acc + item.pricePerUnit * item.quantity,
              0,
            );

            return (
              <div
                key={order.id}
                className="border border-white/5 rounded-xl bg-white/2 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="font-mono text-xs text-slate-500 shrink-0">#{order.id}</span>
                    <span className="font-medium text-white truncate">
                      {order.address.firstname} {order.address.lastname}
                    </span>
                    <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs shrink-0">
                      <MapPinIcon className="size-3 text-slate-500" />
                      {order.address.city}
                    </div>
                    <div className="hidden md:flex items-center gap-1 text-slate-500 text-xs shrink-0">
                      <CalendarIcon className="size-3" />
                      {dateFormatter.format(new Date(order.orderedAt))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="font-semibold text-white">EGP {total.toLocaleString()}</span>
                    <ChevronDownIcon
                      className={`size-4 text-slate-500 transition-transform ${
                        expanded === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {expanded === order.id && (
                  <div className="border-t border-white/5 bg-black/20">
                    {/* Mobile: city + date */}
                    <div className="sm:hidden px-5 py-2 flex gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="size-3" />
                        {order.address.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3" />
                        {dateFormatter.format(new Date(order.orderedAt))}
                      </span>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-500 text-xs uppercase tracking-wider">
                          <th className="text-left px-5 py-3">Product</th>
                          <th className="text-left px-5 py-3">Qty</th>
                          <th className="text-right px-5 py-3">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map((item, i) => (
                          <tr key={i} className="border-t border-white/5">
                            <td className="px-5 py-3 text-slate-300">
                              {item.productTitle === null ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <span className="text-slate-500 italic">Unavailable</span>
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                                    Deleted
                                  </span>
                                </span>
                              ) : (
                                item.productTitle
                              )}
                            </td>
                            <td className="px-5 py-3 text-slate-400">{item.quantity}</td>
                            <td className="px-5 py-3 text-right text-white font-medium">
                              EGP {(item.quantity * item.pricePerUnit).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-white/10">
                          <td colSpan={2} className="px-5 py-3 text-slate-500 text-xs font-medium">
                            {order.address.street}, {order.address.city}
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-white">
                            EGP {total.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {!search && initialData.totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-3 pt-4">
          {currentPage < initialData.totalPages - 1 ? (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-400 transition"
            >
              Load more orders
              <ChevronDownIcon className="size-4" />
            </button>
          ) : (
            <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs text-slate-400">
              All orders loaded
            </div>
          )}
          <p className="text-xs text-slate-500">
            Page {currentPage + 1} of {initialData.totalPages} — {initialData.totalElements} total
            orders
          </p>
        </div>
      )}
      <ScrollToTopButton />
    </>
  );
}
