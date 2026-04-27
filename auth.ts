import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { mockUsers } from "@/lib/data/mock-store";
import { getCurrentUserByEmail } from "@/lib/store";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? "local-dev-auth-secret",
  trustHost: true,
  adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined,
  session: { strategy: process.env.DATABASE_URL ? "database" : "jwt" },
  providers: [
    Credentials({
      id: "demo-access",
      name: "Demo Access",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        if (!email) return null;

        const existing = await getCurrentUserByEmail(email);
        if (existing?.isBlocked) return null;
        if (existing) {
          return {
            id: existing.id,
            email: existing.email,
            name: existing.name,
            image: existing.avatar ?? existing.image,
          };
        }

        const mockUser = mockUsers.find((user) => user.email.toLowerCase() === email);
        if (!mockUser || mockUser.isBlocked) return null;

        return {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          image: mockUser.avatar ?? mockUser.image,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const existing = await getCurrentUserByEmail(user.email);
      if (existing?.isBlocked) return false;
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await getCurrentUserByEmail(token.email);
        if (dbUser) {
          token.role = dbUser.role;
          token.steamId = dbUser.steamId;
          token.balance = Number(dbUser.balance);
          token.userId = dbUser.id;
          token.picture = dbUser.avatar ?? dbUser.image ?? token.picture;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.id = String(token.userId ?? user?.id ?? "");
      session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      session.user.steamId = (token.steamId as string | null) ?? null;
      session.user.balance = Number(token.balance ?? 0);
      session.user.image = (token.picture as string | null) ?? session.user.image;
      return session;
    },
  },
});
