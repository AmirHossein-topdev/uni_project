// backend/controller/role.controller.js
const RoleService = require("../services/role.service");

class RoleController {
  // ایجاد نقش جدید
  async createRole(req, res) {
    try {
      const role = await RoleService.createRole(req.body);
      res.status(201).json({ success: true, data: role });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // دریافت نقش با آی‌دی
  async getRoleById(req, res) {
    try {
      const role = await RoleService.getRoleById(req.params.id);
      res.json({ success: true, data: role });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // دریافت نقش با نام
  async getRoleByName(req, res) {
    try {
      const role = await RoleService.getRoleByName(req.params.name);
      res.json({ success: true, data: role });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // آپدیت نقش
  async updateRole(req, res) {
    try {
      const updatedRole = await RoleService.updateRole(req.params.id, req.body);
      res.json({ success: true, data: updatedRole });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // حذف نقش
  async deleteRole(req, res) {
    try {
      const deletedRole = await RoleService.deleteRole(req.params.id);
      res.json({ success: true, data: deletedRole });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // تغییر وضعیت نقش
  async changeRoleStatus(req, res) {
    try {
      const { status } = req.body;
      const role = await RoleService.changeRoleStatus(req.params.id, status);
      res.json({ success: true, data: role });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // لیست نقش‌ها با فیلتر و pagination
  async listRoles(req, res) {
    try {
      const { page, limit, status } = req.query;
      const result = await RoleService.listRoles({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new RoleController();
