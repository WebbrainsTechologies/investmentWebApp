const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const mongoosePaginate = require("mongoose-paginate-v2");

const KycSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
      default: "",
    },
    gender: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    firstName: {
      type: String,
      trim: true,
    },
    front_image: {
      type: String,
      trim: true,
      default: "",
    },
    back_image: {
      type: String,
      trim: true,
      default: "",
    },
    selfi_image: {
      type: String,
      default: "",
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    document_type: {
      type: String,
      trim: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      trim: true,
      default: "",
    },
    step: {
      type: Number,
      default: 0,
    },
    address_line_one: {
      type: String,
      default: "",
      trim: true,
    },
    address_line_second: {
      type: String,
      default: "",
      trim: true,
    },
    address_line_third: {
      type: String,
      default: "",
      trim: true,
    },
    country: {
      type: String,
      default: "",
      trim: true,
    },
    country_iso_code: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    state_iso_code: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    pincode: {
      type: String,
      default: "",
      trim: true,
    },
    rejected_section: {
      type: Array,
      default: [],
    },
    aadhar_number: {
      type: String,
      default: "",
      trim: true,
    },
    pan_number: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

KycSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

KycSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("kyc", KycSchema);
