const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
module.exports.index = async (req, res) => {
  const cart = await Cart.findOne({
    _id: req.cookies.cartId,
  });
  //   console.log(cart);
  const products = cart.products;
  // console.log(products);
  let total = 0;

  for (const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId,
      deleted: false,
      status: "active",
    });
    // if (infoItem != null) console.log(infoItem.thumbnail);
    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;
    item.priceNew = infoItem.price;
    if (infoItem.discountPercentage > 0) {
      item.priceNew = (1 - infoItem.discountPercentage / 100) * infoItem.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
    item.total = item.priceNew * item.quantity;
    total += item.total;
  }
  res.render("client/pages/order/index.pug", {
    products: products,
    total: total,
  });
};
module.exports.indexPost = async (req, res) => {
  const currentCart = await Cart.findOne({
    _id: req.cookies.cartId,
  });
  //   console.log(currentCart);
  const orderInfo = {
    username: req.body.username,
    email: req.body.email,
    SDT: req.body.SDT,
    address: req.body.address,
    payment: req.body.payment,
    products: [],
  };
  let products = currentCart.products;
  for (const product of products) {
    const detailProduct = await Product.findOne({
      _id: product.productId,
      status: "active",
      deleted: false,
    });
    const specificProduct = {
      productId: product.productId,
      price: detailProduct.price,
      discountPercentage: detailProduct.discountPercentage,
      quantity: product.quantity,
    };
    orderInfo.products.push(specificProduct);
  }
  const newOrder = new Order(orderInfo);
  await newOrder.save();
  products = [];
  res.redirect(`/order/success/${newOrder.id}`);
};
module.exports.success = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({
    _id: orderId,
  });
  let total = 0;
  for (const item of order.products) {
    const infoItem = await Product.findOne({
      _id: item.productId,
    });
    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;
    item.priceNew = item.price;
    if (item.discountPercentage > 0) {
      item.priceNew = (1 - item.discountPercentage / 100) * item.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
    item.total = item.priceNew * item.quantity;
    total += item.total;
  }
  res.render("client/pages/order/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
    total: total,
  });
};
