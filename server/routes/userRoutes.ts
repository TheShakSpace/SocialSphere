import express from "express";
import {
  getUserProfile,
  updateProfile,
  followUser,
  getNotifications,
  markNotificationsRead,
  searchUsers,
} from "../controllers/userController";
import { protect, optionalProtect } from "../middleware/auth";

const router = express.Router();

router.get("/search", optionalProtect, searchUsers);
router.put("/profile", protect, updateProfile);
router.get("/notifications", protect, getNotifications);
router.put("/notifications/read", protect, markNotificationsRead);

router.route("/:id")
  .get(optionalProtect, getUserProfile)
  .post(protect, followUser);

router.post("/:id/follow", protect, followUser);

export default router;
