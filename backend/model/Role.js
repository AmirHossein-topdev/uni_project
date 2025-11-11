const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const roleSchema = mongoose.Schema(
  {
    // نام نقش
    name: {
      type: String,
      required: [true, "Please provide a role name"],
      trim: true,
      unique: true,
      maxLength: 50,
    },
    // توضیح نقش
    description: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    // دسترسی‌ها
    permissions: {
      type: [String],
      required: true,
      default: [], // اگر Admin هست می‌تونه "all" باشه
      validate: {
        validator: function (arr) {
          // آرایه خالی یا "all" یا از مجموعه مجاز باشه
          const allowed = [
            "read_properties",
            "create_properties",
            "update_properties",
            "delete_properties",
            "read_contracts",
            "create_contracts",
            "update_contracts",
            "delete_contracts",
            "manage_users",
            "manage_roles",
            "all",
          ];
          return arr.every((item) => allowed.includes(item));
        },
        message: (props) => `${props.value} includes invalid permission`,
      },
    },
    // وضعیت فعال بودن نقش
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // کاربران مرتبط با این نقش
    users: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
