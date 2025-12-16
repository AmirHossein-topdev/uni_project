const express = require("express");
const router = express.Router();
const PropertyController = require("../controller/property.controller");

// middleware نمونه (همان استایل Role)
const authMiddleware = (req, res, next) => next();
const roleMiddleware = (roles) => (req, res, next) => next();

/* ===== PropertyStatus (اصلی) ===== */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  PropertyController.createProperty
);

router.get("/", authMiddleware, PropertyController.listProperties);

router.get("/:id", authMiddleware, PropertyController.getProperty);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  PropertyController.updateProperty
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  PropertyController.deleteProperty
);

/* ===== Sections (one-to-one) ===== */
router.put("/:id/identity", authMiddleware, PropertyController.upsertIdentity);
router.put("/:id/location", authMiddleware, PropertyController.upsertLocation);
router.put("/:id/legal", authMiddleware, PropertyController.upsertLegal);
router.put(
  "/:id/ownership",
  authMiddleware,
  PropertyController.upsertOwnership
);
router.put(
  "/:id/boundaries",
  authMiddleware,
  PropertyController.upsertBoundaries
);
router.put(
  "/:id/additional",
  authMiddleware,
  PropertyController.upsertAdditional
);

/* ===== Full view ===== */
router.get("/:id/full", authMiddleware, PropertyController.getFullProperty);

module.exports = router;
