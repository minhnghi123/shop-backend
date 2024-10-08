const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const categoryMiddleWare = require("../../middleware/client/category.middleware");
module.exports.routeClient = (app) => {
  app.use(categoryMiddleWare.getAllCategory);
  app.use("/", homeRoute);
  app.use("/products", productRoute);
};
