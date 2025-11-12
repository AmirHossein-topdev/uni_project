// backend/service/contract.service.js
const Contract = require("../model/Contract");

class ContractService {
  // ایجاد قرارداد جدید
  async createContract(data) {
    try {
      const contract = new Contract(data);
      await contract.save();
      return contract;
    } catch (err) {
      throw err;
    }
  }

  // دریافت قرارداد با آی‌دی
  async getContractById(id) {
    const contract = await Contract.findById(id)
      .populate("tenant")
      .populate("property");
    if (!contract) throw new Error("Contract not found");
    return contract;
  }

  // آپدیت قرارداد
  async updateContract(id, data) {
    try {
      const updatedContract = await Contract.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedContract) throw new Error("Contract not found");
      return updatedContract;
    } catch (err) {
      throw err;
    }
  }

  // حذف قرارداد
  async deleteContract(id) {
    const deletedContract = await Contract.findByIdAndDelete(id);
    if (!deletedContract) throw new Error("Contract not found");
    return deletedContract;
  }

  // تغییر وضعیت قرارداد
  async changeContractStatus(id, status) {
    const allowedStatuses = [
      "در انتظار",
      "در حال اجرا",
      "تکمیل‌شده",
      "لغو شده",
    ];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status");
    }
    const contract = await Contract.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!contract) throw new Error("Contract not found");
    return contract;
  }

  // لیست قراردادها با فیلتر و pagination
  async listContracts({ page = 1, limit = 10, status, tenant, property }) {
    const query = {};
    if (status) query.status = status;
    if (tenant) query.tenant = tenant;
    if (property) query.property = property;

    const contracts = await Contract.find(query)
      .populate("tenant")
      .populate("property")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Contract.countDocuments(query);
    return { contracts, total, page, limit };
  }
}

module.exports = new ContractService();
