import { Router, Request, Response } from "express";
import { metrics } from "../middleware/logger";

const router = Router();

router.get("/metrics", (req: Request, res: Response) => {
  const meanDuration =
    metrics.totalRequests > 0
      ? metrics.totalDuration / metrics.totalRequests
      : 0;
  res.json({
    total_requests: metrics.totalRequests,
    mean_duration_ms: meanDuration,
  });
});

export default router;
