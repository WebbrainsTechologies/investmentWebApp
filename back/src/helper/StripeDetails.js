const stripe = require("stripe");
const CryptoJS = require("crypto-js");
const UserModel = require("../modal/user");
var key;

const stripeDetailsForUsingApi = async () => {
  let user = await UserModel.findOne({ is_superadmin: true });

  // req body stripe public_key
  var de_stripe_public_key = CryptoJS.AES.decrypt(
    user.stripe_public_key,
    "secret key 123"
  );
  var original_stripe_public_key = de_stripe_public_key.toString(
    CryptoJS.enc.Utf8
  );

  // req body stripe secret_key
  var de_stripe_secret_key = CryptoJS.AES.decrypt(
    user.stripe_secret_key,
    "secret key 123"
  );
  var original_stripe_secret_key = de_stripe_secret_key.toString(
    CryptoJS.enc.Utf8
  );
  // console.log("stripe12", original_stripe_secret_key);

  key = original_stripe_secret_key;
  return original_stripe_secret_key;
};

const result = stripeDetailsForUsingApi();
// console.log(key);
module.exports = {
  key,
  stripeDetailsForUsingApi
};
