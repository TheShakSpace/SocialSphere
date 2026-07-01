import mongoose from "mongoose";

export let isMongoConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<username>") || uri.includes("YOUR_MONGODB_URI")) {
    console.log("ℹ️  MONGODB_URI is not set or contains placeholders.");
    console.log("🚀 Running SocialSphere in high-fidelity sandbox mode using a persistent JSON-file database.");
    isMongoConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`🚀 Connected to MongoDB successfully: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.log("⚠️  Falling back to high-fidelity JSON-file database fallback.");
    isMongoConnected = false;
    return false;
  }
};
