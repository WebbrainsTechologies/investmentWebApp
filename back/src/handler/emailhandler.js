// require("dotenv").config();
// const nodemailer = require("nodemailer");
// let AWS = require("aws-sdk");

// // class EmailHandler {
// //   async sendEmail(email, body, subject, attachments = []) {
// //     AWS.config.update({
// //       accessKeyId: process.env.SES_ACCESSKEY_ID,
// //       secretAccessKey: process.env.SES_SECRET_KEY,
// //       region: process.env.SES_REGION,
// //     });

// //     const transporter = nodemailer.createTransport({
// //       SES: new AWS.SES({
// //         // apiVersion: "2010-12-01",
// //       }),
// //     });

// //     console.log(transporter, "testingmail");
// //     transporter.verify(function (error, success) {
// //       console.log(error, success);
// //       if (error) {
// //         console.log(error);
// //       } else {
// //         console.log("Server is ready to take our messages");
// //       }
// //     });
// //     const mailOptions = {
// //       from: "suryarathod315@gmail.com",
// //       to: email,
// //       subject,
// //       html: body,
// //     };
// //     if (attachments.length > 0) {
// //       mailOptions["attachments"] = attachments;
// //     }
// //     await transporter.sendMail(mailOptions).then(
// //       (result) => {
// //         console.log("email sucuess:: ", result);
// //         return result;
// //       },
// //       (error) => {
// //         console.log("email error:: ", error);
// //         return error;
// //       }
// //     );
// //   }
// // }

// module.exports = new EmailHandler();

require("dotenv").config();
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const CryptoJS = require("crypto-js");
const responseHandler = require("./responsehandler");
const MessageConstant = require("../constant/messageconstant");

class EmailHandler {
  async sendEmail(email, body, subject, cc = "", attachments, user1, res) {
    try {
      // Decode the String
      // console.log( user1);
      // let smtp_password = CryptoJS.AES.decrypt(
      //   user1.smtp_password,
      //   "secret key 123"
      // );
      // let decrpted_smtp_password = smtp_password.toString(CryptoJS.enc.Utf8);
      const transporter = nodemailer.createTransport(
        smtpTransport({
          host: process.env.SMTP_HOST,
          secure: false,
          port: process.env.SMTP_PORT,
          // secureConnection: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          // tls: {
          // do not fail on invalid certs
          // rejectUnauthorized: false,
          // ciphers:'SSLv3'
          // },
        })
      );
      let a;

      transporter.verify(function (error, success) {
        if (error) {
          console.log(error, success);
          return false;
          // return responseHandler.errorResponse(
          //   res,
          //   400,
          //   MessageConstant.INVALID_SMTP_DETAILS,
          //   []
          // );
        } else {
          console.log("Server is ready to take our messages");
        }
      });
      // console.log("transporter", a);
      const mailOptions = {
        from: process.env.SMTP_MAIL_FROM,
        to: email,
        subject,
        html: body,
      };
      if (attachments.length > 0) {
        mailOptions["attachments"] = attachments;
      }

      if (cc != "") {
        mailOptions["cc"] = cc;
      }
      await transporter.sendMail(mailOptions).then(
        (result) => {
          // console.log(result, "check118");
          console.log("email success:: ", result.accepted);
          return result;
        },
        (error) => {
          console.log("email error:: ", error);
          return false;
        }
      );
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
module.exports = new EmailHandler();
