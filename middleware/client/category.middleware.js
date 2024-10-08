const ProductCategory = require("../../models/product-category.model");
const createTree = require("../../helpers/createTree.helper");
module.exports.getAllCategory = async (req, res, next) => {
  //   console.log("Logging to here !");
  const productCategory = await ProductCategory.find({
    deleted: false,
    status: "active",
  });
  //   console.log(productCategory);
  const allCategory = createTree.getAllCategory(productCategory);
  //   console.log(allCategory);
  res.locals.allCategory = allCategory;
  next();
};
