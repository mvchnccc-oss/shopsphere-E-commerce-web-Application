import { UserInterface } from "@/lib/interfaces/auth.interface";
import NextAuth, { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: UserInterface;
    token: string;
    isSeller: boolean;
  }
  interface User {
    user: UserInterface;
    token: string;
    isSeller: boolean;
  }
}
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: UserInterface;
    token: string;
    isSeller: boolean;
  }
}
