import Product from "../models/product.js";
import OrderItem from "../models/order-item.js";

export async function getProducts(req, res) {
  try {
    const products = await Product.find({ sellerId: req.userId });
    var prods = [];
    for (const prod of products) prods.push(prod._id);

    return res.status(200).json(prods);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await OrderItem.find({ sellerId: req.userId });

    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function changeStatusProduct(req, res) {
  try {
    const orderItemId = req.params.orderItemId;
    const status = req.body.status;
    const item = await OrderItem.findOne({ _id: orderItemId });
    if (item.sellerId != req.userId)
      return res.status(403).json("Bạn không có quyền xác nhận sản phẩm");
    item.status = status;
    await item.save();

    return res.status(200).json("Xác nhận sản phẩm thành công");
  } catch (error) {
    console.log(err);
    return res.status(500).json(error);
  }
}
