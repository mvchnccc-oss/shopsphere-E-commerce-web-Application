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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email: data?.email,
            password: data?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const payload = await response.json();
        if (response.ok && payload.token) {
          return {
            id: data?.email as string,
            user: {
              email: data?.email,
              name: data?.email?.split("@")[0] ?? "",
              // role: payload.role,
            },
            token: payload.token,
            expiresAt: payload.expiresAt,
          };
        } else {
          throw new Error(payload.message || "Invalid cerdintials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
        // convert duration to an actual future timestamp
        token.accessTokenExpires = Date.now() + user.expiresAt;
      }

      if (!token.accessTokenExpires) {
        return { ...token, error: "AccessTokenError" as const };
      }

      if (Date.now() < token.accessTokenExpires) {
        const { error: _, ...validToken } = token;
        return validToken;
      }

      return { ...token, error: "AccessTokenError" as const };
    },
    async session({ session, token }) {
      /* 
     
      if (session.user) {
        (session.user as any).role = token.role;
      } 
     
      */
      session.user = token.user as any;
      (session as any).token = token.token;
      (session as any).error = token.error;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
