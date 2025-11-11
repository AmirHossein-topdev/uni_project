const Role = require("../model/Role");
const roleService = require("../services/role.service");

// ایجاد نقش جدید
exports.addRole = async (req, res, next) => {
  try {
    const result = await roleService.addRoleService(req.body);
    res.status(200).json({
      status: "success",
      message: "Role created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// افزودن چند نقش همزمان
exports.addAllRoles = async (req, res, next) => {
  try {
    const result = await roleService.addAllRolesService(req.body);
    res.status(200).json({
      status: "success",
      message: "Roles added successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// دریافت تمام نقش‌ها
exports.getAllRoles = async (req, res, next) => {
  try {
    const result = await Role.find(
      {},
      { name: 1, description: 1, permissions: 1, status: 1 }
    );
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// دریافت نقش‌های فعال
exports.getActiveRoles = async (req, res, next) => {
  try {
    const result = await roleService.getActiveRolesService();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// حذف نقش
exports.deleteRole = async (req, res, next) => {
  try {
    await roleService.deleteRoleService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ویرایش نقش
exports.updateRole = async (req, res, next) => {
  try {
    const result = await roleService.updateRoleService(req.params.id, req.body);
    res.status(200).json({
      status: true,
      message: "Role updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// دریافت یک نقش خاص
exports.getSingleRole = async (req, res, next) => {
  try {
    const result = await roleService.getSingleRoleService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
