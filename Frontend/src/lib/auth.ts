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

        if (response.ok) {
          // Decode JWT to extract user email (sub field)
          const base64Payload = payload.token.split(".")[1];
          const decoded = JSON.parse(atob(base64Payload));

          return {
            id: decoded.sub, 
            user: {
              email: decoded.sub,
              name: data?.email?.split("@")[0] ?? "", 
              role: decoded.role ?? "user",
            },
            token: payload.token,
          };
        } else {
          throw new Error(payload.message || "Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // correct path
    error: "/auth/login", // correct path
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      (session as any).token = token.token;
      return session;
    },
  },
};
