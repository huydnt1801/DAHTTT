import Product from "../models/product.js";
import Cart from "../models/cart.js";
import User from "../models/user.js";

export async function getProducts(req, res) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function addProduct(req, res) {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    if (title == "") return res.status(400).json("Vui lòng nhập tên sản phẩm");
    if (imageUrl == "")
      return res.status(400).json("Vui lòng nhập ảnh sản phẩm");
    if (price == 0) return res.status(400).json("Vui lòng nhập giá sản phẩm");
    if (description == "")
      return res.status(400).json("Vui lòng nhập giới thiệu sản phẩm");

    if (!Number.isInteger(price))
      return res.status(400).json("Sai định dạng giá sản phẩm");
    if (price < 0) return res.status(400).json("Giá không được là số âm");

    const userId = req.userId;
    var user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json("Không tìm thấy tài khoản");

    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      sellerId: userId,
    });
    await product.save();

    return res.status(201).json("Thêm sản phẩm thành công");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function editProduct(req, res) {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    if (title == "") return res.status(400).json("Vui lòng nhập tên sản phẩm");
    if (imageUrl == "")
      return res.status(400).json("Vui lòng nhập ảnh sản phẩm");
    if (price == 0) return res.status(400).json("Vui lòng nhập giá sản phẩm");
    if (description == "")
      return res.status(400).json("Vui lòng nhập giới thiệu sản phẩm");

    if (!Number.isInteger(price))
      return res.status(400).json("Sai định dạng giá sản phẩm");
    if (price < 0) return res.status(400).json("Giá không được là số âm");

    const productId = req.params.productId;
    const product = await Product.findOne({ _id: productId });
    if (!product) return res.status(404).json("Không tìm thấy sản phẩm");

    if (req.userId != product.sellerId)
      return res.status(403).json("Bạn không có quyền chỉnh sửa sản phẩm");

    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    await product.save();

    return res.status(201).json("Sửa sản phẩm thành công");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function deleteProduct(req, res) {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ _id: productId });
    if (!product) return res.status(404).json("Không tìm thấy sản phẩm");

    if (req.userId != product.sellerId)
      return res.status(403).json("Bạn không có quyền xóa sản phẩm");

    await Cart.deleteMany({ productId: productId });
    await Product.deleteOne({ _id: productId });

    return res.status(201).json("Xóa sản phẩm thành công");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
