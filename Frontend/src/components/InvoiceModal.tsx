"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReceiptText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});


export function InvoiceModal({ order, total }: { order: any; total: number }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ReceiptText size={16} />
          View Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-125">
        <DialogHeader>
          <DialogTitle>Order Invoice</DialogTitle>
        </DialogHeader>

        <div
          className="p-4 border rounded-lg bg-white text-black space-y-4 shadow-sm"
          id={`invoice-${order.id}`}
        >
          <div className="flex justify-between items-start border-b pb-2">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Invoice</h2>
              <p className="text-[10px] text-muted-foreground font-mono">ID: {order.id}</p>

              <div className="mt-2">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Customer</p>
                <div className="flex gap-1 text-sm text-black font-medium">
                  <span>{order.orderAddress?.firstname}</span>
                  <span>{order.orderAddress?.lastname}</span>
                </div>
              </div>

            </div>

            <div className="text-right">
              <p className="text-sm font-medium">Date</p>
              <p className="text-xs">
                {dateFormatter.format(new Date(order.orderedAt))}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold">Shipping Address:</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {order.orderAddress?.street}, {order.orderAddress?.city}
            </p>
          </div>

          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2 font-medium">Item</th>
                <th className="text-center py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, i: number) => (
                <tr key={i} className="border-b border-dashed last:border-b-0">
                  <td className="py-2 text-xs max-w-50 truncate">
                    {item.productTitle}
                  </td>
                  <td className="py-2 text-center text-xs">{item.quantity}</td>
                  <td className="py-2 text-right text-xs">
                    EGP {(item.quantity * item.pricePerUnit).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-bold">Total Amount</span>
            <span className="font-bold text-lg text-primary">
              EGP {total.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          onClick={() => window.print()}
          variant="secondary"
          className="w-full gap-2 mt-4"
        >
          <Printer size={16} /> Print Invoice
        </Button>
      </DialogContent>
    </Dialog>
  );
}