import mongoose, { Schema } from "mongoose";
import { JsonDB } from "../config/jsonDb";

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const MongoComment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export const Comment: any = new Proxy(MongoComment, {
  get(target, prop) {
    const useReal = !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>");
    const activeModel = useReal ? MongoComment : JsonDB.getModel("Comment");
    return (activeModel as any)[prop];
  },
});
