import { UserInterface } from "@/Interfaces/AuthInterface";

declare module "next-auth" {
  interface Session {
    user: UserInterface;
    token: string;
    error?: "AccessTokenError";
  }

  interface User {
    user: UserInterface;
    token: string;
    expiresAt: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserInterface;
    token: string;
    accessTokenExpires: number;
    error?: "AccessTokenError";
  }
}
