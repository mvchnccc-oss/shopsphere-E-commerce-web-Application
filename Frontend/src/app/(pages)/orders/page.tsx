import { InvoiceModal } from "@/components/InvoiceModal";
import { getOrdersAction } from "@/lib/actions/orders.action";
import { Orders } from "@/lib/interfaces/orders.interface";
import { Banknote, ClockIcon, MapPinIcon } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function OrdersPage() {
  const res = await getOrdersAction();

  if (!res.success) {
    return <div className="p-8 text-center text-red-500">Failed to load orders.</div>;
  }

  const orders = (res as Orders).orders;
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <p className="text-lg font-medium">No orders yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          When you place an order, it will show up here.
        </p>
      </div>
    );
  }
  const totalSpent = orders.reduce(
    (s, o) => s + o.items.reduce((ss, i) => ss + i.quantity * i.pricePerUnit, 0),
    0,
  );
  const totalItems = orders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.quantity, 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-medium">My Orders</h1>
        <span className="text-sm text-muted-foreground">{orders.length} orders</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total orders", value: orders.length },
          { label: "Items purchased", value: totalItems },
          { label: "Total spent", value: `EGP ${totalSpent.toFixed(2)}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const total = order.items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
          return (
            <details key={order.id} className="border rounded-xl overflow-hidden group">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted list-none">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Order #{order.id}</span>
                  <InvoiceModal
                    order={order}
                    total={total}
                    
                  />
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {order.items.length} items
                  </span>
                </div>
                <span className="font-medium">EGP {total.toFixed(2)}</span>
              </summary>

              <div className="border-t">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-xs text-muted-foreground uppercase">
                    <tr>
                      <th className="text-left p-3">Product</th>
                      <th className="text-left p-3">Qty</th>
                      <th className="text-left p-3">Unit price</th>
                      <th className="text-right p-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-3">{item.productTitle}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">EGP {item.pricePerUnit.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">
                          EGP {(item.quantity * item.pricePerUnit).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col p-3 bg-muted border-t">
                  <div className="flex items-center gap-2">
                    <span className="flex-none w-23.5 md:w-fit flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPinIcon className="text-red-400" size={20} />
                      Address
                    </span>
                    <span className="text-base font-medium">
                      {order.orderAddress?.city || "No City"} - {order.orderAddress?.street || "No Street"}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 ">
                    <div className="flex items-center gap-2">
                      <span className="flex-none w-23.5 md:flex-1 md:w-full text-nowrap flex items-center gap-1 text-sm text-muted-foreground">
                        <ClockIcon className="mt-px" size={18} />
                        Ordered At
                      </span>
                      <span className="text-base font-medium">
                        {dateFormatter.format(new Date(order.orderedAt))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex-none w-23.5 md:flex-1 md:w-full flex items-center gap-1 text-sm text-muted-foreground">
                        <Banknote className="text-green-500" size={20} />
                        Total
                      </span>
                      <span className="text-base font-medium">EGP {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
