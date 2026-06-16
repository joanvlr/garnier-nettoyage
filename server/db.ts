import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, quoteRequests, InsertQuoteRequest, messages, InsertMessage } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * Create or get admin user
 */
export async function createOrGetAdminUser(email: string, passwordHash: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(users).values({
    email,
    passwordHash,
    role: "admin",
  });

  const newUser = await getUserByEmail(email);
  if (!newUser) {
    throw new Error("Failed to create user");
  }
  return newUser;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new quote request
 */
export async function createQuoteRequest(data: InsertQuoteRequest) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(quoteRequests).values(data);
  return result;
}

/**
 * Get all quote requests (admin only)
 */
export async function getQuoteRequests() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db.select().from(quoteRequests).orderBy(quoteRequests.createdAt);
}

/**
 * Get a single quote request by ID
 */
export async function getQuoteRequestById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update quote request status
 */
export async function updateQuoteRequestStatus(id: number, status: "new" | "contacted" | "completed" | "rejected") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db.update(quoteRequests).set({ status, updatedAt: new Date() }).where(eq(quoteRequests.id, id));
}

/**
 * Delete a quote request
 */
export async function deleteQuoteRequest(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db.delete(quoteRequests).where(eq(quoteRequests.id, id));
}

/**
 * Send a message to client
 */
export async function sendMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db.insert(messages).values(data);
}

/**
 * Get messages for a quote
 */
export async function getMessagesForQuote(quoteId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db.select().from(messages).where(eq(messages.quoteId, quoteId)).orderBy(messages.createdAt);
}
