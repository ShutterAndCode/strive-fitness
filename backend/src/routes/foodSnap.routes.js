import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { analyzeFoodSnap } from "../controllers/foodSnap.controller.js";
import { defaultErrorMap } from "zod/v3";

const router = Router();

router.post("/", protect, upload.single("image"), analyzeFoodSnap);

export default router;
