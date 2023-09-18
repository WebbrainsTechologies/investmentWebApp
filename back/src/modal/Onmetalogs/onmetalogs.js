const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const OnmetalogsSchema = new Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
    },
    request: {
      type: String,
      default: "",
      trim: true,
    },
    response: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

OnmetalogsSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

OnmetalogsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Onemetalogs", OnmetalogsSchema);
