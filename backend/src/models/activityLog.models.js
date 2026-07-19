import mongoose from 'mongoose';
const activityTypes = ['running', 'cycling', 'swimming', 'strength', 'yoga', 'walking', 'other'];
const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      enum: ['running', 'cycling', 'swimming', 'strength', 'yoga', 'walking', 'other'],
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;