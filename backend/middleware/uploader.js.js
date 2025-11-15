// backend\middleware\uploader.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// اطمینان از وجود پوشه
const uploadDir = path.join(__dirname, "../../public/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const supportedImage = /png|jpg|jpeg|webp/;
    const extension = path.extname(file.originalname).toLowerCase();

    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("فایل باید تصویر با فرمت png/jpg/jpeg/webp باشد"));
    }
  },
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB
  },
});

module.exports = uploader;
