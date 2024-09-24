module.exports.createPost = async (req, res, next) => {
  const content = req.body;
  //validate data manually!
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (!req.body.title) {
    req.flash("error", "Vui Lòng Ghi Tiêu Đề");
    res.redirect("back");
    return;
  }
  if (req.body.title.length < 5) {
    req.flash("error", "Tiêu đề ít nhất là 5 ký tự!");
    res.redirect("back");
    return;
  }
  next();
};
