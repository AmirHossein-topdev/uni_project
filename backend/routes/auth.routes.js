const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { employeeCode, password } = req.body;

    // 1️⃣ چک کاربر
    const user = await User.findOne({ employeeCode }).populate("role");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "کاربر یافت نشد" });

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
