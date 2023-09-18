const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const SubscriptionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    currencyId: {
      type: ObjectId,
      ref: "currency",
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
      default: "one time",
    },
    commision: {
      type: Number,
      trim: true,
    },
    maximum_value: {
      type: Number,
      trim: true,
    },
    minimum_value: {
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
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

SubscriptionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
