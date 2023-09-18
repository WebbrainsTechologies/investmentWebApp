const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const UserWalletSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
    userSubscriptionId: {
      type: ObjectId,
      default: null,
      ref: "Usersubscription",
    },
    amount: {
      type: Number,
    },
    currencyId: {
      type: ObjectId,
      ref: "currency",
    },
    is_withdraw: {
      type: Boolean,
      default: false,
    },
    // currency: {
    //   type: String,
    //   trim: true,
    // },
  },
  {
    timestamps: true,
  }
);

UserWalletSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

UserWalletSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Userwallet", UserWalletSchema);
