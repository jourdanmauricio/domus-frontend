// lib/auth.ts
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
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
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
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
    async jwt({ token, user }: { token: JWT; user: any }) {
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
    async session({ session, token }: { session: Session; token: JWT }) {
      // Pasar la información del token a la sesión
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.roles = token.roles as string[];
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { auth, handlers } = NextAuth(authConfig);
