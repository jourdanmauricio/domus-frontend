// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
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

        try {
          const loginPayload = {
            email: credentials.email,
            password: credentials.password,
          };

          const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginPayload),
          });

          const responseData = await res.json();

          if (res.ok && responseData.access_token) {
            const returnUser = {
              id: responseData.user.id,
              email: responseData.user.email,
              name: responseData.user.name,
              roles: responseData.user.roles,
              accessToken: responseData.access_token,
            };

            return returnUser;
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Agregar el accessToken al token JWT de NextAuth
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar la información del token a la sesión
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.roles = token.roles;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});

export const { GET, POST } = handlers;
