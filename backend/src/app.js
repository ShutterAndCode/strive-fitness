import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import ApiError from "./utils/ApiError.js";
import errorHandler from "./utils/errorHandler.js";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/health", healthRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
