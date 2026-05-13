import { promises } from "dns";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "shopsphere",
      credentials: {
        email: { placeholder: "ahmed@gmail.com", type: "email" },
        password: { label: "enter your password", type: "password" },
      },
      async authorize(data): Promise<User | null> {
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

        let payload: any = {};
        try {
          payload = await response.json();
        } catch {
          // no body
        }

        if (response.ok && payload.token) {
          return {
            id: data?.email as string,
            user: {
              email: data?.email,
              name: data?.email?.split("@")[0] ?? "",
            },
            token: payload.token,
            expiresAt: Date.now() + payload.expiresAt,
            role: payload.role,
          } as User;
        }

        if (response.status === 403) {
          throw new Error(
            "Your account has been suspended. Please contact support.",
          );
        }

        throw new Error(payload?.message || "Invalid credentials");
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
        token.user = user.user;
        token.token = user.token;
        token.role = user.role;
        token.accessTokenExpires = (user as any).expiresAt;
      }

      if (trigger === "update" && session?.role !== undefined) {
        token.role = session.role;
        if (session.token) token.token = session.token;
        if (session.user) token.user = session.user;
        if (session.accessTokenExpires)
          token.accessTokenExpires = session.accessTokenExpires;
      }

      const currentTime = Date.now();
      if (currentTime < (token.accessTokenExpires as number)) {
        return token;
      }
      return { ...token, error: "AccessTokenError" };
    },
    async session({ session, token }) {
      session.user = token.user;
      session.token = token.token;
      session.role = token.role;
      (session as any).error = token.error;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
