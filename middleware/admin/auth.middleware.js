const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const user = await Account.findOne({
    deleted: false,
    status: "active",
    token: req.cookies.token,
  });
  const role = await Role.findOne({
    deleted: false,
    _id: user.role_id,
  });
  if (!user) {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  res.locals.user = user;
  res.locals.role = role;
  next();
};
