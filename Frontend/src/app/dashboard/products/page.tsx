"use client";

import { useEffect, useState } from "react";
import {
  PlusIcon, PencilIcon, Trash2Icon, XIcon, SearchIcon,
  PackageIcon, AlertTriangleIcon, CheckCircle2Icon, LoaderIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SellerProduct, CreateProductPayload,
  getSellerProductsAction, createProductAction,
  updateProductAction, deleteProductAction,
} from "@/lib/actions/seller.actions";
import { getAllCategories } from "@/lib/actions/category.action";
import { Category } from "@/lib/interfaces/categories.interface";

const emptyForm: CreateProductPayload = {
  title: "", description: "", price: 0, category: "", images: [],
};

function ProductImage({ src, title }: { src?: string; title: string }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
        <PackageIcon className="size-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="size-9 rounded-lg object-cover border border-border shrink-0"
      onError={() => setError(true)}
    />
  );
}

function ConfirmDeleteModal({
  product, onConfirm, onCancel, isPending,
}: {
  product: SellerProduct;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-950">
            <AlertTriangleIcon className="size-7 text-red-500" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-center mb-1">Delete Product?</h2>
        <p className="text-muted-foreground text-sm text-center mb-1">You're about to delete</p>
        <p className="text-sm font-semibold text-center mb-5 px-4 truncate">"{product.title}"</p>
        <p className="text-xs text-muted-foreground text-center mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>Cancel</Button>
          <Button
            variant="destructive"
            className="flex-1 flex items-center gap-2"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? <><LoaderIcon className="size-4 animate-spin" /> Deleting...</> : <><Trash2Icon className="size-4" /> Delete</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({
  editingProduct, categories, onSave, onClose,
}: {
  editingProduct: SellerProduct | null;
  categories: Category[];
  onSave: (payload: CreateProductPayload) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CreateProductPayload>(
    editingProduct
      ? {
          title: editingProduct.title,
          description: editingProduct.description,
          price: editingProduct.price,
          category: editingProduct.category,
          images: Array.isArray(editingProduct.images) ? editingProduct.images : [],
        }
      : { ...emptyForm }
  );
  const [imageInput, setImageInput] = useState("");
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!form.title.trim() || !form.price || !form.category) {
      setError("Title, price and category are required.");
      return;
    }
    setPending(true);
    setError(null);
    const finalPayload = {
      ...form,
      images: form.images.length > 0 ? form.images : []
    };
    await onSave(finalPayload);
    setPending(false);
  }

  function addImage() {
    if (imageInput.trim()) {
      setForm((f) => ({ ...f, images: [...f.images, imageInput.trim()] }));
      setImageInput("");
    }
  }

  function removeImage(i: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors"><XIcon className="size-4" /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product name" />
          </div>
          <div className="grid gap-1.5">
            <Label>Description *</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your product..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Price (EGP) *</Label>
              <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="0" min={0} />
            </div>
            <div className="grid gap-1.5">
              <Label>Category *</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select...</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Images (URLs)</Label>
            <div className="flex gap-2">
              <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())} />
              <Button type="button" variant="outline" onClick={addImage} className="shrink-0">Add</Button>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                {form.images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-muted rounded-lg px-3 py-2">
                    <span className="flex-1 truncate text-muted-foreground">{url}</span>
                    <button onClick={() => removeImage(i)} className="text-destructive hover:opacity-70"><XIcon className="size-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-destructive text-xs mt-3 flex items-center gap-1"><AlertTriangleIcon className="size-3" /> {error}</p>}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 flex items-center gap-2" onClick={handleSave} disabled={isPending}>
            {isPending ? <><LoaderIcon className="size-4 animate-spin" /> Saving...</> : (editingProduct ? "Save Changes" : "Add Product")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SellerProduct | null>(null);
  const [isDeletePending, setDeletePending] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  async function loadProducts() {
    const res = await getSellerProductsAction();
    if (res.success) setProducts(res.data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
    getAllCategories().then((cats) => {
      if (cats) setCategories(Array.isArray(cats) ? cats : []);
    });
  }, []);

  const filtered = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  async function handleSave(payload: CreateProductPayload) {
    if (editingProduct) {
      const res = await updateProductAction(editingProduct.id, payload);
      if (res.success) { showToast("Product updated successfully!"); await loadProducts(); }
      else showToast(`Error: ${res.message}`);
    } else {
      const res = await createProductAction(payload);
      if (res.success) { showToast("Product added successfully!"); await loadProducts(); }
      else showToast(`Error: ${res.message}`);
    }
    setModalOpen(false);
    setEditingProduct(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeletePending(true);
    const res = await deleteProductAction(deleteTarget.id);
    setDeletePending(false);
    setDeleteTarget(null);
    if (res.success) { showToast("Product deleted."); await loadProducts(); }
    else showToast(`Error: ${res.message}`);
  }

  return (
    <div className="flex flex-col gap-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
          {toastMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{loading ? "Loading..." : `${products.length} products total`}</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setModalOpen(true); }} className="flex items-center gap-2"><PlusIcon className="size-4" /> Add Product</Button>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3 text-muted-foreground"><LoaderIcon className="size-6 animate-spin" /><span className="text-sm">Loading products...</span></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-muted-foreground"><PackageIcon className="size-8 opacity-40" /><span className="text-sm">{search ? "No products match your search." : "No products yet. Add your first one!"}</span></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <ProductImage src={product.images?.[0]} title={product.title} />
                      <span className="font-medium truncate max-w-[140px]">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{product.category}</td>
                  <td className="px-5 py-3.5 font-semibold">EGP {product.price.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingProduct(product); setModalOpen(true); }} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><PencilIcon className="size-4" /></button>
                      <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-muted-foreground hover:text-red-500"><Trash2Icon className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && <ProductModal editingProduct={editingProduct} categories={categories} onSave={handleSave} onClose={() => { setModalOpen(false); setEditingProduct(null); }} />}
      {deleteTarget && <ConfirmDeleteModal product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isPending={isDeletePending} />}
    </div>
  );
}