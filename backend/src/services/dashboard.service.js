import FoodLog from '../models/foodLog.model.js';
import ActivityLog from '../models/activityLog.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const getTodayRange = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

export const getDashboardSummary = async (userId) => {
  const { startOfDay, endOfDay } = getTodayRange();

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const dateFilter = { loggedAt: { $gte: startOfDay, $lte: endOfDay } };

  const [caloriesConsumedResult, caloriesBurnedResult, foodEntriesToday, activityEntriesToday, recentFoodLogs, recentActivityLogs] =
    await Promise.all([
      FoodLog.aggregate([
        { $match: { user: user._id, ...dateFilter } },
        { $group: { _id: null, total: { $sum: '$calories' } } },
      ]),
      ActivityLog.aggregate([
        { $match: { user: user._id, ...dateFilter } },
        { $group: { _id: null, total: { $sum: '$caloriesBurned' } } },
      ]),
      FoodLog.countDocuments({ user: user._id, ...dateFilter }),
      ActivityLog.countDocuments({ user: user._id, ...dateFilter }),
      FoodLog.find({ user: user._id }).sort({ loggedAt: -1 }).limit(5),
      ActivityLog.find({ user: user._id }).sort({ loggedAt: -1 }).limit(5),
    ]);

  const caloriesConsumed = caloriesConsumedResult[0]?.total || 0;
  const caloriesBurned = caloriesBurnedResult[0]?.total || 0;
  const remainingCalorieBudget = user.dailyCalorieGoal - caloriesConsumed + caloriesBurned;

  return {
    caloriesConsumed,
    caloriesBurned,
    dailyCalorieGoal: user.dailyCalorieGoal,
    remainingCalorieBudget,
    foodEntriesToday,
    activityEntriesToday,
    recentFoodLogs,
    recentActivityLogs,
  };
};