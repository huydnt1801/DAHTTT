import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { compare, genSalt, hash } from "bcrypt";
import { sceret } from "../config.js";
import { sendResetPass, sendVerifyAcc } from "../helper/send-email.js";

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validatePassword(password) {
  return /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\;:\'",.<>/?]{6,16}$/.test(password);
}

export async function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!validateEmail(email))
      return res.status(400).json("Email không hợp lệ");
    if (!validatePassword(password))
      return res.status(400).json("Mật khẩu không hợp lệ");

    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).json("Không tìm thấy tài khoản");

    const validPassword = await compare(password, user.password);
    if (!validPassword) return res.status(400).json("Sai mật khẩu");

    if (!user.verify) return res.status(400).json("Tài khoản chưa xác nhận");
    const token = jwt.sign({ id: user._id }, sceret);
    await user.save();
    user.password = undefined;
    const clonedUser = JSON.parse(JSON.stringify(user));
    clonedUser.token = token;
    return res.status(200).json(clonedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function logout(req, res) {
  try {
    return res.status(200).json({ token: null });
  } catch (error) {
    console.log(err);
    return res.status(500).json(error);
  }
}

export async function register(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const place = req.body.place;

    if (!validateEmail(email))
      return res.status(400).json("Email không hợp lệ");
    if (!validatePassword(password))
      return res.status(400).json("Mật khẩu không hợp lệ");
    if (fullName == "") return res.status(400).json("Tên không hợp lệ");
    if (place == "") return res.status(400).json("Địa chỉ không hợp lệ");

    const findUser = await User.findOne({ email: email });
    if (findUser) return res.status(404).json("Email đã được sử dụng");

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      fullName: fullName,
      place: place,
    });
    await newUser.save();

    sendVerifyAcc(newUser._id, email);
    return res.status(200).json("Đăng ký thành công");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function editProfile(req, res) {
  try {
    const fullName = req.body.fullName;
    const place = req.body.place;
    const userId = req.params.userId;

    if (fullName == "") return res.status(400).json("Tên không hợp lệ");
    if (place == "") return res.status(400).json("Địa chỉ không hợp lệ");

    if (userId != req.userId)
      return res.status(403).json("Không có quyền truy cập");

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json("Không tìm thấy tài khoản");

    user.fullName = fullName;
    user.place = place;
    await user.save();

    user.password = undefined;
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    req.status(500).json(err);
  }
}

function makePassword(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export async function forgotPassword(req, res) {
  try {
    const email = req.body.email;
    if (!validateEmail(email))
      return res.status(400).json("Email không hợp lệ");

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json("Email chưa được đăng ký");

    const newPass = makePassword(6);
    const salt = await genSalt(10);
    const hashedPassword = await hash(newPass, salt);
    user.password = hashedPassword;
    user.verify = true;
    await user.save();
    sendResetPass(email, newPass);
    return res.status(201).json("Vui lòng kiểm tra email của bạn");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function changePassword(req, res) {
  try {
    const password = req.body.password;
    if (!validatePassword(password))
      return res.status(400).json("Mật khẩu không hợp lệ");

    const userId = req.params.userId;

    if (userId != req.userId)
      return res.status(403).json("Không có quyền truy cập");

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json("Email chưa được đăng ký");

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    user.password = hashedPassword;
    user.save();

    return res.status(201).json("Đổi mật khẩu thành công");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function verifyAcc(req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json("Email chưa được đăng ký");

    user.verify = true;
    user.save();
    return res.redirect("http://localhost:3000/login");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export async function accInfo(req, res) {
  const userId = req.userId;
  try {
    var user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json("Không tìm thấy tài khoản");

    user.password = undefined;
    const clonedUser = JSON.parse(JSON.stringify(user));
    clonedUser.token = req.token;
    return res.status(200).json(clonedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
