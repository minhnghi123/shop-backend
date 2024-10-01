const Role = require("../../models/role.model");
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/roles/index", {
    pageTitle: "Role Page",
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
module.exports.edit = async (req, res) => {
  const role = await Role.findOne({ _id: req.params.id });
  // console.log(role);
  res.render("admin/pages/roles/edit", {
    pageTitle: "Editing Roles",
    role,
  });
};
module.exports.editPatch = async (req, res) => {
  await Role.updateOne({ _id: req.params.id }, req.body);
  req.flash("success", "Updating new role successfully !");
  res.redirect("back");
};
