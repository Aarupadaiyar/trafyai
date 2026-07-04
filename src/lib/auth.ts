import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.DIGEST_FROM_EMAIL,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    // Only allow sign-in for pre-approved admin emails.
    async signIn({ user }) {
      if (!user.email) return false;
      return ADMIN_EMAILS.includes(user.email.toLowerCase());
    },
    async session({ session }) {
      if (session.user?.email) {
        const admin = await db.admin.findUnique({
          where: { email: session.user.email },
        });
        (session.user as { role?: string }).role = admin?.role ?? "EDITOR";
      }
      return session;
    },
  },
  session: { strategy: "database" },
});
