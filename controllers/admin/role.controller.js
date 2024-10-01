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
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Create Role Page",
  });
};
module.exports.createPost = async (req, res) => {
  // console.log(req.body);
  const newRole = new Role(req.body);
  await newRole.save();
  req.flash("success", "Creating new role successfully !");
  res.redirect("back");
};
