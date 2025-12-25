const PropertyStatus = require("../model/PropertyStatus");
const PropertyOwnership = require("../model/PropertyOwnership");
const PropertyIdentity = require("../model/PropertyIdentity");
const PropertyLegalStatus = require("../model/PropertyLegalStatus");
const PropertyBoundaries = require("../model/PropertyBoundariesInfo");
const {
  PropertyLocationInfo: PropertyLocation,
} = require("../model/PropertyLocationInfo");
const PropertyAdditionalInfo = require("../model/PropertyAdditionalInfo");

/* ========= CREATE ========= */
exports.createProperty = async (req, res) => {
  try {
    const {
      status,
      ownership,
      identity,
      location,
      legalStatus,
      boundaries,
      additionalInfo,
    } = req.body;
    if (!status) return res.status(400).json({ error: "status required" });

    const saved = await new PropertyStatus(status).save();
    const id = saved._id;

    if (ownership)
      await new PropertyOwnership({ ...ownership, property: id }).save();
    if (identity)
      await new PropertyIdentity({ ...identity, property: id }).save();
    if (location)
      await new PropertyLocation({ ...location, property: id }).save();
    if (legalStatus)
      await new PropertyLegalStatus({ ...legalStatus, property: id }).save();
    if (boundaries)
      await new PropertyBoundaries({ ...boundaries, property: id }).save();
    if (additionalInfo)
      await new PropertyAdditionalInfo({
        ...additionalInfo,
        property: id,
      }).save();

    res.status(201).json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ========= READ ALL ========= */
exports.listProperties = async (req, res) => {
  try {
    res.json(await PropertyStatus.find());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ========= READ ONE ========= */
exports.getProperty = async (req, res) => {
  try {
    const doc = await PropertyStatus.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ========= UPDATE ========= */
exports.updateProperty = async (req, res) => {
  try {
    const updated = await PropertyStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ========= DELETE ========= */
exports.deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;
    await PropertyStatus.findByIdAndDelete(id);
    await PropertyOwnership.deleteOne({ property: id });
    await PropertyIdentity.deleteOne({ property: id });
    await PropertyLocation.deleteOne({ property: id });
    await PropertyLegalStatus.deleteOne({ property: id });
    await PropertyBoundaries.deleteOne({ property: id });
    await PropertyAdditionalInfo.deleteOne({ property: id });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ========= UPSERT SECTIONS ========= */
const upsert = (Model) => async (req, res) => {
  try {
    const doc = await Model.findOneAndUpdate(
      { property: req.params.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.upsertIdentity = upsert(PropertyIdentity);
exports.upsertLocation = upsert(PropertyLocation);
exports.upsertLegal = upsert(PropertyLegalStatus);
exports.upsertOwnership = upsert(PropertyOwnership);
exports.upsertBoundaries = upsert(PropertyBoundaries);
exports.upsertAdditional = upsert(PropertyAdditionalInfo);

/* ========= FULL VIEW ========= */
exports.getFullProperty = async (req, res) => {
  try {
    const id = req.params.id;
    res.json({
      status: await PropertyStatus.findById(id),
      ownership: await PropertyOwnership.findOne({ property: id }),
      identity: await PropertyIdentity.findOne({ property: id }),
      location: await PropertyLocation.findOne({ property: id }),
      legalStatus: await PropertyLegalStatus.findOne({ property: id }),
      boundaries: await PropertyBoundaries.findOne({ property: id }),
      additionalInfo: await PropertyAdditionalInfo.findOne({ property: id }),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
