const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
  const categories = await ProductCategory.find({ deleted: false });
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh sách danh mục sản phẩm",
    categories,
  });
};
module.exports.create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false,
  });
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    listCategory: listCategory,
  });
};
module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countRecord = await ProductCategory.countDocuments();
    req.body.position = countRecord + 1;
  }
  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
};
module.exports.edit = async (req, res) => {
  const categoryId = req.params.id;
  // console.log(categoryId);
  const category = await ProductCategory.findOne({ _id: categoryId });
  // console.log(category);
  const listCategory = await ProductCategory.find({
    deleted: false,
  });
  res.render("admin/pages/products-category/edit", {
    pageTitle: "Chỉnh danh mục sản phẩm",
    listCategory: listCategory,
    category,
  });
};
module.exports.editPatch = async (req, res) => {
  // console.log(req.body);
  const categoryId = req.params.id;
  req.body.position = parseInt(req.body.position);
  await ProductCategory.updateOne(
    { _id: categoryId, deleted: false },
    req.body
  );
  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};
