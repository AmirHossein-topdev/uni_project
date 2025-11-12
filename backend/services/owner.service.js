// backend/service/owner.service.js
const Owner = require("../model/Owner");

class OwnerService {
  // ایجاد مالک جدید
  async createOwner(data) {
    try {
      const owner = new Owner(data);
      await owner.save();
      return owner;
    } catch (err) {
      if (err.code === 11000 && err.keyValue.email) {
        throw new Error("Email already exists");
      }
      throw err;
    }
  }

  // دریافت مالک با آی‌دی
  async getOwnerById(id) {
    const owner = await Owner.findById(id).populate("properties");
    if (!owner) throw new Error("Owner not found");
    return owner;
  }

  // دریافت مالک با ایمیل
  async getOwnerByEmail(email) {
    const owner = await Owner.findOne({ email }).populate("properties");
    if (!owner) throw new Error("Owner not found");
    return owner;
  }

  // آپدیت مالک
  async updateOwner(id, data) {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedOwner) throw new Error("Owner not found");
      return updatedOwner;
    } catch (err) {
      if (err.code === 11000 && err.keyValue.email) {
        throw new Error("Email already exists");
      }
      throw err;
    }
  }

  // حذف مالک
  async deleteOwner(id) {
    const deletedOwner = await Owner.findByIdAndDelete(id);
    if (!deletedOwner) throw new Error("Owner not found");
    return deletedOwner;
  }

  // تغییر وضعیت مالک
  async changeOwnerStatus(id, status) {
    const allowedStatuses = ["active", "inactive", "blocked"];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status");
    }
    const owner = await Owner.findByIdAndUpdate(id, { status }, { new: true });
    if (!owner) throw new Error("Owner not found");
    return owner;
  }

  // لیست مالکان با فیلتر و pagination
  async listOwners({ page = 1, limit = 10, status, type }) {
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const owners = await Owner.find(query)
      .populate("properties")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Owner.countDocuments(query);
    return { owners, total, page, limit };
  }
}

module.exports = new OwnerService();
