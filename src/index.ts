import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

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
        (origin.endsWith(".vercel.app") || origin.endsWith(".vercel.app/"))
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  if (process.env.NODE_ENV === "production") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

app.get("/", (_req, res) => {
  res.json({
    name: "Hiku API",
    status: "ok",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    endpoints: {
      health: "/health",
      api: "/api",
      auth: "/api/auth",
      documents: "/api/documents",
      canvases: "/api/canvases",
      diagrams: "/api/diagrams",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? "configured" : "missing",
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
    hint: "Available routes: /, /health, /api/auth, /api/documents, /api/canvases, /api/diagrams",
  });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n 🌿 Hiku is running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   API: http://localhost:${PORT}/api\n`);
  });
}

export default app;
