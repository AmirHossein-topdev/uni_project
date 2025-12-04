// const { Role } = require("../model/Role");
const Role = require("../model/Role"); // حالا Role.find() درست کار میکنه

class RoleService {
  // ایجاد نقش جدید
  async createRole(data) {
    try {
      const role = new Role(data);
      await role.save();
      return role;
    } catch (err) {
      if (err.code === 11000 && err.keyValue.name) {
        throw new Error("Role name already exists");
      }
      throw err;
    }
  }

  // دریافت نقش با آی‌دی
  async getRoleById(id) {
    const role = await Role.findById(id).populate("users");
    if (!role) throw new Error("Role not found");
    return role;
  }

  // دریافت نقش با نام
  async getRoleByName(name) {
    const role = await Role.findOne({ name }).populate("users");
    if (!role) throw new Error("Role not found");
    return role;
  }

  // آپدیت نقش
  async updateRole(id, data) {
    try {
      const updatedRole = await Role.findByIdAndUpdate(id, data, { new: true });
      if (!updatedRole) throw new Error("Role not found");
      return updatedRole;
    } catch (err) {
      if (err.code === 11000 && err.keyValue.name) {
        throw new Error("Role name already exists");
      }
      throw err;
    }
  }

  // حذف نقش
  async deleteRole(id) {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) throw new Error("Role not found");
    return deletedRole;
  }

  // تغییر وضعیت نقش
  async changeRoleStatus(id, status) {
    if (!["active", "inactive"].includes(status)) {
      throw new Error("Invalid status");
    }
    const role = await Role.findByIdAndUpdate(id, { status }, { new: true });
    if (!role) throw new Error("Role not found");
    return role;
  }

  // لیست نقش‌ها با فیلتر و pagination
  async listRoles({ page = 1, limit = 10, status }) {
    const query = {};
    if (status) query.status = status;

    const roles = await Role.find(query) // ← این خط
      .populate("users")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Role.countDocuments(query);
    return { roles, total, page, limit };
  }
}

module.exports = new RoleService();
