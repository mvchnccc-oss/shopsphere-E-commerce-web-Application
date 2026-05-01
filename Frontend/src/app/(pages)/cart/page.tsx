"use client";
import Swal from "sweetalert2";
import React, { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Clock, Truck, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/context";
import LoadingImage from "@/components/loading-image";

const CartPage = () => {
  const { cartProducts, updateCartItem, clearCart } = useCart();
  const productsArray = cartProducts ? Object.entries(cartProducts) : [];
  const [removing, setRemoving] = useState<string | null>(null);

  let subtotal = 0;
  productsArray.forEach(([, p]) => { subtotal += p.price * p.quantity; });

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    updateCartItem(id, newQty);
  };

  const handleRemove = async (id: string) => {
    setRemoving(id);
    await updateCartItem(id, 0);
    setRemoving(null);
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear your cart?",
      text: "All items will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it",
      cancelButtonText: "Keep shopping",
    }).then((result) => {
      if (result.isConfirmed) clearCart();
    });
  };

  // Empty state
  if (productsArray.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-emerald-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-400">0</span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
        </div>
        <Link href="/products">
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-100 active:scale-95">
            <Package size={16} /> Browse Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/products" className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-emerald-600 transition-colors mb-2">
              <ArrowLeft size={14} /> Continue shopping
            </Link>
            <h1 className="text-2xl font-bold text-gray-100">
              Shopping Cart
              <span className="ml-2 text-base font-normal text-gray-400">
                ({productsArray.length} {productsArray.length === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={13} /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* Cart Items */}
          <div className="flex flex-col gap-3">
            {productsArray.map(([id, product]) => {
              const lineTotal = product.price * product.quantity;
              const isRemoving = removing === id;

              return (
                <div
                  key={id}
                  className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all duration-300 ${
                    isRemoving ? "opacity-40 pointer-events-none scale-[0.98]" : "hover:shadow-md hover:border-emerald-100"
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    {/* Image */}
                    <Link href={`/products/${id}`} className="shrink-0">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl relative overflow-hidden border border-gray-100 hover:border-emerald-200 transition-colors">
                        {product.image && (
                          <LoadingImage
                            src={product.image}
                            fill
                            alt={product.title}
                            sizes="80px"
                            className="object-contain p-1"
                          />
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${id}`}>
                        <p className="text-sm font-semibold text-gray-800 truncate hover:text-emerald-600 transition-colors">
                          {product.title}
                        </p>
                      </Link>
                      <p className="text-emerald-600 font-bold text-sm mt-0.5">
                        EGP {product.price.toLocaleString()}
                      </p>

                      {/* Mobile controls */}
                      <div className="flex items-center justify-between mt-3 md:hidden">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button onClick={() => handleUpdateQuantity(id, product.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-600 active:scale-90">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-800">{product.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(id, product.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-600 active:scale-90">
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800">EGP {lineTotal.toLocaleString()}</span>
                          <button onClick={() => handleRemove(id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop quantity */}
                    <div className="hidden md:flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button onClick={() => handleUpdateQuantity(id, product.quantity - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-600 active:scale-90">
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm font-bold text-gray-800">{product.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(id, product.quantity + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-600 active:scale-90">
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Desktop total + remove */}
                    <div className="hidden md:flex flex-col items-end gap-2 min-w-[90px]">
                      <span className="text-sm font-bold text-gray-900">EGP {lineTotal.toLocaleString()}</span>
                      <button onClick={() => handleRemove(id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h2 className="font-semibold text-gray-800 text-sm">Order Summary</h2>
              </div>

              <div className="p-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({productsArray.length} items)</span>
                  <span className="font-medium text-gray-800">EGP {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="h-px bg-gray-50 my-1" />
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>EGP {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="px-5 pb-4">
                <Link href="/checkout">
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-100 active:scale-95 text-sm">
                    <ShoppingBag size={15} /> Proceed to Checkout
                  </button>
                </Link>
              </div>

              <div className="px-5 pb-5 flex flex-col gap-2">
                {[
                  { icon: Truck,       text: "Free delivery on all orders" },
                  { icon: ShieldCheck, text: "Secure SSL checkout" },
                  { icon: Clock,       text: "Delivered in 3–7 business days" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                    <Icon size={12} className="text-emerald-500 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;