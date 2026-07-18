import mongoose, { mongo } from "mongoose";
import config from "./env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    mongoose.connection.on(`error`, (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });
    mongoose.connection.on(`disconnected`, () => {
      console.warn(`MongoDB disconnected`);
    });
  } catch (error) {
    console.error(`Failed to connect to mongoDB: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
