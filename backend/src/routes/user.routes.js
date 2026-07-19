import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/user.validator.js";
import { getUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", protect, getUser);
router.patch("/me", protect, validate(updateProfileSchema), updateUser);

export default router;
