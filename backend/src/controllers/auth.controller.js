import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.validated.body);

  return res
    .status(201)
    .json(new ApiResponse(201, result, `User registered successfully`));
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.validated.body);
  return res.status(200).json(new ApiResponse(200, result, `Login successful`));
});
