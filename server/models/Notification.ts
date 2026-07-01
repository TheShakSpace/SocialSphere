import mongoose, { Schema } from "mongoose";
import { JsonDB } from "../config/jsonDb";

const NotificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MongoNotification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export const Notification: any = new Proxy(MongoNotification, {
  get(target, prop) {
    const useReal = !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>");
    const activeModel = useReal ? MongoNotification : JsonDB.getModel("Notification");
    return (activeModel as any)[prop];
  },
});
