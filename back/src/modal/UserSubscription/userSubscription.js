const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const UserSubscriptionSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
    subscriptionId: {
      type: ObjectId,
      ref: "Subscription",
    },
    notificationId: {
      type: ObjectId,
      ref: "Notification",
    },
    currencyId: {
      type: ObjectId,
      ref: "currency",
    },
    name: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      trim: true,
    },
    // multiply_value: {
    //   type: Number,
    //   trim: true,
    // },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      trim: true,
    },
    roi: {
      type: Number,
      trim: true,
    },
    roi_duration: {
      type: String,
      trim: true,
    },
    principal_withdrawal: {
      type: Number,
      trim: true,
    },
    commision_method: {
      type: String,
      trim: true,
    },
    commision: {
      type: Number,
      trim: true,
    },
    minimum_value: {
      type: Number,
      trim: true,
    },
    maximum_value: {
      type: Number,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
    usersubscriptionstatus: {
      type: String,
      default: "Pending",
    },
    withdrawal_request: {
      type: Boolean,
      default: false,
    },
    withdrawal_status: {
      type: String,
      default: "Pending",
    },
    withdrawal_date: {
      type: Date,
      default: null,
    },
    package_expiry_date: {
      type: Date,
    },
    referral_user_id: {
      type: ObjectId,
    },
    is_referral_paid: {
      type: Boolean,
      default: false,
    },
    onmeta_amount: {
      type: Number,
      default: null,
    },
    transfer_rate: {
      type: Number,
      default: null,
    },
    inr_amount: {
      type: Number,
      default: null,
    },
    investment_type: {
      type: String,
      default: "",
      trim: true,
    },
    onmeta_orderId: {
      type: String,
      trim: true,
      default: "",
    },
    onemeta_reason: {
      type: String,
      trim: true,
      default: "",
    },
    manual_purchase_image: {
      type: String,
      default: "",
      trim: true,
    },
    withdrawal_remark: {
      type: String,
      default: "",
      trim: true,
    },
    remark: {
      type: String,
      default: "",
      trim: true,
    },
    invoice_number: {
      type: String,
      default: "",
      trim: true,
    },
    payment_method: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSubscriptionSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

UserSubscriptionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Usersubscription", UserSubscriptionSchema);
