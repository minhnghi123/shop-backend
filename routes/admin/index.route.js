const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const roleRoute = require("./role.route");
const systemConfig = require("../../config/system");
const productCategoryRoute = require("./product-category.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const authMiddleWare = require("../../middleware/admin/auth.middleware");
module.exports.routeAdmin = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(
    `/${PATH_ADMIN}/dashboard`,
    authMiddleWare.requireAuth,
    dashboardRoute
  );
  app.use(`/${PATH_ADMIN}/products`, authMiddleWare.requireAuth, productRoute);
  app.use(
    `/${PATH_ADMIN}/products-category`,
    authMiddleWare.requireAuth,
    productCategoryRoute
  );
  app.use(`/${PATH_ADMIN}/roles`, authMiddleWare.requireAuth, roleRoute);
  app.use(`/${PATH_ADMIN}/accounts`, authMiddleWare.requireAuth, accountRoute);
  app.use(`/${PATH_ADMIN}/auth`, authRoute);
};
