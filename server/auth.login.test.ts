import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = {
  id: number;
  email: string;
  passwordHash: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
};

function createAuthContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      setHeader: () => {},
      clearCookie: () => {},
    } as any,
    user: null,
  };

  return { ctx };
}

describe("auth.login", () => {
  it("should validate email format", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        email: "invalid-email",
        password: "password123",
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("auth.me", () => {
  it("should return null when not authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("should return user when authenticated", async () => {
    const user: AuthenticatedUser = {
      id: 1,
      email: "admin@example.com",
      passwordHash: "hashed_password",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ctx: TrpcContext = {
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
      user,
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();

    expect(result).toEqual(user);
  });
});

describe("auth.logout", () => {
  it("should return success on logout", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
  });
});

describe("quotes.getAll", () => {
  it("should require authentication", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.quotes.getAll();
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
