import mongoose, { Schema } from "mongoose";
import { JsonDB } from "../config/jsonDb";

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const MongoPost = mongoose.models.Post || mongoose.model("Post", PostSchema);

export const Post: any = new Proxy(MongoPost, {
  get(target, prop) {
    const useReal = !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>");
    const activeModel = useReal ? MongoPost : JsonDB.getModel("Post");
    return (activeModel as any)[prop];
  },
});
