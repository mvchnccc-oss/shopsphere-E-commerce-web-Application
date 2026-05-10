"use client";

import { useEffect, useState } from "react";
import {
  SearchIcon, Trash2Icon, LoaderIcon, PackageIcon,
  AlertTriangleIcon, CheckCircle2Icon, XCircleIcon,
} from "lucide-react";
import {
  getAdminProductsAction,
  deleteAdminProductAction,
  type AdminProduct,
} from "@/lib/actions/admin.action";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastState { message: string; type: "success" | "error" }

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function ConfirmDeleteModal({
  product, onConfirm, onCancel, isPending,
}: {
  product: AdminProduct;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
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
        <p className="text-sm font-semibold text-center text-white mb-5 px-4 truncate">
          &ldquo;{product.title}&rdquo;
        </p>
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
            {isPending ? (
              <><LoaderIcon className="size-4 animate-spin" /> Deleting...</>
            ) : (
              <><Trash2Icon className="size-4" /> Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Image ────────────────────────────────────────────────────────────

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
    <img
      src={src}
      alt={title}
      className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0"
      onError={() => setError(true)}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 150;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [isPending, setPending] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  function showToast(message: string, type: ToastState["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadPage(page: number, append = false) {
    if (page === 0) {
      setLoading(true);
      setLoadError(null);
    } else {
      setLoadingMore(true);
    }

    const res = await getAdminProductsAction(page, PAGE_SIZE);

    if (res.success) {
      setProducts((prev) => (append ? [...prev, ...res.data.products] : res.data.products));
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } else {
      setLoadError(res.error);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  useEffect(() => { loadPage(0); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setPending(true);
    const res = await deleteAdminProductAction(deleteTarget.id);
    setPending(false);
    setDeleteTarget(null);

    if (res.success) {
      showToast("Product deleted successfully.", "success");
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotalElements((prev) => Math.max(0, prev - 1));
    } else {
      showToast(res.error, "error");
    }
  }

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  function handleLoadMore() {
    if (currentPage >= totalPages - 1) return;
    loadPage(currentPage + 1, true);
  }

  const hasMore = !search && currentPage < totalPages - 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 border rounded-xl px-4 py-3 shadow-lg text-sm text-white animate-in fade-in slide-in-from-bottom-3 duration-300 ${
            toast.type === "success"
              ? "bg-[#0d1424] border-white/10"
              : "bg-[#1a0d0d] border-red-500/20"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircleIcon className="size-4 text-red-400 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <div className="flex flex-col gap-1">
          <p className="text-slate-400 text-sm mt-1">
            {loading
              ? "Loading..."
              : search
                ? `${filtered.length} of ${totalElements} total products`
                : `Showing ${products.length} of ${totalElements} total products`}
          </p>
          {!loading && totalPages > 0 && (
            <p className="text-slate-500 text-xs">
              {PAGE_SIZE} products per page · Page {currentPage + 1} of {totalPages}
            </p>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <input
          placeholder="Search products or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="border border-white/5 rounded-xl bg-white/2 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <LoaderIcon className="size-6 animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : loadError ? (
          <div className="p-12 flex flex-col items-center gap-3">
            <XCircleIcon className="size-8 text-red-400/50" />
            <span className="text-sm text-red-400">{loadError}</span>
            <button
              onClick={() => loadPage(0)}
              className="mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <PackageIcon className="size-8 opacity-30" />
            <span className="text-sm">
              {search ? "No products match your search." : "No products found."}
            </span>
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
                <tr
                  key={product.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <ProductImage src={product.images?.[0]} title={product.title} />
                      <span className="font-medium text-white truncate max-w-35">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-slate-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 hidden lg:table-cell">
                    {product.seller ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-white">
                    EGP {Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteTarget(product)}
                      title="Delete product"
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

      {hasMore && (
        <div className="flex flex-col items-center justify-center gap-3 pt-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-400 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading more..." : "Load more products"}
          </button>
          <p className="text-xs text-slate-500">
            Page {currentPage + 1} of {totalPages}
          </p>
        </div>
      )}

      <ScrollToTopButton />

      {/* Confirm Delete Modal */}
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