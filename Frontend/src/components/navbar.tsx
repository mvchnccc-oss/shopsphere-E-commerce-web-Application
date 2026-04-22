"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeartIcon, MenuIcon, ShoppingBagIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { status } = useSession();
  const pathname = usePathname();
  const [toggler, setToggler] = useState(false);

  const links = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/categories", label: "Categories" },
  ];

  async function handleLogout() {
    await signOut();
  }

  return (
    <div className="bg-accent p-5">
      {/* Desktop Row */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl flex items-center gap-0.5"
        >
          <ShoppingBagIcon className="size-8" />
          <span className="pt-1">ShopSphere</span>
        </Link>

        {/* Links - Desktop only */}
        <div className=" flex-1 hidden sm:flex justify-center">
          <ul className="py-2 px-15 bg-[#111] text-white rounded-full flex items-center gap-8">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={pathname === link.path ? "text-emerald-500" : "text-white"}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Icons - Desktop only */}
        <div className="hidden sm:flex items-center pt-1">
          {status === "unauthenticated" && (
            <>
              <Link href="/auth/login" className="mr-1">
                <Button variant="default">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="default">Register</Button>
              </Link>
            </>
          )}
          {status === "authenticated" && (
            <>
              <Button variant="ghost" size="icon">
                <ShoppingCartIcon />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full ml-1">
                    <Avatar>
                      <AvatarImage src="" alt="shadcn" />
                      <AvatarFallback>
                        <UserIcon />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Hamburger - Mobile only */}
        <div className="flex-1 flex justify-end sm:hidden">
          <button onClick={() => setToggler(!toggler)}>
            <MenuIcon className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className={`sm:hidden overflow-hidden transition-all duration-500 ease-in-out ${toggler ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setToggler(false)}
              className={pathname === link.path ? "text-emerald-400" : ""}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-1 pt-1">
            {status === "unauthenticated" && (
              <>
                <Link href="/auth/login" onClick={() => setToggler(false)} className="mr-1">
                  <Button variant="default">Login</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setToggler(false)}>
                  <Button variant="default">Register</Button>
                </Link>
              </>
            )}
            {status === "authenticated" && (
              <>

                <Button variant="ghost" size="icon">
                  <ShoppingCartIcon />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full ml-1">
                      <Avatar>
                        <AvatarImage src="" alt="shadcn" />
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-32">
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" onClick={() => setToggler(false)}>Profile</Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive" onClick={() => { handleLogout(); setToggler(false); }}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}