import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/login";

      if (isOnDashboard) {
        return isLoggedIn;
      }

      if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
