"use client";
import React, { useState } from 'react';
import { Truck, Check, ChevronLeft, ShieldCheck, CheckCircle2, ImageIcon } from 'lucide-react';
import Link from 'next/link';

const CheckoutPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    

    const handleOrder = () => {
        setIsSubmitted(true);
        // Submition logic
    };

    return (
        <div className="max-w-4xl mx-auto my-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden font-sans">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_380px]">

                {/* Left Side: Delivery Details */}
                <div className="p-8 border-r border-gray-100">
                    <Link href="/cart">
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
                            <ChevronLeft size={16} /> Back to cart
                        </button>
                    </Link>

                    <h2 className="font-serif text-2xl font-medium text-gray-800 mb-6">Delivery Information</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[12px] font-medium text-gray-500">First name</label>
                                <input className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]" placeholder="John" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[12px] font-medium text-gray-500">Last name</label>
                                <input className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]" placeholder="Smith" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[12px] font-medium text-gray-500">Email address</label>
                            <input className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]" type="email" placeholder="john@example.com" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[12px] font-medium text-gray-500">Street address</label>
                            <input className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]" placeholder="123 Main Street, Apt 5" />
                        </div>

                        <div className="">
                            <div className="space-y-1">
                                <label className="text-[12px] font-medium text-gray-500">City</label>
                                <input className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]" placeholder="New York" />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 my-8"></div>

                    <h3 className="text-lg font-serif mb-4 text-emerald-700">Payment Method</h3>
                    <div className="p-4 border border-[#1D9E75] bg-[#E1F5EE] rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-4 border-[#1D9E75] bg-white"></div>
                            <div>
                                <p className="text-sm font-medium text-emerald-700">Cash on Delivery</p>
                                <p className="text-[11px] text-gray-500">Pay when you receive your order</p>
                            </div>
                        </div>
                        <Truck size={20} className="text-[#1D9E75]" />
                    </div>

                    <button
                        onClick={handleOrder}
                        disabled={isSubmitted}
                        className={`w-full mt-8 p-3.5 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${isSubmitted ? 'bg-[#085041]' : 'bg-[#0F6E56] hover:bg-[#085041] active:scale-[0.98]'}`}
                    >
                        {isSubmitted ? (
                            <><CheckCircle2 size={18} /> Order Placed Successfully!</>
                        ) : (
                            `Confirm Order — Total Price`
                        )}
                    </button>
                </div>

                {/* Right Side: Order Summary */}
                <div className="p-8 bg-gray-50">
                    <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wider mb-6">Order Summary</p>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#E1F5EE] rounded-lg flex items-center justify-center text-2xl relative">
                                
                                <ImageIcon/>
                                
                                 <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1D9E75] text-white text-[10px] rounded-full flex items-center justify-center">1</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-emerald-600 font-medium">Title</p>
                                <p className="text-xs text-gray-500 line-clamp-1">Discription</p>
                            </div>
                            <span className="text-sm font-medium text-emerald-700">Price EGP</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#E1F5EE] rounded-lg flex items-center justify-center text-2xl relative">
                                
                                <ImageIcon/>
                                
                                 <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1D9E75] text-white text-[10px] rounded-full flex items-center justify-center">1</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-emerald-600">Title</p>
                                <p className="text-xs text-gray-500 line-clamp-1">Discription</p>
                            </div>
                            <span className="text-sm font-medium text-emerald-700">Price EGP</span>
                        </div>
                        
                    </div>

                    <div className="h-px bg-gray-200 mb-6"></div>

                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span className="text-gray-800">SubTotal EGP</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Shipping</span>
                            <span className="text-[#1D9E75] font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-base font-medium pt-3 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span className="text-gray-900">Total EGP </span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-[12px] text-gray-500">
                            <Check size={14} className="text-[#1D9E75]" /> Free returns within 14 days
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-gray-500">
                            <Check size={14} className="text-[#1D9E75]" /> Quality guarantee
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-gray-500">
                            <ShieldCheck size={14} className="text-[#1D9E75]" /> Secure checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;