const Contract = require("../model/Contract");

// ➕ ایجاد قرارداد جدید
exports.addContract = async (req, res, next) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json({
      success: true,
      message: "قرارداد با موفقیت ثبت شد",
      contract,
    });
  } catch (error) {
    console.error("Add Contract Error:", error);
    next(error);
  }
};

// 📃 دریافت همه قراردادها
exports.getContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.find({})
      .populate("tenant", "name email contactNumber")
      .populate("property", "title address");
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    console.error("Get Contracts Error:", error);
    next(error);
  }
};

// 📄 دریافت یک قرارداد خاص
exports.getSingleContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate("tenant", "name email contactNumber")
      .populate("property", "title address");
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "قرارداد یافت نشد" });
    }
    res.status(200).json(contract);
  } catch (error) {
    console.error("Get Single Contract Error:", error);
    next(error);
  }
};

// 🔄 بروزرسانی وضعیت قرارداد
exports.updateContractStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "قرارداد یافت نشد" });
    }
    res.status(200).json({
      success: true,
      message: "وضعیت قرارداد با موفقیت بروزرسانی شد",
      contract,
    });
  } catch (error) {
    console.error("Update Contract Status Error:", error);
    next(error);
  }
};

// 📝 افزودن یادداشت یا اسناد به قرارداد
exports.addDocumentsOrNotes = async (req, res, next) => {
  try {
    const { notes, documents } = req.body;
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "قرارداد یافت نشد" });
    }

    if (notes) contract.notes = notes;
    if (documents && Array.isArray(documents)) {
      contract.documents.push(...documents);
    }

    await contract.save();

    res.status(200).json({
      success: true,
      message: "اسناد یا یادداشت‌ها با موفقیت اضافه شد",
      contract,
    });
  } catch (error) {
    console.error("Add Documents/Notes Error:", error);
    next(error);
  }
};

// 🗑 حذف قرارداد
exports.deleteContract = async (req, res, next) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "قرارداد یافت نشد" });
    }
    res
      .status(200)
      .json({ success: true, message: "قرارداد با موفقیت حذف شد" });
  } catch (error) {
    console.error("Delete Contract Error:", error);
    next(error);
  }
};
