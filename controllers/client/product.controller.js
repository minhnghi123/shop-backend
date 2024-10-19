const productModel = require("../../models/product.model");
const productCategory = require("../../models/product-category.model");
const Products = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper");
const home = async (req, res) => {
  // Pagination
  const data = await paginationHelper.pagination(
    req.query.page,
    req.query.limit
  );
  // End pagination

  // Sort
  let sort = {};
  const keyName = req.query.keyName;
  const keyValue = req.query.keyValue;
  if (keyName && keyValue) {
    sort[keyName] = keyValue;
  } else {
    sort["price"] = "asc";
  }
  // End sort

  // Price filter
  let priceFilter = {};
  if (req.query.price) {
    if (req.query.price !== "all") {
      let value = req.query.price.split("-");
      priceFilter = {
        $gte: parseInt(value[0]),
        $lte: parseInt(value[1]),
      };
    }
  }

  const hasPriceFilter = Object.keys(priceFilter).length > 0;

  const products = await productModel
    .find({
      deleted: false,
      ...(hasPriceFilter ? { price: priceFilter } : {}),
    })
    .limit(data.limitItems)
    .skip(data.skip)
    .sort(sort);

  for (let product of products) {
    let price = product.price;
    let discount = product.discountPercentage;
    let priceNew = price - (price * discount) / 100;
    priceNew = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(priceNew);
    product.priceNew = priceNew;
    product.price = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(product.price);
  }

  const totalPage = data.totalPage;
  const currentPage = data.currentPage;

  res.render("client/pages/products/search", {
    products,
    totalPage,
    currentPage,
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
  // Pagination
  const data = await paginationHelper.pagination(
    req.query.page,
    req.query.limit
  );
  // End pagination

  // Sort
  let sort = {};
  const keyName = req.query.keyName;
  const keyValue = req.query.keyValue;
  if (keyName && keyValue) {
    sort[keyName] = keyValue;
  } else {
    sort["price"] = "asc";
  }
  // End sort

  // Price filter
  let priceFilter = {};
  if (req.query.price) {
    if (req.query.price !== "all") {
      let value = req.query.price.split("-");
      priceFilter = {
        $gte: parseInt(value[0]),
        $lte: parseInt(value[1]),
      };
    }
  }

  const hasPriceFilter = Object.keys(priceFilter).length > 0;
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
        ...(hasPriceFilter ? { price: priceFilter } : {}),
      })
      .limit(data.limitItems)
      .skip(data.skip)
      .sort(sort);
    for (let product of products) {
      let price = product.price;
      let discount = product.discountPercentage;
      let priceNew = price - (price * discount) / 100;
      priceNew = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(priceNew);
      product.priceNew = priceNew;
      product.price = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(product.price);
    }
  }
  const totalPage = data.totalPage;
  const currentPage = data.currentPage;

  // Hết Tìm kiếm
  res.render("client/pages/products/search", {
    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
    keyword: keyword,
    products: products,
    totalPage: totalPage,
    currentPage: currentPage,
  });
};
module.exports = { home, edit, dele, category, detail, search };
