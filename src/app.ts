import cors from "cors";
import express from "express";
// @ts-ignore - ESM CommonJS compatibility
import rateLimit from "express-rate-limit";
// @ts-ignore - ESM CommonJS compatibility
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";
import { router } from "./routes/index.js";
import { logger } from "./utils/logger.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));
  app.use(requestContext);

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: env.NODE_ENV === "production" ? 120 : 1000,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use((req, _res, next) => {
    const start = Date.now();
    resOnFinish(req, start);
    next();
  });

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

function resOnFinish(req: express.Request, startedAt: number): void {
  req.res?.on("finish", () => {
    logger.info("request_completed", {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: req.res?.statusCode,
      latencyMs: Date.now() - startedAt
    });
  });
}
