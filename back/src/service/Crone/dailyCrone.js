const moment = require("moment");
const UserSchema = require("../../modal/User/user");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");
const TransactionSchema = require("../../modal/Transaction/transaction");
const UserWalletSchema = require("../../modal/UserWallet/userwallet");
const ObjectId = require("mongodb").ObjectId;
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const invoiceHtml = require("../../emailTemplates/InvoiceEmailTemplate");
const path = require("path");

// last day of daily roi
const lastDayDailyRoi = async () => {
  //   const currentDate = new Date();
  //   const utcDate = moment.utc(currentDate);

  //   let dailyroi = await UserSubscriptionSchema.find({
  //     roi_duration: "daily",
  //     withdrawal_date: null,
  //     usersubscriptionstatus: "Accepted",
  //     package_expiry_date: { $lte: utcDate },
  //   });
  const currentDate = new Date();
  console.log(currentDate, "check24dailycrone24");
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth() + 1; // Adding 1 because months are 0-based in JavaScript
  const day = currentDate.getUTCDate();

  //   last day of daily roi
  let lastDayDailyRoi = await UserSubscriptionSchema.find({
    roi_duration: "daily",
    withdrawal_date: null,
    usersubscriptionstatus: "Accepted",
    $expr: {
      $and: [
        { $eq: [{ $year: "$package_expiry_date" }, year] },
        { $eq: [{ $month: "$package_expiry_date" }, month] },
        { $eq: [{ $dayOfMonth: "$package_expiry_date" }, day] },
      ],
    },
  });
  console.log(lastDayDailyRoi, "check41", lastDayDailyRoi.length);
  let modifiedCount = await UserSubscriptionSchema.updateMany(
    {
      roi_duration: "daily",
      withdrawal_date: null,
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $eq: [{ $year: "$package_expiry_date" }, year] },
          { $eq: [{ $month: "$package_expiry_date" }, month] },
          { $eq: [{ $dayOfMonth: "$package_expiry_date" }, day] },
        ],
      },
    },
    {
      $set: { usersubscriptionstatus: "Closed", withdrawal_status: "Closed" },
    },
    {
      new: true,
    }
  );
  let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });

  let adminTransactionCreate = lastDayDailyRoi.map((val) => {
    let amountData = val.amount + (val.amount * val.roi) / 100;
    return {
      adminId: adminId[0]?._id,
      userId: val.userId,
      userSubscriptionId: val._id,
      transaction_type: "Debit",
      amount: amountData,
      currency: val.currency,
      currencyId: val.currencyId,
    };
  });
  let userTransactionCreate = lastDayDailyRoi.map((val) => {
    let amountData = val.amount + (val.amount * val.roi) / 100;
    return {
      adminId: null,
      userId: val.userId,
      userSubscriptionId: val._id,
      transaction_type: "Credit",
      amount: amountData,
      currency: val.currency,
      currencyId: val.currencyId,
    };
  });
  let userWalletData = lastDayDailyRoi.map((val) => {
    let amountData = val.amount + (val.amount * val.roi) / 100;
    return {
      userId: val.userId,
      userSubscriptionId: val._id,
      amount: amountData,
      currencyId: val.currencyId,
    };
  });

  let transactionData = [...adminTransactionCreate, ...userTransactionCreate];
  let completeMonthTransaction = await TransactionSchema.insertMany(
    transactionData
  );
  let userwalletDataAdd = await UserWalletSchema.insertMany(userWalletData);
  console.log(completeMonthTransaction, "transactionDatacase1");
  console.log(userwalletDataAdd, "userWalletDatacase1");
  return completeMonthTransaction;
};
// daily roi
let dailyRoi = async () => {
  const currentDate = new Date();
  console.log(currentDate, "check110", typeof currentDate);
  let dailyRoi = await UserSubscriptionSchema.find({
    roi_duration: "daily",
    withdrawal_date: null,
    usersubscriptionstatus: "Accepted",
    package_expiry_date: {
      $gt: currentDate, // Check if package_expiry_date is less than current UTC date
    },
  });
  console.log(dailyRoi, "check118", dailyRoi.length);
  let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });

  let adminTransactionCreate = dailyRoi.map((val) => {
    let amountData = (val.amount * val.roi) / 100;
    return {
      adminId: adminId[0]?._id,
      userId: val.userId,
      userSubscriptionId: val._id,
      transaction_type: "Debit",
      amount: amountData,
      currency: val.currency,
      payment_type: "roi",
      currencyId: val.currencyId,
    };
  });
  let userTransactionCreate = dailyRoi.map((val) => {
    let amountData = (val.amount * val.roi) / 100;
    return {
      adminId: null,
      userId: val.userId,
      userSubscriptionId: val._id,
      transaction_type: "Credit",
      amount: amountData,
      currency: val.currency,
      payment_type: "roi",
      currencyId: val.currencyId,
    };
  });

  let userWalletData = dailyRoi.map((val) => {
    let amountData = (val.amount * val.roi) / 100;
    return {
      userId: val.userId,
      userSubscriptionId: val._id,
      amount: amountData,
      currencyId: ObjectId(val.currencyId),
    };
  });
  let transactionData = [...adminTransactionCreate, ...userTransactionCreate];
  let userWalletDataAdd = await UserWalletSchema.insertMany(userWalletData);
  let completeMonthTransaction = await TransactionSchema.insertMany(
    transactionData
  );
  //   console.log(completeMonthTransaction, "transactionDatacase2");
  //   console.log(userWalletDataAdd, "userWalletDataAdd1");
  return completeMonthTransaction;
};

module.exports = {
  lastDayDailyRoi,
  dailyRoi,
};
