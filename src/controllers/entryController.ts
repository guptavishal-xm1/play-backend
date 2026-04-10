import type { Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../middleware/errorHandler.js";
import { getCurrentDecisionState, getEntryDecision, updateDecision } from "../services/decisionService.js";

const updateDecisionSchema = z.object({
  isQuiz: z.boolean(),
  redirectUrl: z.string().url().optional()
});

export async function entryDecisionController(_req: Request, res: Response): Promise<void> {
  const payload = await getEntryDecision();
  res.status(200).json(payload);
}

export function adminGetDecisionController(_req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    data: getCurrentDecisionState()
  });
}

export function adminUpdateDecisionController(req: Request, res: Response): void {
  const parsed = updateDecisionSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid admin payload");
  }

  if (parsed.data.isQuiz === false && !parsed.data.redirectUrl) {
    throw new HttpError(400, "redirectUrl must be provided when isQuiz is false");
  }

  const state = updateDecision(parsed.data);
  res.status(200).json({
    success: true,
    data: state
  });
}
