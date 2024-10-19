const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const sendMailHelper = require("../../helpers/sendMail.helper.js");
// var total = 0;
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
    item.discountPercentage = infoItem.discountPercentage;
    if (infoItem.discountPercentage > 0) {
      item.priceNew = (1 - infoItem.discountPercentage / 100) * infoItem.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
    item.total = item.priceNew * item.quantity;
    total += item.total;
    orderInfo.products.push(item);
  }
  console.log(orderInfo);
  // console.log(orderInfo);
  const subject = "Đặt hàng thành công";
  const text = `<div style="margin: 1rem 0;">
  <div style="text-align: center; margin-bottom: 1rem;">
    <h2 style="color: #28a745;">Đặt hàng thành công</h2>
  </div>

  <div style="margin-bottom: 1rem;">
    <div style="color: #155724; background-color: #d4edda; border: 1px solid #c3e6cb; padding: 0.75rem 1.25rem; border-radius: 0.25rem;">
      Chúc mừng bạn đã đặt hàng thành công! Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.
    </div>
  </div>

  <div style="margin-bottom: 1rem;">
    <h4 style="margin-bottom: 1rem;">Thông tin cá nhân</h4>
    <table style="width: 100%; border-collapse: collapse; border: 2px solid #28a745;">
      <tbody>
        <tr>
          <td style="border: 1px solid #28a745; padding: 8px;">Họ tên</td>
          <td style="border: 1px solid #28a745; padding: 8px;"><b>${
            orderInfo.username
          }</b></td>
        </tr>
        <tr>
          <td style="border: 1px solid #28a745; padding: 8px;">Số điện thoại</td>
          <td style="border: 1px solid #28a745; padding: 8px;"><b>${
            orderInfo.SDT
          }</b></td>
        </tr>
        <tr>
          <td style="border: 1px solid #28a745; padding: 8px;">Địa chỉ</td>
          <td style="border: 1px solid #28a745; padding: 8px;"><b>${
            orderInfo.address
          }</b></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="margin-bottom: 1rem;">
    <h4 style="margin-bottom: 1rem;">Thông tin sản phẩm</h4>
    <table style="width: 100%; border-collapse: collapse; border: 2px solid #28a745;">
      <thead>
        <tr style="background-color: #28a745; color: white;">
          <th style="border: 1px solid #28a745; padding: 8px;">STT</th>
          <th style="border: 1px solid #28a745; padding: 8px;">Ảnh</th>
          <th style="border: 1px solid #28a745; padding: 8px;">Tên</th>
          <th style="border: 1px solid #28a745; padding: 8px;">Giá</th>
          <th style="border: 1px solid #28a745; padding: 8px;">Số lượng</th>
          <th style="border: 1px solid #28a745; padding: 8px;">Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        ${orderInfo.products
          .map(
            (item, index) => `
        <tr>
          <td style="border: 1px solid #28a745; padding: 8px;">${index + 1}</td>
          <td style="border: 1px solid #28a745; padding: 8px;">
            <img src="${item.thumbnail}" alt="${
              item.title
            }" style="width: 80px;" />
          </td>
          <td style="border: 1px solid #28a745; padding: 8px;">
            <a href="/products/detail/${item.slug}" style="color: #28a745;">${
              item.title
            }</a>
          </td>
          <td style="border: 1px solid #28a745; padding: 8px;">${
            item.priceNew
          }đ</td>
          <td style="border: 1px solid #28a745; padding: 8px;">${
            item.quantity
          }</td>
          <td style="border: 1px solid #28a745; padding: 8px;">${item.total.toLocaleString()}đ</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <h3 style="text-align: right; color: #28a745;">Tổng đơn hàng: ${total.toLocaleString()}đ</h3>
  </div>
</div>`;

  sendMailHelper.sendMail(orderInfo.email, subject, text);
  const newOrder = new Order(orderInfo);
  await newOrder.save();
  await Cart.updateOne(
    { _id: req.cookies.cartId },
    {
      $set: {
        products: [],
      },
    }
  );

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
    // item.priceNew = item.price;
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
