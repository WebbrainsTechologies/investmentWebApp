const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const WebhookSchema = new Schema(
  {
    response: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

WebhookSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

WebhookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Webhook", WebhookSchema);
