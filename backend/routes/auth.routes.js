// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs"); // ← استفاده از bcryptjs به‌صورت یکنواخت
const jwt = require("jsonwebtoken");
console.log("🔹 auth.routes.js loaded");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  console.log("➡️ /api/auth/login endpoint hit");
  console.log("📥 Request body:", req.body);
  try {
    const { employeeCode, password } = req.body;

    // 1️⃣ چک کاربر
    const user = await User.findOne({ employeeCode }).populate("role");
    console.log("🔹 Searching for user with employeeCode:", employeeCode);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "کاربر یافت نشد" });
    console.log("✅ User found:", user);
    console.log("🔹 Comparing password...");

    // 2️⃣ چک رمز
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "رمز عبور اشتباه است" });

    // 3️⃣ تولید JWT
    const token = jwt.sign(
      { id: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("✅ Login successful, token generated");

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        employeeCode: user.employeeCode,
        role: user.role.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
