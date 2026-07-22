import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as foodSnapService from "../services/foodSnap.service.js";

export const analyzeFoodSnap = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const result = await foodSnapService.analyzeFoodImage(
    req.file.buffer,
    req.file.mimetype,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Food image analyzed successfully"));
});
