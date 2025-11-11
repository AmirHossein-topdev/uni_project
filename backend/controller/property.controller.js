const Property = require("../model/Property");
const propertyServices = require("../services/property.service");

// ➕ Add a new property
exports.addProperty = async (req, res, next) => {
  try {
    const firstImage = {
      img: req.body.mainImage,
      description: req.body.mainImageDescription || "",
    };
    const galleryImages = [firstImage, ...(req.body.gallery || [])];

    const result = await propertyServices.createPropertyService({
      ...req.body,
      gallery: galleryImages,
    });

    res.status(200).json({
      success: true,
      message: "Property created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ➕ Add multiple properties
exports.addAllProperties = async (req, res, next) => {
  try {
    const result = await propertyServices.addAllPropertyService(req.body);
    res.status(200).json({
      success: true,
      message: "All properties added successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 📋 Get all properties (admin)
exports.getAllProperties = async (req, res, next) => {
  try {
    const result = await propertyServices.getAllPropertiesService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// 📍 Get properties by type
exports.getPropertiesByType = async (req, res, next) => {
  try {
    const result = await propertyServices.getPropertyTypeService(
      req.params.type
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// 🏷 Get featured properties
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const result = await propertyServices.getFeaturedPropertyService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// 📅 Get properties with active offers
exports.getOfferProperties = async (req, res, next) => {
  try {
    const result = await propertyServices.getOfferPropertyService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// 🏡 Get single property
exports.getSingleProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email phone")
      .populate("contracts");

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// 🔄 Update property
exports.updateProperty = async (req, res, next) => {
  try {
    const updatedProperty = await propertyServices.updatePropertyService(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({
        success: true,
        data: updatedProperty,
        message: "Property updated successfully",
      });
  } catch (error) {
    next(error);
  }
};

// ❌ Delete property
exports.deleteProperty = async (req, res, next) => {
  try {
    await propertyServices.deleteProperty(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// 🔎 Get properties with filters (area, price, type, status)
exports.filterProperties = async (req, res, next) => {
  try {
    const result = await propertyServices.filterPropertiesService(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
