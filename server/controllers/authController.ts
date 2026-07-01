import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_socialsphere_jwt_key_10293847";

const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, avatar, bio } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("Please provide name, email, and password", 400));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return next(new AppError("User already exists with this email", 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      bio: bio || "",
    });

    const token = generateToken(user._id || user.id, user.email);

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        bio: user.bio || "",
        location: user.location || "Neo-San Francisco",
        website: user.website || "https://socialsphere.io",
        skills: user.skills && user.skills.length > 0 ? user.skills : ["React 19", "Vite", "Spatial UI"],
        interests: user.interests && user.interests.length > 0 ? user.interests : ["Augmented Reality", "Cybernetic Aesthetics"],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = generateToken(user._id || user.id, user.email);

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        bio: user.bio || "",
        location: user.location || "Neo-San Francisco",
        website: user.website || "https://socialsphere.io",
        skills: user.skills && user.skills.length > 0 ? user.skills : ["React 19", "Vite", "Spatial UI"],
        interests: user.interests && user.interests.length > 0 ? user.interests : ["Augmented Reality", "Cybernetic Aesthetics"],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        bio: user.bio || "",
        location: user.location || "Neo-San Francisco",
        website: user.website || "https://socialsphere.io",
        skills: user.skills && user.skills.length > 0 ? user.skills : ["React 19", "Vite", "Spatial UI"],
        interests: user.interests && user.interests.length > 0 ? user.interests : ["Augmented Reality", "Cybernetic Aesthetics"],
      },
    });
  } catch (error) {
    next(error);
  }
};
