// const userDao = require("../dao/userdao");
const bcrypt = require("bcryptjs");
const UserModel = require("../modal/User/user");
const CryptoJS = require("crypto-js");

const btoa = require("btoa");

class InitialDbAdmin {
  constructor() {}

  async createAdminuser() {
    // Encrypt
    let Encrypt_smtp_password = CryptoJS.AES.encrypt(
      "szbifxelizrwzixf",
      "secret key 123"
    ).toString();

    let Encrypt_stripe_public_key = CryptoJS.AES.encrypt(
      "pk_test_51Ls2S3SJwc7CK89tCMQgovlWwAuDiqnE54oVSWpJraOhrQGwhinGPoiV5MZkufQTf9cTEBRpfqhASk9BjUmn5sBx00qnWQATOh",
      "secret key 123"
    ).toString();

    let Encrypt_stripe_secret_key = CryptoJS.AES.encrypt(
      "sk_test_51Ls2S3SJwc7CK89toww1jI2l6TJX5MHujAhMYtnRs5WL25OqnG1EdfGQd2xLyT8D7txsUnunBsybNSj4mdT5BfHs00bjjEEqs5",
      "secret key 123"
    ).toString();

    let hashed_password = await bcrypt.hash("admin@123", 8);

    let data = {
      is_superadmin: true,
      status: "1",
      islogin: true,
      name: "superadmin",
      lastName: "super Admin",
      email: "superadmin@yopmail.com",
      password: hashed_password,
      role: "",
      phone_number: "8375942502",
      smtp_email: "suryarathod315@gmail.com",
      smtp_password: Encrypt_smtp_password,
      stripe_public_key: Encrypt_stripe_public_key,
      stripe_secret_key: Encrypt_stripe_secret_key,
      referral_code: null,
      referral_user_id: null,
      is_otp_verified: true,
      is_kyc_verified: true,
    };

    let user = await UserModel.findOne({ is_superadmin: true });
    if (!user) {
      let userCreate = await UserModel.create(data);
      return userCreate;
    }
  }
}

module.exports = new InitialDbAdmin();
