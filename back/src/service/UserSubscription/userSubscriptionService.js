const SubscriptionSchema = require("../../modal/Subscription/subscription");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");
const NotificationSchema = require("../../modal/Notification/notification");
const UserSchema = require("../../modal/User/user");
const UserWalletSchema = require("../../modal/UserWallet/userwallet");
const TransactionSchema = require("../../modal/Transaction/transaction");
const FuturePaymentSchema = require("../../modal/FuturePayment/futurePayment");
const pagination = require("../../helper/pagination");
const ObjectId = require("mongodb").ObjectId;
const moment = require("moment");
const invoiceHtml = require("../../emailTemplates/InvoiceEmailTemplate");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const PurchaseEmailTemplate = require("../../emailTemplates/PurchaseEmailTemplate");
const emailhandler = require("../../handler/emailhandler");
const InvoiceSchema = require("../../modal/Invoice/invoice");
const fs = require("fs").promises;

class UserSubscriptionService {
  constructor() {}
  // purchase subscription
  // async purchaseSubscription(_id, user, res) {
  //   try {
  //     let data;
  //     let totalSubscriptionPerchased = await UserSubscriptionSchema.find({
  //       userId: user._id,
  //       subscriptionId: _id,
  //     });
  //     async function userSubscriptionPurchase(_id, id, name) {
  //       let subscriptionData = await SubscriptionSchema.findById({ _id });
  //       let adminId = await UserSchema.find(
  //         { is_superadmin: true },
  //         { _id: 1 }
  //       );
  //       let adminNotificationCreate = await NotificationSchema.create({
  //         userId: adminId[0]?._id,
  //         title: "New Investment",
  //         body: `${name} invest in ${subscriptionData.name} subscription`,
  //         n_type: "admin",
  //         n_link: "/subscriber",
  //       });
  //       const currentDate = new Date();
  //       const utcDate = moment.utc(currentDate);
  //       const formattedDate = utcDate.format("DD");
  //       let monthDate;
  //       if (Number(formattedDate) >= 1 && Number(formattedDate) <= 10) {
  //         monthDate = 11;
  //       }
  //       if (Number(formattedDate) >= 11 && Number(formattedDate) <= 21) {
  //         monthDate = 21;
  //       }
  //       if (Number(formattedDate) >= 21 && Number(formattedDate) <= 31) {
  //         monthDate = 1;
  //       }
  //       let expiryDate;
  //       if (monthDate === 1) {
  //         expiryDate = moment(new Date())
  //           .date(monthDate)
  //           .utc()
  //           .add(subscriptionData?.duration + 1, "months")
  //           .startOf("day");
  //       } else {
  //         expiryDate = moment(new Date())
  //           .date(monthDate)
  //           .utc()
  //           .add(subscriptionData?.duration, "months")
  //           .startOf("day");
  //       }
  //       console.log(expiryDate, "check47", moment(expiryDate).toDate());
  //       if (subscriptionData && adminId && adminNotificationCreate) {
  //         let subscriptiondata = await UserSubscriptionSchema.create({
  //           userId: id,
  //           subscriptionId: _id,
  //           currencyId: subscriptionData?.currencyId,
  //           notificationId: adminNotificationCreate._id,
  //           name: subscriptionData?.name,
  //           is_delete: subscriptionData?.is_delete,
  //           currency: subscriptionData?.currency,
  //           amount: subscriptionData?.amount,
  //           description: subscriptionData?.description,
  //           duration: subscriptionData?.duration,
  //           roi: subscriptionData?.roi,
  //           roi_duration: subscriptionData?.roi_duration,
  //           principal_withdrawal: subscriptionData?.principal_withdrawal,
  //           commision_method: subscriptionData?.commision_method,
  //           commision: subscriptionData?.commision,
  //           maximum_value: subscriptionData?.maximum_value,
  //           status: subscriptionData?.status,
  //           package_expiry_date: expiryDate,
  //           referral_user_id: user?.referral_user_id
  //             ? user.referral_user_id
  //             : null,
  //         });
  //         return subscriptiondata;
  //       }
  //     }
  //     if (totalSubscriptionPerchased.length > 0) {
  //       if (totalSubscriptionPerchased[0]?.maximum_value) {
  //         let maxSubscription = Math.floor(
  //           totalSubscriptionPerchased[0]?.maximum_value /
  //             totalSubscriptionPerchased[0]?.amount
  //         );
  //         if (maxSubscription > totalSubscriptionPerchased.length) {
  //           data = await userSubscriptionPurchase(_id, user._id, user.name);
  //           // .then((res) => {
  //           //   return res;
  //           // })
  //           // .catch((err) => {
  //           //   console.log(err, "check37");
  //           //   throw new Error(err);
  //           // });
  //         } else {
  //           data = "maxlimit reached";
  //         }
  //       } else {
  //         data = await userSubscriptionPurchase(_id, user._id, user.name);
  //         // .then((res) => {
  //         //   return res;
  //         // })
  //         // .catch((err) => {
  //         //   console.log(err, "check37");
  //         //   throw new Error(err);
  //         // });
  //       }
  //     } else {
  //       data = await userSubscriptionPurchase(_id, user._id, user.name);
  //       // .then((res) => {
  //       //   return res;
  //       // })
  //       // .catch((err) => {
  //       //   console.log(err, "check37");
  //       //   throw new Error(err);
  //       // });
  //     }
  //     return data;
  //   } catch (error) {
  //     // return error;
  //     throw new Error(error);
  //   }
  // }
  // purchase subscription
  async purchaseSubscription(_id, payload, user, filename, res) {
    try {
      // console.log(filename, "check136");
      let data;
      // let totalSubscriptionPerchased = await UserSubscriptionSchema.find({
      //   userId: user._id,
      //   subscriptionId: _id,
      // });
      let subscriptionValue = await SubscriptionSchema.findOne({
        _id: ObjectId(_id),
      });
      // console.log(subscriptionValue, "check144", payload?.amount);
      let totalInvested = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            userId: ObjectId(user._id),
            subscriptionId: ObjectId(_id),
            usersubscriptionstatus: { $in: ["Accepted", "Pending"] },
          },
        },
        {
          $group: {
            _id: "userId",
            totalInvestedAmount: { $sum: "$amount" },
          },
        },
      ]);
      // console.log(totalInvested, "check160");
      async function userSubscriptionPurchase(_id, id, name) {
        let subscriptionData = await SubscriptionSchema.findById({ _id });
        let adminId = await UserSchema.find(
          { is_superadmin: true },
          { _id: 1 }
        );
        let adminNotificationCreate = await NotificationSchema.create({
          userId: adminId[0]?._id,
          title: "New Investment",
          body: `${name} invest in ${subscriptionData.name} subscription`,
          n_type: "admin",
          n_link: "/subscriber",
        });
        const currentDate = new Date();
        const utcDate = moment.utc(currentDate);
        const formattedDate = utcDate.format("DD");
        let monthDate;
        if (Number(formattedDate) >= 1 && Number(formattedDate) <= 10) {
          monthDate = 11;
        }
        if (Number(formattedDate) >= 11 && Number(formattedDate) <= 21) {
          monthDate = 21;
        }
        if (Number(formattedDate) >= 21 && Number(formattedDate) <= 31) {
          monthDate = 1;
        }
        let expiryDate;
        if (subscriptionValue.roi_duration === "daily") {
          const today = moment();
          expiryDate = today
            .clone()
            .add(subscriptionValue?.duration, "months")
            .utc()
            .startOf("day");
        } else {
          if (monthDate === 1) {
            expiryDate = moment(new Date())
              .date(monthDate)
              .utc()
              .add(subscriptionData?.duration + 1, "months")
              .startOf("day");
          } else {
            expiryDate = moment(new Date())
              .date(monthDate)
              .utc()
              .add(subscriptionData?.duration, "months")
              .startOf("day");
          }
        }
        // console.log(expiryDate, "check47", moment(expiryDate).toDate());
        if (subscriptionData && adminId && adminNotificationCreate) {
          let subscriptiondata = await UserSubscriptionSchema.create({
            userId: id,
            subscriptionId: _id,
            currencyId: subscriptionData?.currencyId,
            notificationId: adminNotificationCreate._id,
            name: subscriptionData?.name,
            is_delete: subscriptionData?.is_delete,
            currency: subscriptionData?.currency,
            amount: payload?.amount,
            description: subscriptionData?.description,
            duration: subscriptionData?.duration,
            roi: subscriptionData?.roi,
            roi_duration: subscriptionData?.roi_duration,
            principal_withdrawal: subscriptionData?.principal_withdrawal,
            commision_method: subscriptionData?.commision_method,
            commision: subscriptionData?.commision,
            maximum_value: subscriptionData?.maximum_value,
            minimum_value: subscriptionData?.minimum_value,
            status: subscriptionData?.status,
            package_expiry_date: expiryDate,
            referral_user_id: user?.referral_user_id
              ? user.referral_user_id
              : null,
            onmeta_amount: payload.onmeta_amount ? payload.onmeta_amount : null,
            transfer_rate: payload.transfer_rate ? payload.transfer_rate : null,
            inr_amount: payload.inr_amount ? payload.inr_amount : null,
            onmeta_orderId: payload.onmeta_orderId
              ? payload.onmeta_orderId
              : "",
            investment_type: payload.investment_type
              ? payload.investment_type
              : "",
            manual_purchase_image: filename ? filename : "",
            payment_method: payload.payment_method
              ? payload.payment_method
              : "",
          });
          return subscriptiondata;
        }
      }
      if (totalInvested && totalInvested[0]?.totalInvestedAmount > 0) {
        if (subscriptionValue?.maximum_value !== 0) {
          let maxSubscription = Math.floor(
            subscriptionValue?.maximum_value /
              (totalInvested[0]?.totalInvestedAmount + payload.amount)
          );
          // console.log(maxSubscription, "check234");
          if (maxSubscription >= 1) {
            data = await userSubscriptionPurchase(_id, user._id, user.name);
          } else {
            data = "maxlimit reached";
          }
        } else {
          data = await userSubscriptionPurchase(_id, user._id, user.name);
        }
      } else {
        if (subscriptionValue?.maximum_value !== 0) {
          if (payload?.amount > subscriptionValue?.maximum_value) {
            data = "maxlimit reached";
          } else {
            data = await userSubscriptionPurchase(_id, user._id, user.name);
          }
        } else {
          data = await userSubscriptionPurchase(_id, user._id, user.name);
        }
      }
      return data;
    } catch (error) {
      // return error;
      console.log(error, "check270");
      throw new Error(error);
    }
  }
  // change subscription status
  async changeSubscriptionStatus(_id, payload, res) {
    try {
      let data = await UserSubscriptionSchema.findByIdAndUpdate(
        { _id },
        {
          $set: {
            usersubscriptionstatus: payload.usersubscriptionstatus,
            onemeta_reason: payload.onemeta_reason
              ? payload.onemeta_reason
              : "",
            remark: payload.remark ? payload.remark : "",
          },
        },
        {
          new: true,
        }
      );
      if (payload.notificationId) {
        let notificationStatusChange =
          await NotificationSchema.findByIdAndUpdate(
            { _id: payload?.notificationId },
            { $set: { seen: true } }
          );
      }

      let userNotificationCreate = await NotificationSchema.create({
        userId: payload.userId,
        title: `${payload.usersubscriptionstatus}`,
        body: `Your ${data?.name} subscription is ${
          payload.usersubscriptionstatus
        } ${data.investment_type === "with_one_meta" ? "" : "by admin"}`,
        n_type: "user",
        n_link: "/packages",
      });

      if (payload.usersubscriptionstatus === "Accepted") {
        let adminId = await UserSchema.find(
          { is_superadmin: true },
          { _id: 1 }
        );
        let userData = await UserSchema.findOne(
          { _id: payload.userId },
          { referral_user_id: 1, name: 1, email: 1 }
        );
        let userTransactionCreate = await TransactionSchema.create({
          userId: payload.userId,
          userSubscriptionId: _id,
          transaction_type: "Debit",
          currency: data.currency,
          amount: data.amount,
          currencyId: data.currencyId,
        });
        let adminTransactionCreate = await TransactionSchema.create({
          adminId: adminId[0]?._id,
          userId: payload.userId,
          userSubscriptionId: _id,
          transaction_type: "Credit",
          currency: data.currency,
          amount: data.amount,
          currencyId: data.currencyId,
        });
        if (userData?.referral_user_id) {
          let parentUserData = await UserSchema.findOne(
            { _id: userData?.referral_user_id },
            { referral_user_id: 1, name: 1, email: 1, is_delete: 1 }
          );
          if (!parentUserData?.is_delete) {
            let userCommisionTransactionData = await TransactionSchema.create({
              userId: userData.referral_user_id,
              userSubscriptionId: _id,
              transaction_type: "Credit",
              currency: data.currency,
              amount: (data.amount * data.commision) / 100,
              currencyId: data.currencyId,
              payment_type: "commision",
              referral_user_id: userData?._id,
              acctual_package_amount: data.amount,
            });
            let adminCommisionTransaction = await TransactionSchema.create({
              adminId: adminId[0]?._id,
              userId: userData.referral_user_id,
              userSubscriptionId: _id,
              transaction_type: "Debit",
              currency: data.currency,
              amount: (data.amount * data.commision) / 100,
              currencyId: data.currencyId,
              payment_type: "commision",
              referral_user_id: userData?._id,
              acctual_package_amount: data.amount,
            });

            let addCommisionInUserWallet = await UserWalletSchema.create({
              userId: userData.referral_user_id,
              userSubscriptionId: data._id,
              amount: (data.amount * data.commision) / 100,
              currencyId: data.currencyId,
            });

            let updateReferralflage =
              await UserSubscriptionSchema.findByIdAndUpdate(
                { _id },
                {
                  $set: {
                    is_referral_paid: true,
                  },
                }
              );
          }
        }
        const currentDate = new Date();
        const utcDate = moment.utc(currentDate);
        const formattedDate = utcDate.format("DD");
        let date_start;
        if (Number(formattedDate) >= 11 && Number(formattedDate) <= 20) {
          date_start = 21;
        } else if (Number(formattedDate) >= 21 && Number(formattedDate) <= 31) {
          date_start = 1;
        } else if (Number(formattedDate) >= 1 && Number(formattedDate) <= 10) {
          const currentDate = moment.utc();
          date_start = 11;
        } else {
          // console.log(formattedDate, "formattedDatecase1");
          return;
        }
        let futurePayment = [];
        let rateofinterest = (data.amount * data.roi) / 100;
        let currency = data.currency;
        if (data.roi_duration === "daily") {
          const today = moment();
          const startDate = today.clone().add(1, "day").utc().startOf("day"); // Start from the day after today
          const endDate = today
            .clone()
            .add(data?.duration, "months")
            .utc()
            .startOf("day"); // End on the same day of the month, 3 months later

          let currentDate = startDate.clone();

          while (currentDate.isSameOrBefore(endDate, "day")) {
            // dateRange.push(currentDate.clone());
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: currentDate.clone().toISOString(),
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            currentDate.add(1, "day");
          }
        } else if (data.roi_duration === "monthly") {
          let i = 1;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            console.log(
              next_mont_interest_date,
              "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i++;
          }
        } else if (data.roi_duration === "quarterly") {
          let i = 3;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 3;
          }
        } else if (data.roi_duration === "halfyearly") {
          let i = 6;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "######################################"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 6;
          }
        } else if (data.roi_duration === "yearly") {
          let i = 12;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 12;
          }
        } else if (data.roi_duration === "one and half year") {
          let i = 18;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 18;
          }
        } else if (data.roi_duration === "two year") {
          let i = 24;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 24;
          }
        } else if (data.roi_duration === "two and half year") {
          let i = 30;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 30;
          }
        } else if (data.roi_duration === "three year") {
          let i = 36;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 36;
          }
        } else if (data.roi_duration === "three and half year") {
          let i = 42;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 42;
          }
        } else if (data.roi_duration === "four year") {
          let i = 48;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 48;
          }
        } else if (data.roi_duration === "four and half year") {
          let i = 54;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 54;
          }
        } else if (data.roi_duration === "five year") {
          let i = 60;
          while (i <= data?.duration) {
            let next_mont_interest_date;
            if (date_start === 1) {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i + 1, "month")
                .startOf("day");
            } else {
              next_mont_interest_date = moment(new Date())
                .set("date", date_start)
                .utc()
                .add(i, "month")
                .startOf("day");
            }
            // console.log(
            //   next_mont_interest_date,
            //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
            // );
            let obj = {
              userId: data.userId,
              userSubscriptionId: data._id,
              roi: rateofinterest,
              currency: currency,
              roi_date: next_mont_interest_date,
              subscriptionId: data.subscriptionId,
              currencyId: data.currencyId,
            };
            futurePayment.push(obj);
            i += 60;
          }
        }
        if (futurePayment && futurePayment.length > 0) {
          const futurePayout = await FuturePaymentSchema.insertMany(
            futurePayment
          );
        }
        // for dynemic pdf genaration
        let lastpdfserialnumber = await UserSubscriptionSchema.find({
          invoice_number: { $ne: "" },
          $and: [
            { usersubscriptionstatus: { $ne: "Pending" } },
            { usersubscriptionstatus: { $ne: "Rejected" } },
          ],
        })
          .sort({ invoice_number: -1 })
          .limit(1);
        // console.log(lastpdfserialnumber, "check807");
        console.log(lastpdfserialnumber[0]?.invoice_number, "check808");
        function generatePaddedNumber(number, width) {
          return String(number).padStart(width, "0");
        }
        let paddedNumber = generatePaddedNumber(
          Number(lastpdfserialnumber[0]?.invoice_number) + 1,
          6
        );
        console.log(paddedNumber, "check862");
        const browser = await puppeteer.launch({
          headless: "new",
        });
        const page = await browser.newPage();
        let body = await invoiceHtml.MailSent({
          invoiceNumber: paddedNumber,
          invoiceDate: moment(new Date()).format("DD/MM/YYYY"),
          userName: userData.name,
          packageName: data.name,
          packageDuration: data.duration,
          netAmount: data.amount?.toFixed(2),
          totalAmount: data.amount?.toFixed(2),
          currencyName: data.currency,
        });
        await page.setContent(body);

        await page.pdf({
          path: `uploads/Invoice/Invoice-${paddedNumber}.pdf`,
          format: "A4",
          printBackground: true,
        });
        await browser.close();
        // ??????????????????????????????????????????????????????????????????????????????????????????????????????????
        let updateUserSubscriptionData =
          await UserSubscriptionSchema.findByIdAndUpdate(
            { _id },
            {
              $set: {
                invoice_number: paddedNumber,
              },
            },
            {
              new: true,
            }
          );
        let purchaseMailBody = await PurchaseEmailTemplate.MailSent({
          username: userData.name,
        });
        await emailhandler.sendEmail(
          userData.email?.toLowerCase(),
          purchaseMailBody,
          "Invoice",
          "",
          [
            {
              filename: `Invoice-${paddedNumber}.pdf`,
              path: `${process.env.BACKEND_UPLOAD_DIR}Invoice/Invoice-${paddedNumber}.pdf`,
              contentType: "application/pdf",
            },
          ]
        );
        let createInvoiceData = await InvoiceSchema.create({
          invoice_name: `Invoice-${paddedNumber}.pdf`,
          invoice_number: paddedNumber,
          userId: ObjectId(updateUserSubscriptionData?.userId),
          usersubscriptionId: ObjectId(updateUserSubscriptionData?._id),
          currencyId: ObjectId(updateUserSubscriptionData?.currencyId),
        });
      }
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      console.log(error, "check845");
      throw new Error(error);
    }
  }
  // getall subscription
  async getallSubscription(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;

      let sortField = {};
      sortField[sort_on] = sort === "asc" ? 1 : -1;

      let user_id;
      if (payload.usernameFilter) {
        user_id = {
          userId: ObjectId(payload.usernameFilter),
        };
      }
      let subscription;
      if (payload.subscriptionnameFilter) {
        subscription = {
          subscriptionId: ObjectId(payload.subscriptionnameFilter),
        };
      }
      let currency;
      if (payload.currencyFilter) {
        currency = { currencyId: ObjectId(payload.currencyFilter) };
      }
      let duration;
      if (payload.durationFilter) {
        duration = { duration: Number(payload.durationFilter) };
      }
      let amount;
      if (payload.amountFilter) {
        if (Number(payload.amountFilter) !== 1001) {
          if (Number(payload.amountFilter) === 100) {
            amount = { amount: { $lte: Number(payload.amountFilter) } };
          } else {
            amount = { amount: { $gt: 100, $lt: 1000 } };
          }
        } else {
          amount = { amount: { $gte: 1000 } };
        }
      }
      // console.log(amount, "check842");
      let query = [
        {
          $match: {
            ...user_id,
            ...subscription,
            ...currency,
            ...duration,
            ...amount,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
        {
          $sort: sortField,
        },
      ];
      // console.log(query, "checkequery856");
      let objData = await UserSubscriptionSchema.aggregate(query);
      // console.log(objData, "checkobjdata");
      // console.log(page, "check859");
      let data = await pagination(objData, page, limit);
      // let options = {
      //   page: page ? page : 1,
      //   limit: limit ? limit : 10,
      //   sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      //   populate: "userId",
      // };
      // console.log(options, "check517");
      // let query = {};
      // let data = await UserSubscriptionSchema.paginate(query, options);
      // console.log(data, "check867");
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // get user approved or rejected subsctiption with pagination
  async getUserApproveRejectSubscription(payload, user, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      };
      let query = { userId: user?._id };
      let data = await UserSubscriptionSchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // get user approved subsctiption without pagination
  async getUserApproveSubscriptionWithoutPagination(user, res) {
    try {
      let data = await UserSubscriptionSchema.find({
        userId: user?._id,
        usersubscriptionstatus: "Accepted",
      }).sort({ createdAt: -1 });
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // change withdrawal request
  async changeWithdrawalRequest(_id, payload, user, res) {
    try {
      let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });
      let adminNotificationCreate = await NotificationSchema.create({
        userId: adminId[0]._id,
        title: `Withdrawal Request`,
        body: `${user.name} made a request for withdrawal of ${payload.name} subscription`,
        n_type: "admin",
        n_link: "/withdrawalrequests",
      });
      let data = await UserSubscriptionSchema.findByIdAndUpdate(
        { _id },
        {
          $set: {
            withdrawal_request: payload.withdrawal_request,
            notificationId: adminNotificationCreate._id,
            withdrawal_status: "Pending",
          },
        }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // change withdrawal request by admin
  async changeWithdrawalRequestByAdmin(_id, payload, user, res) {
    try {
      let adminNotificationSeen = await NotificationSchema.findByIdAndUpdate(
        { _id: ObjectId(payload.notificationId) },
        {
          $set: {
            seen: true,
          },
        }
      );
      let userNotificationCreate = await NotificationSchema.create({
        userId: ObjectId(payload.userId),
        title: `${payload.withdrawal_status}`,
        body: `your withdrawal request for ${payload.name} subscription is ${payload.withdrawal_status}`,
        n_type: "user",
        n_link: "/withdrawal",
      });
      const currentDate = new Date();
      const utcDate = new Date(currentDate.toUTCString());

      // console.log(utcDate.toISOString()); // Outputs the current UTC date in ISO 8601 format

      let data = await UserSubscriptionSchema.findByIdAndUpdate(
        { _id },
        {
          $set: {
            usersubscriptionstatus:
              payload.withdrawal_status === "Accepted" ? "Closed" : "Accepted",
            withdrawal_status:
              payload.withdrawal_status === "Accepted" ? "Closed" : "Rejected",
            notificationId: userNotificationCreate._id,
            withdrawal_date:
              payload.withdrawal_status === "Accepted"
                ? utcDate.toISOString()
                : null,
            withdrawal_remark: payload.withdrawal_remark,
            withdrawal_request:
              payload.withdrawal_status === "Accepted" ? true : false,
          },
        },
        {
          new: true,
        }
      );
      if (payload.withdrawal_status === "Accepted") {
        let deleteFuturePayout = await FuturePaymentSchema.deleteMany({
          userId: data.userId,
          userSubscriptionId: _id,
          roi_date: { $gt: utcDate.toISOString() },
        });
        let adminId = await UserSchema.findOne(
          { is_superadmin: true },
          { _id: 1 }
        );
        let adminTransactionCreate = {
          adminId: adminId?._id,
          userId: payload.userId,
          userSubscriptionId: data._id,
          transaction_type: "Debit",
          amount: (data.amount * data.principal_withdrawal) / 100,
          currency: data.currency,
          currencyId: data.currencyId,
        };
        let userTransactionCreate = {
          adminId: null,
          userId: payload.userId,
          userSubscriptionId: data._id,
          transaction_type: "Credit",
          amount: (data.amount * data.principal_withdrawal) / 100,
          currency: data.currency,
          currencyId: data.currencyId,
        };
        let transactionData = [adminTransactionCreate, userTransactionCreate];
        let completeMonthTransaction = await TransactionSchema.insertMany(
          transactionData
        );
        let userWalletData = {};
        let userWalletDataAdd = await UserWalletSchema.create({
          userId: payload.userId,
          userSubscriptionId: data._id,
          amount: (data.amount * data.principal_withdrawal) / 100,
          currencyId: data.currencyId,
        });
      }
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // get all user approved subsctiption with pagination
  async getUserApprovedSubscription(payload, user, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
        populate: "userId",
      };
      let query = {
        userId: user?._id,
        $or: [
          { usersubscriptionstatus: "Accepted" },
          { usersubscriptionstatus: "Closed" },
        ],
        withdrawal_status: { $ne: "Closed" },
      };
      let data = await UserSubscriptionSchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // get all user withdrawal request with pagination
  async getallWithdrawalRequest(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        populate: "userId",
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      };
      // console.log(options, "chcek668");
      let query = {
        withdrawal_request: true,
      };
      let data = await UserSubscriptionSchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new UserSubscriptionService();

// {
//     "name": "mukund sakhareliya",
//     "panNumber": "BXWPS1236A",
//     "kycVerfied": true,
//     "email": "vaibhav@yopmail.com",
//     "bankDetails": {
//         "accountNumber": "66010018336",
//         "accountName": "MUKUND JENTILAL SAKHRELIYA",
//         "ifsc": "SBIN0060074"
//     },
//     "phone": {
//         "number": "9909459663"
//     }
// }
