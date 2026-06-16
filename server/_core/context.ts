import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import jwt from "jsonwebtoken";
import { getUserById } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Extract JWT from cookies
    const cookies = opts.req.headers.cookie || "";
    const cookieArray = cookies.split(";");
    let token: string | null = null;

    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token") {
        token = value;
        break;
      }
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
      const foundUser = await getUserById(decoded.id);
      user = foundUser || null;
    }
  } catch (error) {
    // Authentication is optional for public procedures
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
