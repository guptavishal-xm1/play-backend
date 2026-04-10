import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { HttpError } from "./errorHandler.js";

export function adminAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.header("x-admin-token");

  if (!token || token !== env.APP_ADMIN_TOKEN) {
    throw new HttpError(401, "Unauthorized admin token");
  }

  next();
}
