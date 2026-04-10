import { createServer } from "node:http";
import createApp from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const app = createApp();
const server = createServer(app);

const startTime = Date.now();
server.listen(env.PORT, () => {
  const bootTime = Date.now() - startTime;
  logger.info("server_started", {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    bootTimeMs: bootTime,
    runtime: "vercel-node"
  });
});

// Graceful shutdown for serverless
process.on("SIGTERM", () => {
  logger.info("server_sigterm", { uptime: process.uptime() });
  server.close(() => {
    logger.info("server_closed", {});
    process.exit(0);
  });
});
