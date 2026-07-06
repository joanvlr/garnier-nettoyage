import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createPost } from "./db";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Logging middleware for debugging
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      console.log(`[API Request] ${req.method} ${req.path}`);
    }
    next();
  });

  // Test route to verify API is reachable
  app.get("/api/test", (req, res) => {
    res.status(200).json({ status: "ok", message: "Garnier Nettoyage API is active" });
  });

  // Webhook for Baby Love Growth
  app.post("/api/blog-webhook", async (req, res) => {
    try {
      // Security Check: Bearer Token
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];
      const secretToken = process.env.BLOG_WEBHOOK_SECRET || "gn_secure_blog_2026_xyz";

      if (!token || token !== secretToken) {
        console.warn(`[Webhook] Unauthorized attempt with token: ${token}`);
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("[Webhook] Received payload:", JSON.stringify(req.body).substring(0, 100) + "...");

      // Match Baby Love Growth payload fields
      const { title, slug, content_html, metaDescription, heroImageUrl } = req.body;
      
      // Allow content to be in 'content' or 'content_html'
      const finalContent = content_html || req.body.content;
      
      if (!title || !slug || !finalContent) {
        console.error("[Webhook] Validation failed. Missing title, slug or content.");
        return res.status(400).json({ error: "Missing required fields: title, slug, and content_html" });
      }

      await createPost({
        title,
        slug,
        content: finalContent,
        excerpt: metaDescription || req.body.excerpt,
        coverImage: heroImageUrl || req.body.coverImage,
        status: "published",
        publishedAt: new Date(),
      });

      console.log(`[Webhook] New post published: ${title}`);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("[Webhook] Error processing post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
