const UserWalletSchema = require("../../modal/UserWallet/userwallet");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");
const TransactionSchema = require("../../modal/Transaction/transaction");
const FuturePaymentSchema = require("../../modal/FuturePayment/futurePayment");
const paginate = require("../../helper/pagination");
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

class UserDetailService {
  constructor() {}
  // get user detail data for total investment
  async getUserDetailsForTotalInvestment(_id, payload, res) {
    try {
      let userTotalInvestmentData = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            userId: ObjectId(payload?.userId),
            currencyId: ObjectId(_id),
            $or: [
              { usersubscriptionstatus: "Accepted" },
              { usersubscriptionstatus: "Cancelled" },
            ],
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
  async getUserDetailsForTotalAsset(_id, payload, res) {
    try {
      let userTotalInvestmentDataForAsset =
        await UserSubscriptionSchema.aggregate([
          {
            $match: {
              userId: ObjectId(payload?.userId),
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
            userId: ObjectId(payload?.userId),
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
            userId: ObjectId(payload?.userId),
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
            userId: ObjectId(payload?.userId),
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
            userId: ObjectId(payload?.userId),
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
      // console.log(withdrawalAmountData, "check337", _id, payload?.userId);
      let data = Promise.all([
        userTotalInvestmentDataForAsset,
        userWithdrawalBeforeTime,
        totalInterest,
        userTotalCommisionAmount,
        withdrawalAmountData,
      ]);

      let obj = {
        totalAsset: 0,
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
        // console.log(totalinvestmentasset, "check1370");
        // console.log(userWithdrawalBeforeTimeData, "check1371");
        // console.log(totalInterestUserGet, "check1372");
        // console.log(totalCommisionGet, "check1373");
        // console.log(withdrawalAmount, "chek1374");
        obj = {
          totalAsset: (
            totalinvestmentasset +
            userWithdrawalBeforeTimeData +
            totalInterestUserGet +
            totalCommisionGet +
            withdrawalAmount
          )?.toFixed(2),
        };
      }
      // console.log(obj, "chckeobj");
      return obj;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user detail data for total withdrawal
  async getUserDetailsForTotalWithdrawal(_id, payload, res) {
    try {
      let withdrawalAmountData = await UserWalletSchema.aggregate([
        {
          $match: {
            currencyId: ObjectId(_id),
            userId: ObjectId(payload?.userId),
            amount: { $lt: 0 },
          },
        },
        {
          $group: {
            _id: "userId",
            userwithdrawalData: { $sum: "$amount" },
          },
        },
      ]);
      // console.log(withdrawalAmountData, "check56");
      let withdrawalAmount = withdrawalAmountData[0]?.userwithdrawalData
        ? -withdrawalAmountData[0]?.userwithdrawalData?.toFixed(2)
        : 0;

      let obj = {
        withdrawn: withdrawalAmount,
      };
      // console.log(obj, "chckeobj");
      return obj;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user detail data for roi and commision
  async getUserDetailsForRoiAndCommision(_id, payload, res) {
    try {
      let roiGain = await TransactionSchema.aggregate([
        {
          $match: {
            adminId: null,
            userId: ObjectId(payload?.userId),
            currencyId: ObjectId(_id),
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
            userId: ObjectId(payload?.userId),
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
      let roi = roiGain[0]?.userRoiGain
        ? roiGain[0]?.userRoiGain?.toFixed(2)
        : 0;
      let commision = commisionGain[0]?.userCommisionGain
        ? commisionGain[0]?.userCommisionGain?.toFixed(2)
        : 0;
      return {
        roi: roi,
        commision: commision,
      };
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user detail data for wallet amount
  async getUserDetailsForWalletAmount(_id, payload, res) {
    try {
      let walletAmount = await UserWalletSchema.aggregate([
        {
          $match: {
            currencyId: ObjectId(_id),
            userId: ObjectId(payload?.userId),
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

  // get user approved subsctiption without pagination by user id
  async getUserApproveSubscriptionWithoutPagination(_id, res) {
    try {
      let data = await UserSubscriptionSchema.find({
        userId: ObjectId(_id),
        usersubscriptionstatus: "Accepted",
      }).sort({ createdAt: -1 });
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user future payout without pagination by user id
  async getUserFuturePayout(_id, payload, res) {
    try {
      // let { page, limit, sort_on, sort, year } = payload;

      // Get the current year
      // let subscriptionyearfirstDate;
      // let subscriptionyearlastDate;
      // if (payload.year > 1) {
      //   subscriptionyearfirstDate = moment(payload.createdAt)
      //     .add(payload.year - 1, "year")
      //     .startOf("day");
      //   subscriptionyearlastDate = moment(subscriptionyearfirstDate)
      //     .add(1, "year")
      //     .endOf("day");
      // } else {
      //   subscriptionyearfirstDate = moment(payload.createdAt).startOf("day");
      //   subscriptionyearlastDate = moment(payload.createdAt)
      //     .add(1, "year")
      //     .endOf("day");
      // }
      // console.log(
      //   subscriptionyearfirstDate,
      //   "firstDate",
      //   subscriptionyearlastDate,
      //   "lastDate"
      // );
      let query = {
        userId: ObjectId(_id),
        userSubscriptionId: ObjectId(payload.userSubscriptionId),
        // roi_date: {
        //   $gte: new Date(subscriptionyearfirstDate),
        //   $lte: new Date(subscriptionyearlastDate),
        // },
      };
      // let data = await FuturePaymentSchema.paginate(query, options);
      // console.log(data, "checkdata");
      let data = await FuturePaymentSchema.find(query).sort({ roi_date: 1 });

      let dataWithProgressBar = data.map((val) => {
        let createdAtDate = moment(val.createdAt);
        let roiDate = moment(val.roi_date);
        let today = moment(new Date()).utc();
        let totaldays = roiDate.diff(createdAtDate, "days");
        let completedDate = today.diff(createdAtDate, "days");
        let progresswith = (completedDate * 100) / totaldays;
        return {
          ...val?._doc,
          progress: progresswith,
        };
      });
      return dataWithProgressBar;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
}

module.exports = new UserDetailService();
