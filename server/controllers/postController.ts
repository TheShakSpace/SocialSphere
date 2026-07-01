import { Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { Notification } from "../models/Notification";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));

    const { content, image } = req.body;
    if (!content) {
      return next(new AppError("Post content is required", 400));
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      image: image || "",
      likes: [],
    });

    const populatedPost = await Post.findById(post._id || post.id).populate("user");

    res.status(201).json({
      status: "success",
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (Timeline)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find()
      .populate("user")
      .populate("likes")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by ID with comments
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("user").populate("likes");

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const comments = await Comment.find({ post: id }).populate("user").sort({ createdAt: 1 });

    res.status(200).json({
      status: "success",
      post,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Like on Post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const userId = req.user.id;
    if (!post.likes) {
      post.likes = [];
    }
    const likeIndex = post.likes.findIndex((id: any) => {
      const idStr = id && (typeof id === "object" && id._id ? id._id.toString() : id.toString());
      return idStr === userId;
    });
    let liked = false;

    if (likeIndex !== -1) {
      // Unlike post
      post.likes.splice(likeIndex, 1);
      liked = false;

      // Clean up like notification
      await Notification.deleteOne({
        recipient: post.user,
        sender: userId,
        type: "like",
        post: postId,
      });
    } else {
      // Like post
      post.likes.push(userId);
      liked = true;

      // Log notification if post creator is not the liker
      const postCreatorId = post.user && (typeof post.user === "object" && post.user._id ? post.user._id.toString() : post.user.toString());
      if (postCreatorId !== userId) {
        await Notification.create({
          recipient: postCreatorId,
          sender: userId,
          type: "like",
          post: postId,
        });
      }
    }

    await post.save();

    res.status(200).json({
      status: "success",
      liked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));
    const postId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return next(new AppError("Comment text is required", 400));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user.id,
      content,
    });

    const populatedComment = await Comment.findById(comment._id || comment.id).populate("user");

    // Send comment notification to post author if not commenting on their own post
    const postCreatorId = post.user && (typeof post.user === "object" && post.user._id ? post.user._id.toString() : post.user.toString());
    if (postCreatorId !== req.user.id) {
      await Notification.create({
        recipient: postCreatorId,
        sender: req.user.id,
        type: "comment",
        post: postId,
      });
    }

    res.status(201).json({
      status: "success",
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    // Verify ownership
    const postCreatorId = post.user && (typeof post.user === "object" && post.user._id ? post.user._id.toString() : post.user.toString());
    if (postCreatorId !== req.user.id) {
      return next(new AppError("You do not have permission to delete this post", 403));
    }

    await Post.findByIdAndDelete(postId);
    // Delete all comments of the post
    await Comment.deleteMany({ post: postId });
    // Delete related notifications
    await Notification.deleteMany({ post: postId });

    res.status(200).json({
      status: "success",
      message: "Post and its associated data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
