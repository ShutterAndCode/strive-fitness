import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as userService from "../services/user.service.js";

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, `Profile retrieved successfully`));
});
export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(
    req.user._id,
    req.validated.body,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, `Profile updated successfully`));
});
