import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ── Rate Limiting ────────────────────────────────────────────────────────────
// Diagnose is the expensive Gemini call — 5 per IP per hour
const diagnoseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many diagnoses from this IP. You get 5 per hour during beta — try again later.",
  },
});

// Image gen is cheaper but still has a cost — 10 per IP per hour
const imageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many image generation requests. Limit is 10 per hour during beta.",
  },
});

app.use("/api/diagnose", diagnoseLimiter);
app.use("/api/generate-step-image", imageLimiter);
// ─────────────────────────────────────────────────────────────────────────────

app.use("/api", router);

export default app;