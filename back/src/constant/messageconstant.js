const { modelNames } = require("mongoose");

//MERCHANT
module.exports.SUCCESS = "Success";
module.exports.MAX_LIMIT_REACHED = "Maximum limit reached";
module.exports.SOMETHING_WRONG = "Something went wrong";
module.exports.LOGIN_SUCCESS = "Login successfully";
module.exports.LOGOUT_SUCCESS = "Logout successfully";
module.exports.OTP_VERIFIED_SUCCESS = "Otp verified successfully";
module.exports.USER_NOT_REGISTERED = "User is not registered";
module.exports.ACCESS_KEY_SUCCESS = "Access key send successfully";
module.exports.PASSWORD_RESET_SUCCESS = "Password changed successfully";
module.exports.LINK_SEND_SUCCESSFULLY = "Link send successfully";
module.exports.USER_NOT_REGISTERED = "User is not registered";
module.exports.CURRENT_PASSWORD = "The password you entered is incorrect";
module.exports.PASSWORD_REQUIRED = "Password is required";
module.exports.EMAIL_REQUIRED = "Email is required";
module.exports.EMAIL_ID_REGISTERED = "Email is already registered";
module.exports.INVALID_EMAIL = "Invalid email";
module.exports.INVALID_DETAILS = "Invalid details";
module.exports.WRONG_ID = "Invalid Id";
module.exports.SUBSCRIPTION_PACKAGE_ADD =
  "Subscription package added successfully";
module.exports.SUBSCRIPTION_PACKAGE_UPDATE =
  "Subscription package updated successfully";
module.exports.SUBSCRIPTION_PACKAGE_DELETE =
  "Subscription package deleted successfully";
module.exports.SUBSCRIPTION_PACKAGE_NAME_ALREADY_EXIST =
  "Subscription package name already exist";
module.exports.LOGO_MSG = "Please select profile logo";
module.exports.SUPERADMIN_UPDATE_PROFILE = "Profile updated successfully";
module.exports.wrong_current_password = "Provided current password is wrong";
module.exports.password_change_missmatch =
  "New password and current password is not matched";
module.exports.password_changed = "password changed successfully";
module.exports.reset_password_request_expired =
  "Reset password token is expired";
module.exports.REGISTER_SUCCESS = "User register successfully";
module.exports.EMAIL_ALREDY_EXIST = "Email already exists";
module.exports.PHONE_ALREDY_EXIST = "Phone number already exists";
module.exports.INVALID_REFERRAL_CODE = "Invalid referral code";
module.exports.UPDATE_USER_PROFILE = "User profile updated successfully";
module.exports.DELETE_USER_PROFILE = "User profile deleted successfully";
module.exports.USER_ALREADY_SUBSCRIBED = "User has been already subscribed";

//Duration
module.exports.DURATION_EXIST = "Duration month already exists";
module.exports.DURATION_ADD = "Duration added successfully";
module.exports.DURATION_UPDATED = "Duration updated successfully";
module.exports.DURATION_DELETE = "Duration deleted successfully";
module.exports.STATUS = "Status changed successfully";

//CURRENCY
module.exports.CURRENCY_EXIST = "Currency name already exists";
module.exports.CURRENCY_ADD = "Currency added successfully";
module.exports.CURRENCY_UPDATED = "Currency updated successfully";
module.exports.CURRENCY_DELETE = "Currency deleted successfully";
module.exports.STATUS = "Status changed successfully";

// USER SUBSCRIPTION
module.exports.USER_INVESTMENT_ADD = "Investment request added successfully";

// USER WITHDRAWAL
module.exports.USER_WITHDRAWAL_ADD = "Withdrawal request added successfully";

// ADMIN WALLET
module.exports.ADMIN_WALLET_UPDATE = "Admin wallet updated successfully";

// KYC
module.exports.KYC_ADD = "Kyc added successfully";
module.exports.KYC_UPDATED = "Kyc request updated successfully";

// otp
module.exports.OTP_SEND_SUCCESS = "Otp sent successfully";
module.exports.INVALID_OTP = "Invalid Otp";
