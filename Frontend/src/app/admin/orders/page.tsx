import OrdersList from "@/components/OrdersList";
import { getAdminOrdersAction } from "@/lib/actions/admin.action";

interface Props {
  searchParams?: { page?: string };
}

export default async function AdminOrdersPage({ searchParams }: Readonly<Props>) {
  const page = Math.max(0, Number(searchParams?.page ?? 0));
  const size = 20;

  const result = await getAdminOrdersAction(page, size);

  if (!result.success) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
        </div>
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {result.error}
        </div>
      </div>
    );
  }

  const data = result.data;

  const totalItems = data.orders.reduce(
    (sum, order) => sum + order.orderItems.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const totalRevenue = data.orders.reduce(
    (sum, order) => sum + order.orderItems.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 text-sm mt-1">{data.totalElements} total orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Orders", value: data.totalElements, color: "text-violet-400" },
          { label: "Total Items", value: totalItems, color: "text-blue-400" },
          {
            label: "Total Revenue",
            value: `EGP ${totalRevenue.toLocaleString()}`,
            color: "text-emerald-400",
          },
        ].map((card) => (
          <div key={card.label} className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
            <p className="text-xs text-slate-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <OrdersList initialData={data} currentPage={page} />
    </div>
  );
}
