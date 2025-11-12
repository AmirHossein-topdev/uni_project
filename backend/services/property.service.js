// backend/service/property.service.js
const Property = require("../model/Property");

class PropertyService {
  // ایجاد ملک جدید
  async createProperty(data) {
    try {
      const property = new Property(data);
      await property.save();
      return property;
    } catch (err) {
      throw err;
    }
  }

  // دریافت ملک با آی‌دی
  async getPropertyById(id) {
    const property = await Property.findById(id)
      .populate("owner")
      .populate("contracts")
      .populate("createdBy");
    if (!property) throw new Error("Property not found");
    return property;
  }

  // آپدیت ملک
  async updateProperty(id, data) {
    try {
      const updatedProperty = await Property.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedProperty) throw new Error("Property not found");
      return updatedProperty;
    } catch (err) {
      throw err;
    }
  }

  // حذف ملک
  async deleteProperty(id) {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) throw new Error("Property not found");
    return deletedProperty;
  }

  // تغییر وضعیت ملک
  async changePropertyStatus(id, status) {
    const allowedStatuses = [
      "در دسترس",
      "اجاره داده شده",
      "فروخته شده",
      "در تعمیر",
    ];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status");
    }
    const property = await Property.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!property) throw new Error("Property not found");
    return property;
  }

  // افزایش شمارنده بازدید
  async incrementViews(id) {
    const property = await Property.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
    if (!property) throw new Error("Property not found");
    return property;
  }

  // لیست ملک‌ها با فیلتر و pagination
  async listProperties({ page = 1, limit = 10, status, type, owner }) {
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (owner) query.owner = owner;

    const properties = await Property.find(query)
      .populate("owner")
      .populate("contracts")
      .populate("createdBy")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);
    return { properties, total, page, limit };
  }

  // جستجو ملک‌ها بر اساس عنوان، توضیحات یا تگ‌ها
  async searchProperties({ keyword, page = 1, limit = 10 }) {
    const regex = new RegExp(keyword, "i");
    const query = {
      $or: [{ title: regex }, { description: regex }, { tags: regex }],
    };

    const properties = await Property.find(query)
      .populate("owner")
      .populate("contracts")
      .populate("createdBy")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);
    return { properties, total, page, limit };
  }
}

module.exports = new PropertyService();
