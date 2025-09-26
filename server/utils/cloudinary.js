import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const isPdf = localFilePath.endsWith('.pdf');

    const result = await cloudinary.uploader.upload(localFilePath, {
      // Explicitly set resource_type for PDFs to ensure correct URL generation
      resource_type: isPdf ? "raw" : "auto",
    });

    // delete local file only after upload success
    fs.unlinkSync(localFilePath);

    // return a clean object with consistent field names
    return {
      url: result.secure_url,         // ✅ always use `url`
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  } finally {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);   // cleanup if failed
    }
  }
};

export { uploadOnCloudinary, cloudinary };
