const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");
const userRoute = require("./user.route");
const notificationRoute = require("./notification.route");
const categoryMiddleWare = require("../../middleware/client/category.middleware");
const cartMiddleWare = require("../../middleware/client/cart.middleware");
const userMiddleWare = require("../../middleware/client/user.middleware");
module.exports.routeClient = (app) => {
  app.use(categoryMiddleWare.getAllCategory);
  app.use(cartMiddleWare.cart);
  app.use(userMiddleWare.user);
  app.use("/", homeRoute);
  app.use("/products", productRoute);
  app.use("/cart", cartMiddleWare.checkCart, cartRoute);
  app.use("/order", orderRoute);
  app.use("/user", userRoute);
  app.use("/notification", notificationRoute);
  app.get("*", (req, res) => {
    res.render("client/pages/error/index", {});
  });
};
