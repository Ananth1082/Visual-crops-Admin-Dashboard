import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { getRefreshTokenExpiry, isJwtExpired } from "@/lib/jwt";
import { getBaseUrl } from "@/lib/get-url";

const authUrl = `${getBaseUrl()}/auth`;
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
  }

  interface User {
    login: {
      data: {
        accessToken: string;
        refreshToken: string;
      };
      user: {
        phone: string;
        id: string;
        role: "USER" | "ADMIN";
      };
    };

    accessToken: string;
  }

  interface AdapterUser {
    token: {
      access: string;
      refresh: string;
    };
    user: {
      phone: string;
      id: string;
      role: "USER" | "ADMIN";
    };
    accessToken: string;
  }

  interface Session {
    accessToken: string;
    userData: {
      phone: string;
      id: string;
      role: "USER" | "ADMIN";
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    iat: number;
    exp: number;
    accessToken: string;
    user: {
      phone: string;
      id: string;
      role: "USER" | "ADMIN";
    };
  }
}
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        orderId: { label: "OrderID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");
        const response = await axios.post(`${authUrl}/login`, {
          phone: credentials.phone,
          otp: credentials.otp,
          order_id: credentials.orderId,
        });
        console.log("Response: ", response);

        if (response.status !== 200) {
          throw new Error("Unauthorized user");
        }

        const { accessToken, refreshToken, user } = response.data;
        console.log("Authorize - API Response:", response.data);

        // Return a properly structured user object
        const authUser = {
          id: user.id, // This is required by NextAuth
          login: {
            data: {
              accessToken,
              refreshToken,
            },
            user: {
              phone: user.phone,
              id: user.id,
              role: user.role,
            },
          },
          accessToken, // Include this at root level as well
        };

        console.log("Authorize - Returning:", authUser);
        return authUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);

      if (user) {
        // When first signing in
        token = {
          ...token,
          accessToken: user.login.data.accessToken,
          refreshToken: user.login.data.refreshToken,
          user: user.login.user,
          iat: Math.floor(Date.now() / 1000),
          exp: getRefreshTokenExpiry(user.login.data.refreshToken),
        };
      } else if (
        token?.accessToken &&
        isJwtExpired(String(token.accessToken))
      ) {
        // Token refresh logic
        try {
          const response = await axios.post(`${authUrl}/refresh-token`, {
            refreshToken: token.refreshToken,
          });

          const { accessToken, refreshToken } = response.data;

          if (!accessToken || !refreshToken) {
            throw new Error("TokenRefreshError");
          }

          token = {
            ...token,
            accessToken,
            refreshToken,
            exp: getRefreshTokenExpiry(refreshToken),
          };
        } catch (error) {
          console.error("Token refresh error:", error);
          return { ...token, error: "TokenRefreshError" };
        }
      }

      console.log("JWT Callback - Returning Token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Initial Session:", session);

      if (token && token.user) {
        session.accessToken = token.accessToken;
        session.userData = {
          phone: token.user.phone,
          id: token.user.id,
          role: token.user.role,
        };
      }

      console.log("Session Callback - Final Session:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
