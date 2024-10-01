const Role = require("../../models/role.model");
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/roles/index", {
    pageTitle: "Home Page",
    records,
  });
};
