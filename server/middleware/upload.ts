import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

// Ensure local uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)"));
  },
});

// Configure Cloudinary if keys are available
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Handles image upload to Cloudinary or falls back to local uploads directory.
 * Compresses local images if fallback is active.
 */
export const handleUpload = async (file: Express.Multer.File): Promise<string> => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "socialsphere",
          resource_type: "image",
          transformation: [{ width: 1200, crop: "limit", quality: "auto:good" }],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result?.secure_url || "");
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // Local upload fallback during development
    const filename = `image_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${path.extname(file.originalname).toLowerCase()}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Save file buffer locally
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the accessible public static asset path as a relative URL
    return `/uploads/${filename}`;
  }
};
