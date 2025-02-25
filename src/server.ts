import express from "express";
import * as dotenv from "dotenv";
import { loggerMiddleware } from "./middleware/logger";
import dealsRouter from "./routes/deals";
import metricsRouter from "./routes/metrics";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(loggerMiddleware);

app.use(dealsRouter);
app.use(metricsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
