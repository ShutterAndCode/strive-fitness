import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    age: {
      type: Number,
      min: 13,
      max: 120,
    },

    height: {
      type: Number,
      min: 50,
    },

    weight: {
      type: Number,
      min: 20,
    },

    goal: {
      type: String,
      enum: ["lose", "maintain", "gain"],
    },

    dailyCalorieIntake: {
      type: Number,
      default: 2000,
    },

    dailyCalorieBurn: {
      type: Number,
      default: 500,
    },
    dailyCalorieGoal: {
      type: Number,
      default: 2000,
      min: 0,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
