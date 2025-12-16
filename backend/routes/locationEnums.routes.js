const express = require("express");
const router = express.Router();

const {
  provinces,
  citiesByProvince,
} = require("../model/PropertyLocationInfo");

router.get("/", (req, res) => {
  res.json({ provinces, citiesByProvince });
});

module.exports = router;
