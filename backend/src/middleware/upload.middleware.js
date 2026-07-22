import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]; //image extension should be rejected based on its "actual" declared MIME type.
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; //5mb

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new ApiError(
        400,
        `Unsupported file type, only JPEG,PNG,WEBP images are supported`,
      ),
    );
  }
  cb(null, true);
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

export default upload;
