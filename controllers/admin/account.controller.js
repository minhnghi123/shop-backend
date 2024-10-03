const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const system = require("../../config/system");
const generate = require("../../helpers/generate.helper");
const md5 = require("md5");
module.exports.index = async (req, res) => {
  const records = await Account.find({
    deleted: false,
  });
  for (const element of records) {
    const role = await Role.findOne({
      _id: element.role_id,
      deleted: false,
    });
    element.role_title = role.title;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Home Page",
    records,
  });
};
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Create Page",
    roles,
  });
};
module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);
  //   console.log(req.body.password);
  req.body.token = generate.generateRandomString(30);
  //   console.log(req.body.token);
  const newAccount = new Account(req.body);
  await newAccount.save();
  req.flash("success", "Creating a new account successfully !");
  res.redirect(`/${system.prefixAdmin}/accounts`);
};
