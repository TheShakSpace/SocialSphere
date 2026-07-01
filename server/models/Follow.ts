import mongoose, { Schema } from "mongoose";
import { JsonDB } from "../config/jsonDb";

const FollowSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const MongoFollow = mongoose.models.Follow || mongoose.model("Follow", FollowSchema);

export const Follow: any = new Proxy(MongoFollow, {
  get(target, prop) {
    const useReal = !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>");
    const activeModel = useReal ? MongoFollow : JsonDB.getModel("Follow");
    return (activeModel as any)[prop];
  },
});
