const ProductCategory = require("../../models/product-category.model");
const createTree = require("../../helpers/createTree.helper");
const Product = require("../../models/product.model");
module.exports.getAllCategory = async (req, res, next) => {
  //   console.log("Logging to here !");
  const productCategory = await ProductCategory.find({
    deleted: false,
    status: "active",
  });
  for (const category of productCategory) {
    category.countProducts = await Product.countDocuments({
      category_id: category._id,
      deleted: false,
      status: "active",
    });
  }
  //   console.log(productCategory);
  const allCategory = createTree.getAllCategory(productCategory);
  //   console.log(allCategory);
  res.locals.allCategory = allCategory;
  res.locals.categories = productCategory;
  next();
};
