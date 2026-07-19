import ActivityLog from '../models/activityLog.models.js';
import ApiError from '../utils/ApiError.js';

export const createActivityLog = async (userId, data) => {
  const activityLog = await ActivityLog.create({ ...data, user: userId });
  return activityLog;
};

export const getActivityLogs = async (userId) => {
  const activityLogs = await ActivityLog.find({ user: userId }).sort({ loggedAt: -1 });
  return activityLogs;
};

export const getActivityLogById = async (userId, activityLogId) => {
  const activityLog = await ActivityLog.findById(activityLogId);

  if (!activityLog) {
    throw new ApiError(404, 'Activity log not found');
  }

  if (activityLog.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'You do not have access to this activity log');
  }

  return activityLog;
};

export const updateActivityLog = async (userId, activityLogId, updates) => {
  const activityLog = await getActivityLogById(userId, activityLogId);

  Object.assign(activityLog, updates);
  await activityLog.save();

  return activityLog;
};

export const deleteActivityLog = async (userId, activityLogId) => {
  const activityLog = await getActivityLogById(userId, activityLogId);

  await activityLog.deleteOne();
};