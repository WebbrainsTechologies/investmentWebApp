const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    is_superadmin: {
      type: Boolean,
      default: true,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
    is_kyc_verified: {
      type: Boolean,
      default: false,
    },
    reset_tokens: {
      type: Object,
      default: null,
      reset_password_token: {
        token: {
          type: String,
          default: null,
        },
        expiry: {
          type: Date,
          default: null,
        },
      },
    },
    profile_img: {
      type: String,
      default: "",
    },
    smtp_email: {
      type: String,
      trim: true,
    },
    smtp_password: {
      type: String,
      trim: true,
    },
    user_status: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: Array,
      default: [],
    },
    stripe_public_key: {
      type: String,
      trim: true,
    },
    stripe_secret_key: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    referral_code: {
      type: Number,
      default: null,
    },
    referral_user_id: {
      type: ObjectId,
    },
    otp: {
      type: Number,
    },
    is_otp_verified: {
      type: Boolean,
      default: false,
    },
    is_bank_verified: {
      type: Boolean,
      default: false,
    },
    bank_user_name: {
      type: String,
      default: "",
      trim: true,
    },
    bank_pan_number: {
      type: String,
      default: "",
      trim: true,
    },
    bank_account_number: {
      type: String,
      default: "",
      trim: true,
    },
    bank_account_name: {
      type: String,
      default: "",
      trim: true,
    },
    bank_phone_number: {
      type: String,
      default: "",
      trim: true,
    },
    bank_ifsc_code: {
      type: String,
      default: "",
      trim: true,
    },
    country_code: {
      type: String,
      default: "",
      trim: true,
    },
    referenceNumber: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("user", UserSchema);
