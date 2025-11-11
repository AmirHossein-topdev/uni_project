// Role Service (backend/services/role.service.js)
const ApiError = require("../errors/api-error");
const Role = require("../model/Role");

// ایجاد یک نقش جدید
exports.addRoleService = async (data) => {
  const role = await Role.create(data);
  return role;
};

// ایجاد چند نقش همزمان
exports.addAllRolesService = async (data) => {
  await Role.deleteMany();
  const roles = await Role.insertMany(data);
  return roles;
};

// دریافت نقش‌های فعال
exports.getActiveRolesService = async () => {
  const roles = await Role.find({ status: "active" }).populate("users");
  return roles;
};

// حذف نقش
exports.deleteRoleService = async (id) => {
  const role = await Role.findByIdAndDelete(id);
  return role;
};

// ویرایش نقش
exports.updateRoleService = async (id, payload) => {
  const isExist = await Role.findById(id);
  if (!isExist) {
    throw new ApiError(404, "Role not found!");
  }
  const result = await Role.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// دریافت یک نقش خاص
exports.getSingleRoleService = async (id) => {
  const result = await Role.findById(id).populate("users");
  if (!result) {
    throw new ApiError(404, "Role not found!");
  }
  return result;
};
