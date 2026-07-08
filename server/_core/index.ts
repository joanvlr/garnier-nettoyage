import express from "express";
import { createServer } from "http";
import cors from "cors";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Configure CORS - Allow main domain and all Vercel preview URLs
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://garnier-nettoyage.fr",
        "https://www.garnier-nettoyage.fr",
        "https://garnier-nettoyage.vercel.app"
      ];
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }));
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Storage proxy for file downloads
  registerStorageProxy(app);

  // Test route to verify API is reachable
  app.get("/api/test", (req, res) => {
    res.status(200).json({ status: "ok", message: "Garnier Nettoyage API is active" });
  });

  // Webhook for Baby Love Growth (Legacy support)
  app.post("/api/blog-webhook", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];
      const secretToken = process.env.BLOG_WEBHOOK_SECRET || "gn_secure_blog_2026_xyz";

      if (!token || token !== secretToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { title, slug, content_html, metaDescription, heroImageUrl } = req.body;
      const finalContent = content_html || req.body.content;
      
      if (!title || !slug || !finalContent) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { createPost } = await import("../db");
      await createPost({
        title,
        slug,
        content: finalContent,
        excerpt: metaDescription || req.body.excerpt,
        coverImage: heroImageUrl || req.body.coverImage,
        status: "published",
        publishedAt: new Date(),
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("[Webhook] Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
