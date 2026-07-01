import { Response, NextFunction } from "express";
import { User } from "../models/User";
import { Follow } from "../models/Follow";
import { Notification } from "../models/Notification";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public / Private
export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const followersCount = await Follow.countDocuments({ following: id });
    const followingCount = await Follow.countDocuments({ follower: id });

    let isFollowing = false;
    if (req.user) {
      const followRecord = await Follow.findOne({
        follower: req.user.id,
        following: id,
      });
      isFollowing = !!followRecord;
    }

    res.status(200).json({
      status: "success",
      profile: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        bio: user.bio,
        location: user.location || "Neo-San Francisco",
        website: user.website || "https://socialsphere.io",
        skills: user.skills && user.skills.length > 0 ? user.skills : ["React 19", "Vite", "Spatial UI"],
        interests: user.interests && user.interests.length > 0 ? user.interests : ["Augmented Reality", "Cybernetic Aesthetics"],
        followersCount,
        followingCount,
        isFollowing,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));

    const { name, bio, avatar, coverImage, location, website, skills, interests } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (location !== undefined) updates.location = location;
    if (website !== undefined) updates.website = website;
    if (skills !== undefined) updates.skills = skills;
    if (interests !== undefined) updates.interests = interests;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    res.status(200).json({
      status: "success",
      user: {
        id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        coverImage: updatedUser.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        bio: updatedUser.bio,
        location: updatedUser.location || "Neo-San Francisco",
        website: updatedUser.website || "https://socialsphere.io",
        skills: updatedUser.skills && updatedUser.skills.length > 0 ? updatedUser.skills : ["React 19", "Vite", "Spatial UI"],
        interests: updatedUser.interests && updatedUser.interests.length > 0 ? updatedUser.interests : ["Augmented Reality", "Cybernetic Aesthetics"],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow or Unfollow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));
    const targetUserId = req.params.id;

    if (req.user.id === targetUserId) {
      return next(new AppError("You cannot follow yourself", 400));
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return next(new AppError("Target user not found", 404));
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user.id,
      following: targetUserId,
    });

    if (existingFollow) {
      // Unfollow
      await Follow.deleteOne({
        follower: req.user.id,
        following: targetUserId,
      });

      // Remove corresponding follow notification
      await Notification.deleteOne({
        recipient: targetUserId,
        sender: req.user.id,
        type: "follow",
      });

      return res.status(200).json({
        status: "success",
        message: "Successfully unfollowed user",
        isFollowing: false,
      });
    } else {
      // Follow
      await Follow.create({
        follower: req.user.id,
        following: targetUserId,
      });

      // Log follow notification
      await Notification.create({
        recipient: targetUserId,
        sender: req.user.id,
        type: "follow",
      });

      return res.status(201).json({
        status: "success",
        message: "Successfully followed user",
        isFollowing: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));

    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender")
      .populate("post")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markNotificationsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError("Not authenticated", 401));

    await Notification.updateMany({ recipient: req.user.id }, { isRead: true });

    res.status(200).json({
      status: "success",
      message: "Notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search for users
// @route   GET /api/users/search
// @access  Public
export const searchUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ status: "success", users: [] });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    }).limit(10);

    const safeUsers = users.map((u: any) => ({
      id: u._id || u.id,
      name: u.name,
      avatar: u.avatar,
      bio: u.bio,
    }));

    res.status(200).json({
      status: "success",
      users: safeUsers,
    });
  } catch (error) {
    next(error);
  }
};
