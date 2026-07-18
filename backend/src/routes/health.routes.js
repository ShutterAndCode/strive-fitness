import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => { //wont fail still habit
    return res
      .status(200)
      .json(new ApiResponse(200, { status: 'ok' }, 'Server is healthy'));
  })
);

export default router;