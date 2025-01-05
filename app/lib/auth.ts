import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    roleId?: string;
    company?: string;
    accessToken?: string;
    email?: string;
  }

  interface JWT {
    id?: string;
    role?: string;
    roleId?: string;
    name?: string;
    email?: string;
    company?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
      roleId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      company?: string;
      accessToken?: string;
    };
  }

  interface AdapterUser {
    role?: string;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" }, // Change email to username
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error("Email or password not provided in credentials.");
          return null;
        }
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            console.error(
              `Login failed with status: ${response.status}, ${response.statusText}`
            );
            return null;
          }

          const user = await response.json();
          if (user?.data) {
            return {
              id: user.data.userId,
              email: user.data.email,
              role: user.data.roleName,
              roleId: user.data.roleId,
              name: user.data.name,
              company: user.data.company?.id,
              accessToken: user.token,
            };
          }

          console.error("Invalid user data received from API.");
          return null;
        } catch (error) {
          console.error("Error during login request:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roleId = user.roleId;
        token.name = user.name;
        token.email = user.email;
        token.company = user.company;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.roleId = token.roleId as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.company = token.company as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
