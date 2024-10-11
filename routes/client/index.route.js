const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const cartRoute = require("./cart.route");
const categoryMiddleWare = require("../../middleware/client/category.middleware");
const cartMiddleWare = require("../../middleware/client/cart.middleware");
module.exports.routeClient = (app) => {
  app.use(categoryMiddleWare.getAllCategory);
  app.use(cartMiddleWare.cart);
  app.use("/", homeRoute);
  app.use("/products", productRoute);
  app.use("/cart", cartRoute);
};
