import { loggerMiddleware, metrics } from "../src/middleware/logger";
import { Request, Response, NextFunction } from "express";

describe("Logger Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { method: "GET", url: "/test" };
    res = {
      on: jest.fn((event: string, callback: (...args: any[]) => void) => {
        if (event === "finish") {
          callback();
        }
        return res as Response;
      }),
      statusCode: 200,
    };
    next = jest.fn();
    metrics.totalRequests = 0;
    metrics.totalDuration = 0;
  });

  test("should call next() and update metrics on finish", () => {
    loggerMiddleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(metrics.totalRequests).toBe(1);
    expect(metrics.totalDuration).toBeGreaterThanOrEqual(0);
  });
});
