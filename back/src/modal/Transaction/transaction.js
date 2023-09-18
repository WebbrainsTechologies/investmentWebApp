const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const UserTransactionSchema = new Schema(
  {
    adminId: {
      type: ObjectId,
      ref: "user",
      default: null,
    },
    userId: {
      type: ObjectId,
      ref: "user",
    },
    userSubscriptionId: {
      type: ObjectId,
      default: null,
      ref: "Usersubscription",
    },
    notificationId: {
      type: ObjectId,
      ref: "Notification",
    },
    transaction_type: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      trim: true,
    },
    payment_type: {
      type: String,
      trime: true,
      default: null,
    },
    currencyId: {
      type: ObjectId,
      default: null,
    },
    referral_user_id: {
      type: ObjectId,
      default: null,
      ref: "user",
    },
    acctual_package_amount: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserTransactionSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

UserTransactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Usertransaction", UserTransactionSchema);
