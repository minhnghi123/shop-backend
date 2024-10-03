const Role = require("../../models/role.model");

module.exports.index = (req, res) => {
  res.render("admin/pages/accounts/index", {
    pageTitle: "Home Page",
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
