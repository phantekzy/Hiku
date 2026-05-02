import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (
        process.env.NODE_ENV === "production" &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// ── Body parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend static files ───────────────────────────
const publicPath = path.resolve(process.cwd(), "client/dist");
app.use(express.static(publicPath));

// ── Request logger ────────────────────────────────────────
app.use((req, _res, next) => {
  if (process.env.NODE_ENV === "production") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ── Health check ──────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? "configured" : "missing",
  });
});

// ── API routes ────────────────────────────────────────────
app.use("/api", routes);

// ── Frontend fallback (React Router) ─────────────────────
app.use((_req, res) => {
  const indexPath = path.resolve(process.cwd(), "client/dist", "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ message: "Not found" });
    }
  });
});

// ── Error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start server locally only ─────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n 🌿 Hiku is running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   API: http://localhost:${PORT}/api\n`);
  });
}

// ── Export for Vercel ─────────────────────────────────────
export default app;
