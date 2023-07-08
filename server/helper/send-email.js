import Mailjet from "node-mailjet";
import { mailjetAPIKey, mailjetSecretKey } from "../config.js";
const mailjet = Mailjet.apiConnect(
  mailjetAPIKey,
  mailjetSecretKey
);
export function sendVerifyAcc(userId, email) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "daohuy137@gmail.com",
          Name: "MyShop",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Verify account!",
        HTMLPart: `
        <p>Bạn nhận được yêu cầu xác nhận tài khoản</p>
        <p>Nhấn vào <a href="http://localhost:8080/auth/verify/${userId}">link</a> để xác nhận tài khoản</p>
      `,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
}
export function sendResetPass(email, password) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "daohuy137@gmail.com",
          Name: "MyShop",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Verify account!",
        HTMLPart: `
        <p>Mật khẩu mới của bạn là: ${password}</p>
      `,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
}
