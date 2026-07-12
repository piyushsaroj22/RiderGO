import mongoose from "mongoose";
import env from "./env.js";

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error);

    process.exit(1);
  }
};

export default connectToDatabase;
