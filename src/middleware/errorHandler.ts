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
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Unexpected server error";

  logger.error("request_failed", {
    requestId: req.requestId,
    statusCode,
    method: req.method,
    path: req.path,
    message
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message
    }
  });
}
