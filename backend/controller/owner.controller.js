const Owner = require("../model/Owner");
const {
  createOwnerService,
  addAllOwnerService,
  getAllOwnerService,
  getActiveOwnerService,
  getSingleOwnerService,
  updateOwnerService,
  deleteOwnerService,
} = require("../services/owner.service");

// ایجاد مالک جدید
exports.addOwner = async (req, res, next) => {
  try {
    const owner = await createOwnerService(req.body);
    res
      .status(200)
      .json({ success: true, message: "Owner created", data: owner });
  } catch (err) {
    next(err);
  }
};

// ایجاد چند مالک
exports.addAllOwner = async (req, res, next) => {
  try {
    const owners = await addAllOwnerService(req.body);
    res
      .status(200)
      .json({ success: true, message: "All owners added", data: owners });
  } catch (err) {
    next(err);
  }
};

// دریافت همه مالکان
exports.getAllOwners = async (req, res, next) => {
  try {
    const owners = await getAllOwnerService();
    res.status(200).json({ success: true, data: owners });
  } catch (err) {
    next(err);
  }
};

// دریافت مالکان فعال
exports.getActiveOwners = async (req, res, next) => {
  try {
    const owners = await getActiveOwnerService();
    res.status(200).json({ success: true, data: owners });
  } catch (err) {
    next(err);
  }
};

// دریافت تک مالک
exports.getOwnerById = async (req, res, next) => {
  try {
    const owner = await getSingleOwnerService(req.params.id);
    res.status(200).json({ success: true, data: owner });
  } catch (err) {
    next(err);
  }
};

// بروزرسانی مالک
exports.updateOwner = async (req, res, next) => {
  try {
    const owner = await updateOwnerService(req.params.id, req.body);
    res
      .status(200)
      .json({ success: true, message: "Owner updated", data: owner });
  } catch (err) {
    next(err);
  }
};

// حذف مالک
exports.deleteOwner = async (req, res, next) => {
  try {
    const owner = await deleteOwnerService(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Owner deleted", data: owner });
  } catch (err) {
    next(err);
  }
};
