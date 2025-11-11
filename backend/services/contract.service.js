const Contract = require("../model/Contract");
const User = require("../model/User");
const Property = require("../model/Property");

// ایجاد قرارداد جدید
exports.createContractService = async (data) => {
  const { tenant, property, rentAmount, deposit, tax } = data;

  // محاسبه totalAmount
  const totalAmount = rentAmount + (deposit || 0) + (tax || 0);
  const contract = await Contract.create({ ...data, totalAmount });

  // آپدیت وضعیت ملک به "در حال اجرا" یا مشابه
  await Property.findByIdAndUpdate(property, { status: "در حال اجرا" });

  return contract;
};

// دریافت همه قراردادها
exports.getAllContractsService = async () => {
  const contracts = await Contract.find()
    .populate("tenant", "name email phone")
    .populate("property", "title address city country");
  return contracts;
};

// دریافت یک قرارداد خاص
exports.getSingleContractService = async (id) => {
  const contract = await Contract.findById(id)
    .populate("tenant", "name email phone")
    .populate("property", "title address city country");
  return contract;
};

// بروزرسانی وضعیت قرارداد
exports.updateContractStatusService = async (id, newStatus) => {
  const contract = await Contract.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );
  return contract;
};

// افزودن اسناد یا یادداشت‌ها
exports.addDocumentsOrNotesService = async (id, docsOrNotes) => {
  const contract = await Contract.findById(id);
  if (!contract) throw new Error("Contract not found");

  if (docsOrNotes.documents) {
    contract.documents.push(...docsOrNotes.documents);
  }
  if (docsOrNotes.notes) {
    contract.notes = docsOrNotes.notes;
  }

  await contract.save();
  return contract;
};

// حذف قرارداد
exports.deleteContractService = async (id) => {
  const contract = await Contract.findByIdAndDelete(id);
  return contract;
};
