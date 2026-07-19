import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";

import {
  createFoodLogSchema,
  updateFoodLogSchema,
  foodLogIdSchema,
} from "../validators/foodLog.validator.js";
import {
  createFoodLog,
  getFoodLogs,
  getFoodLogById,
  updateFoodLog,
  deleteFoodLog,
} from "../controllers/foodLog.controller.js";

const router = Router();

router.use(protect); //as all need authentication

router.post("/", validate(createFoodLogSchema), createFoodLog);
router.get("/", getFoodLogs);
router.get("/:id", validate(foodLogIdSchema), getFoodLogById);
router.patch("/:id", validate(updateFoodLogSchema), updateFoodLog);
router.delete("/:id", validate(foodLogIdSchema), deleteFoodLog);

export default router;
