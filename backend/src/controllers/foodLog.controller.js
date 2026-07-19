import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as foodLogService from "../services/foodLog.service.js";

export const createFoodLog = asyncHandler(async (req, res) => {
  const foodLog = await foodLogService.createFoodLog(
    req.user._id,
    req.validated.body,
  );
  return res
    .status(201)
    .json(new ApiResponse(201, foodLog, `Food Log created successfully`));
});
export const getFoodLogs = asyncHandler(async (req, res) => {
  const foodLogs = await foodLogService.getFoodLogs(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, foodLogs, "Food logs retrieved successfully"));
});
export const getFoodLogById = asyncHandler(async (req, res) => {
  const foodLog = await foodLogService.getFoodLogById(
    req.user._id,
    req.validated.params.id,
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        foodLog,
        `Food Log (individual) retrieved successfully`,
      ),
    );
});
export const updateFoodLog = asyncHandler(async (req, res) => {
  
  const foodLog = await foodLogService.updateFoodLog(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, foodLog, `Food log updated successfully`));
});
export const deleteFoodLog = asyncHandler(async (req, res) => {
  await foodLogService.deleteFoodLog(req.user._id, req.validated.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, `Food log deleted successfully`));
});
