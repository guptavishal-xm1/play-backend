import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  let statusCode = 500;
  let message = "Unexpected server error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
    // Detect timeout errors
    if (message.includes("AbortError") || message.includes("timeout")) {
      statusCode = 504;
      message = "Request timeout - endpoint took too long to respond";
    }
  }

  logger.error("request_failed", {
    requestId: req.requestId,
    statusCode,
    method: req.method,
    path: req.path,
    message,
    errorName: err instanceof Error ? err.name : typeof err
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      timestamp: new Date().toISOString()
    }
  });
}
