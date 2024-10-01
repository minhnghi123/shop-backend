const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug); // adding slug into schema
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  category_id: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
});
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
