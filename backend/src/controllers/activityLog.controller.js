import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as activityLogService from '../services/activityLog.service.js';

export const createActivityLog = asyncHandler(async (req, res) => {
  const activityLog = await activityLogService.createActivityLog(req.user._id, req.validated.body);

  return res
    .status(201)
    .json(new ApiResponse(201, activityLog, 'Activity log created successfully'));
});

export const getActivityLogs = asyncHandler(async (req, res) => {
  const activityLogs = await activityLogService.getActivityLogs(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, activityLogs, 'Activity logs retrieved successfully'));
});

export const getActivityLogById = asyncHandler(async (req, res) => {
  const activityLog = await activityLogService.getActivityLogById(req.user._id, req.validated.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, activityLog, 'Activity log retrieved successfully'));
});

export const updateActivityLog = asyncHandler(async (req, res) => {
  const activityLog = await activityLogService.updateActivityLog(
    req.user._id,
    req.validated.params.id,
    req.validated.body
  );

  return res
    .status(200)
    .json(new ApiResponse(200, activityLog, 'Activity log updated successfully'));
});

export const deleteActivityLog = asyncHandler(async (req, res) => {
  await activityLogService.deleteActivityLog(req.user._id, req.validated.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Activity log deleted successfully'));
});