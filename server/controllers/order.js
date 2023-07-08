import mongoose from "mongoose";
import Cart from "../models/cart.js";
import OrderItem from "../models/order-item.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

export async function getOrder(req, res) {
  try {
    const userId = req.userId;
    const order = await Order.find({ userId: userId });
    var result = [];
    for (let ord of order) {
      const products = await OrderItem.find({ orderId: ord._id });
      result.push({
        products: products,
        attribute: ord,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(err);
    return res.status(500).json(error);
  }
}

export async function addOrder(req, res) {
  try {
    const userId = req.userId;
    const cart = await Cart.find({ userId: userId });
    if (cart.length != 0) {
      const order = await new Order({
        userId: userId,
      });

      let price = 0;
      for (const prod of cart) {
        let product = await Product.findOne({ _id: prod.productId });
        let orderItem = await new OrderItem({
          orderId: mongoose.Types.ObjectId(order._id),
          sellerId: mongoose.Types.ObjectId(product.sellerId),
          productId: mongoose.Types.ObjectId(prod.productId),
          quantity: prod.quantity,
        });
        await orderItem.save();
        price += product.price * prod.quantity;
      }
      order.price = price;
      await order.save();

      await Cart.deleteMany({ userId: userId });
    } else return res.status(400).json("Không có sản phẩm trong giỏ hàng");
    return res.status(201).json("Đặt hàng thành công");
  } catch (error) {
    console.log(err);
    return res.status(500).json(error);
  }
}
