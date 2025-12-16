const propertyService = require("../services/property.service");

/* ===== helpers ===== */
const success = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

const failure = (res, err) =>
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });

/* ===== PropertyStatus ===== */
exports.createProperty = async (req, res) => {
  try {
    const result = await propertyService.createProperty(req.body);
    success(res, result, 201);
  } catch (err) {
    failure(res, err);
  }
};

exports.listProperties = async (req, res) => {
  try {
    const result = await propertyService.listProperties(req.query);
    success(res, result);
  } catch (err) {
    failure(res, err);
  }
};

exports.getProperty = async (req, res) => {
  try {
    const result = await propertyService.getProperty(req.params.id);
    success(res, result);
  } catch (err) {
    failure(res, err);
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const result = await propertyService.updateProperty(
      req.params.id,
      req.body
    );
    success(res, result);
  } catch (err) {
    failure(res, err);
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const result = await propertyService.deleteProperty(req.params.id);
    success(res, result);
  } catch (err) {
    failure(res, err);
  }
};

/* ===== Sections ===== */
exports.upsertIdentity = (req, res) =>
  sectionHandler(req, res, "PropertyIdentity");

exports.upsertLocation = (req, res) =>
  sectionHandler(req, res, "PropertyLocationInfo");

exports.upsertLegal = (req, res) =>
  sectionHandler(req, res, "PropertyLegalStatus");

exports.upsertOwnership = (req, res) =>
  sectionHandler(req, res, "PropertyOwnership");

exports.upsertBoundaries = (req, res) =>
  sectionHandler(req, res, "PropertyBoundariesInfo");

exports.upsertAdditional = (req, res) =>
  sectionHandler(req, res, "PropertyAdditionalInfo");

/* ===== Full ===== */
exports.getFullProperty = async (req, res) => {
  try {
    const result = await propertyService.getFullProperty(req.params.id);
    success(res, result);
  } catch (err) {
    failure(res, err);
  }
};

/* ===== shared handler ===== */
async function sectionHandler(req, res, modelName) {
  try {
    const result = await propertyService.upsertSection(
      req.params.id,
      modelName,
      req.body
    );
    success(res, result);
  } catch (err) {
    failure(res, err);
  }
}
