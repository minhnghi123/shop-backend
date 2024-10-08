const productModel = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const system = require("../../config/system");
const Account = require("../../models/account.model");
const moment = require("moment-timezone");
const index = async (req, res) => {
  let condition = {
    deleted: false,
  };
  //pagination
  let currentPage = 1;
  if (req.query.page) {
    currentPage = parseInt(req.query.page);
  }

  const totalItems = await productModel.countDocuments({ deleted: false });
  const limitItems = 4;
  if (req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }
  const skip = (currentPage - 1) * limitItems;
  const totalPage = Math.ceil(totalItems / limitItems);
  //creating a searching feature
  const inputValue = req.query.inputValue;
  if (inputValue) {
    const regex = new RegExp(inputValue, "i");
    console.log(regex);
    condition.title = regex;
  }
  //creating a product filters
  const status = req.query.status;
  if (status) {
    condition.status = status;
  }
  let sort = {};
  const keyName = req.query.keyName;
  const keyValue = req.query.keyValue;
  if (keyName && keyValue) {
    // console.log(keyName, keyValue);
    sort[keyName] = keyValue;
  } else {
    sort["position"] = "desc";
  }

  const products = await productModel
    .find(condition)
    .limit(limitItems)
    .skip(skip)
    .sort(sort);
  for (const element of products) {
    const userCreated = await Account.findOne({
      _id: element.createdBy,
    });
    const userEdited = await Account.findOne({
      _id: element.editedBy,
    });
    if (userCreated) {
      element.fullName = userCreated.fullName;
    } else {
      element.fullName = "";
    }
    if (userEdited) {
      element.fullNameEdited = userEdited.fullName;
    } else {
      element.fullNameEdited = "";
    }
    // console.log(element);
    if (element.createdAt) {
      element.createdAtFormat = moment
        .tz(element.createdAt, "Asia/Ho_Chi_Minh")
        .fromNow();
    }
    if (element.editedAt) {
      element.editedAtFormat = moment
        .tz(element.editedAt, "Asia/Ho_Chi_Minh")
        .fromNow();
    }
  }
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh Sach San Pham",
    products,
    totalPage,
    currentPage,
    skip,
  });
};
//change-status-by click->api request
const changeStatusByClick = async (req, res) => {
  const content = req.body;
  console.log(content);
  if (content) {
    try {
      const { idProduct, stateChange } = content;
      await productModel.updateOne({ _id: idProduct }, { status: stateChange });
      req.flash("success", "Update Successfully !");
      res.json({
        success: "200",
      });
    } catch (error) {
      console.log("ERROR, CANNOT UPDATE, PLEASE TRY AGAIN !");
    }
  }
};
//change-multi-products
const changeMultiStatus = async (req, res) => {
  const content = req.body;
  console.log(content);
  if (content) {
    try {
      const { statusValue, arrID } = content;
      await productModel.updateMany({ _id: arrID }, { status: statusValue });
      req.flash("success", "Update Successfully !");
      res.json({
        success: "200",
      });
    } catch (error) {
      console.log("ERROR, CANNOT UPDATE, PLEASE TRY AGAIN !");
    }
  }
};
const deleteMulti = async (req, res) => {
  const content = req.body;
  // console.log(content);
  if (content) {
    try {
      const { arrID } = content;
      await productModel.updateMany(
        { _id: arrID },
        { deleted: true, deletedBy: res.locals.user._id, deletedAt: new Date() }
      );
      req.flash("success", "Delete Successfully. Let go to the rubbish page !");
      res.json({
        success: "200",
      });
    } catch (error) {
      console.log("ERROR, CANNOT DELETE, PLEASE TRY AGAIN !");
    }
  }
};
const deletePer = async (req, res) => {
  const content = req.body;
  console.log(content);
  if (content) {
    try {
      const { idProduct } = content;
      await productModel.updateOne(
        { _id: idProduct },
        { deleted: true, deletedBy: res.locals.user._id, deletedAt: new Date() }
      );
      console.log("Delete successfully !");
      req.flash("success", "Delete Successfully. Let go to the rubbish page !");
      res.json({
        success: "200",
      });
    } catch (error) {
      console.log("ERROR, CANNOT DELETE, PLEASE TRY AGAIN !");
    }
  }
};
const rubbishPage = async (req, res) => {
  let condition = {
    deleted: true,
  };
  //pagination
  let currentPage = 1;
  if (req.query.page) {
    currentPage = parseInt(req.query.page);
  }

  const totalItems = await productModel.countDocuments({ deleted: true });
  const limitItems = 4;
  if (req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }
  const skip = (currentPage - 1) * limitItems;
  const totalPage = Math.ceil(totalItems / limitItems);
  //creating a searching feature
  const inputValue = req.query.inputValue;
  if (inputValue) {
    const regex = new RegExp(inputValue, "i");
    console.log(regex);
    condition.title = regex;
  }
  //creating a product filters
  const status = req.query.status;
  if (status) {
    condition.status = status;
  }
  const products = await productModel
    .find(condition)
    .limit(limitItems)
    .skip(skip);
  for (const element of products) {
    const accountDeleted = await Account.findOne({
      _id: element.deletedBy,
    });
    if (accountDeleted) {
      element.deletedFullName = accountDeleted.fullName;
    } else {
      element.deletedFullName = "";
    }
    if (element.deletedAt) {
      element.deletedAtFormat = moment
        .tz(element.deletedAt, "Asia/Ho_Chi_Minh")
        .fromNow();
    }
  }
  res.render("admin/pages/products/rubbish.pug", {
    pageTitle: "Rubbish Page",
    products,
    totalPage,
    currentPage,
    skip,
  });
};
//restoreAll
const restoreAll = async (req, res) => {
  const content = req.body;
  // console.log(content); //  restoreAll: true -> !restoreAll : false=deleted
  try {
    const condition = {
      deleted: true,
    };
    const deletedProducts = await productModel.find(condition);
    const arrID = deletedProducts.map((product) => product._id);
    // console.log(arrID);
    await productModel.updateMany({ _id: arrID }, { deleted: false });
    req.flash("success", "Restore Successfully !");
    res.json({
      response: "200",
    });
  } catch (error) {
    console.log(error);
  }
};
//change-position
const changePosition = async (req, res) => {
  const { newPosition, idProduct } = req.body;
  try {
    await productModel.updateOne({ _id: idProduct }, { position: newPosition });
    req.flash("success", "Change Position Successfully !");
    res.json({
      success: "200",
    });
  } catch (error) {
    console.log(error);
  }
};
const deletePermanent = async (req, res) => {
  const { id } = req.body;
  // console.log(id);
  try {
    await productModel.deleteOne({ _id: id });
  } catch (error) {
    console.log(error);
  }
  req.flash(
    "success",
    "Delete permanently this product. You can not restore it from database or any where !"
  );
  res.json({
    success: "200",
  });
};
const create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false,
  });
  console.log(listCategory);
  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm ",
    listCategory,
  });
};
const createPost = async (req, res) => {
  if (!req.body.position) {
    const totalProducts = await productModel.countDocuments();
    req.body.position = totalProducts + 1;
  }
  req.body.position = parseInt(req.body.position);
  // console.log(req.file);
  req.body.createdBy = res.locals.user._id;
  req.body.createdAt = new Date();
  const newProduct = new productModel(req.body);
  await newProduct.save();
  req.flash("success", "Thêm mới sản phẩm thành công");

  res.redirect(`/${system.prefixAdmin}/products`);
};
const edit = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const listCategory = await ProductCategory.find({
    deleted: false,
  });
  const product = await productModel.findOne({
    _id: id,
    deleted: false,
  });
  // console.log(product);
  res.render("admin/pages/products/edit.pug", {
    title: " Trang Chỉnh Sửa Sản Phẩm",
    product: product,
    listCategory,
  });
};

const editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.editedBy = res.locals.user._id;
  req.body.editedAt = new Date();
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  }
  console.log(req.body);
  await productModel.updateOne(
    {
      _id: id,
      deleted: false,
    },
    req.body
  );
  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};

const detail = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const product = await productModel.findOne({ _id: id });
  // console.log(product);
  res.render("admin/pages/products/detail", {
    title: "Trang Chi Tiết Sản Phẩm",
    product,
  });
};

module.exports = {
  index,
  changeStatusByClick,
  changeMultiStatus,
  deleteMulti,
  deletePer,
  rubbishPage,
  restoreAll,
  changePosition,
  deletePermanent,
  create,
  createPost,
  edit,
  editPatch,
  detail,
};
