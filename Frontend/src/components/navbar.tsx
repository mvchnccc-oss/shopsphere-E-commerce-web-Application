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
import { HeartIcon, ShoppingBagIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-accent p-3 flex items-center gap-4">
      <Link
        href="/"
        className="text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl flex items-center gap-0.5"
      >
        <ShoppingBagIcon className="size-8" />
        <span className="pt-1">ShopSphere</span>
      </Link>
      <div className="pt-2 flex-1">
        <Link href="/">Home</Link>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon">
          <HeartIcon />
        </Button>
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
