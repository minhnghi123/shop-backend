const md5 = require("md5");
const generateToken = require("../../helpers/generate.helper");
const User = require("../../models/user.model");
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký",
  });
};
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng Nhập",
  });
};
module.exports.registerPost = async (req, res) => {
  //   console.log(req.body);
  if (req.body.password != req.body.rePassword) {
    req.flash("error", "Mật khẩu không trùng khớp");
    res.redirect("back");
    return;
  }
  req.body.token = generateToken.generateRandomString(30);
  const infoData = {
    username: req.body.username,
    email: req.body.email,
    password: md5(req.body.password),
    token: req.body.token,
    phone: req.body.phone,
  };
  const newUser = new User(infoData);
  await newUser.save();
  req.flash("success", "Đăng ký thành công !");
  res.redirect("/user/login");
};
module.exports.loginPost = async (req, res) => {
  const existedUser = await User.findOne({
    email: req.body.email,
    deleted: false,
    status: "active",
  });
  if (!existedUser) {
    req.flash("error", "Tài khoản chưa được đăng ký");
    res.redirect("back");
    return;
  }
  if (existedUser.password != md5(req.body.password)) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }
  res.cookie("userToken", existedUser.token);
  req.flash(
    "success",
    `Chào mừng ${existedUser.username} đến với shop của chúng tôi ^.^`
  );
  res.redirect("/");
};
