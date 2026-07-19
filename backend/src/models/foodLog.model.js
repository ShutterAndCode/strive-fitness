import mongoose from "mongoose";
const mealType=["breakfast", "lunch", "snacks", "dinner"]
const foodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
      required: true,
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "snacks", "dinner"],
      required: true,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
const FoodLog = mongoose.model(`FoodLog`, foodLogSchema);
export default FoodLog;
