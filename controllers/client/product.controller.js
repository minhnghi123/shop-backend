const productModel = require("../../models/product.model");
const home = async (req, res) => {
  const products = await productModel.find({
    deleted: false,
  });

  for (let product of products) {
    let price = product.price;
    let discount = product.discountPercentage;
    let newPrice = price - (price * discount) / 100;
    newPrice = newPrice.toFixed(2);
    product.newPrice = newPrice;
  }
  res.render("client/pages/products/index", {
    pageTitle: "Products Pages",
    products,
  });
};
const edit = (req, res) => {
  res.render("client/pages/products/index");
};
const dele = (req, res) => {
  res.render("client/pages/products/index");
};
module.exports = { home, edit, dele };
