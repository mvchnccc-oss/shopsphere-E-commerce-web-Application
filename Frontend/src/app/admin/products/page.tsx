"use client";
import { useEffect, useState } from "react";
import {
  SearchIcon, Trash2Icon, LoaderIcon, PackageIcon,
  AlertTriangleIcon, CheckCircle2Icon,
} from "lucide-react";
import { getAdminProductsAction, deleteAdminProductAction, AdminProduct } from "@/lib/actions/admin.action";

function ConfirmDeleteModal({
  product, onConfirm, onCancel, isPending,
}: {
  product: AdminProduct; onConfirm: () => void; onCancel: () => void; isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertTriangleIcon className="size-7 text-red-400" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-center text-white mb-1">Delete Product?</h2>
        <p className="text-slate-400 text-sm text-center mb-1">You're about to delete</p>
        <p className="text-sm font-semibold text-center text-white mb-5 px-4 truncate">"{product.title}"</p>
        <p className="text-xs text-slate-500 text-center mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? <><LoaderIcon className="size-4 animate-spin" /> Deleting...</> : <><Trash2Icon className="size-4" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductImage({ src, title }: { src?: string; title: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <PackageIcon className="size-4 text-slate-500" />
      </div>
    );
  }
  return (
    <img src={src} alt={title} className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0" onError={() => setError(true)} />
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [isPending, setPending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    const res = await getAdminProductsAction();
    if (res.success) setProducts(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setPending(true);
    const res = await deleteAdminProductAction(deleteTarget.id);
    setPending(false);
    setDeleteTarget(null);
    if (res.success) { showToast("Product deleted."); load(); }
    else showToast("Failed to delete product.");
  }

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0d1424] border border-white/10 rounded-xl px-4 py-3 shadow-lg text-sm text-white animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <p className="text-slate-400 text-sm mt-1">{loading ? "Loading..." : `${products.length} total products`}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <LoaderIcon className="size-6 animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <PackageIcon className="size-8 opacity-30" />
            <span className="text-sm">{search ? "No products match your search." : "No products found."}</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-xs">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Seller</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <ProductImage src={product.images?.[0]} title={product.title} />
                      <span className="font-medium text-white truncate max-w-[140px]">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-slate-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 hidden lg:table-cell">{product.seller ?? "—"}</td>
                  <td className="px-5 py-3.5 font-semibold text-white">EGP {product.price.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={isPending}
        />
      )}
    </div>
  );
}