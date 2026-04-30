"use client";
import Swal from "sweetalert2";
import React from "react";
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Clock, RefreshCw, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/context";


const CartPage = () => {

    const { cartProducts, updateCartItem, clearCart } = useCart();
    const productsArray = cartProducts ? Object.entries(cartProducts) : [];

    let subtotal = 0;


    const handleUpdateQuantity = (id: string, newQty: number) => {
        if (newQty < 1) return;
        updateCartItem(id, newQty);
    };

    const handleRemove = (id: string) => {
        updateCartItem(id, 0);
    };

    const handleClearCart = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your cart will be completely empty!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0F6E56",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, clear it!",
        }).then((result) => {
            if (result.isConfirmed) {
                clearCart();
                Swal.fire("Cleared!", "Your cart is now empty.", "success");
            }
        });
    };
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-baseline justify-between mb-8">
                <h1 className="font-serif text-3xl font-semibold text-emerald-600">Your cart</h1>
                <div className="flex gap-3 justify-between items-center">
                    <span className="text-xl text-gray-500 text-nowrap">{productsArray.length} items</span>
                    <button
                        onClick={handleClearCart}
                        disabled={productsArray.length === 0}
                        className="w-full bg-red-500 text-white py-2 px-2 rounded-xl font-medium flex items-center justify-center gap-1 hover:bg-red-700 transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-600 cursor-pointer"
                    >
                        <Trash size={18} /> Clear cart
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                <div className="space-y-4">
                    {productsArray.length > 0 ? (
                        <>
                            <div className="hidden md:grid grid-cols-[1fr_120px_100px_100px] gap-4 pb-4 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                                <div>Product</div>
                                <div className="text-center">Quantity</div>
                                <div className="text-center">Price</div>
                                <div className="text-right">Total</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {productsArray.map(([id, product]) => {
                                    const lineTotal = product.price * product.quantity;
                                    subtotal += lineTotal;

                                    return (
                                        <div key={id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_100px] gap-4 py-6 items-center group">
                                            <div className="flex gap-4 items-center">
                                                <Link href={`/products/${id}`}>
                                                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center relative shrink-0 cursor-pointer hover:shadow-md transition-shadow">
                                                        {product.image && (
                                                            <Image src={product.image} alt={product.title} width={56} height={56} className="object-contain" />
                                                        )}
                                                    </div>
                                                </Link>
                                                <div className="flex flex-col min-w-0">
                                                    <Link href={`/products/${id}`} className="text-sm font-medium text-gray-200 truncate hover:text-emerald-600 transition-colors">
                                                        {product.title}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(id)}
                                                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 mt-2 transition-colors w-fit cursor-pointer"
                                                    >
                                                        <Trash2 size={12} /> Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex justify-center">
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(id, product.quantity - 1)}
                                                        className="p-1.5 hover:bg-gray-50 text-gray-500 cursor-pointer"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium text-gray-900 min-w-8 text-center">
                                                        {product.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(id, product.quantity + 1)}
                                                        className="p-1.5 hover:bg-gray-50 text-gray-500 cursor-pointer"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-center text-sm text-gray-300 hidden md:block">
                                                {product.price.toLocaleString()} EGP
                                            </div>

                                            <div className="text-right text-sm font-semibold text-gray-50">
                                                {lineTotal.toLocaleString()} EGP
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="text-4xl mb-4">🛍️</div>
                            <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                            <Link href="/">
                                <button className="mt-6 text-[#0F6E56] font-medium text-sm hover:underline">Continue shopping</button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-6">
                        <h2 className="font-serif text-lg font-medium text-gray-900 mb-6">Order summary</h2>
                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-gray-900 font-medium">{subtotal.toLocaleString()} EGP</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span className="text-[#0F6E56] font-medium">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-baseline">
                            <span className="text-base font-medium">Total</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {subtotal.toLocaleString()} EGP
                            </span>
                        </div>

                        <Link href="/checkout">
                            <button
                                disabled={productsArray.length === 0}
                                className="w-full bg-[#0F6E56] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#085041] transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={18} /> Proceed to checkout
                            </button>
                        </Link>

                        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4 text-[11px] text-gray-500 uppercase tracking-tight">
                            <div className="flex items-center gap-3"><RefreshCw size={14} className="text-[#1D9E75]" /> Free returns within 14 days</div>
                            <div className="flex items-center gap-3"><ShieldCheck size={14} className="text-[#1D9E75]" /> Secure SSL checkout</div>
                            <div className="flex items-center gap-3"><Clock size={14} className="text-[#1D9E75]" /> Delivered in 3–7 business days</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;