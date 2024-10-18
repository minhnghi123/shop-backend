const productModel = require("../models/product.model");
module.exports.pagination = async (page, limit) => {
  //pagination
  let currentPage = 1;
  if (page) {
    currentPage = parseInt(page);
  }

  const totalItems = await productModel.countDocuments({ deleted: false });
  let limitItems = 4;
  if (limit) {
    limitItems = parseInt(limit);
  }
  const skip = (currentPage - 1) * limitItems;
  const totalPage = Math.ceil(totalItems / limitItems);
  const data = {
    skip,
    limitItems,
    totalPage,
    currentPage,
  };
  return data;
};
