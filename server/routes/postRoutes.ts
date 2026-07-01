import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  likePost,
  addComment,
  deletePost,
} from "../controllers/postController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.route("/").post(protect, createPost).get(getPosts);

router.route("/:id").get(getPostById).delete(protect, deletePost);

router.post("/:id/like", protect, likePost);
router.post("/:id/comments", protect, addComment);

export default router;
