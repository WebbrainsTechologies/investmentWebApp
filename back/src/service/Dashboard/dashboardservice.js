const FuturePaymentSchema = require("../../modal/FuturePayment/futurePayment");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");
const SubscriptionSchema = require("../../modal/Subscription/subscription");
const TransactionSchema = require("../../modal/Transaction/transaction");
const UserSchema = require("../../modal/User/user");
const AdminWalletSchema = require("../../modal/AdminWallet/adminwallet");
const UserWalletSchema = require("../../modal/UserWallet/userwallet");
const ObjectId = require("mongodb").ObjectId;

const moment = require("moment");

class DashboardService {
  constructor() {}
  // // get user dashboard data for total investment
  // async getUserDashboardDataForTotalInvestment(_id, user, res) {
  //   try {
  //     console.log(user?._id, "chcekuserid");
  //     // for total investment
  //     let userTotalInvestmentData = await UserSubscriptionSchema.aggregate([
  //       {
  //         $match: {
  //           userId: user?._id,
  //           usersubscriptionstatus: "Accepted",
  //           currencyId: ObjectId(_id),
  //           withdrawal_request: false,
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "userId",
  //           userTotalInvestment: { $sum: "$amount" },
  //         },
  //       },
  //     ]);

  //     // for asset calculation
  //     let userTotalInvestmentDataForAsset =
  //       await UserSubscriptionSchema.aggregate([
  //         {
  //           $match: {
  //             userId: user?._id,
  //             usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
  //             currencyId: ObjectId(_id),
  //             withdrawal_request: false,
  //           },
  //         },
  //         {
  //           $group: {
  //             _id: "userId",
  //             userTotalInvestment: { $sum: "$amount" },
  //           },
  //         },
  //       ]);
  //     let userWithdrawalBeforeTime = await UserSubscriptionSchema.aggregate([
  //       {
  //         $match: {
  //           userId: user?._id,
  //           withdrawal_request: true,
  //           withdrawal_date: { $ne: null },
  //           currencyId: ObjectId(_id),
  //           withdrawal_status: { $in: ["Closed", "Pending"] },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "userId",
  //           userTotalWithdrawalAmount: {
  //             $sum: {
  //               $divide: [
  //                 { $multiply: ["$amount", "principal_withdrawal"] },
  //                 100,
  //               ],
  //             },
  //           },
  //         },
  //       },
  //     ]);
  //     let totalInterest = await FuturePaymentSchema.aggregate([
  //       {
  //         $match: {
  //           userId: user._id,
  //           currencyId: ObjectId(_id),
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "currencyId",
  //           userTotalInterest: { $sum: "$roi" },
  //         },
  //       },
  //     ]);
  //     let userTotalCommisionAmount = await UserWalletSchema.aggregate([
  //       {
  //         $match: {
  //           adminId: null,
  //           userId: user?._id,
  //           currencyId: ObjectId(_id),
  //           payment_type: "commision",
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "userId",
  //           userCommisionGain: { $sum: "$amount" },
  //         },
  //       },
  //     ]);

  //     // for currentmonth income
  //     let today = moment(new Date()).utc();
  //     let startDate = moment(today).startOf("month").startOf("day");
  //     let endDate = moment(today).endOf("month").endOf("day");
  //     console.log(today, "checktoday", startDate, endDate);
  //     let roiGain = await TransactionSchema.aggregate([
  //       {
  //         $match: {
  //           adminId: null,
  //           userId: user?._id,
  //           currencyId: ObjectId(_id),
  //           createdAt: {
  //             $gte: moment(startDate).toDate(),
  //             $lte: moment(endDate).toDate(),
  //           },
  //           payment_type: "roi",
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "userId",
  //           userRoiGain: { $sum: "$amount" },
  //         },
  //       },
  //     ]);
  //     let commisionGain = await TransactionSchema.aggregate([
  //       {
  //         $match: {
  //           adminId: null,
  //           userId: user?._id,
  //           currencyId: ObjectId(_id),
  //           createdAt: {
  //             $gte: moment(startDate).toDate(),
  //             $lte: moment(endDate).toDate(),
  //           },
  //           payment_type: "commision",
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "userId",
  //           userCommisionGain: { $sum: "$amount" },
  //         },
  //       },
  //     ]);

  //     // fot wallerAmount
  //     let walletAmount = await UserWalletSchema.aggregate([
  //       {
  //         $match: {
  //           currencyId: ObjectId(_id),
  //           userId: user._id,
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "userId",
  //           userwalletData: { $sum: "$amount" },
  //         },
  //       },
  //     ]);

  //     let mainObj = await Promise.all([
  //       userTotalInvestmentData,
  //       totalInterest,
  //       roiGain,
  //       commisionGain,
  //       walletAmount,
  //     ]);
  //     let roiGainData = roiGain[0]?.userRoiGain ? roiGain[0]?.userRoiGain : 0;
  //     let commisionGainData = commisionGain[0]?.userCommisionGain
  //       ? commisionGain[0]?.userCommisionGain
  //       : 0;
  //     let obj = {
  //       userTotalAsset: 0,
  //       userTotalInvestment: 0,
  //       commision: 0,
  //       roi: 0,
  //       walletAmount: 0,
  //     };
  //     if (mainObj) {
  //       obj = {
  //         ...obj,
  //         userTotalInvestment: userTotalInvestmentData[0]?.userTotalInvestment
  //           ? userTotalInvestmentData[0]?.userTotalInvestment
  //           : 0,
  //         userTotalAsset:
  //           (userTotalInvestmentData[0]?.userTotalInvestment
  //             ? userTotalInvestmentData[0]?.userTotalInvestment
  //             : 0) +
  //           (totalInterest[0]?.userTotalInterest
  //             ? totalInterest[0]?.userTotalInterest
  //             : 0),
  //         monthGain: roiGainData + commisionGainData,
  //         commision: commisionGainData,
  //         roi: roiGainData,
  //         walletAmount: walletAmount[0]?.userwalletData
  //           ? walletAmount[0]?.userwalletData
  //           : 0,
  //       };
  //     }
  //     console.log(obj, "checkobj");
  //     return obj;
  //   } catch (error) {
  //     console.log(error, "60");
  //     throw new Error(error);
  //   }
  // }
  // get user dashboard data for total investment
  async getUserDashboardDataForTotalInvestment(_id, user, res) {
    try {
      let userTotalInvestmentData = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            userId: user?._id,
            usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
            currencyId: ObjectId(_id),
            // withdrawal_status: { $ne: "Closed" },
          },
        },
        {
          $group: {
            _id: "userId",
            userTotalInvestment: { $sum: "$amount" },
          },
        },
      ]);
      let data = {
        userTotalInvestment: userTotalInvestmentData[0]?.userTotalInvestment
          ? userTotalInvestmentData[0]?.userTotalInvestment?.toFixed(2)
          : 0,
      };
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user dashboard data for total asset
  async getUserDashboardDataForTotalAsset(_id, user, res) {
    try {
      let userTotalInvestmentDataForAsset =
        await UserSubscriptionSchema.aggregate([
          {
            $match: {
              userId: user?._id,
              usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
              currencyId: ObjectId(_id),
              withdrawal_request: false,
              // withdrawal_status: { $ne: "Closed" },
            },
          },
          {
            $group: {
              _id: "userId",
              userTotalInvestment: { $sum: "$amount" },
            },
          },
        ]);
      let userWithdrawalBeforeTime = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            userId: user?._id,
            withdrawal_request: true,
            withdrawal_date: { $ne: null },
            currencyId: ObjectId(_id),
            withdrawal_status: { $in: ["Closed", "Pending"] },
          },
        },
        {
          $group: {
            _id: "userId",
            userTotalWithdrawalAmount: {
              $sum: {
                $divide: [
                  { $multiply: ["$amount", "$principal_withdrawal"] },
                  100,
                ],
              },
            },
          },
        },
      ]);
      let totalInterest = await FuturePaymentSchema.aggregate([
        {
          $match: {
            userId: user._id,
            currencyId: ObjectId(_id),
          },
        },
        {
          $group: {
            _id: "currencyId",
            userTotalInterest: { $sum: "$roi" },
          },
        },
      ]);
      let userTotalCommisionAmount = await TransactionSchema.aggregate([
        {
          $match: {
            adminId: null,
            userId: user?._id,
            currencyId: ObjectId(_id),
            payment_type: "commision",
          },
        },
        {
          $group: {
            _id: "userId",
            userCommisionGain: { $sum: "$amount" },
          },
        },
      ]);
      let withdrawalAmountData = await UserWalletSchema.aggregate([
        {
          $match: {
            currencyId: ObjectId(_id),
            userId: user?._id,
            amount: { $lt: 0 },
            is_withdraw: true,
          },
        },
        {
          $group: {
            _id: "userId",
            userwithdrawalData: { $sum: "$amount" },
          },
        },
      ]);
      // console.log(withdrawalAmountData, "check337", _id, user?._id);
      let data = Promise.all([
        userTotalInvestmentDataForAsset,
        userWithdrawalBeforeTime,
        totalInterest,
        userTotalCommisionAmount,
        withdrawalAmountData,
      ]);

      let obj = {
        totalAsset: 0,
        withdrawn: 0,
      };

      if (data) {
        let totalinvestmentasset = userTotalInvestmentDataForAsset[0]
          ?.userTotalInvestment
          ? userTotalInvestmentDataForAsset[0]?.userTotalInvestment
          : 0;
        let userWithdrawalBeforeTimeData = userWithdrawalBeforeTime[0]
          ?.userTotalWithdrawalAmount
          ? userWithdrawalBeforeTime[0]?.userTotalWithdrawalAmount
          : 0;
        let totalInterestUserGet = totalInterest[0]?.userTotalInterest
          ? totalInterest[0]?.userTotalInterest
          : 0;
        let totalCommisionGet = userTotalCommisionAmount[0]?.userCommisionGain
          ? userTotalCommisionAmount[0]?.userCommisionGain
          : 0;
        let withdrawalAmount = withdrawalAmountData[0]?.userwithdrawalData
          ? withdrawalAmountData[0]?.userwithdrawalData
          : 0;
        // console.log(totalinvestmentasset, "check370");
        // console.log(userWithdrawalBeforeTimeData, "check371");
        // console.log(totalInterestUserGet, "check372");
        // console.log(totalCommisionGet, "check373");
        // console.log(withdrawalAmount, "chek374");
        obj = {
          totalAsset: (
            totalinvestmentasset +
            userWithdrawalBeforeTimeData +
            totalInterestUserGet +
            totalCommisionGet +
            withdrawalAmount
          )?.toFixed(2),
          withdrawn: -withdrawalAmount?.toFixed(2),
        };
      }
      // console.log(obj, "chckeobj");
      return obj;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user dashboard data for current month income
  async getUserDashboardDataForCurrentMonthIncome(_id, user, res) {
    try {
      let today = moment(new Date()).utc();
      let startDate = moment(today).startOf("month").startOf("day");
      let endDate = moment(today).endOf("month").endOf("day");
      // console.log(startDate, "checkbothData", endDate);
      // console.log(today, "checktoday", startDate, endDate);
      let roiGain = await TransactionSchema.aggregate([
        {
          $match: {
            adminId: null,
            userId: user?._id,
            currencyId: ObjectId(_id),
            createdAt: {
              $gte: moment(startDate).toDate(),
              $lte: moment(endDate).toDate(),
            },
            payment_type: "roi",
          },
        },
        {
          $group: {
            _id: "userId",
            userRoiGain: { $sum: "$amount" },
          },
        },
      ]);
      let commisionGain = await TransactionSchema.aggregate([
        {
          $match: {
            adminId: null,
            userId: user?._id,
            currencyId: ObjectId(_id),
            createdAt: {
              $gte: moment(startDate).toDate(),
              $lte: moment(endDate).toDate(),
            },
            payment_type: "commision",
          },
        },
        {
          $group: {
            _id: "userId",
            userCommisionGain: { $sum: "$amount" },
          },
        },
      ]);
      // console.log(commisionGain, "check441");
      let roi = roiGain[0]?.userRoiGain ? roiGain[0]?.userRoiGain : 0;
      let commision = commisionGain[0]?.userCommisionGain
        ? commisionGain[0]?.userCommisionGain
        : 0;
      let totalMonthIncome = roi + commision;
      return {
        roi: roi?.toFixed(2),
        commision: commision?.toFixed(2),
        monthGain: totalMonthIncome?.toFixed(2),
      };
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user dashboard data for wallet amount
  async getUserDashboardDataForWalletAmount(_id, user, res) {
    try {
      let walletAmount = await UserWalletSchema.aggregate([
        {
          $match: {
            currencyId: ObjectId(_id),
            userId: user._id,
          },
        },
        {
          $group: {
            _id: "userId",
            userwalletData: { $sum: "$amount" },
          },
        },
      ]);

      let data = {
        walletAmount: walletAmount[0]?.userwalletData
          ? walletAmount[0]?.userwalletData?.toFixed(2)
          : 0,
      };
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user purhcased subscription data
  async getUserPurchesedSubscription(payload, user, res) {
    try {
      // console.log(user._id, "userid");
      let data = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            userId: user._id,
            usersubscriptionstatus: "Accepted",
          },
        },
        {
          $group: {
            _id: "$subscriptionId",
            name: { $first: "$name" },
            subscriptionId: { $first: "$subscriptionId" },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user purhcased subscription data
  // async getAdminDashboardSubscriptionData(user, res) {
  //   try {
  //     let data = await UserSubscriptionSchema.find({})
  //       .populate("userId")
  //       .sort({ createdAt: -1 })
  //       .limit(10);
  //     return data;
  //   } catch (error) {
  //     console.log(error, "60");
  //     throw new Error(error);
  //   }
  // }

  // get user purhcased subscription data
  async getAdminDashboardSubscriptionData(user, res) {
    try {
      let data = await UserSubscriptionSchema.find({})
        .populate("userId")
        .sort({ createdAt: -1 })
        .limit(5);
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get subscription data for admin
  async getAdminDashboardSubscription(user, res) {
    try {
      let data = await SubscriptionSchema.find({}, { name: 1 }).sort({
        createdAt: -1,
      });
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get admin dashboard data
  async getAdminDashboardData(_id, user, res) {
    try {
      // let totaluser = await UserSchema.countDocuments({
      //   is_superadmin: false,
      //   is_delete: false,
      // });

      let adminWalletBalanceByCurrency = await AdminWalletSchema.findOne({
        currencyId: ObjectId(_id),
      });
      let CurrencyTotalInvestment = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            $or: [
              { usersubscriptionstatus: "Accepted" },
              { usersubscriptionstatus: "Closed" },
            ],
            currencyId: ObjectId(_id),
          },
        },
        {
          $group: {
            _id: "currencyId",
            userTotalInvestment: { $sum: "$amount" },
          },
        },
      ]);
      let today = moment(new Date()).utc();
      // console.log(today, "checktoday");
      let startDate = moment(today).startOf("month").startOf("day");
      let endDate = moment(today).endOf("month").endOf("day");
      // let CurrentMonthPackageTotalInterestToPay =
      //   await FuturePaymentSchema.aggregate([
      //     {
      //       $match: {
      //         currencyId: ObjectId(_id),
      //         roi_date: {
      //           $gte: moment(startDate).toDate(),
      //           $lte: moment(endDate).toDate(),
      //         },
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: "currencyId",
      //         totalcurrentmontInteresttopay: { $sum: "$roi" },
      //       },
      //     },
      //   ]);

      // let currentMonthWithdrawDataByCurrency = await UserWalletSchema.aggregate(
      //   [
      //     {
      //       $match: {
      //         currencyId: ObjectId(_id),
      //         is_withdraw: true,
      //         createdAt: {
      //           $gte: moment(startDate).toDate(),
      //           $lte: moment(endDate).toDate(),
      //         },
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: null,
      //         totalwithdrawalamount: { $sum: "$amount" },
      //       },
      //     },
      //   ]
      // );
      let currentMonthInvestmentByCurrency =
        await UserSubscriptionSchema.aggregate([
          {
            $match: {
              usersubscriptionstatus: "Accepted",
              currencyId: ObjectId(_id),
              createdAt: {
                $gte: moment(startDate).toDate(),
                $lte: moment(endDate).toDate(),
              },
            },
          },
          {
            $group: {
              _id: "currencyId",
              totalcurrentmonthInvestment: { $sum: "$amount" },
            },
          },
        ]);
      let mainObj = await Promise.all([
        CurrencyTotalInvestment,
        // currentMonthWithdrawDataByCurrency,
        currentMonthInvestmentByCurrency,
      ]);
      let obj = {
        TotalInvestment: 0,
        CurrentMonthInvestment: 0,
        // CurrentMonthWithdrawal: 0,
        adminWalletBalance: 0,
      };
      if (mainObj) {
        obj = {
          ...obj,
          // CurrentMonthPackageTotalInterestToPay:
          //   CurrentMonthPackageTotalInterestToPay[0]
          //     ?.totalcurrentmontInteresttopay
          //     ? CurrentMonthPackageTotalInterestToPay[0]
          //         ?.totalcurrentmontInteresttopay
          //     : 0,
          TotalInvestment: CurrencyTotalInvestment[0]?.userTotalInvestment
            ? CurrencyTotalInvestment[0]?.userTotalInvestment?.toFixed(2)
            : 0,
          CurrentMonthInvestment: currentMonthInvestmentByCurrency[0]
            ?.totalcurrentmonthInvestment
            ? currentMonthInvestmentByCurrency[0]?.totalcurrentmonthInvestment?.toFixed(
                2
              )
            : 0,
          // CurrentMonthWithdrawal: currentMonthWithdrawDataByCurrency[0]
          //   ?.totalwithdrawalamount
          //   ? currentMonthWithdrawDataByCurrency[0]?.totalwithdrawalamount
          //   : 0,
          adminWalletBalance: adminWalletBalanceByCurrency?.amount
            ? adminWalletBalanceByCurrency?.amount?.toFixed(2)
            : 0,
        };
      }
      // console.log(obj, "check228");
      return obj;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get admin dashboard witdrawal data by month
  async getAdminDashboardWithdrawalDatabyMonth(_id, payload, user, res) {
    try {
      let startDate = moment(payload.selectedDate)
        .utc()
        .startOf("month")
        .startOf("day");
      let endDate = moment(payload.selectedDate)
        .utc()
        .endOf("month")
        .endOf("day");
      let currentMonthWithdrawDataByCurrency =
        await FuturePaymentSchema.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $unwind: "$userDetails",
          },
          {
            $match: {
              "userDetails.is_delete": false,
              currencyId: ObjectId(_id),
              roi_date: {
                $gte: moment(startDate).toDate(),
                $lte: moment(endDate).toDate(),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalwithdrawalamount: { $sum: "$roi" },
            },
          },
        ]);
      let currentMonthWithdrawDataByDate = await FuturePaymentSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.is_delete": false,
            currencyId: ObjectId(_id),
            roi_date: {
              $gte: moment(startDate).toDate(),
              $lte: moment(endDate).toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$roi_date",
                timezone: "UTC",
              },
            },
            totalwithdrawalamount: { $sum: "$roi" },
          },
        },
      ]);
      // console.log(currentMonthWithdrawDataByDate, "check746");
      let firstDate = 0;
      let elevenDate = 0;
      let twentyoneDate = 0;
      let data = currentMonthWithdrawDataByDate?.map((val) => {
        let dateValue = val._id?.split("-")[2];
        // console.log(
        //   dateValue,
        //   "dateValue",
        //   typeof dateValue,
        //   Number(dateValue)
        // );
        if (dateValue === "01") {
          firstDate = val.totalwithdrawalamount;
        } else if (dateValue === "11") {
          elevenDate = val.totalwithdrawalamount;
        } else if (dateValue === "21") {
          twentyoneDate = val.totalwithdrawalamount;
        }
      });
      // console.log(firstDate, "checkfirst");
      // console.log(elevenDate, "checkeleven");
      // console.log(twentyoneDate, "checkfirst");

      let packageExpiryAmount = await UserSubscriptionSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.is_delete": false,
            currencyId: ObjectId(_id),
            withdrawal_date: null,
            usersubscriptionstatus: "Accepted",
            package_expiry_date: {
              $gte: moment(startDate).toDate(),
              $lte: moment(endDate).toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$package_expiry_date",
                timezone: "UTC",
              },
            },
            totalwithdrawalamount: { $sum: "$amount" },
          },
        },
      ]);
      let currentMonthPackageExpiryDataByCurrency =
        await UserSubscriptionSchema.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $unwind: "$userDetails",
          },
          {
            $match: {
              "userDetails.is_delete": false,
              currencyId: ObjectId(_id),
              package_expiry_date: {
                $gte: moment(startDate).toDate(),
                $lte: moment(endDate).toDate(),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalwithdrawalamount: { $sum: "$amount" },
            },
          },
        ]);
      // console.log(currentMonthPackageExpiryDataByCurrency, "check813");
      let packageExpireData = packageExpiryAmount?.map((val) => {
        let dateValue = val._id?.split("-")[2];
        // console.log(
        //   dateValue,
        //   "dateValue",
        //   typeof dateValue,
        //   Number(dateValue)
        // );
        if (dateValue === "01") {
          firstDate += val.totalwithdrawalamount;
        } else if (dateValue === "11") {
          elevenDate += val.totalwithdrawalamount;
        } else if (dateValue === "21") {
          twentyoneDate += val.totalwithdrawalamount;
        }
      });
      // console.log(
      //   packageExpiryAmount,
      //   "check795",
      //   typeof currentMonthWithdrawDataByCurrency[0]?.totalwithdrawalamount,
      //   typeof currentMonthPackageExpiryDataByCurrency[0]
      //     ?.totalwithdrawalamount,
      //   currentMonthWithdrawDataByCurrency[0]?.totalwithdrawalamount,
      //   currentMonthPackageExpiryDataByCurrency[0]?.totalwithdrawalamount,
      //   typeof currentMonthWithdrawDataByCurrency[0]?.totalwithdrawalamount?.toFixed(
      //     2
      //   )
      // );

      let totalcurrentmonthwithdrawalamount =
        (currentMonthWithdrawDataByCurrency[0]?.totalwithdrawalamount
          ? Number(
              currentMonthWithdrawDataByCurrency[0]?.totalwithdrawalamount?.toFixed(
                2
              )
            )
          : 0) +
        (currentMonthPackageExpiryDataByCurrency[0]?.totalwithdrawalamount
          ? Number(
              currentMonthPackageExpiryDataByCurrency[0]?.totalwithdrawalamount?.toFixed(
                2
              )
            )
          : 0);
      let obj = {
        CurrentMonthWithdrawal: totalcurrentmonthwithdrawalamount,
        firstDate: firstDate ? firstDate?.toFixed(2) : 0,
        elevenDate: elevenDate ? elevenDate?.toFixed(2) : 0,
        twentyoneDate: twentyoneDate ? twentyoneDate?.toFixed(2) : 0,
      };
      // console.log(obj, "checkobj757");
      return obj;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get admin dashboard  data of pending withdrawal
  async getAdminDashboardPendingWithdrawalData(_id, user, res) {
    try {
      let data = await UserWalletSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.is_delete": false,
            currencyId: ObjectId(_id),
          },
        },
        {
          $group: {
            _id: "currencyId",
            totalWithdrawalPending: { $sum: "$amount" },
          },
        },
      ]);
      // console.log(data[0]?.totalWithdrawalPending, "check790");
      let mainData = {
        PendingWithdrawal: data[0]?.totalWithdrawalPending
          ? data[0]?.totalWithdrawalPending?.toFixed(2)
          : 0,
      };
      return mainData;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
  // get admin dashboard chart data
  async getAdminDashboardChartData(_id, user, res) {
    try {
      let today = moment(new Date()).utc();
      let yearStartDate = moment(today).startOf("year").startOf("day");
      let yearEndDate = moment(today).endOf("year").endOf("day");
      let data = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            $or: [
              { usersubscriptionstatus: "Accepted" },
              { usersubscriptionstatus: "Closed" },
            ],
            currencyId: ObjectId(_id),
            createdAt: {
              $gte: moment(yearStartDate).toDate(),
              $lte: moment(yearEndDate).toDate(),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);
      // console.log(data, "check984");
      const monthlyAmounts = Array.from({ length: 12 }, () => 0); // Create an array of 12 zeros

      data.forEach(({ _id, totalAmount }) => {
        monthlyAmounts[_id - 1] = totalAmount; // Update the corresponding index with the total amount
      });
      return monthlyAmounts;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // edit admin wallet balance by currency id
  async editAdminWalletBalance(_id, payload, user, res) {
    try {
      // console.log(_id, payload, "check394");
      let data = await AdminWalletSchema.findOneAndUpdate(
        { currencyId: ObjectId(_id) },
        { amount: Number(payload.amount) },
        { new: true }
      );
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get admin wallet balance by currency id
  async getAdminWalletBalance(_id, payload, user, res) {
    try {
      let data = await AdminWalletSchema.findOne({ currencyId: ObjectId(_id) });
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get admin dashboard total asset by currency id
  async getAdminDashboardTotalAsset(_id, payload, user, res) {
    try {
      let userTotalInvestmentDataForAsset =
        await UserSubscriptionSchema.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $unwind: "$userDetails",
          },
          {
            $match: {
              "userDetails.is_delete": false,
              usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
              currencyId: ObjectId(_id),
              withdrawal_request: false,
              // withdrawal_status: { $ne: "Closed" },
            },
          },
          {
            $group: {
              _id: null,
              userTotalInvestment: { $sum: "$amount" },
            },
          },
        ]);
      let userWithdrawalBeforeTime = await UserSubscriptionSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.is_delete": false,
            withdrawal_request: true,
            withdrawal_date: { $ne: null },
            currencyId: ObjectId(_id),
            withdrawal_status: { $in: ["Closed", "Pending"] },
          },
        },
        {
          $group: {
            _id: null,
            userTotalWithdrawalAmount: {
              $sum: {
                $divide: [
                  { $multiply: ["$amount", "$principal_withdrawal"] },
                  100,
                ],
              },
            },
          },
        },
      ]);
      let totalInterest = await FuturePaymentSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.is_delete": false,
            currencyId: ObjectId(_id),
          },
        },
        {
          $group: {
            _id: "currencyId",
            userTotalInterest: { $sum: "$roi" },
          },
        },
      ]);
      let userTotalCommisionAmount = await TransactionSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.is_delete": false,
            adminId: null,
            currencyId: ObjectId(_id),
            payment_type: "commision",
          },
        },
        {
          $group: {
            _id: null,
            userCommisionGain: { $sum: "$amount" },
          },
        },
      ]);
      let withdrawalAmountData = await UserWalletSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.is_delete": false,
            currencyId: ObjectId(_id),
            amount: { $lt: 0 },
            is_withdraw: true,
          },
        },
        {
          $group: {
            _id: null,
            userwithdrawalData: { $sum: "$amount" },
          },
        },
      ]);

      let totalinvestmentasset = userTotalInvestmentDataForAsset[0]
        ?.userTotalInvestment
        ? userTotalInvestmentDataForAsset[0]?.userTotalInvestment
        : 0;
      let userWithdrawalBeforeTimeData = userWithdrawalBeforeTime[0]
        ?.userTotalWithdrawalAmount
        ? userWithdrawalBeforeTime[0]?.userTotalWithdrawalAmount
        : 0;
      let totalInterestUserGet = totalInterest[0]?.userTotalInterest
        ? totalInterest[0]?.userTotalInterest
        : 0;
      let totalCommisionGet = userTotalCommisionAmount[0]?.userCommisionGain
        ? userTotalCommisionAmount[0]?.userCommisionGain
        : 0;
      let withdrawalAmount = withdrawalAmountData[0]?.userwithdrawalData
        ? withdrawalAmountData[0]?.userwithdrawalData
        : 0;
      let totalAsset = (
        totalinvestmentasset +
        userWithdrawalBeforeTimeData +
        totalInterestUserGet +
        totalCommisionGet +
        withdrawalAmount
      )?.toFixed(2);
      // console.log(totalAsset, "checktotalasset");
      return { data: totalAsset };
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
}

module.exports = new DashboardService();
