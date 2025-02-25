import { Request, Response, NextFunction } from "express";

export interface Metrics {
  totalRequests: number;
  totalDuration: number;
}

export const metrics: Metrics = { totalRequests: 0, totalDuration: 0 };

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  console.log(`Incoming ${req.method} request to ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    metrics.totalRequests++;
    metrics.totalDuration += duration;
    console.log(
      `Completed ${req.method} ${req.url} in ${duration}ms with status ${res.statusCode}`
    );
  });

  next();
};
