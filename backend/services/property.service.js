const Brand = require("../model/Brand"); // optional: اگر املاک برند داشته باشند
const Category = require("../model/Category"); // optional: اگر دسته‌بندی املاک دارید
const Property = require("../model/Property");

// ➕ Create a new property
exports.createPropertyService = async (data) => {
  const property = await Property.create(data);

  const { _id: propertyId, owner, category } = property;

  // اگر میخوای owner یا category آپدیت بشه
  if (owner?.id) {
    await Brand.updateOne(
      { _id: owner.id },
      { $push: { properties: propertyId } }
    );
  }

  if (category?.id) {
    await Category.updateOne(
      { _id: category.id },
      { $push: { properties: propertyId } }
    );
  }

  return property;
};

// ➕ Add multiple properties
exports.addAllPropertyService = async (data) => {
  await Property.deleteMany();
  const properties = await Property.insertMany(data);

  for (const property of properties) {
    if (property.owner?.id) {
      await Brand.findByIdAndUpdate(property.owner.id, {
        $push: { properties: property._id },
      });
    }
    if (property.category?.id) {
      await Category.findByIdAndUpdate(property.category.id, {
        $push: { properties: property._id },
      });
    }
  }

  return properties;
};

// 📋 Get all properties
exports.getAllPropertiesService = async () => {
  const properties = await Property.find({})
    .populate("owner")
    .populate("category");
  return properties;
};

// 📍 Get properties by type
exports.getPropertyTypeService = async (type) => {
  const properties = await Property.find({ propertyType: type })
    .populate("owner")
    .populate("category");
  return properties;
};

// 🏷 Get featured properties
exports.getFeaturedPropertyService = async () => {
  const properties = await Property.find({ featured: true })
    .populate("owner")
    .populate("category");
  return properties;
};

// 📅 Get properties with active offers
exports.getOfferPropertyService = async () => {
  const properties = await Property.find({
    "offerDate.endDate": { $gt: new Date() },
  })
    .populate("owner")
    .populate("category");
  return properties;
};

// 🔎 Get single property
exports.getPropertyService = async (id) => {
  if (!id) throw new Error("Property ID is required");

  const property = await Property.findById(id)
    .populate("owner")
    .populate("category")
    .populate("contracts");

  return property;
};

// 🔄 Update a property
exports.updatePropertyService = async (id, data) => {
  const property = await Property.findById(id);

  if (!property) return null;

  Object.assign(property, data);

  await property.save();

  return property;
};

// ❌ Delete a property
exports.deleteProperty = async (id) => {
  const result = await Property.findByIdAndDelete(id);
  return result;
};

// 🔎 Related properties by category
exports.getRelatedPropertyService = async (propertyId) => {
  const current = await Property.findById(propertyId);

  if (!current) return [];

  const related = await Property.find({
    "category.name": current.category.name,
    _id: { $ne: propertyId },
  });

  return related;
};

// 🔍 Filter properties by query (price, area, type, status)
exports.filterPropertiesService = async (query) => {
  const filter = {};

  if (query.minPrice) filter.price = { $gte: Number(query.minPrice) };
  if (query.maxPrice)
    filter.price = { ...filter.price, $lte: Number(query.maxPrice) };
  if (query.status) filter.status = query.status;
  if (query.propertyType) filter.propertyType = query.propertyType;
  if (query.city) filter["address.city"] = query.city;

  const properties = await Property.find(filter)
    .populate("owner")
    .populate("category");

  return properties;
};
