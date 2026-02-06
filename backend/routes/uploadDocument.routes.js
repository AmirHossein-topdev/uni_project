// npm i multer
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "public", "uploads"); // تنظیم طبق ساختار بک‌اند

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /(\.zip|\.rar)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error("فرمت فایل باید zip یا rar باشد"));
    }
    cb(null, true);
  },
});

router.post("/upload-document", upload.single("documentFile"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: "فایل ارسال نشد" });

  // مسیر استاتیک که فرانت میتونه بخونه
  const publicPath = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    filePath: publicPath,
    fileName: req.file.filename,
  });
});

module.exports = router;
