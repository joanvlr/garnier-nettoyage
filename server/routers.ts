import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { createQuoteRequest, getQuoteRequests, updateQuoteRequestStatus, deleteQuoteRequest, sendMessage, getMessagesForQuote, getUserByEmail, getUserById, createPost, getPublishedPosts, getPostBySlug } from "./db";
import { sendQuoteNotificationEmail, sendClientMessageEmail } from "./email";
import { storagePut } from "./storage";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export const appRouter = router({
  auth: router({
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(input.email);
        
        if (!user) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const passwordMatch = await bcryptjs.compare(input.password, user.passwordHash);
        if (!passwordMatch) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        // Set JWT in httpOnly cookie
        ctx.res.setHeader(
          "Set-Cookie",
          `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
        );

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        };
      }),

    me: publicProcedure.query(({ ctx }) => {
      return ctx.user || null;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.setHeader(
        "Set-Cookie",
        "auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
      );
      return { success: true };
    }),
  }),

  quotes: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().email().optional(),
          building: z.string().optional(),
          message: z.string().min(1),
          files: z
            .array(
              z.object({
                name: z.string(),
                content: z.string(),
                type: z.string(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const uploadedFiles = [];
        const uploadErrors: string[] = [];

        if (input.files && input.files.length > 0) {
          for (const file of input.files) {
            try {
              const base64Data = file.content.split(",")[1];
              if (!base64Data) {
                uploadErrors.push(`${file.name}: données invalides`);
                continue;
              }
              const buffer = Buffer.from(base64Data, "base64");
              const fileKey = `quote-requests/${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
              const { url, key } = await storagePut(fileKey, buffer, file.type);
              uploadedFiles.push({
                key,
                url,
                name: file.name,
                type: file.type,
              });
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
              uploadErrors.push(`${file.name}: ${errorMsg}`);
              console.error("File upload error:", error);
            }
          }

          if (uploadErrors.length > 0 && uploadedFiles.length === 0) {
            throw new Error(`Impossible d'uploader les fichiers: ${uploadErrors.join(", ")}`);
          }
        }

        const result = await createQuoteRequest({
          name: input.name,
          phone: input.phone,
          email: input.email,
          building: input.building,
          message: input.message,
          files: uploadedFiles,
        });

        // Envoyer une notification par email de manière asynchrone
        sendQuoteNotificationEmail({
          name: input.name,
          phone: input.phone,
          email: input.email,
          building: input.building,
          message: input.message,
        }).catch(err => console.error("Échec de l'envoi de l'email de notification:", err));

        return result;
      }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: admin access required");
      }
      return getQuoteRequests();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: admin access required");
        }
        return getQuoteRequestById(input.id);
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "contacted", "completed", "rejected"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: admin access required");
        }
        return updateQuoteRequestStatus(input.id, input.status);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: admin access required");
        }
        return deleteQuoteRequest(input.id);
      }),
  }),

  messages: router({
    send: protectedProcedure
      .input(
        z.object({
          quoteId: z.number(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: admin access required");
        }

        // 1. Sauvegarder le message en base de données
        const result = await sendMessage({
          quoteId: input.quoteId,
          content: input.content,
        });

        // 2. Récupérer les infos du client pour envoyer l'email
        const quote = await getQuoteRequestById(input.quoteId);
        if (quote && quote.email) {
          // 3. Envoyer l'email via Resend
          await sendClientMessageEmail({
            email: quote.email,
            name: quote.name,
            message: input.content,
          }).catch(err => console.error("Erreur lors de l'envoi de l'email client:", err));
        }

        return result;
      }),

    getForQuote: protectedProcedure
      .input(z.object({ quoteId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: admin access required");
        }
        return getMessagesForQuote(input.quoteId);
      }),
  }),

  blog: router({
    getAll: publicProcedure.query(async () => {
      return getPublishedPosts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getPostBySlug(input.slug);
      }),
    sync: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: admin access required");
      }
      
      try {
        const apiKey = "7d676e20-a8da-424c-8e8c-281cc6973484";
        const baseUrl = "https://api.babylovegrowth.ai/api/integrations/v1";
        
        const response = await fetch(`${baseUrl}/articles`, {
          headers: { "X-API-Key": apiKey, "Content-Type": "application/json" }
        });
        
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        const articles = await response.json();
        
        let syncCount = 0;
        for (const article of articles) {
          const fullRes = await fetch(`${baseUrl}/articles/${article.id}`, {
            headers: { "X-API-Key": apiKey, "Content-Type": "application/json" }
          });
          
          if (fullRes.ok) {
            const fullData = await fullRes.json();
            const existing = await getPostBySlug(fullData.slug);
            if (!existing) {
              await createPost({
                title: fullData.title,
                slug: fullData.slug,
                content: fullData.content_html,
                excerpt: fullData.meta_description,
                coverImage: fullData.hero_image_url,
                status: "published",
                publishedAt: new Date(fullData.createdAt),
              });
              syncCount++;
            }
          }
        }
        return { success: true, message: `${syncCount} nouveaux articles synchronisés.` };
      } catch (error) {
        console.error("[Sync] Error:", error);
        throw new Error("Échec de la synchronisation avec Baby Love Growth");
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;

// Helper function for getting quote by ID
export async function getQuoteRequestById(id: number) {
  const { getDb } = await import("./db");
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const { eq } = await import("drizzle-orm");
  const { quoteRequests } = await import("../drizzle/schema");
  
  const result = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
