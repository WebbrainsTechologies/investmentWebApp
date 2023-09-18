const SubscriptionSchema = require("../../modal/Subscription/subscription");
const WithdrawalSchema = require("../../modal/Withdrawal/withdrawal");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");
const NotificationSchema = require("../../modal/Notification/notification");
const UserSchema = require("../../modal/User/user");
const UserWalletSchema = require("../../modal/UserWallet/userwallet");
const TransactionSchema = require("../../modal/Transaction/transaction");
const FuturePaymentSchema = require("../../modal/FuturePayment/futurePayment");
const ObjectId = require("mongodb").ObjectId;
const moment = require("moment");
const CurrencySchema = require("../../modal/Currency/currency");
const WithdrawEmailTemplate = require("../../emailTemplates/WithdrawalEmailTemplate");
const emailhandler = require("../../handler/emailhandler");
class UserSubscriptionService {
  constructor() {}
  // add withdrawal request
  async AddWithdrawRequest(payload, user, res) {
    try {
      if (payload?.withdrawal_type === "manual") {
        let pendingWithdrawalAmount = await WithdrawalSchema.aggregate([
          {
            $match: {
              currencyId: ObjectId(payload.currencyId),
              userId: user?._id,
              status: "Pending",
            },
          },
          {
            $group: {
              _id: null,
              getamountForPendingWithdrawal: { $sum: "$amount" },
            },
          },
        ]);
        let pendingamount = pendingWithdrawalAmount[0]
          ?.getamountForPendingWithdrawal
          ? pendingWithdrawalAmount[0]?.getamountForPendingWithdrawal?.toFixed(
              2
            )
          : 0;

        // console.log(pendingamount, "checkboth", pendingWithdrawalAmount);

        let totalWithdrawalRequest =
          Number(payload?.amount) + Number(pendingamount);

        // console.log(
        //   totalWithdrawalRequest,
        //   payload?.walletAmount,
        //   "checkboth1",
        //   payload?.walletAmount < totalWithdrawalRequest
        // );

        if (payload?.walletAmount < totalWithdrawalRequest) {
          return "insufficient balance/your earlier withdrawal request under approval.";
        }
      }
      let currencyName = await CurrencySchema.findById({
        _id: payload.currencyId,
      });
      let adminId = await UserSchema.findOne({ is_superadmin: true });
      let adminNotificationCreate = await NotificationSchema.create({
        userId: adminId?._id,
        title: "Withdrawal request",
        body: `${user?.name} made withdrae request for ${payload.amount} ${currencyName.name}`,
        n_type: "admin",
        n_link: "/manuallywithdrawrequest",
      });

      let data = await WithdrawalSchema.create({
        userId: user?._id,
        currencyId: ObjectId(payload.currencyId),
        withdrawal_type: payload.withdrawal_type,
        walletAddress: payload.walletAddress,
        amount: payload.amount,
        hash_value: payload.hash_value,
        transfer_rate: payload.transfer_rate,
        withdrawal_orderId: payload.withdrawal_orderId,
        notificationId: adminNotificationCreate?._id,
        senderWalletAddress: payload.senderWalletAddress,
        inr_amount: payload.inr_amount,
        network_type: payload.network_type,
      });
      return data;
    } catch (error) {
      // return error;
      throw new Error(error);
    }
  }
  // change withdrawal request status
  async changeWithdrawalRequestStatus(_id, payload, filename, res) {
    try {
      let data = await WithdrawalSchema.findByIdAndUpdate(
        { _id },
        {
          $set: {
            status: payload.status,
            hash_value: payload.hash_value ? payload.hash_value : "",
            remark: payload.remark ? payload.remark : "",
            withdrawal_file: filename ? filename : "",
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
      let currencyName = await CurrencySchema.findById({
        _id: data.currencyId,
      });
      let userNotificationCreate = await NotificationSchema.create({
        userId: payload.userId,
        title: `${payload.status}`,
        body: `Your withdraw request for ${data.amount} ${currencyName?.name}`,
        n_type: "user",
        n_link: "/usertransaction",
      });
      if (payload.status === "Accepted") {
        let adminID = await UserSchema.findOne({ is_superadmin: true });
        let userEmailAndName = await UserSchema.findOne(
          { _id: ObjectId(payload.userId) },
          { name: 1, email: 1 }
        );
        let userWalletMinusEntry = await UserWalletSchema.create({
          userId: ObjectId(payload.userId),
          currencyId: data.currencyId,
          amount: -data.amount,
          is_withdraw: true,
          userSubscriptionId: null,
        });

        let adminTransactionCreate = await TransactionSchema.create({
          adminId: adminID?._id,
          userId: ObjectId(payload.userId),
          userSubscriptionId: null,
          transaction_type: "Debit",
          amount: data?.amount,
          currencyId: payload.currencyId,
          currency: currencyName.name,
        });
        let body = await WithdrawEmailTemplate.MailSent({
          username: userEmailAndName.name,
        });

        await emailhandler.sendEmail(
          userEmailAndName.email,
          body,
          "Withdrawal",
          "",
          [],
          "",
          res
        );
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  // getall withdrawal request for admin
  async getallWithdrawalRequest(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
        populate: ["userId", "currencyId"],
      };
      let query = {};
      let data = await WithdrawalSchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // getall withdrawal request for user
  async getallWithdrawalRequestForUser(payload, user, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
        populate: "currencyId",
      };
      let query = { userId: user?._id };
      let data = await WithdrawalSchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // check pending withdrawal amount
  async checkPendingWithdrawal(payload, user, res) {
    try {
      let pendingWithdrawalAmount = await WithdrawalSchema.aggregate([
        {
          $match: {
            currencyId: ObjectId(payload.currencyId),
            userId: user?._id,
            status: "Pending",
          },
        },
        {
          $group: {
            _id: null,
            getamountForPendingWithdrawal: { $sum: "$amount" },
          },
        },
      ]);
      let pendingamount = pendingWithdrawalAmount[0]
        ?.getamountForPendingWithdrawal
        ? pendingWithdrawalAmount[0]?.getamountForPendingWithdrawal?.toFixed(2)
        : 0;

      // console.log(pendingamount, "checkboth", pendingWithdrawalAmount);

      let totalWithdrawalRequest =
        Number(payload?.amount) + Number(pendingamount);

      // console.log(
      //   totalWithdrawalRequest,
      //   payload?.walletAmount,
      //   "checkboth1",
      //   payload?.walletAmount < totalWithdrawalRequest
      // );
      if (payload?.walletAmount < totalWithdrawalRequest) {
        return "insufficient balance/your earlier withdrawal request under approval.";
      }
      return true;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
}

module.exports = new UserSubscriptionService();
