const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
module.exports.checkCart = async (req, res, next) => {
  if (!req.cookies.userToken) {
    req.flash("error", "Yêu cầu đăng nhập !");
    res.redirect("/user/login");
    return;
  }
  next();
};
module.exports.cart = async (req, res, next) => {
  if (!req.cookies.userToken) {
    res.locals.miniCart = 0;
  } else {
    const user = await User.findOne({
      token: req.cookies.userToken,
      deleted: false,
      status: "active",
    });
    const userCart = await Cart.findOne({
      userId: user.id,
    });
    if (!userCart) {
      const newCart = new Cart({
        userId: user.id,
        product: [],
      });
      await newCart.save();
      res.locals.miniCart = 0;
      res.cookie("cartId", newCart.id);
    } else {
      res.locals.miniCart = userCart.products.length;
      res.cookie("cartId", userCart.id);
    }
  }
  next();
};
