process.env.PIPEDRIVE_API_TOKEN = "dummy_token";

import request from "supertest";
import express from "express";
import dealsRouter from "../src/routes/deals";
import metricsRouter from "../src/routes/metrics";
import { metrics, loggerMiddleware } from "../src/middleware/logger";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe("API Endpoints", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(loggerMiddleware);

    metrics.totalRequests = 0;
    metrics.totalDuration = 0;

    app.use(dealsRouter);
    app.use(metricsRouter);
  });

  test("GET /deals returns data from mocked axios", async () => {
    const mockedResponse = { status: 200, data: { deals: ["deal1", "deal2"] } };
    mockedAxios.mockResolvedValueOnce(mockedResponse);

    const res = await request(app).get("/deals");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockedResponse.data);
  });

  test("POST /deals forwards request and returns mocked axios response", async () => {
    const newDeal = { title: "New Deal", value: 100 };
    const mockedResponse = { status: 201, data: { success: true } };
    mockedAxios.mockResolvedValueOnce(mockedResponse);

    const res = await request(app)
      .post("/deals")
      .send(newDeal)
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockedResponse.data);
  });

  test("PUT /deals forwards request and returns mocked axios response", async () => {
    const updatedDeal = { id: 1, title: "Updated Deal", value: 150 };
    const mockedResponse = { status: 200, data: { success: true } };
    mockedAxios.mockResolvedValueOnce(mockedResponse);

    const res = await request(app)
      .put("/deals")
      .send(updatedDeal)
      .set("Content-Type", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockedResponse.data);
  });

  test("GET /metrics returns proper metrics", async () => {
    const mockedResponse = { status: 200, data: { deals: ["deal1"] } };
    mockedAxios.mockResolvedValueOnce(mockedResponse);
    await request(app).get("/deals");

    await new Promise((resolve) => setTimeout(resolve, 100));

    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total_requests");
    expect(res.body).toHaveProperty("mean_duration_ms");
    expect(res.body.total_requests).toBeGreaterThan(0);
    expect(res.body.mean_duration_ms).toBeGreaterThanOrEqual(0);
  });
});
