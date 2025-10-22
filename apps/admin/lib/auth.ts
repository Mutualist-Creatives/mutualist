import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Get admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mutualist.co";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Verify against environment variables
        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            email: ADMIN_EMAIL,
            name: ADMIN_NAME,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname === "/login";
      const isOnAuth = nextUrl.pathname.startsWith("/api/auth");

      // Allow auth endpoints
      if (isOnAuth) {
        return true;
      }

      // If on login page
      if (isOnLogin) {
        // Redirect to dashboard if already logged in
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        // Allow access to login page
        return true;
      }

      // For all other pages, require authentication
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
  trustHost: true, // Important for production deployment
});
