import mongoose, { Schema } from "mongoose";
import { JsonDB } from "../config/jsonDb";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
  },
  { timestamps: true }
);

const MongoUser = mongoose.models.User || mongoose.model("User", UserSchema);

export const User: any = new Proxy(MongoUser, {
  get(target, prop) {
    const useReal = !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>");
    const activeModel = useReal ? MongoUser : JsonDB.getModel("User");
    return (activeModel as any)[prop];
  },
});
