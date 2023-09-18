const UserDao = require("../../dao/userDao");
const MessageConstant = require("../../constant/messageconstant");
const Userhelper = require("../../helper/userhelper");
const utility = require("../../lib/utility");
const bcrypt = require("bcryptjs");
const forgetpswHtmlString = require("../../emailer/forgetpassword");
require("dotenv").config();
const emailHandler = require("../../handler/emailhandler");
const crypto = require("crypto");
const User = require("../../modal/User/user");
const moment = require("moment");
const ResendOtpTemplate = require("../../emailTemplates/ResendOtpTemplate");
const UserToken = require("../../modal/User/userToken");
// const messages = require("../helper/messages");

class Superadminservices {
  constructor() {}
  async superadminlogin(payload, res) {
    try {
      Userhelper.checkAdminUser(payload);
      let user = await UserDao.findUserDetails({
        email: payload.email,
        // is_superadmin: true,
      });
      if (user?.is_delete) {
        throw new Error(MessageConstant.USER_NOT_REGISTERED);
      }
      if (!user) {
        throw new Error(MessageConstant.USER_NOT_REGISTERED);
      } else {
        const comparePassword = await Userhelper.comparePassword(
          payload.password,
          user.password
        );
        if (!comparePassword) {
          throw new Error(MessageConstant.INVALID_DETAILS);
        }
        if (!user.is_otp_verified) {
          throw new Error("First verify your email address");
        }
        const is_login = true;
        const token = utility.generateJwtToken(user._id);
        const otp = Math.floor(1000 + Math.random() * 9000);
        // const otp = 1234;
        console.log(otp, "checkotp81");
        let body = await ResendOtpTemplate.MailSent({
          username: user.name,
          otp: otp,
        });
        await emailHandler.sendEmail(
          payload.email,
          body,
          "Login Otp",
          "",
          [],
          "",
          res
        );
        const updateUser = await UserDao.findAndUpdateUser(user._id, {
          is_login,
          token,
          otp,
        });
        // const tokenAdded = await UserToken.create({
        //   user_id: user._id,
        //   token: token,
        // });

        user = { ...user._doc, token: token };
        return user;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async superadminlogout(payload) {
    const is_login = false;
    const token = "";
    const user = await UserDao.findUserDetails({
      _id: payload._id,
    });
    if (user) {
      const updateUser = await UserDao.findAndUpdateUser(payload._id, {
        is_login,
      });
      // const removetoken = await UserToken.deleteMany({ user_id: payload._id });
      return updateUser;
    } else {
      throw new Error(MessageConstant.WRONG_ID);
    }
  }

  async forgetPassword(request_data, res) {
    try {
      const user = await UserDao.findUserDetails({
        email: request_data.email,
        // is_superadmin: true,
      });
      const user1 = await UserDao.findUserDetails({
        is_superadmin: true,
      });
      if (!user) {
        return false;
      }
      var link = process.env.BASE_URL_ADMIN;
      var current_date = new Date().valueOf().toString();
      var random = Math.random().toString();
      let reset_password_token = crypto
        .createHash("sha1")
        .update(current_date + random)
        .digest("hex");

      const body = forgetpswHtmlString.Forgetpassword(
        link + "/admin/resetpassword/" + reset_password_token
      );
      ///// email of admin is used to send email to////

      await emailHandler.sendEmail(
        user.email,
        body,
        "Forget password",
        "",
        [],
        user1,
        res
      );

      let reset_token_data = {
        reset_tokens: {
          reset_password_token: {
            token: reset_password_token,
            expiry: moment().add(1440, "minutes"),
          },
        },
      };
      await User.find({ _id: user._id }).update(reset_token_data);
      return true;
    } catch (error) {
      console.log(error, "checkerror");
      throw new Error(error);
    }
  }

  async resetpassword(payload, user) {
    // const user = await UserDao.findUserDetails({
    //     is_admin: true
    // });

    const salt = await bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hashSync(payload.new_password, salt);
    const password = hash;
    const updateUserPassword = await UserDao.findAndUpdateUser(user._id, {
      password,
    });
    return true;
  }

  // reset password for user with authentication
  // async resetUserpassword(payload) {
  //   let user1;
  //   // if (payload.type === 0) {
  //   user1 = await UserDao.newpassword({
  //     _id: payload._id,
  //   });
  //   // }
  //   const user = user1[0];
  //   // console.log(taxi);
  //   if (!user) {
  //     throw new Error(MessageConstant.USER_NOT_REGISTERED);
  //   } else {
  //     const data = await bcrypt.compare(
  //       payload.current_password,
  //       user.password
  //     );
  //     if (data == false) {
  //       throw new Error(MessageConstant.CURRENT_PASSWORD);
  //     }
  //     const salt = await bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
  //     const hash = await bcrypt.hashSync(payload.new_password, salt);
  //     const updatepassword = await UserDao.findAndUpdateUser(payload._id, {
  //       password: hash,
  //     });
  //     return true;
  //   }
  // }
}

module.exports = new Superadminservices();
