// backend/server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

// --- Database ---
const connectDB = require("./config/db");

// --- Routes ---
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");
const propertyRoutes = require("./routes/property.routes");
const ownerRoutes = require("./routes/owner.routes");
const contractRoutes = require("./routes/contract.routes");
const locationEnumsRoutes = require("./routes/locationEnums.routes");

// --- Middleware ---
const globalErrorHandler = require("./middleware/global-error-handler");

const app = express();
const PORT = process.env.PORT || 7000;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// --- Connect to Database ---
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/location-enums", locationEnumsRoutes);

// اجازه به دسترسی به فایل‌های آپلود شده
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// --- Root Route ---
app.get("/", (req, res) => res.send("Server is running successfully"));

// --- Global Error Handler ---
app.use(globalErrorHandler);

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// --- 404 Handler ---
app.use((req, res) => {
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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
