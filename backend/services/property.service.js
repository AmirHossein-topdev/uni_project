const PropertyStatus = require("../model/PropertyStatus");
const PropertyIdentity = require("../model/PropertyIdentity");
const PropertyLocationInfo = require("../model/PropertyLocationInfo");
const PropertyLegalStatus = require("../model/PropertyLegalStatus");
const PropertyOwnership = require("../model/PropertyOwnership");
const PropertyBoundariesInfo = require("../model/PropertyBoundariesInfo");
const PropertyAdditionalInfo = require("../model/PropertyAdditionalInfo");

const sectionModels = {
  PropertyIdentity,
  PropertyLocationInfo,
  PropertyLegalStatus,
  PropertyOwnership,
  PropertyBoundariesInfo,
  PropertyAdditionalInfo,
};

/* ===== PropertyStatus ===== */
exports.createProperty = async (data) => {
  return await PropertyStatus.create(data);
};

exports.listProperties = async () => {
  return await PropertyStatus.find().sort({ createdAt: -1 });
};

exports.getProperty = async (id) => {
  const doc = await PropertyStatus.findById(id);
  if (!doc) throw { status: 404, message: "Property not found" };
  return doc;
};

exports.updateProperty = async (id, data) => {
  const doc = await PropertyStatus.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!doc) throw { status: 404, message: "Property not found" };
  return doc;
};

exports.deleteProperty = async (id) => {
  await PropertyStatus.findByIdAndDelete(id);

  // حذف وابسته‌ها
  await Promise.all(
    Object.values(sectionModels).map((Model) =>
      Model.findOneAndDelete({ property: id })
    )
  );

  return { deleted: true };
};

/* ===== Sections (Upsert) ===== */
exports.upsertSection = async (propertyId, modelName, payload) => {
  const Model = sectionModels[modelName];
  if (!Model) throw { status: 400, message: "Invalid section" };

  const doc = await Model.findOneAndUpdate(
    { property: propertyId },
    { ...payload, property: propertyId },
    { new: true, upsert: true }
  );

  return doc;
};

/* ===== Full ===== */
exports.getFullProperty = async (propertyId) => {
  const property = await PropertyStatus.findById(propertyId);
  if (!property) throw { status: 404, message: "Property not found" };

  const sections = await Promise.all(
    Object.entries(sectionModels).map(async ([key, Model]) => [
      key,
      await Model.findOne({ property: propertyId }),
    ])
  );

  return {
    property,
    sections: Object.fromEntries(sections),
  };
};
