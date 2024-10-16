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
    let priceNew = price - (price * discount) / 100;
    priceNew = priceNew.toFixed(2);
    product.priceNew = priceNew;
  }
  res.render("client/pages/products/search", {
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
  res.render("client/pages/products/search", {
    pageTitle: specificCategory.title,
    products,
  });
};
const detail = async (req, res) => {
  const specificProduct = await productModel.findOne({
    slug: req.params.slugProduct,
  });

  specificProduct.priceNew =
    (1 - specificProduct.discountPercentage / 100) * specificProduct.price;
  specificProduct.priceNew = specificProduct.priceNew.toFixed(0);

  res.render("client/pages/products/detail", {
    pageTitle: "Products Pages",
    product: specificProduct,
  });
};
const search = async (req, res) => {
  const keyword = req.query.keyword;
  let products = [];
  // Tìm kiếm
  if (keyword) {
    const regex = new RegExp(keyword, "i");
    products = await productModel
      .find({
        title: regex,
        deleted: false,
        status: "active",
      })
      .sort({ position: "desc" });
    for (const item of products) {
      item.priceNew = (1 - item.discountPercentage / 100) * item.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
  }
  // Hết Tìm kiếm
  res.render("client/pages/products/search", {
    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
    keyword: keyword,
    products: products,
  });
};
module.exports = { home, edit, dele, category, detail, search };
