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

  // Webhook for Baby Love Growth
  app.post("/api/blog-webhook", async (req, res) => {
    try {
      const { title, slug, content, excerpt, coverImage } = req.body;
      
      if (!title || !slug || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await createPost({
        title,
        slug,
        content,
        excerpt,
        coverImage,
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
