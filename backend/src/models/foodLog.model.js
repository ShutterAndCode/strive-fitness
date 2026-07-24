import mongoose from "mongoose";
const mealType=["breakfast", "lunch", "snack", "dinner"]
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
      enum: mealType,
      required: true,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
foodLogSchema.index({user:1,loggedAt:-1});

const FoodLog = mongoose.model(`FoodLog`, foodLogSchema);
export default FoodLog;
