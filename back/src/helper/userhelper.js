const bcrypt = require("bcryptjs");
const MessageConstant = require("../constant/messageconstant");
class UserHelper {
  constructor() {}

  comparePassword(candidatePassword, cryptPassword) {
    return bcrypt.compare(candidatePassword, cryptPassword);
  }

  checkUserDetails(user) {
    if (user.first_name === "" || user.first_name === undefined) {
      throw new Error(MessageConstant.NAME_REQUIRED);
    }
    if (user.email === "" || user.email === undefined) {
      throw new Error(MessageConstant.EMAIL_REQUIRED);
    }
    const emailValidation = this.checkEmail(user.email);
    if (!emailValidation) {
      throw new Error(MessageConstant.INVALID_EMAIL);
    }
    if (user.phone_number === "" || user.phone_number === undefined) {
      throw new Error(MessageConstant.PHONE_REQUIRED);
    }
    if (user.password === "" || user.password === undefined) {
      throw new Error(MessageConstant.PASSWORD_REQUIRED);
    }
    if (user.zipcode === "" || user.zipcode === undefined) {
      throw new Error(MessageConstant.ZIPCODE_REQUIRED);
    }
    return true;
  }

  checkEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  checkAdminUser(user) {
    if (user.password === "" || user.password === undefined) {
      throw new Error(MessageConstant.PASSWORD_REQUIRED);
    }
    if (user.email === "" || user.email === undefined) {
      throw new Error(MessageConstant.EMAIL_REQUIRED);
    }
    const emailValidation = this.checkEmail(user.email);
    if (!emailValidation) {
      throw new Error(MessageConstant.INVALID_EMAIL);
    }
  }

  checkemailonly(email) {
    const emailValidation = this.checkEmail(email);
    if (!emailValidation) {
      throw new Error(MessageConstant.INVALID_EMAIL);
    }
    return true;
  }

  generatePassword() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  generateId() {
    var length = 24,
      charset =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  sequenceGenerator(length) {
    var result = "";
    var characters =
      "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  diff_minutes(dt2, dt1) {
    // console.log(dt2, dt1);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff = diff / 60;
    // console.log(diff);
    return Math.abs(Math.round(diff));
  }

  getPdfAttachments() {
    let attachments = [
      {
        filename: "Secure Fintec Logo.png",
        path: path.resolve(
          __dirname.replace("/helper", ""),
          "assets/logo/Secure Fintec Logo.png"
        ),
        cid: "securefinteclogo",
      },
    ];
    attachments.push(logo);
    return attachments;
  }
}

module.exports = new UserHelper();
