"use client";
import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon, XIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

const mockProducts: Product[] = [
  { id: 1, title: "Wireless Headphones", price: 850, category: "Electronics", stock: 24, image: "https://i.imgur.com/QkIa5tT.jpeg" },
  { id: 2, title: "Smart Watch", price: 1200, category: "Electronics", stock: 12, image: "https://i.imgur.com/QkIa5tT.jpeg" },
  { id: 3, title: "Laptop Stand", price: 320, category: "Accessories", stock: 40, image: "https://i.imgur.com/QkIa5tT.jpeg" },
  { id: 4, title: "Mechanical Keyboard", price: 650, category: "Accessories", stock: 8, image: "https://i.imgur.com/QkIa5tT.jpeg" },
  { id: 5, title: "USB-C Hub", price: 280, category: "Accessories", stock: 35, image: "https://i.imgur.com/QkIa5tT.jpeg" },
];

const emptyForm = { title: "", price: "", category: "", stock: "", image: "" };

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditingProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      title: product.title,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      image: product.image,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.title || !form.price) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, title: form.title, price: Number(form.price), category: form.category, stock: Number(form.stock), image: form.image }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: form.title,
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          image: form.image,
        },
      ]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} products total</p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <PlusIcon className="size-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              <th className="text-left px-5 py-3 font-medium">Product</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3 font-medium">Price</th>
              <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Stock</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="font-medium">{product.title}</span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{product.category}</td>
                <td className="px-5 py-3.5 font-semibold">EGP {product.price}</td>
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.stock > 20
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      : product.stock > 5
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-muted-foreground hover:text-red-500"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-md hover:bg-muted transition-colors">
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Price (EGP)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Stock</Label>
                  <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Electronics" />
              </div>
              <div className="grid gap-1.5">
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </div>
        </div>
      )}

      
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h2 className="text-lg font-bold mb-2">Delete Product?</h2>
            <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteId)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
