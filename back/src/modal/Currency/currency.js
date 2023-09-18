const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const mongoosePaginate = require("mongoose-paginate-v2");

const CurrencySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    // multiply_value: {
    //   type: Number,
    //   trim: true,
    // },
    // currency_logo: {
    //   type: String,
    // },
    address: {
      type: String,
      trim: true,
    },
    onmeta_name: {
      type: String,
      trim: true,
    },
    symbol: {
      type: String,
      trim: true,
    },
    chainId: {
      type: Number,
    },
    decimals: {
      type: Number,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CurrencySchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

CurrencySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("currency", CurrencySchema);
