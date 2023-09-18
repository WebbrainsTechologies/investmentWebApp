require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");

class Utility {
  generateJwtToken(user_id) {
    var token = jwt.sign({ id: user_id }, process.env.JWT_SECRET);
    return token;
  }
  checkUserActive(req, res, next) {
    //console.log(req);
    const user = _.get(req, "user", null);
    if (!req.user.is_active) {
      return responseHandler.errorResponse(
        res,
        403,
        MessageConstant.ACCOUNT_LOCKED,
        []
      );
    } else if (user.token === "" || user.token === "") {
      return responseHandler.errorResponse(
        res,
        403,
        MessageConstant.BLANKTOCKEN,
        []
      );
    } else {
      next();
    }
  }
  async checksingleusersession(req, res, next) {
    const user = _.get(req, "user", null);

    let urltoken = req.headers.authorization;
    let utoken = user.token;
    //authorization token contain Bearer additional word which need to be removed before comparing password
    urltoken = urltoken.substring(7);
    //Comparing password bcrypt method did't work so apply simple compare in if condition
    if (urltoken != utoken) {
      return responseHandler.errorResponse(
        res,
        405,
        MessageConstant.SESSION_EXPIRED,
        []
      );
    } else {
      next();
    }
  }
}
module.exports = new Utility();
