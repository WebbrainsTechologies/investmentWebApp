const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const UserWithdrawalSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
    currencyId: {
      type: ObjectId,
      ref: "currency",
    },
    notificationId: {
      type: ObjectId,
      ref: "Notification",
    },
    status: {
      type: String,
      default: "Pending",
      trim: true,
    },
    remark: {
      type: String,
      default: "",
      trim: true,
    },
    inr_amount: {
      type: Number,
      default: null,
    },
    amount: {
      type: Number,
    },
    withdrawal_file: {
      type: String,
      default: "",
      trim: true,
    },
    walletAddress: {
      type: String,
      default: "",
      trim: true,
    },
    hash_value: {
      type: String,
      default: "",
      trim: true,
    },
    withdrawal_type: {
      type: String,
      trim: true,
    },
    withdrawal_orderId: {
      type: String,
      default: "",
      trim: true,
    },
    senderWalletAddress: {
      type: String,
      default: "",
      trim: true,
    },
    network_type: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserWithdrawalSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

UserWithdrawalSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Userwithdrawal", UserWithdrawalSchema);
