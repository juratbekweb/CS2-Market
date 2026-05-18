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
  // Force JWT strategy because Credentials provider requires it in NextAuth v5
  session: { strategy: "jwt" },
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
    Credentials({
      id: "steam-login",
      name: "Steam Login",
      credentials: {
        steamId: { label: "Steam ID", type: "text" },
        name: { label: "Name", type: "text" },
        avatar: { label: "Avatar", type: "text" },
      },
      async authorize(credentials) {
        const steamId = credentials?.steamId as string;
        const name = credentials?.name as string;
        const avatar = credentials?.avatar as string;
        
        if (!steamId) return null;
        
        if (process.env.DATABASE_URL) {
          // Find or create user in DB
          let user = await prisma.user.findUnique({ where: { steamId } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                steamId,
                name,
                avatar,
                role: "USER",
              },
            });
          } else {
            // Update avatar and name if changed
            user = await prisma.user.update({
              where: { id: user.id },
              data: { name, avatar },
            });
          }
          
          return {
            id: user.id,
            name: user.name,
            image: user.avatar,
          };
        } else {
          // Mock mode
          const mockUser = mockUsers.find((u) => u.steamId === steamId);
          if (mockUser) {
            return {
              id: mockUser.id,
              name: mockUser.name,
              image: mockUser.avatar,
            };
          }
          // Create a temp mock user
          return {
            id: `mock-${steamId}`,
            name: name || "Steam User",
            image: avatar || null,
          };
        }
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
      if (user.email) {
        const existing = await getCurrentUserByEmail(user.email);
        if (existing?.isBlocked) return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      // If user is passed, it means we just signed in
      if (user) {
        token.userId = user.id;
        token.picture = user.image;
      }
      
      // Fetch additional data from DB if needed
      if (token.userId && process.env.DATABASE_URL) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.userId as string } });
        if (dbUser) {
          token.role = dbUser.role;
          token.steamId = dbUser.steamId;
          token.balance = Number(dbUser.balance);
          token.picture = dbUser.avatar ?? dbUser.image ?? token.picture;
        }
      } else if (token.userId && !process.env.DATABASE_URL) {
        // Mock mode
        const mockUser = mockUsers.find((u) => u.id === token.userId);
        if (mockUser) {
          token.role = mockUser.role;
          token.steamId = mockUser.steamId;
          token.balance = Number(mockUser.balance);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? session.user.id;
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
        session.user.steamId = (token.steamId as string | null) ?? null;
        session.user.balance = Number(token.balance ?? 0);
        session.user.image = (token.picture as string | null) ?? session.user.image;
      }
      return session;
    },
  },
});
