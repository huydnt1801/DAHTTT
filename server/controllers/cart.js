import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

export async function getCart(req, res) {
  try {
    const userId = req.userId;
    const cart = await Cart.find({ userId: userId });

    return res.status(200).json(cart);
  } catch (error) {
    console.log(err);
    return res.status(500).json(error);
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.userId;
    const productId = req.body.productId;

    let owner = await Product.findOne({ sellerId: userId, _id: productId });
    if (owner) {
      return res.status(400).json("Không thể mua sản phẩm của bạn");
    }
    let cart = await Cart.findOne({ userId: userId, productId: productId });
    if (cart) cart.quantity = cart.quantity + 1;
    else
      cart = new Cart({
        userId: mongoose.Types.ObjectId(userId),
        productId: mongoose.Types.ObjectId(productId),
      });
    await cart.save();

    return res.status(201).json("Thêm vào giỏ hàng thành công");
  } catch (error) {
    console.log(err);
    return res.status(500).json(error);
  }
}

export async function removeFromCart(req, res) {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    await Cart.deleteOne({ userId: userId, productId: productId });

    return res.status(200).json("Xóa khỏi giỏ hàng thành công");
  } catch (error) {
    console.log(err);
    return res.status(500).json(error);
  }
}
