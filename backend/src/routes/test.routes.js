import { Router } from 'express';
import validate from '../middleware/validate.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import testSchema from '../validators/test.validator.js';
import protect from '../middleware/auth.middleware.js';
const router = Router();

router.post(
  '/',
  validate(testSchema),
  asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.validated.body, 'Validation passed'));
  })
);

router.get(
  '/protected',
  protect,
  asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, { userId: req.user._id, email: req.user.email }, 'You are authenticated'));
  })
);

export default router;