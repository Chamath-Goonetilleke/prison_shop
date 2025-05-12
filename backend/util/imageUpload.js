import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure multer to use memory storage (buffer) instead of disk storage
const memoryStorage = multer.memoryStorage();

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create multer upload instance with memory storage
export const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Function to upload a buffer to Cloudinary
export const uploadToCloudinary = (buffer, options = {}) => {
  const uploadOptions = {
    folder: options.folder || "uploads",
    resource_type: options.resource_type || "auto",
    ...options,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// Function to delete an image from Cloudinary by public_id
export const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary delete error:", error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

// Get public_id from a Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // Extract the public_id from a Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
    const splitUrl = url.split("/");
    const filenameWithExt = splitUrl[splitUrl.length - 1];
    const filename = filenameWithExt.split(".")[0];
    const folderPath = splitUrl[splitUrl.length - 2];
    return `${folderPath}/${filename}`;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};
