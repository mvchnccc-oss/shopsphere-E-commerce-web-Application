"use client";

import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Footer() {
    const { data: session } = useSession();
    const isSeller = (session as any)?.isSeller ?? false;

    const shopLinks = [
        { href: "/products", label: "All Products" },
        { href: "/categories", label: "Categories" },
    ];


    const accountLinks = isSeller
        ? [{ href: "/profile", label: "My Profile" }]
        : [
              { href: "/profile", label: "My Profile" },
              { href: "/orders", label: "My Orders" },
              { href: "/wishlist", label: "My Wishlist" },
              { href: "/cart", label: "My Cart" },
              { href: "/auth/login", label: "Login" },
              { href: "/auth/register", label: "Register" },
          ];

    const helpLinks = [
        { href: "#", label: "Track your order" },
        { href: "#", label: "Returns & exchanges" },
        { href: "#", label: "Shipping info" },
        { href: "#", label: "Contact us" },
    ];

    return (
        <footer className="bg-[#085041] text-[#9FE1CB] mt-16 px-6 pt-12 pb-6">
            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">

                    <div>
                        <Link href={isSeller ? "/dashboard" : "/"} className="flex items-center gap-1 mb-3">
                            <ShoppingBagIcon className="size-6 text-[#5DCAA5]" />
                            <span className="text-xl font-extrabold text-[#E1F5EE]">ShopSphere</span>
                        </Link>
                        <p className="text-sm text-[#5DCAA5] leading-relaxed max-w-55 mb-5">
                            Your one-stop destination for quality products delivered right to your door.
                        </p>

                        <div className="flex gap-2">
                            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full border border-[#1D9E75] flex items-center justify-center text-[#9FE1CB] hover:bg-[#0F6E56] transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#1D9E75] flex items-center justify-center text-[#9FE1CB] hover:bg-[#0F6E56] transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                            </a>
                            <a href="#" aria-label="X" className="w-8 h-8 rounded-full border border-[#1D9E75] flex items-center justify-center text-[#9FE1CB] hover:bg-[#0F6E56] transition-colors">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                        </div>
                    </div>

               
                    {!isSeller && (
                        <div>
                            <p className="text-[11px] font-medium text-[#E1F5EE] uppercase tracking-widest mb-4">Shop</p>
                            <ul className="flex flex-col gap-2.5">
                                {shopLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-[#5DCAA5] hover:text-[#E1F5EE] transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div>
                        <p className="text-[11px] font-medium text-[#E1F5EE] uppercase tracking-widest mb-4">Account</p>
                        <ul className="flex flex-col gap-2.5">
                            {accountLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[#5DCAA5] hover:text-[#E1F5EE] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-[11px] font-medium text-[#E1F5EE] uppercase tracking-widest mb-4">Help</p>
                        <ul className="flex flex-col gap-2.5">
                            {helpLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-[#5DCAA5] hover:text-[#E1F5EE] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="h-px bg-[#0F6E56] mb-5" />

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-[#5DCAA5]">
                        © {new Date().getFullYear()} ShopSphere. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                        <span className="px-3 py-1 bg-[#0F6E56] border border-[#1D9E75] rounded text-[11px] font-medium text-[#9FE1CB]">
                            Cash on Delivery
                        </span>
                    </div>
                    <div className="flex gap-5">
                        {["Privacy policy", "Terms of service"].map((label) => (
                            <a key={label} href="#" className="text-xs text-[#5DCAA5] hover:text-[#E1F5EE] transition-colors">
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}