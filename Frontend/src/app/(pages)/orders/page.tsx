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
    (s, o) => s + o.orderItems.reduce((ss, i) => ss + i.quantity * i.pricePerUnit, 0),
    0,
  );
  const totalItems = orders.reduce(
    (s, o) => s + o.orderItems.reduce((ss, i) => ss + i.quantity, 0),
    0,
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-medium">My Orders</h1>
        <span className="text-sm text-muted-foreground">{orders.length} orders</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 mb-6">
        {[
          { label: "Total orders", value: orders.length },
          { label: "Items purchased", value: totalItems },
          { label: "Total spent", value: `EGP ${totalSpent.toFixed(2)}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted rounded-lg p-2 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-base sm:text-2xl font-medium truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const total = order.orderItems.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
          return (
            <details key={`order-${order.id}`} className="border rounded-xl overflow-hidden group">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted list-none">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-medium text-sm sm:text-base">#{order.id}</span>
                  <InvoiceModal order={order} total={total} />
                  <span className="text-xs bg-green-100 md:hidden lg:block text-green-700 px-2 py-0.5 rounded">
                    {order.orderItems.length} items
                  </span>
                </div>
                <span className="font-medium text-sm sm:text-base">EGP {total.toFixed(2)}</span>
              </summary>
              <div className="border-t">
                <div className="w-full text-sm">
                  {/* Header - hidden on mobile */}
                  <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr] bg-muted text-xs text-muted-foreground uppercase">
                    <div className="p-3">Product</div>
                    <div className="p-3">Qty</div>
                    <div className="p-3">Unit price</div>
                    <div className="p-3 text-right">Subtotal</div>
                  </div>

                  {/* Rows */}
                  {order.orderItems.map((item, i) => (
                    <div
                      key={i}
                      className="border-t grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-y-1 p-3 sm:p-0"
                    >
                      {/* Product */}
                      <div className="col-span-2 sm:col-span-1 sm:p-3">
                        {item.productTitle === null ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-muted-foreground italic">Unavailable</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                              Deleted
                            </span>
                          </span>
                        ) : (
                          item.productTitle
                        )}
                      </div>

                      {/* Qty */}
                      <div className="sm:p-3">
                        <span className="text-xs text-muted-foreground sm:hidden">Qty: </span>
                        {item.quantity}
                      </div>

                      {/* Unit price */}
                      <div className="sm:p-3">
                        <span className="text-xs text-muted-foreground sm:hidden">Price: </span>
                        EGP {item.pricePerUnit.toFixed(2)}
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 sm:col-span-1 sm:p-3 sm:text-right font-medium">
                        <span className="text-xs text-muted-foreground sm:hidden">Total: </span>
                        EGP {(item.quantity * item.pricePerUnit).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col p-3 bg-muted border-t">
                  <div className="flex items-center gap-2">
                    <span className="flex-none w-23.5 md:w-fit flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPinIcon className="text-red-400" size={20} />
                      Address
                    </span>
                    <span className="text-base font-medium">
                      {order.address?.city || "No City"} - {order.address?.street || "No Street"}
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
