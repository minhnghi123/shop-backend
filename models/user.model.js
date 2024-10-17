const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema, "users");
module.exports = User;
