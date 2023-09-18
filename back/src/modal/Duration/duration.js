const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const DurationSchema = new Schema(
  {
    month: {
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
  { timestamps: true }
);

DurationSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

DurationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("duration", DurationSchema);
