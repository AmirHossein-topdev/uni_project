const Owner = require("../model/Owner");
const ApiError = require("../errors/api-error");

// ایجاد مالک جدید
exports.createOwnerService = async (data) => {
  const existing = await Owner.findOne({ email: data.email });
  if (existing) throw new ApiError(400, "Owner already exists");
  const owner = await Owner.create(data);
  return owner;
};

// ایجاد چند مالک همزمان
exports.addAllOwnerService = async (data) => {
  await Owner.deleteMany(); // اگر بخوای reset کامل
  const owners = await Owner.insertMany(data);
  return owners;
};

// دریافت همه مالکان برای داشبورد
exports.getAllOwnerService = async () => {
  return await Owner.find().populate("properties");
};

// دریافت مالکان فعال
exports.getActiveOwnerService = async () => {
  return await Owner.find({ status: "active" }).populate("properties");
};

// دریافت تک مالک
exports.getSingleOwnerService = async (id) => {
  const owner = await Owner.findById(id).populate("properties");
  if (!owner) throw new ApiError(404, "Owner not found");
  return owner;
};

// بروزرسانی مالک
exports.updateOwnerService = async (id, data) => {
  const owner = await Owner.findByIdAndUpdate(id, data, { new: true });
  if (!owner) throw new ApiError(404, "Owner not found");
  return owner;
};

// حذف مالک
exports.deleteOwnerService = async (id) => {
  const owner = await Owner.findByIdAndDelete(id);
  if (!owner) throw new ApiError(404, "Owner not found");
  return owner;
};
