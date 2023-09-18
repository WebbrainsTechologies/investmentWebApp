const mongoose = require("mongoose");
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
const responseHandler = require("../../handler/responsehandler");
const generatePassword = require("../../helper/randomPassword");
const { sequenceGenerator } = require("../../helper/userhelper");
const user_token = require("../../modal/User/userToken");
const { log } = require("util");
const fs = require("fs");
const RegisterEmailTemplate = require("../../emailTemplates/RegisterEmailTemplate");
const userToken = require("../../modal/User/userToken");
const userSubscription = require("../../modal/UserSubscription/userSubscription");
const ResendOtpTemplate = require("../../emailTemplates/ResendOtpTemplate");
const userWalletSchema = require("../../modal/UserWallet/userwallet");
const FuturePaymentSchema = require("../../modal/FuturePayment/futurePayment");
const futurePayment = require("../../modal/FuturePayment/futurePayment");
const ObjectId = require("mongodb").ObjectId;

class userProfileService {
  constructor() {}

  // new user register
  async userRegister(payload, res) {
    try {
      let email = payload.email;
      let phone = payload.phone_number;
      // console.log(email, "checkemail");
      const userEmail = await User.findOne({
        email: email,
      }).lean(); // Finding Email
      // console.log(userEmail, "check31");
      if (userEmail) {
        return "Email Exist";
      }
      // const userPhone = await User.findOne({
      //   is_delete: false,
      //   phone_number: phone,
      // }).lean();

      // if (userPhone) {
      //   return "Phone Exist";
      // }
      let referral_user_id;
      // console.log(payload.referral_code, "check52");
      if (payload.referral_code) {
        const isReferralExist = await User.findOne({
          is_delete: false,
          referral_code: Number(payload.referral_code),
        });
        if (isReferralExist) {
          referral_user_id = isReferralExist._id;
        } else {
          return "Invlid Referral code";
        }
      }
      const getRandomNumber = () => {
        // Generate a random 6-digit number
        const min = 100000; // Minimum value (inclusive)
        const max = 999999; // Maximum value (inclusive)
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      const generateUniqueReferralCode = async () => {
        const referralCode = getRandomNumber();
        const referralExist = await User.findOne({
          referral_code: referralCode,
        });
        if (referralExist) {
          // Referral code already exists, generate a new one
          return generateUniqueReferralCode();
        }
        return referralCode;
      };
      const uniqueReferralCode = await generateUniqueReferralCode();
      const hash = await bcrypt.hash(payload.password, 8);

      const otp = Math.floor(1000 + Math.random() * 9000);
      // const otp = 1234;
      console.log(otp, "checkotp81");
      const userOtpUpdate = await User.findOneAndUpdate(
        { email: payload.email },
        { otp: otp }
      );
      let body = await ResendOtpTemplate.MailSent({
        username: payload.name,
        otp: otp,
      });
      await emailHandler.sendEmail(
        payload.email,
        body,
        "Register Otp",
        "",
        [],
        "",
        res
      );

      const newUser = await User.create({
        name: payload.name,
        phone_number: payload.phone_number,
        email: payload.email.toLowerCase(),
        password: hash,
        is_superadmin: payload.is_superadmin,
        user_status: payload.user_status,
        permission: payload.permission,
        referral_code: uniqueReferralCode,
        referral_user_id: referral_user_id ? referral_user_id : null,
        country_code: payload.country_code ? payload.country_code : "",
        otp: otp,
      });

      // console.log("payload", newUser);
      return newUser;
    } catch (error) {
      console.log(error);
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // new user register by admin
  async userRegisterByAdmin(payload, res) {
    try {
      let email = payload.email;
      let phone = payload.phone_number;
      // console.log(email, "checkemail");
      const userEmail = await User.findOne({
        email: email,
      }).lean(); // Finding Email
      // console.log(userEmail, "check31");
      if (userEmail) {
        return "Email Exist";
      }
      // const userPhone = await User.findOne({
      //   is_delete: false,
      //   phone_number: phone,
      // }).lean();

      // if (userPhone) {
      //   return "Phone Exist";
      // }

      const getRandomNumber = () => {
        // Generate a random 6-digit number
        const min = 100000; // Minimum value (inclusive)
        const max = 999999; // Maximum value (inclusive)
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      const generateUniqueReferralCode = async () => {
        const referralCode = getRandomNumber();
        const referralExist = await User.findOne({
          referral_code: referralCode,
        });
        if (referralExist) {
          // Referral code already exists, generate a new one
          return generateUniqueReferralCode();
        }
        return referralCode;
      };
      const uniqueReferralCode = await generateUniqueReferralCode();

      const password = await generatePassword();
      payload.password = password;
      const hash = await bcrypt.hash(payload.password, 8);
      const newUser = await User.create({
        name: payload.name,
        phone_number: payload.phone_number,
        email: payload.email.toLowerCase(),
        password: hash,
        is_superadmin: payload.is_superadmin,
        // user_status: payload.user_status,
        is_delete: payload.is_delete,
        referral_user_id: null,
        referral_code: uniqueReferralCode,
        country_code: payload.country_code ? payload.country_code : "",
      });

      let body = await RegisterEmailTemplate.MailSent({
        username: payload.name,
        email: payload.email,
        password: password,
      });

      await emailHandler.sendEmail(
        payload.email,
        body,
        "Login Details",
        "",
        [],
        "",
        res
      );

      // console.log("payload", newUser);

      return newUser;
    } catch (error) {
      console.log(error);
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // update user by admin
  async updateUser(_id, payload, res) {
    try {
      let email = payload.email;
      let phone = payload.phone_number;
      const userEmail = await User.findOne({
        email: email,
        _id: { $ne: _id },
      }).lean(); // Finding Email
      if (userEmail) {
        return "Email Exist";
      }
      // const userPhone = await User.findOne({
      //   is_delete: false,
      //   phone_number: phone,
      //   _id: { $ne: _id },
      // }).lean();

      // if (userPhone) {
      //   return "Phone Exist";
      // }
      const userUpdate = await User.findByIdAndUpdate(
        { _id },
        {
          name: payload.name,
          phone_number: payload.phone_number,
          email: payload.email,
          country_code: payload.country_code,
          is_superadmin: payload.is_superadmin,
          is_delete: payload.is_delete,
        }
      );
      if (payload.is_delete) {
        const removeUserToken = await userToken.deleteMany({ user_id: _id });
        let closedSubscriptionByUserId = await userSubscription.updateMany(
          {
            userId: _id,
            usersubscriptionstatus: "Accepted",
          },
          {
            $set: {
              usersubscriptionstatus: "Cancelled",
              withdrawal_status: "Closed",
            },
          },
          {
            new: true,
          }
        );
        let userCancelledSubscriptionData = await userSubscription.find(
          {
            userId: _id,
            usersubscriptionstatus: "Cancelled",
          },
          { _id: 1 }
        );

        let userSubscriptionId = userCancelledSubscriptionData.map(
          (val) => val._id
        );
        let deleteFututepayment = await futurePayment.deleteMany({
          userSubscriptionId: { $in: userSubscriptionId },
          roi_date: { $gt: moment(new Date()).utc() },
          userId: _id,
        });
      }
      // console.log("payload", userUpdate);

      return userUpdate;
    } catch (error) {
      console.log(error);
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //Update User Profile Details
  async updateUserProfile(id, userData, filename, res) {
    try {
      let userExist = await User.find({
        email: userData.email,
        is_delete: false,
        _id: { $ne: id },
      });

      if (userExist.length >= 1) {
        return userExist.length;
      } else {
        let userDetails = await User.find({});
        filename
          ? (userData = {
              ...userData,
              file_image: filename,
            })
          : (userData = {
              ...userData,
            });

        let data = await User.findByIdAndUpdate(
          { _id: id },
          { ...userData },
          {
            new: true,
          }
        );

        if (filename) {
          if (filename !== userDetails.file_image) {
            if (
              fs.existsSync(
                `${__dirname.replace("/src/service", "")}/${
                  process.env.UPLOAD_DIR
                }/${userDetails.file_image}`
              )
            ) {
              fs.unlinkSync(
                `${process.env.UPLOAD_DIR}/${userDetails.file_image}`
              );
            }
          }
        }
        return data;
      }
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //View User Data
  async getViewUser(_id, user, res) {
    try {
      let data = await User.findById({ _id });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //change user status
  async updateuserstatus(_id, payload, res) {
    try {
      // if (!payload.user_status) {
      //   let subscriptionDetails = await userSubscription.find({
      //     userId: _id,
      //     usersubscriptionstatus: "Accepted",
      //   });
      //   if (subscriptionDetails?.length > 0) {
      //     return "subscription exist";
      //   }
      // }
      let updateUserStatus = await User.findByIdAndUpdate(
        { _id },
        { is_delete: payload.is_delete }
      );
      // if (!payload.is_delete) {
      //   const removeUserToken = await userToken.deleteMany({ user_id: _id });
      // }
      return updateUserStatus;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //delete user
  async deleteUserProfile(_id, res) {
    try {
      // let subscriptionDetails = await userSubscription.find({
      //   userId: _id,
      //   usersubscriptionstatus: "Accepted",
      // });
      let closedSubscriptionByUserId = await userSubscription.updateMany(
        {
          userId: _id,
          usersubscriptionstatus: "Accepted",
        },
        {
          $set: {
            usersubscriptionstatus: "Cancelled",
            withdrawal_status: "Closed",
          },
        }
      );
      let userCancelledSubscriptionData = await userSubscription.find(
        {
          userId: _id,
          usersubscriptionstatus: "Cancelled",
        },
        { _id: 1 }
      );

      let userSubscriptionId = userCancelledSubscriptionData.map(
        (val) => val._id
      );
      let deleteFututepayment = await futurePayment.deleteMany({
        userSubscriptionId: { $in: userSubscriptionId },
        roi_date: { $gt: moment(new Date()).utc() },
        userId: _id,
      });
      // console.log(subscriptionDetails, "checkdetails");
      // if (subscriptionDetails?.length > 0) {
      //   return "subscription exist";
      // }
      let deleteUser = await User.findByIdAndUpdate(
        { _id },
        { is_delete: true }
      );
      // console.log(deleteUser, "check357");
      let removeUserToken = await userToken.deleteMany({ user_id: _id });
      // console.log(removeUserToken, "check359");
      return true;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //get all user
  async getAllUser(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      };
      let search = payload.search;
      let query = {
        is_superadmin: false,
        is_delete: false,
      };
      let data = await User.paginate(query, options);
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //get delted user
  async getDeletedUser(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      };
      let search = payload.search;
      let query = {
        is_superadmin: false,
        is_delete: true,
      };
      let data = await User.paginate(query, options);
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //get all user withoutpagination
  async getAllUserWithoutpagination(payload, res) {
    try {
      let data = await User.find({ is_superadmin: false });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  //get user transaction detail
  async getUserTransactionDetails(_id, payload, res) {
    try {
      let totalInvestmentData = await userSubscription.aggregate([
        {
          $match: {
            userId: ObjectId(_id),
          },
        },
        {
          $group: {
            _id: null,
            totalInvestment: { $sum: "$amount" },
          },
        },
      ]);
      let totalWithdrawData = await userWalletSchema.aggregate([
        {
          $match: {
            userId: ObjectId(_id),
            is_withdraw: true,
          },
        },
        {
          $group: {
            _id: null,
            totalWithdrawal: { $sum: "$amount" },
          },
        },
      ]);
      let userassosiateDate = await User.findById({ _id }, { createdAt: 1 });
      let obj = {
        totalInvestmentData: totalInvestmentData[0]?.totalInvestment
          ? totalInvestmentData[0]?.totalInvestment
          : 0,
        totalWithdrawData: totalWithdrawData[0]?.totalWithdrawal
          ? totalWithdrawData[0]?.totalWithdrawal
          : 0,
        userassosiateDate: userassosiateDate.createdAt,
      };
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // resend otp
  async resendOtp(payload, res) {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      // const otp = 1234;
      console.log(otp, "checkotp", payload?.email?.toLowerCase());
      const userOtpUpdate = await User.findOneAndUpdate(
        { email: payload.email?.toLowerCase() },
        { otp: otp }
      );
      const userName = await User.findOne(
        { email: payload?.email?.toLowerCase() },
        { name: 1 }
      );
      // console.log(userName, "check378");
      let body = await ResendOtpTemplate.MailSent({
        username: userName.name,
        otp: otp,
      });
      console.log(payload.account_verified, "check549");
      await emailHandler.sendEmail(
        payload?.email?.toLowerCase(),
        body,
        payload.account_verified ? "Account verification" : "Resend Otp",
        "",
        [],
        "",
        res
      );

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  // send otp
  async sendOtp(payload, res) {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      // const otp = 1234;
      console.log(otp, "checkotp", payload?.email?.toLowerCase());
      const userOtpUpdate = await User.findOneAndUpdate(
        { email: payload.email?.toLowerCase() },
        { otp: otp }
      );
      const userName = await User.findOne(
        { email: payload?.email?.toLowerCase() },
        { name: 1 }
      );
      // console.log(userName, "check378");
      let body = await ResendOtpTemplate.MailSent({
        username: userName.name,
        otp: otp,
      });
      await emailHandler.sendEmail(
        payload?.email?.toLowerCase(),
        body,
        "Otp for withdrawal",
        "",
        [],
        "",
        res
      );

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  // check otp
  async checkOtp(payload, res) {
    try {
      const userData = await User.findOne(
        { email: payload?.email?.toLowerCase() },
        { otp: 1 }
      );
      var isReffral = false;
      console.log(payload.otp, "check422", userData);
      if (Number(payload?.otp) !== userData?.otp) {
        return false;
      } else {
        let user = {};
        if (payload.page === "Sign Up") {
          let updateUserIsOtpVerified = await User.findOneAndUpdate(
            { email: payload?.email?.toLowerCase() },
            { $set: { is_otp_verified: true } }
          );
        } else {
          let userData = await User.findOne({
            email: payload?.email?.toLowerCase(),
          });
          if (!userData.is_otp_verified) {
            let userUpdate = await User.findOneAndUpdate(
              { email: payload?.email?.toLowerCase() },
              { $set: { is_otp_verified: true } }
            );
            userData = await User.findOne({
              email: payload?.email?.toLowerCase(),
            });
          }
          const token = utility.generateJwtToken(userData._id);
          const tokenAdded = await userToken.create({
            user_id: userData._id,
            token: token,
          });
          let referral_user_id = userData?._id;
          const userReffaralData = await User.findOne({
            referral_user_id: referral_user_id,
          });
          if (userReffaralData && Object.keys(userReffaralData)?.length > 0) {
            isReffral = true;
          }
          user = {
            ...userData?._doc,
            isLogin: true,
            token: token,
            isReffral: isReffral,
          };
          // console.log(user, "checkuser", tokenAdded);
        }
        return user;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

module.exports = new userProfileService();
