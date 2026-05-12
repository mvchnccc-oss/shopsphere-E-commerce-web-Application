import { AlertCircle, Trash2 } from "lucide-react";

interface DeletedProductCardProps {
  title?: string;
  price: number;
  quantity: number;
  subtotal: number;
  variant?: "orders" | "compact";
}

export default function DeletedProductCard({
  title,
  price,
  quantity,
  subtotal,
  variant = "orders",
}: DeletedProductCardProps) {
  const compact = variant === "compact";
  return (
    <div className={`flex ${compact ? "flex-col gap-3" : "items-center gap-4"} py-3 w-full`}>

      <div className="shrink-0">
        <div className="w-16 h-16 rounded-lg bg-linear-to-br from-red-500/10 to-red-600/5 border border-red-500/20 flex items-center justify-center">
          <Trash2 className="w-6 h-6 text-red-400/60" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-slate-400 truncate">
            {title ? `${title} (deleted)` : "Product Deleted"}
          </h3>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400 font-medium">Unavailable</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-2">
          This product is no longer available.
        </p>

        <div className={`flex ${compact ? "flex-col gap-2" : "gap-3"} text-xs`}>
          <div className="flex flex-col">
            <span className="text-slate-600">Price</span>
            <span className="text-slate-300 font-medium">EGP {Number(price).toLocaleString()}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-slate-600">Qty</span>
            <span className="text-slate-300 font-medium">{quantity}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-slate-300 font-medium">EGP {Number(subtotal).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className={`${compact ? "self-start" : "hidden sm:flex"} flex-col items-end gap-1`}> 
        <div className="px-2.5 py-1 rounded-lg bg-red-500/5 border border-red-500/10">
          <span className="text-xs text-red-400 font-medium">Removed</span>
        </div>
      </div>
    </div>
  );
}
