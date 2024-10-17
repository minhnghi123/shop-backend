const User = require("../../models/user.model");
module.exports.user = async (req, res, next) => {
  if (req.cookies.userToken) {
    const exsitedUser = await User.findOne({
      token: req.cookies.userToken,
      deleted: false,
      status: "active",
    });
    if (exsitedUser) {
      res.locals.user = exsitedUser;
    }
  }
  next();
};
