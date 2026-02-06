import formidable from "formidable-serverless";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    const file = files.documentFile;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "فایل ارسال نشد" });
    }

    const fileName = path.basename(file.path);
    const publicPath = `/uploads/${fileName}`;

    res.json({
      success: true,
      filePath: publicPath, // برای DB
      originalName: file.name, // برای UI
      size: file.size,
    });
  });
}
