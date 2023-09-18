const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const mongoosePaginate = require("mongoose-paginate-v2");

const InvoiceSchema = new Schema(
  {
    invoice_number: {
      type: String,
      trim: true,
    },
    invoice_name: {
      type: String,
      trim: true,
    },
    usersubscriptionId: {
      type: ObjectId,
      trim: true,
    },
    currencyId: {
      type: ObjectId,
      trim: true,
    },
    userId: {
      type: ObjectId,
      trim: true,
    },
  },
  { timestamps: true }
);

InvoiceSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

InvoiceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("invoice", InvoiceSchema);
