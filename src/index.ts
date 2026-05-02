import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  if (process.env.NODE_ENV === "production") {
    console.log(`[Vercel Debug] Method: ${req.method} | Path: ${req.path}`);
  }
  next();
});

app.get("/", (_req, res) => {
  res.json({
    message: "Hiku API is live",
    status: "ok",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    requestedPath: req.path,
  });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n Hiku is running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   API: http://localhost:${PORT}/api\n`);
  });
}

export default app;
