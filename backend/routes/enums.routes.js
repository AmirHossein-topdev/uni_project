// backend/routes/enums.routes.js
const express = require("express");
const router = express.Router();

// مدل‌ها
const PropertyBasicStatus = require("../model/PropertyStatus");
const PropertyOwnership = require("../model/PropertyOwnership");
const { PropertyLocationInfo } = require("../model/PropertyLocationInfo");
const PropertyLegalStatus = require("../model/PropertyLegalStatus");
const PropertyIdentity = require("../model/PropertyIdentity");
const PropertyBoundariesInfo = require("../model/PropertyBoundariesInfo");
const PropertyAdditionalInfo = require("../model/PropertyAdditionalInfo");

// نگاشت مسیر به مدل و فیلد enum
const enumMap = {
  status: { model: PropertyBasicStatus, field: "caseStatus" },
  ownership: {
    model: PropertyOwnership,
    fields: [
      "ownershipStatus",
      "ownerType",
      "ownershipConfirmedStatus",
      "possessorType",
      "possessionReason",
      "dispute",
      "disputeParty",
    ],
  },
  location: {
    model: PropertyLocationInfo,
    fields: ["province", "city"],
  },
  legal: {
    model: PropertyLegalStatus,
    fields: [
      "legalStatus",
      "officialDocumentType",
      "definiteDocumentType",
      "ordinaryDocumentType",
      "noDocumentType",
      "transferMethod",
    ],
  },
  boundaries: {
    model: PropertyBoundariesInfo,
    fields: ["boundaryStatus", "mapProvider"],
  },
  identity: {
    model: PropertyIdentity,
    fields: [
      "structureType",
      "administrativeDivision",
      "propertyType",
      "usageType",
      "previousUsage",
    ],
  },
  additionalinfo: {
    model: PropertyAdditionalInfo,
    fields: ["securityCouncilApproved", "securityLevel"],
  },
};
// روت ترکیبی برای همه enums
router.get("/:enumName/:fieldName?", (req, res) => {
  const { enumName, fieldName } = req.params;

  try {
    // اگر location باشه، مستقیم provinces و citiesByProvince برگردون
    if (enumName === "location") {
      const {
        PropertyLocationInfo,
        provinces,
        citiesByProvince,
      } = require("../model/PropertyLocationInfo");
      if (!fieldName) return res.json({ provinces, citiesByProvince });
      // اگر فیلد خاص داده شده، فقط همون فیلد رو برگردون
      if (fieldName === "province") return res.json({ province: provinces });
      if (fieldName === "city")
        return res.json({
          city: [].concat(...Object.values(citiesByProvince)),
        });
      return res.status(404).json({ error: "فیلد location پیدا نشد" });
    }

    // بقیه enum ها از mapping استفاده می‌کنن
    const mapping = enumMap[enumName];
    if (!mapping) return res.status(404).json({ error: "Enum پیدا نشد" });

    // همه فیلدها
    if (!fieldName) {
      const result = {};
      const allFields =
        mapping.fields || (mapping.field ? [mapping.field] : []);
      allFields.forEach((f) => {
        result[f] = mapping.model.schema.path(f)?.enumValues || [];
      });
      return res.json(result);
    }

    // فیلد مشخص
    const allFields = mapping.fields || (mapping.field ? [mapping.field] : []);
    if (!allFields.includes(fieldName))
      return res.status(404).json({ error: "فیلد enum پیدا نشد" });

    const values = mapping.model.schema.path(fieldName)?.enumValues || [];
    return res.json({ [fieldName]: values });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "مشکل در دریافت enum" });
  }
});

module.exports = router;
