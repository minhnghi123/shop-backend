const Role = require("../../models/role.model");
module.exports.createPost = async (req, res, next) => {
  //validate data manually!
  const role = await Role.find({
    title: req.body.title,
    deleted: false,
  });
  console.log(role);
  if (role.length > 0) {
    req.flash("error", "The role existed ! Please creating another one");
    res.redirect("back");
    return;
  }
  if (!req.body.title) {
    req.flash("error", "Vui Lòng Ghi Tiêu Đề");
    res.redirect("back");
    return;
  }
  if (req.body.title.length < 5) {
    req.flash("error", "The title was very short !");
    res.redirect("back");
    return;
  }
  next();
};
