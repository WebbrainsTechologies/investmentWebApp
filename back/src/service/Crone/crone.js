const moment = require("moment");
const UserSchema = require("../../modal/User/user");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");
const TransactionSchema = require("../../modal/Transaction/transaction");
const UserWalletSchema = require("../../modal/UserWallet/userwallet");
const ObjectId = require("mongodb").ObjectId;
// const puppeteer = require("puppeteer");
// const fs = require("fs").promises;
// const InvoiceSchema = require("../../modal/Invoice/invoice");
// const invoiceHtml = require("../../emailTemplates/InvoiceEmailTemplate");
// const path = require("path");

//   // let sequence = "000001";
//   // if (sequence === "000001") {
//   // const browser = await puppeteer.launch();
//   // const page = await browser.newPage();
//   // let body = await invoiceHtml.MailSent({
//   //   invoiceNumber: user.name,
//   //   invoiceDate: moment(new Date()).format("DD/MM/YYYY"),
//   //   userName: userData.name,
//   //   packageName: data.name,
//   //   packageDuration: data.duration,
//   //   netAmount: data.amount,
//   //   totalAmount: data.amount,
//   //   currencyName: data.currency,
//   // });
//   // await page.setContent(body);
//   // await page.pdf({ path: `../../uploads/${filename}`, format: "A4" });
//   // await browser.close();
//   // }
// };

// last month of subscription
const subscriptionMonthComplete = async () => {
  try {
    const currentDate = new Date();
    const utcDate = moment.utc(currentDate);

    const formattedDate = utcDate.format("DD");
    let date_start;
    let date_end;
    if (Number(formattedDate) === 11) {
      date_start = 1;
      date_end = 10;
    } else if (Number(formattedDate) === 21) {
      date_start = 11;
      date_end = 20;
    } else if (Number(formattedDate) === 1) {
      const currentDate = moment.utc();
      date_start = 21;
      date_end = 31;
    } else {
      console.log(formattedDate, "formattedDatecase1");
      return;
    }
    let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });
    const completedMonthData = await UserSubscriptionSchema.find({
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
        ],
      },
      package_expiry_date: { $lt: utcDate },
    });
    const modifiedData = await UserSubscriptionSchema.updateMany(
      {
        withdrawal_request: false,
        withdrawal_date: null,
        withdrawal_status: "Pending",
        usersubscriptionstatus: "Accepted",
        $expr: {
          $and: [
            { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
            { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          ],
        },
        package_expiry_date: { $lt: utcDate },
      },
      {
        $set: { usersubscriptionstatus: "Closed", withdrawal_status: "Closed" },
      },
      {
        new: true,
      }
    );
    if (
      completedMonthData &&
      completedMonthData.length > 0 &&
      modifiedData &&
      modifiedData.matchedCount > 0
    ) {
      let adminTransactionCreate = completedMonthData.map((val) => {
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
      let userTransactionCreate = completedMonthData.map((val) => {
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
      let userWalletData = completedMonthData.map((val) => {
        let amountData = val.amount + (val.amount * val.roi) / 100;
        return {
          userId: val.userId,
          userSubscriptionId: val._id,
          amount: amountData,
          currencyId: val.currencyId,
        };
      });
      let transactionData = [
        ...adminTransactionCreate,
        ...userTransactionCreate,
      ];
      let completeMonthTransaction = await TransactionSchema.insertMany(
        transactionData
      );
      let userwalletDataAdd = await UserWalletSchema.insertMany(userWalletData);
      console.log(completeMonthTransaction, "transactionDatacase1");
      console.log(userwalletDataAdd, "userWalletDatacase1");
      return completeMonthTransaction;
    }
  } catch (error) {
    console.log(error, "crone-errorcase1");
    throw new Error(error);
  }
};
// roi payment
// const subscriptionCommisionAtlastMonth = async () => {
//   try {
//     const currentDate = new Date();
//     const utcDate = moment.utc(currentDate);

//     const formattedDate = utcDate.format("DD");
//     let date_start;
//     let date_end;
//     if (Number(formattedDate) === 11) {
//       date_start = 1;
//       date_end = 10;
//     } else if (Number(formattedDate) === 21) {
//       date_start = 11;
//       date_end = 20;
//     } else if (Number(formattedDate) === 1) {
//       const currentDate = moment.utc();
//       date_start = 21;
//       date_end = 31;
//     } else {
//       console.log(formattedDate, "formattedDatecase2");
//       return;
//     }
//     let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });
//     const completedMonthData = await UserSubscriptionSchema.find({
//       referral_user_id: { $ne: null },
//       is_referral_paid: false,
//       withdrawal_request: false,
//       withdrawal_date: null,
//       $expr: {
//         $and: [
//           { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//           { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//         ],
//       },
//       package_expiry_date: { $lt: utcDate },
//     });
//     const modifiedData = await UserSubscriptionSchema.updateMany(
//       {
//         referral_user_id: { $ne: null },
//         is_referral_paid: false,
//         withdrawal_request: false,
//         withdrawal_date: null,
//         $expr: {
//           $and: [
//             { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//             { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//           ],
//         },
//         package_expiry_date: { $lt: utcDate },
//       },
//       {
//         $set: { is_referral_paid: true },
//       },
//       {
//         new: true,
//       }
//     );
//     if (
//       completedMonthData &&
//       completedMonthData.length > 0 &&
//       modifiedData &&
//       modifiedData.matchedCount > 0
//     ) {
//       let adminTransactionCreate = completedMonthData.map((val) => {
//         let amountData = (val.amount * val.commision) / 100;
//         return {
//           adminId: adminId[0]?._id,
//           userId: val.referral_user_id,
//           userSubscriptionId: val._id,
//           transaction_type: "Debit",
//           amount: amountData,
//           currency: val.currency,
//           currencyId: val.currencyId,
//         };
//       });
//       let userTransactionCreate = completedMonthData.map((val) => {
//         let amountData = (val.amount * val.commision) / 100;
//         return {
//           adminId: null,
//           userId: val.referral_user_id,
//           userSubscriptionId: val._id,
//           transaction_type: "Credit",
//           amount: amountData,
//           currency: val.currency,
//           currencyId: val.currencyId,
//         };
//       });
//       let userWalletData = completedMonthData.map((val) => {
//         let amountData = (val.amount * val.commision) / 100;
//         return {
//           userId: val.referral_user_id,
//           userSubscriptionId: val._id,
//           amount: amountData,
//           currencyId: val.currencyId,
//         };
//       });
//       let userwalletDataAdd = await UserWalletSchema.insertMany(userWalletData);
//       let transactionData = [
//         ...adminTransactionCreate,
//         ...userTransactionCreate,
//       ];
//       let completeMonthTransaction = await TransactionSchema.insertMany(
//         transactionData
//       );
//       console.log(completeMonthTransaction, "transactionDatacase2");
//       console.log(userwalletDataAdd, "userWalletDatacase2");
//       return completeMonthTransaction;
//     }
//   } catch (error) {
//     console.log(error, "crone-errorcase2");
//     throw new Error(error);
//   }
// };

// subscription interest
const subscriptionInterest = async () => {
  try {
    const currentDate = new Date();
    const utcDate = moment.utc(currentDate);

    const formattedDate = utcDate.format("DD");
    let date_start;
    let date_end;
    if (Number(formattedDate) === 11) {
      date_start = 1;
      date_end = 10;
    } else if (Number(formattedDate) === 21) {
      date_start = 11;
      date_end = 20;
    } else if (Number(formattedDate) === 1) {
      const currentDate = moment.utc();
      date_start = 21;
      date_end = 31;
    } else {
      console.log(formattedDate, "formattedDatecase3");
      return;
    }
    let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });

    let monthInterest = await UserSubscriptionSchema.find({
      roi_duration: "monthly",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });
    let quaterlyInterest = await UserSubscriptionSchema.find({
      roi_duration: "quarterly",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  3,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });
    let halfyearlyInterest = await UserSubscriptionSchema.find({
      roi_duration: "halfyearly",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },

                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  6,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });
    let yearlyInterest = await UserSubscriptionSchema.find({
      roi_duration: "yearly",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  12,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let oneAndHalfYearInterest = await UserSubscriptionSchema.find({
      roi_duration: "one and half year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  18,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let twoyearInterest = await UserSubscriptionSchema.find({
      roi_duration: "two year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  24,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let twoAndHalfYearInterest = await UserSubscriptionSchema.find({
      roi_duration: "two and half year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  30,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let threeYearInterest = await UserSubscriptionSchema.find({
      roi_duration: "three year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  36,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let threeAndHalfYearInterest = await UserSubscriptionSchema.find({
      roi_duration: "three and half year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  42,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let fourYearInterest = await UserSubscriptionSchema.find({
      roi_duration: "four year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  48,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let fourAndHalfYearInterest = await UserSubscriptionSchema.find({
      roi_duration: "four and half year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  54,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    let fiveYearInterest = await UserSubscriptionSchema.find({
      roi_duration: "five year",
      withdrawal_date: null,
      $or: [
        { withdrawal_status: "Pending" },
        { withdrawal_status: "Rejected" },
      ],
      usersubscriptionstatus: "Accepted",
      $expr: {
        $and: [
          { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
          { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
          {
            $cond: {
              if: {
                $eq: [
                  { $month: "$createdAt" },
                  { $month: moment(utcDate).toDate() },
                ],
              },
              then: {
                $ne: [
                  { $year: "$createdAt" },
                  { $year: moment(utcDate).toDate() },
                ],
              },
              else: {
                $cond: [
                  { $eq: [date_start, 21] },
                  {
                    $cond: [
                      {
                        $eq: [
                          {
                            $subtract: [
                              { $month: utcDate.toDate() },
                              { $month: "$createdAt" },
                            ],
                          },
                          1,
                        ],
                      },
                      {
                        $ne: [
                          { $year: "$createdAt" },
                          { $year: moment(utcDate).toDate() },
                        ],
                      },
                      true,
                    ],
                  },
                  true,
                ],
              },
            },
          },
          {
            $eq: [
              {
                $mod: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          { $month: utcDate.toDate() },
                          { $month: "$createdAt" },
                        ],
                      },
                      { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
                    ],
                  },
                  60,
                ],
              },
              0,
            ],
          },
        ],
      },
      package_expiry_date: { $gt: utcDate },
    });

    console.log(monthInterest, "checkmonthinterestcase2");
    console.log(quaterlyInterest, "checkquaterlyinterestcase2");
    console.log(halfyearlyInterest, "checkhalfyearlyinterestcase2");
    console.log(oneAndHalfYearInterest, "checkoneAndHalfYearInterestcase2");
    console.log(twoyearInterest, "checktwoyearInterestcase2");
    console.log(twoAndHalfYearInterest, "checktwoAndHalfYearInterestcase2");
    console.log(threeYearInterest, "checkthreeYearInterestcase2");
    console.log(threeAndHalfYearInterest, "checkthreeAndHalfYearInterestcase2");
    console.log(fourYearInterest, "checkfourYearInterestcase2");
    console.log(fourAndHalfYearInterest, "checkfourAndHalfYearInterestcase2");
    console.log(fiveYearInterest, "checkfiveYearInterestcase2");
    // if (
    //   monthInterest &&
    //   quaterlyInterest &&
    //   halfyearlyInterest &&
    //   yearlyInterest
    // ) {
    console.log(quaterlyInterest, "checkquaterlyinterestcase2");
    let mainData = await Promise.all([
      monthInterest,
      quaterlyInterest,
      halfyearlyInterest,
      yearlyInterest,
      oneAndHalfYearInterest,
      twoyearInterest,
      twoAndHalfYearInterest,
      threeYearInterest,
      threeAndHalfYearInterest,
      fourYearInterest,
      fourAndHalfYearInterest,
      fiveYearInterest,
    ]);
    let interestValue = [
      ...monthInterest,
      ...quaterlyInterest,
      ...halfyearlyInterest,
      ...yearlyInterest,
      ...oneAndHalfYearInterest,
      ...twoyearInterest,
      ...twoAndHalfYearInterest,
      ...threeYearInterest,
      ...threeAndHalfYearInterest,
      ...fourYearInterest,
      ...fourAndHalfYearInterest,
      ...fiveYearInterest,
    ];
    let adminTransactionCreate = interestValue.map((val) => {
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
    let userTransactionCreate = interestValue.map((val) => {
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

    let userWalletData = interestValue.map((val) => {
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
    console.log(completeMonthTransaction, "transactionDatacase2");
    console.log(userWalletDataAdd, "userWalletDataAdd1");
    return completeMonthTransaction;
    // }
  } catch (error) {
    console.log(error, "crone-errorcase2");
    throw new Error(error);
  }
};

// cancle subscription
// const subscriptionWithDrawRequest = async () => {
//   try {
//     const currentDate = new Date();
//     const utcDate = moment.utc(currentDate);
//     const formattedDate = utcDate.format("DD");
//     let date_start;
//     let date_end;
//     if (Number(formattedDate) === 11) {
//       date_start = 1;
//       date_end = 10;
//     } else if (Number(formattedDate) === 21) {
//       date_start = 11;
//       date_end = 20;
//     } else if (Number(formattedDate) === 1) {
//       const currentDate = moment.utc();
//       date_start = 21;
//       date_end = 31;
//     } else {
//       console.log(formattedDate, "formttedDatecase3");
//       return;
//     }
//     let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });
//     let withdrawalRequest = await UserSubscriptionSchema.find({
//       withdrawal_request: true,
//       withdrawal_date: { $ne: null },
//       withdrawal_status: "Accepted",
//       usersubscriptionstatus: "Accepted",
//       $expr: {
//         $and: [
//           { $gte: [{ $dayOfMonth: "$withdrawal_date" }, date_start] },
//           { $lte: [{ $dayOfMonth: "$withdrawal_date" }, date_end] },
//         ],
//       },
//     });
//     console.log(withdrawalRequest, "case3");
//     const modifiedData = await UserSubscriptionSchema.updateMany(
//       {
//         withdrawal_request: true,
//         withdrawal_date: { $ne: null },
//         withdrawal_status: "Accepted",
//         usersubscriptionstatus: "Accepted",
//         $expr: {
//           $and: [
//             { $gte: [{ $dayOfMonth: "$withdrawal_date" }, date_start] },
//             { $lte: [{ $dayOfMonth: "$withdrawal_date" }, date_end] },
//           ],
//         },
//       },
//       {
//         $set: { usersubscriptionstatus: "Closed", withdrawal_status: "Closed" },
//       },
//       {
//         new: true,
//       }
//     );
//     if (
//       withdrawalRequest &&
//       withdrawalRequest.length > 0 &&
//       modifiedData &&
//       modifiedData.modifiedCount > 0
//     ) {
//       let adminTransactionCreate = withdrawalRequest.map((val) => {
//         let amountData = (val.amount * val.principal_withdrawal) / 100;
//         return {
//           adminId: adminId[0]?._id,
//           userId: val.userId,
//           userSubscriptionId: val._id,
//           transaction_type: "Debit",
//           amount: amountData,
//           currency: val.currency,
//           currencyId: val.currencyId,
//         };
//       });
//       let userTransactionCreate = withdrawalRequest.map((val) => {
//         let amountData = (val.amount * val.principal_withdrawal) / 100;
//         return {
//           adminId: null,
//           userId: val.userId,
//           userSubscriptionId: val._id,
//           transaction_type: "Credit",
//           amount: amountData,
//           currency: val.currency,
//           currencyId: val.currencyId,
//         };
//       });
//       let userWalletData = withdrawalRequest.map((val) => {
//         let amountData = (val.amount * val.principal_withdrawal) / 100;
//         return {
//           userId: val.userId,
//           userSubscriptionId: val._id,
//           amount: amountData,
//           currencyId: val.currencyId,
//         };
//       });
//       let transactionData = [
//         ...adminTransactionCreate,
//         ...userTransactionCreate,
//       ];
//       let completeMonthTransaction = await TransactionSchema.insertMany(
//         transactionData
//       );
//       let userWalletDataAdd = await UserWalletSchema.insertMany(userWalletData);
//       console.log(completeMonthTransaction, "transactionDatacase3");
//       console.log(userWalletDataAdd, "userWalletDataAdd");
//       return completeMonthTransaction;
//     }
//   } catch (error) {
//     console.log(error, "crone-errorcase3");
//     throw new Error(error);
//   }
// };

//commision payment
// const subscriptionCommision = async () => {
//   try {
//     const currentDate = new Date();
//     const utcDate = moment.utc(currentDate);
//     const formattedDate = utcDate.format("DD");
//     let date_start;
//     let date_end;
//     if (Number(formattedDate) === 11) {
//       date_start = 1;
//       date_end = 10;
//     } else if (Number(formattedDate) === 21) {
//       date_start = 11;
//       date_end = 20;
//     } else if (Number(formattedDate) === 1) {
//       const currentDate = moment.utc();
//       date_start = 21;
//       date_end = 31;
//     } else {
//       console.log(formattedDate, "formttedDatecase3");
//       return;
//     }
//     let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });
//     let commisionPayment = await UserSubscriptionSchema.find({
//       is_referral_paid: false,
//       referral_user_id: { $ne: null },
//       $expr: {
//         $and: [
//           { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//           { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//         ],
//       },
//     });
//     let adminTransactionCreate = commisionPayment.map((val) => {
//       let amountData = (val.amount * val.commision) / 100;
//       return {
//         adminId: adminId[0]?._id,
//         userId: val.referral_user_id,
//         userSubscriptionId: val._id,
//         transaction_type: "Debit",
//         amount: amountData,
//         currency: val.currency,
//         payment_type: "commision",
//         currencyId: val.currencyId,
//       };
//     });
//     let userTransactionCreate = commisionPayment.map((val) => {
//       let amountData = (val.amount * val.commision) / 100;
//       return {
//         adminId: null,
//         userId: val.referral_user_id,
//         userSubscriptionId: val._id,
//         transaction_type: "Credit",
//         amount: amountData,
//         currency: val.currency,
//         payment_type: "commision",
//         currencyId: val.currencyId,
//       };
//     });

//     let userWalletData = commisionPayment.map((val) => {
//       let amountData = (val.amount * val.commision) / 100;
//       return {
//         userId: val.referral_user_id,
//         userSubscriptionId: val._id,
//         amount: amountData,
//         currencyId: ObjectId(val.currencyId),
//       };
//     });
//     let transactionData = [...adminTransactionCreate, ...userTransactionCreate];
//     console.log(transactionData, "transactionDatacase4");
//     console.log(userWalletData, "userwalletDatacase4");
//     let userWalletDataAdd = await UserWalletSchema.insertMany(userWalletData);
//     let commisionTransaction = await TransactionSchema.insertMany(
//       transactionData
//     );
//     console.log(userWalletDataAdd, "userWalletDataAddcase4");
//     console.log(commisionTransaction, "commisionTransactioncase4");
//     let commisionPaymentPaid = await UserSubscriptionSchema.updateMany(
//       {
//         is_referral_paid: false,
//         referral_user_id: { $ne: null },
//         $expr: {
//           $and: [
//             { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//             { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//           ],
//         },
//       },
//       {
//         is_referral_paid: true,
//       }
//     );
//     console.log(commisionPaymentPaid, "case4commisionPymentPaid");
//     return commisionPaymentPaid;
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

// subscription commision at interest time
// const subscriptionCommision = async () => {
//   const currentDate = new Date();
//   const utcDate = moment.utc(currentDate);

//   const formattedDate = utcDate.format("DD");

//   let date_start;
//   let date_end;
//   if (Number(formattedDate) === 11) {
//     date_start = 1;
//     date_end = 10;
//   } else if (Number(formattedDate) === 21) {
//     date_start = 11;
//     date_end = 20;
//   } else if (Number(formattedDate) === 1) {
//     date_start = 21;
//     date_end = 31;
//   } else {
//     console.log(formattedDate, "formattedDatecase2");
//     return;
//   }

//   let adminId = await UserSchema.find({ is_superadmin: true }, { _id: 1 });
//   let monthInterest = await UserSubscriptionSchema.find({
//     referral_user_id: { $ne: null },
//     is_referral_paid: false,
//     roi_duration: "monthly",
//     withdrawal_request: false,
//     withdrawal_date: null,
//     $expr: {
//       $and: [
//         { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//         { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//         {
//           $cond: {
//             if: {
//               $eq: [
//                 { $month: "$createdAt" },
//                 { $month: moment(utcDate).toDate() },
//               ],
//             },
//             then: {
//               $ne: [
//                 { $year: "$createdAt" },
//                 { $year: moment(utcDate).toDate() },
//               ],
//             },
//             else: {
//               $cond: [
//                 { $eq: [date_start, 21] },
//                 {
//                   $cond: [
//                     {
//                       $eq: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         1,
//                       ],
//                     },
//                     {
//                       $ne: [
//                         { $year: "$createdAt" },
//                         { $year: moment(utcDate).toDate() },
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//                 true,
//               ],
//             },
//           },
//         },
//         {
//           $eq: [
//             {
//               $mod: [
//                 {
//                   $subtract: [
//                     {
//                       $subtract: [
//                         { $month: utcDate.toDate() },
//                         { $month: "$createdAt" },
//                       ],
//                     },
//                     { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                   ],
//                 },
//                 1,
//               ],
//             },
//             0,
//           ],
//         },
//       ],
//     },
//     package_expiry_date: { $gt: utcDate },
//   });
//   let quaterlyInterest = await UserSubscriptionSchema.find({
//     referral_user_id: { $ne: null },
//     is_referral_paid: false,
//     roi_duration: "quarterly",
//     withdrawal_request: false,
//     withdrawal_date: null,
//     $expr: {
//       $and: [
//         { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//         { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//         {
//           $cond: {
//             if: {
//               $eq: [
//                 { $month: "$createdAt" },
//                 { $month: moment(utcDate).toDate() },
//               ],
//             },
//             then: {
//               $ne: [
//                 { $year: "$createdAt" },
//                 { $year: moment(utcDate).toDate() },
//               ],
//             },
//             else: {
//               $cond: [
//                 { $eq: [date_start, 21] },
//                 {
//                   $cond: [
//                     {
//                       $eq: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         1,
//                       ],
//                     },
//                     {
//                       $ne: [
//                         { $year: "$createdAt" },
//                         { $year: moment(utcDate).toDate() },
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//                 true,
//               ],
//             },
//           },
//         },
//         {
//           $eq: [
//             {
//               $mod: [
//                 {
//                   $subtract: [
//                     {
//                       $subtract: [
//                         { $month: utcDate.toDate() },
//                         { $month: "$createdAt" },
//                       ],
//                     },
//                     { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                   ],
//                 },
//                 3,
//               ],
//             },
//             0,
//           ],
//         },
//       ],
//     },
//     package_expiry_date: { $gt: utcDate },
//   });
//   let halfyearlyInterest = await UserSubscriptionSchema.find({
//     referral_user_id: { $ne: null },
//     is_referral_paid: false,
//     roi_duration: "halfyearly",
//     withdrawal_request: false,
//     withdrawal_date: null,
//     $expr: {
//       $and: [
//         { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//         { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//         {
//           $cond: {
//             if: {
//               $eq: [
//                 { $month: "$createdAt" },
//                 { $month: moment(utcDate).toDate() },
//               ],
//             },
//             then: {
//               $ne: [
//                 { $year: "$createdAt" },
//                 { $year: moment(utcDate).toDate() },
//               ],
//             },
//             else: {
//               $cond: [
//                 { $eq: [date_start, 21] },
//                 {
//                   $cond: [
//                     {
//                       $eq: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         1,
//                       ],
//                     },
//                     {
//                       $ne: [
//                         { $year: "$createdAt" },
//                         { $year: moment(utcDate).toDate() },
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//                 true,
//               ],
//             },
//           },
//         },
//         {
//           $eq: [
//             {
//               $mod: [
//                 {
//                   $subtract: [
//                     {
//                       $subtract: [
//                         { $month: utcDate.toDate() },
//                         { $month: "$createdAt" },
//                       ],
//                     },
//                     { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                   ],
//                 },
//                 6,
//               ],
//             },
//             0,
//           ],
//         },
//       ],
//     },
//     package_expiry_date: { $gt: utcDate },
//   });
//   let yearlyInterest = await UserSubscriptionSchema.find({
//     referral_user_id: { $ne: null },
//     is_referral_paid: false,
//     roi_duration: "yearly",
//     withdrawal_request: false,
//     withdrawal_date: null,
//     $expr: {
//       $and: [
//         { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//         { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//         {
//           $cond: {
//             if: {
//               $eq: [
//                 { $month: "$createdAt" },
//                 { $month: moment(utcDate).toDate() },
//               ],
//             },
//             then: {
//               $ne: [
//                 { $year: "$createdAt" },
//                 { $year: moment(utcDate).toDate() },
//               ],
//             },
//             else: {
//               $cond: [
//                 { $eq: [date_start, 21] },
//                 {
//                   $cond: [
//                     {
//                       $eq: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         1,
//                       ],
//                     },
//                     {
//                       $ne: [
//                         { $year: "$createdAt" },
//                         { $year: moment(utcDate).toDate() },
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//                 true,
//               ],
//             },
//           },
//         },
//         {
//           $eq: [
//             {
//               $mod: [
//                 {
//                   $subtract: [
//                     {
//                       $subtract: [
//                         { $month: utcDate.toDate() },
//                         { $month: "$createdAt" },
//                       ],
//                     },
//                     { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                   ],
//                 },
//                 12,
//               ],
//             },
//             0,
//           ],
//         },
//       ],
//     },
//     package_expiry_date: { $gt: utcDate },
//   });
//   if (
//     monthInterest &&
//     quaterlyInterest &&
//     halfyearlyInterest &&
//     yearlyInterest
//   ) {
//     let interestValue = [
//       ...monthInterest,
//       ...quaterlyInterest,
//       ...halfyearlyInterest,
//       ...yearlyInterest,
//     ];
//     let adminTransactionCreate = interestValue.map((val) => {
//       let amountData = (val.amount * val.commision) / 100;
//       return {
//         adminId: adminId[0]?._id,
//         userId: val.referral_user_id,
//         userSubscriptionId: val._id,
//         transaction_type: "Debit",
//         amount: amountData,
//         currency: val.currency,
//         payment_type: "commision",
//         currencyId: val.currencyId,
//       };
//     });
//     let userTransactionCreate = interestValue.map((val) => {
//       let amountData = (val.amount * val.commision) / 100;
//       return {
//         adminId: null,
//         userId: val.referral_user_id,
//         userSubscriptionId: val._id,
//         transaction_type: "Credit",
//         amount: amountData,
//         currency: val.currency,
//         payment_type: "commision",
//         currencyId: val.currencyId,
//       };
//     });
//     let userWalletData = interestValue.map((val) => {
//       let amountData = (val.amount * val.commision) / 100;
//       return {
//         userId: val.referral_user_id,
//         userSubscriptionId: val._id,
//         amount: amountData,
//         currencyId: ObjectId(val.currencyId),
//       };
//     });
//     let transactionData = [...adminTransactionCreate, ...userTransactionCreate];
//     let userWalletDataAdd = await UserWalletSchema.insertMany(userWalletData);
//     let completeMonthTransaction = await TransactionSchema.insertMany(
//       transactionData
//     );
//     let monthCommisionPaid = await UserSubscriptionSchema.updateMany(
//       {
//         roi_duration: "monthly",
//         is_referral_paid: false,
//         withdrawal_request: false,
//         withdrawal_date: null,
//         withdrawal_status: "Pending",
//         referral_user_id: { $ne: null },
//         $expr: {
//           $and: [
//             { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//             { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//             {
//               $cond: {
//                 if: {
//                   $eq: [
//                     { $month: "$createdAt" },
//                     { $month: moment(utcDate).toDate() },
//                   ],
//                 },
//                 then: {
//                   $ne: [
//                     { $year: "$createdAt" },
//                     { $year: moment(utcDate).toDate() },
//                   ],
//                 },
//                 else: {
//                   $cond: [
//                     { $eq: [date_start, 21] },
//                     {
//                       $cond: [
//                         {
//                           $eq: [
//                             {
//                               $subtract: [
//                                 { $month: utcDate.toDate() },
//                                 { $month: "$createdAt" },
//                               ],
//                             },
//                             1,
//                           ],
//                         },
//                         {
//                           $ne: [
//                             { $year: "$createdAt" },
//                             { $year: moment(utcDate).toDate() },
//                           ],
//                         },
//                         true,
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//               },
//             },
//             {
//               $eq: [
//                 {
//                   $mod: [
//                     {
//                       $subtract: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                       ],
//                     },
//                     1,
//                   ],
//                 },
//                 0,
//               ],
//             },
//           ],
//         },
//         package_expiry_date: { $gt: utcDate },
//       },
//       { $set: { is_referral_paid: true } }
//     );
//     let quaterlyCommisionPaid = await UserSubscriptionSchema.updateMany(
//       {
//         referral_user_id: { $ne: null },
//         is_referral_paid: false,
//         roi_duration: "quarterly",
//         withdrawal_request: false,
//         withdrawal_date: null,
//         $expr: {
//           $and: [
//             { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//             { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//             {
//               $cond: {
//                 if: {
//                   $eq: [
//                     { $month: "$createdAt" },
//                     { $month: moment(utcDate).toDate() },
//                   ],
//                 },
//                 then: {
//                   $ne: [
//                     { $year: "$createdAt" },
//                     { $year: moment(utcDate).toDate() },
//                   ],
//                 },
//                 else: {
//                   $cond: [
//                     { $eq: [date_start, 21] },
//                     {
//                       $cond: [
//                         {
//                           $eq: [
//                             {
//                               $subtract: [
//                                 { $month: utcDate.toDate() },
//                                 { $month: "$createdAt" },
//                               ],
//                             },
//                             1,
//                           ],
//                         },
//                         {
//                           $ne: [
//                             { $year: "$createdAt" },
//                             { $year: moment(utcDate).toDate() },
//                           ],
//                         },
//                         true,
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//               },
//             },
//             {
//               $eq: [
//                 {
//                   $mod: [
//                     {
//                       $subtract: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                       ],
//                     },
//                     3,
//                   ],
//                 },
//                 0,
//               ],
//             },
//           ],
//         },
//         package_expiry_date: { $gt: utcDate },
//       },
//       {
//         $set: {
//           is_referral_paid: true,
//         },
//       }
//     );
//     let halfyearlyCommisionPaid = await UserSubscriptionSchema.updateMany(
//       {
//         referral_user_id: { $ne: null },
//         is_referral_paid: false,
//         roi_duration: "halfyearly",
//         withdrawal_request: false,
//         withdrawal_date: null,
//         $expr: {
//           $and: [
//             { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//             { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//             {
//               $cond: {
//                 if: {
//                   $eq: [
//                     { $month: "$createdAt" },
//                     { $month: moment(utcDate).toDate() },
//                   ],
//                 },
//                 then: {
//                   $ne: [
//                     { $year: "$createdAt" },
//                     { $year: moment(utcDate).toDate() },
//                   ],
//                 },
//                 else: {
//                   $cond: [
//                     { $eq: [date_start, 21] },
//                     {
//                       $cond: [
//                         {
//                           $eq: [
//                             {
//                               $subtract: [
//                                 { $month: utcDate.toDate() },
//                                 { $month: "$createdAt" },
//                               ],
//                             },
//                             1,
//                           ],
//                         },
//                         {
//                           $ne: [
//                             { $year: "$createdAt" },
//                             { $year: moment(utcDate).toDate() },
//                           ],
//                         },
//                         true,
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//               },
//             },
//             {
//               $eq: [
//                 {
//                   $mod: [
//                     {
//                       $subtract: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                       ],
//                     },
//                     6,
//                   ],
//                 },
//                 0,
//               ],
//             },
//           ],
//         },
//         package_expiry_date: { $gt: utcDate },
//       },
//       {
//         $set: {
//           is_referral_paid: true,
//         },
//       }
//     );
//     let yearlyCommisionPaid = await UserSubscriptionSchema.updateMany(
//       {
//         referral_user_id: { $ne: null },
//         is_referral_paid: false,
//         roi_duration: "yearly",
//         withdrawal_request: false,
//         withdrawal_date: null,
//         $expr: {
//           $and: [
//             { $gte: [{ $dayOfMonth: "$createdAt" }, date_start] },
//             { $lte: [{ $dayOfMonth: "$createdAt" }, date_end] },
//             {
//               $cond: {
//                 if: {
//                   $eq: [
//                     { $month: "$createdAt" },
//                     { $month: moment(utcDate).toDate() },
//                   ],
//                 },
//                 then: {
//                   $ne: [
//                     { $year: "$createdAt" },
//                     { $year: moment(utcDate).toDate() },
//                   ],
//                 },
//                 else: {
//                   $cond: [
//                     { $eq: [date_start, 21] },
//                     {
//                       $cond: [
//                         {
//                           $eq: [
//                             {
//                               $subtract: [
//                                 { $month: utcDate.toDate() },
//                                 { $month: "$createdAt" },
//                               ],
//                             },
//                             1,
//                           ],
//                         },
//                         {
//                           $ne: [
//                             { $year: "$createdAt" },
//                             { $year: moment(utcDate).toDate() },
//                           ],
//                         },
//                         true,
//                       ],
//                     },
//                     true,
//                   ],
//                 },
//               },
//             },
//             {
//               $eq: [
//                 {
//                   $mod: [
//                     {
//                       $subtract: [
//                         {
//                           $subtract: [
//                             { $month: utcDate.toDate() },
//                             { $month: "$createdAt" },
//                           ],
//                         },
//                         { $cond: [{ $eq: [date_start, 21] }, 1, 0] },
//                       ],
//                     },
//                     12,
//                   ],
//                 },
//                 0,
//               ],
//             },
//           ],
//         },
//         package_expiry_date: { $gt: utcDate },
//       },
//       {
//         $set: {
//           is_referral_paid: true,
//         },
//       }
//     );
//     console.log(completeMonthTransaction, "transactionDatacase4");
//     console.log(userWalletDataAdd, "userWalletDataAdd4");
//     if (
//       monthCommisionPaid &&
//       quaterlyCommisionPaid &&
//       halfyearlyCommisionPaid &&
//       yearlyCommisionPaid
//     ) {
//       return completeMonthTransaction;
//     }
//   }
// };

// function generatePaddedNumber(number, width) {
//   return String(number).padStart(width, "0");
// }

// generate past subscription invoice
// const generatePastInvoice = async () => {
//   let data = await UserSubscriptionSchema.aggregate([
//     {
//       $match: {
//         usersubscriptionstatus: "Accepted",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "userId",
//         foreignField: "_id",
//         as: "userDetails",
//       },
//     },
//     { $unwind: "$userDetails" },
//     { $sort: { createdAt: 1 } },
//   ]);
//   console.log(data, "check25", data.length);

//   let generatepdf = data.map(async (val, index) => {
//     let paddedNumber = generatePaddedNumber(index + 1, 6);
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     let durationValue =
//       val.duration > 1 ? `${val.duration} Months` : `${val.duration} Month`;
//     let logopath = path.join(
//       `${__dirname.replace(
//         "service/Crone",
//         ""
//       )}/assets/logo/Secure Fintec Logo.png`
//     );
//     console.log(logopath, "check51");
//     let body = await invoiceHtml.MailSent({
//       invoiceNumber: paddedNumber,
//       invoiceDate: moment(val.createdAt).format("DD/MM/YYYY"),
//       userName: val.userDetails.name,
//       packageName: val.name,
//       packageDuration: durationValue,
//       netAmount: val.amount,
//       totalAmount: val.amount,
//       currencyName: val.currency,
//       logo: logopath,
//     });
//     await page.setContent(body);
//     await page.pdf({
//       path: `uploads/Invoice/Invoice-${paddedNumber}.pdf`,
//       format: "A4",
//       printBackground: true,
//     });
//     await browser.close();
//     let updateUserSubscriptionData =
//       await UserSubscriptionSchema.findByIdAndUpdate(
//         { _id: val._id },
//         {
//           $set: {
//             invoice_number: paddedNumber,
//           },
//         }
//       );
//     let createInvoiceData = await InvoiceSchema.create({
//       invoice_name: `Invoice-${paddedNumber}.pdf`,
//       invoice_number: paddedNumber,
//       userId: ObjectId(val.userDetails?._id),
//       usersubscriptionId: ObjectId(val._id),
//       currencyId: ObjectId(val.currencyId),
//     });
//     // console.log(paddedNumber,"check36")
//   });
// };

module.exports = {
  subscriptionMonthComplete,
  subscriptionInterest,
  // subscriptionWithDrawRequest,
  // subscriptionCommision,
  // subscriptionCommisionAtlastMonth,
  // subscriptionCommision,
  // generatePastInvoice,
};
