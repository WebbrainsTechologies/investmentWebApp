const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const AdminWallet = new Schema(
  {
    currencyId: {
      type: ObjectId,
      ref: "currency",
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

AdminWallet.set("toJSON", {
  getters: true,
  virtuals: true,
});

module.exports = mongoose.model("Adminwallet", AdminWallet);
