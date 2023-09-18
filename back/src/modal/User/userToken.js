const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const userTokenSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "user",
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userTokenSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

module.exports = mongoose.model("user_token", userTokenSchema);
