const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    // userId: String,
    username: String,
    email: String,
    SDT: String,
    address: String,
    payment: String,
    products: Array,
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;
