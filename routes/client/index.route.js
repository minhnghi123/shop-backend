const productRoute = require("./product.route");
const homeRoute = require("./home.route");
module.exports.routeClient = (app) => {
  app.use("/", homeRoute);
  app.use("/products", productRoute);
};
