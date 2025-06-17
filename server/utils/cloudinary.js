import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Upload file to Cloudinary
const uploadOnCloudinary = async (filelocalpath) => {
  try {
    if (!filelocalpath) {
      console.error("No file path received for upload.");
      return null;
    }

    console.log("Uploading file at:", filelocalpath);
    const result = await cloudinary.uploader.upload(filelocalpath, {
      resource_type: "auto",
    });

    console.log("The file has been uploaded:", result);

    fs.unlinkSync(filelocalpath); // Clean up temp file
    return result;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    if (fs.existsSync(filelocalpath)) {
      fs.unlinkSync(filelocalpath);
    }
    return null;
  }
};

// Delete file from Cloudinary using public_id
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.error("No publicId provided for deletion.");
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image" // or "video" or "raw" depending on the type
    });

    console.log("Cloudinary file deleted:", result);
    return result;
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
