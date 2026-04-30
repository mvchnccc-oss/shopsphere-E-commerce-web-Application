import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "shopsphere",
      credentials: {
        email: { placeholder: "ahmed@gmail.com", type: "email" },
        password: { label: "enter your password", type: "password" },
      },
      async authorize(data) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: data?.email,
              password: data?.password,
            }),
            headers: { "Content-Type": "application/json" },
          },
        );

        const payload = await response.json();
        if (response.ok && payload.token) {
          return {
            id: data?.email as string,
            user: {
              email: data?.email,
              name: data?.email?.split("@")[0] ?? "",
            },
            token: payload.token,
            expiresAt: payload.expiresAt,
            isSeller: payload.isSeller ?? false,
          };
        } else {
          throw new Error(payload.message || "Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = (user as any).user;
        token.token = (user as any).token;
        token.isSeller = (user as any).isSeller ?? false;
        token.accessTokenExpires = (user as any).expiresAt;
      }


      if (trigger === "update" && session?.isSeller !== undefined) {
        token.isSeller = session.isSeller;
        if (session.token) token.token = session.token;
        if (session.user) token.user = session.user;
      }

      const currentTime = Date.now();
      if (currentTime < (token.accessTokenExpires as number)) {
        return token;
      }

      console.log("Token expired, triggering redirect...");
      return { ...token, error: "AccessTokenError" };
    },
    async session({ session, token }) {
      session.user = token.user as any;
      (session as any).token = token.token;
      (session as any).isSeller = token.isSeller ?? false;
      (session as any).error = token.error;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
