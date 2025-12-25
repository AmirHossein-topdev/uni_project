// backend/server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

// --- Database ---
const connectDB = require("./config/db"); // مسیر فایل کانکت DB (CJS)

// --- Routes ---
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");
const propertyRoutes = require("./routes/property.routes");
const ownerRoutes = require("./routes/owner.routes");
const contractRoutes = require("./routes/contract.routes");
const locationEnumsRoutes = require("./routes/locationEnums.routes");
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/uploadDocument.routes");

// --- Middleware ---
const globalErrorHandler = require("./middleware/global-error-handler");
const {
  attachRequestId,
  requestLogger,
} = require("./middleware/requestLogger"); // CJS require

const app = express();
const PORT = process.env.PORT || 7000;

// --- Basic Middlewares ---
// CORS
app.use(cors());

// Body parsers (important: parse body BEFORE requestLogger if you want to log body)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Attach a request id for tracing
app.use(attachRequestId);

// HTTP request logging (morgan)
app.use(morgan("dev"));

// Custom request logger (will have parsed body available)
app.use(requestLogger);

// Static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Connect to Database ---
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // اگر اتصال DB ضروری است، می‌توان سرور را متوقف کرد یا اجازه داد ادامه یابد:
    // process.exit(1);
  });

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/location-enums", locationEnumsRoutes);
app.use("/api/upload", uploadRoutes);

// --- Root Route ---
app.get("/", (req, res) => res.send("Server is running successfully"));

// --- 404 Handler (اگر به این نقطه رسیدیم یعنی route پیدا نشده) ---
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

// --- Global Error Handler (باید بعد از همه route ها و 404 بیاید) ---
app.use(globalErrorHandler);

// --- Optional: global unhandled rejection / uncaughtException handlers ---
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // در محیط production ممکن است نیاز باشد پروسه را ری‌استارت کنید
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export app برای تست یا موارد دیگر
module.exports = app;
