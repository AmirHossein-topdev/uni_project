// routes/property.routes.js
const express = require("express");
const router = express.Router();

const PropertyController = require("../controller/PropertyController");

router.post("/", PropertyController.createProperty);
router.get("/", PropertyController.listProperties);
router.get("/:id", PropertyController.getProperty);
router.put("/:id", PropertyController.updateProperty);
router.delete("/:id", PropertyController.deleteProperty);

router.put("/:id/identity", PropertyController.upsertIdentity);
router.put("/:id/location", PropertyController.upsertLocation);
router.put("/:id/legal", PropertyController.upsertLegal);
router.put("/:id/ownership", PropertyController.upsertOwnership);
router.put("/:id/boundaries", PropertyController.upsertBoundaries);
router.put("/:id/additional", PropertyController.upsertAdditional);

router.get("/:id/full", PropertyController.getFullProperty);

module.exports = router;
