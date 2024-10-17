const md5 = require("md5");
const generateToken = require("../../helpers/generate.helper");
const User = require("../../models/user.model");
const randomNumber = require("../../helpers/generateNumber.helper.js");
const forgotPassWord = require("../../models/forgot-password.model.js");
const sendMailHelper = require("../../helpers/sendMail.helper.js");
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
module.exports.logout = async (req, res) => {
  res.clearCookie("userToken");
  req.flash("success", "Đăng xuất thành công");
  res.redirect("/user/login");
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
module.exports.forgot = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Quên mật khẩu ",
  });
};
module.exports.forgotPost = async (req, res) => {
  const existedUser = await User.findOne({
    email: req.body.email,
    deleted: false,
    status: "active",
  });
  if (!existedUser) {
    req.flash("error", "Tài khoản không tồn tại");
    res.redirect("back");
    return;
  }
  const existedEmailInForgotPassword = await forgotPassWord.findOne({
    email: req.body.email,
  });
  if (!existedEmailInForgotPassword) {
    const dataInfo = {
      email: req.body.email,
      otp: randomNumber.generateRandomString(6),
      expireAt: Date.now() + 3 * 60 * 1000,
    };
    const newForgot = new forgotPassWord(dataInfo);
    await newForgot.save();
    const subject = "Xác thực mã OTP";
    const text = `Mã xác thực của bạn là <b>${dataInfo.otp}</b>. Mã OTP có hiệu lực trong vòng 3 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
    sendMailHelper.sendMail(dataInfo.email, subject, text);
  }

  res.redirect(`/user/password/send-otp?email=${req.body.email}`);
};
module.exports.sendOtp = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/sendOtp.pug", {
    pageTitle: "Gửi OTP",
    email: email,
  });
};
module.exports.sendOtpPost = async (req, res) => {
  const existedAccountInForgotPassword = await forgotPassWord.findOne({
    email: req.body.email,
    otp: req.body.otp,
  });
  if (!existedAccountInForgotPassword) {
    req.flash("error", "OTP không chính xác! Vui lòng nhập lại ");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: req.body.email,
  });
  res.cookie("userToken", user.token);
  res.redirect("/user/password/reset");
};
module.exports.reset = async (req, res) => {
  res.render("client/pages/user/reset.pug", {
    pageTitle: "Reset mật khẩu",
  });
};
module.exports.resetPost = async (req, res) => {
  if (req.body.password != req.body.repassword) {
    req.flash("error", "Mật khẩu nhập không trùng khớp !");
    res.redirect("back");
    return;
  }
  const token = req.cookies.userToken;
  await User.updateOne(
    {
      token: token,
    },
    {
      password: md5(req.body.password),
    }
  );
  req.flash("success", "Đổi mật khẩu thành công !");
  res.redirect("/user/login");
};
