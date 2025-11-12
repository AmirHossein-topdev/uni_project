// backend/controller/contract.controller.js
const ContractService = require("../services/contract.service");

class ContractController {
  // ایجاد قرارداد جدید
  async createContract(req, res) {
    try {
      const contract = await ContractService.createContract(req.body);
      res.status(201).json({ success: true, data: contract });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // دریافت قرارداد با آی‌دی
  async getContractById(req, res) {
    try {
      const contract = await ContractService.getContractById(req.params.id);
      res.json({ success: true, data: contract });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // آپدیت قرارداد
  async updateContract(req, res) {
    try {
      const updatedContract = await ContractService.updateContract(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: updatedContract });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // حذف قرارداد
  async deleteContract(req, res) {
    try {
      const deletedContract = await ContractService.deleteContract(
        req.params.id
      );
      res.json({ success: true, data: deletedContract });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // تغییر وضعیت قرارداد
  async changeContractStatus(req, res) {
    try {
      const { status } = req.body;
      const contract = await ContractService.changeContractStatus(
        req.params.id,
        status
      );
      res.json({ success: true, data: contract });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // لیست قراردادها با فیلتر و pagination
  async listContracts(req, res) {
    try {
      const { page, limit, status, tenant, property } = req.query;
      const result = await ContractService.listContracts({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status,
        tenant,
        property,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ContractController();
