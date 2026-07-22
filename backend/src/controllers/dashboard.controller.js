import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as dashboardService from '../services/dashboard.service.js'

export const getDashboard=asyncHandler(async (req,res) => {
    const summary = await dashboardService.getDashboardSummary(req.user._id);
    return res
    .status(200)
    .json(new ApiResponse(200,summary,'Dashboard summary retrieved successfully'))
})