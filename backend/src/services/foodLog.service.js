import FoodLog from "../models/foodLog.model.js";
import ApiError from "../utils/ApiError.js";

export const createFoodLog = async (userId, data) => {
  const foodLog = await FoodLog.create({ ...data, user: userId });
  return foodLog;
};

export const getFoodLogs = async (userId) => {
  const foodLogs = await FoodLog.find({ user: userId }).sort({ loggedAt: -1 });
  return foodLogs;
};
export const getFoodLogById = async (userId, foodLogId) => {
  const foodLog = await FoodLog.findById(foodLogId);
  if (!foodLog) {
    throw new ApiError(404, `Food Log not found`);
  }
  if (foodLog.user.toString() !== userId.toString()) {
    throw new ApiError(403, `You do not have access to this food log`);
  }
  return foodLog;
};
export const updateFoodLog = async (userId, foodLogId, updates) => {
  const foodLog = await getFoodLogById(userId, foodLogId);
  Object.assign(foodLog, updates);
  await foodLog.save();
  return foodLog;
};

export const deleteFoodLog = async (userId, foodLogId) => {
  const foodLog = await getFoodLogById(userId, foodLogId);

  await foodLog.deleteOne();
};
