const Products = require("../../models/product.model");
module.exports.home = async (req, res) => {
  const products = await Products.find({
    deleted: false,
  });
  for (let product of products) {
    let price = product.price;
    let discount = product.discountPercentage;
    let priceNew = price - (price * discount) / 100;
    priceNew = priceNew.toFixed(2);
    product.priceNew = priceNew;
  }
  res.render("client/pages/home/homeProduct", {
    products,
  });
};
