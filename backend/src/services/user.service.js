import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, `user not found`);
  }
  return user;
};
export const updateProfile = async (userId, updates) => {
  if (updates.username) {
    const existing = await User.findOne({
      username: updates.username,
      _id: { $ne: userId },// ne mean a different user id (not equal) but same username
    });
    if (existing) {
      throw new ApiError(409, `username already taken`);
    }
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true },
  );
  if (!user) {
    throw new ApiError(404, `user not found`);
  }
  return user;
};
