import multer from 'multer';
import path from 'path';
import fs from 'fs';
// import { ApiError } from '../utils/ApiError';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'file': ['application/pdf'],
    'coverImage': ['image/jpeg', 'image/png', 'image/gif'],
    'tricks': ['application/pdf'],
    'avatar': ['image/jpeg', 'image/png', 'image/gif'],
  };
  if (allowedTypes[file.fieldname]?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${allowedTypes[file.fieldname].join(', ')}`));
  }
};

// Configure Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

export default upload;