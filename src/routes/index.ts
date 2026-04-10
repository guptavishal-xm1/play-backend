import { Router } from "express";
import { adminGetDecisionController, adminUpdateDecisionController, entryDecisionController } from "../controllers/entryController.js";
import { adminAuth } from "../middleware/adminAuth.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    uptimeSec: Math.floor(process.uptime()),
    now: new Date().toISOString()
  });
});

router.get("/v1/app/entry-decision", (req, res, next) => {
  entryDecisionController(req, res).catch(next);
});

router.get("/v1/admin/decision", adminAuth, adminGetDecisionController);
router.post("/v1/admin/decision", adminAuth, adminUpdateDecisionController);
