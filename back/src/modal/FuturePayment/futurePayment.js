const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const FuturePayment = new Schema(
  {
    currencyId: {
      type: ObjectId,
      ref: "currency",
    },
    userId: {
      type: ObjectId,
      ref: "user",
    },
    userSubscriptionId: {
      type: ObjectId,
      ref: "Usersubscription",
    },
    roi: {
      type: Number,
    },
    currency: {
      type: String,
      trim: true,
    },
    roi_date: {
      type: Date,
    },
    subscriptionId: {
      type: ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

FuturePayment.set("toJSON", {
  getters: true,
  virtuals: true,
});

FuturePayment.plugin(mongoosePaginate);

module.exports = mongoose.model("Futurepayment", FuturePayment);
