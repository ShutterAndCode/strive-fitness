import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import ApiError from "./utils/ApiError.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import testRoutes from "./routes/test.routes.js";
import foodLogRoutes from './routes/foodLog.routes.js'
import activityLogRoutes from './routes/activityLog.routes.js';


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
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use('/api/food-logs',foodLogRoutes)
app.use('/api/activity-logs', activityLogRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
