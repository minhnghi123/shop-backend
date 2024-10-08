const productModel = require("../../models/product.model");
const productCategory = require("../../models/product-category.model");
const Products = require("../../models/product.model");
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
const category = async (req, res) => {
  const slugCategory = req.params.slugCategory;
  console.log(slugCategory);
  const specificCategory = await productCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false,
  });
  const childCategory = [];

  // console.log(allCategory);
  const getAllCategory = async (parentId) => {
    const allCategoryChild = await productCategory.find({
      status: "active",
      deleted: false,
      parent_id: parentId,
    });
    for (const element of allCategoryChild) {
      childCategory.push(element._id);
      await getAllCategory(element._id);
    }
  };
  await getAllCategory(specificCategory.id);
  // console.log(childCategory);
  const products = await Products.find({
    category_id: {
      $in: [specificCategory._id, ...childCategory],
    },
    deleted: false,
    status: "active",
  });
  for (const product of products) {
    product.newPrice =
      (product.price * (100 - product.discountPercentage)) / 100;
    product.newPrice = product.newPrice.toLocaleString();
    product.price = product.price.toLocaleString();
  }
  // console.log(products);
  res.render("client/pages/products/index", {
    pageTitle: specificCategory.title,
    products,
  });
};
const detail = async (req, res) => {
  const specificProduct = await productModel.findOne({
    slug: req.params.slugProduct,
  });
  res.render("client/pages/products/detail", {
    pageTitle: "Products Pages",
    product: specificProduct,
  });
};
module.exports = { home, edit, dele, category, detail };
