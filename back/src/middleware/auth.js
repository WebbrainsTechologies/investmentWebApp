const jwt = require("jsonwebtoken");
const user = require("../modal/User/user");
const messages = require("../helper/messages");
const response_handler = require("../handler/responsehandler");
const error_codes = require("../helper/error_codes");
const user_token = require("../modal/User/userToken");

const auth = async (req, res, next) => {
  try {
    let usertoken;
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return response_handler.errorResponse(
        res,
        error_codes.UNAUTHORIZED_ACCESS,
        messages.unauthorized_access
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let checktoken = await user.findOne({ _id: decoded.id });
    jwt.verify(token, process.env.JWT_SECRET, async function (error, data) {
      if (error) {
        return response_handler.errorResponse(
          res,
          error_codes.UNAUTHORIZED_ACCESS,
          messages.unauthorized_access
        );
      } else {
        let userDetail = await user_token.find({
          user_id: decoded.id,
          token: token,
        });
        if (userDetail.length > 0) {
          let userTokenTimeUpdate = await user_token.findOneAndUpdate(
            {
              user_id: decoded.id,
              token: token,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
            }
          );
          usertoken = await user.findOne({ _id: decoded.id });
          usertoken = { ...usertoken?._doc, token: token };
          req.user = usertoken;
          next();
        } else {
          return response_handler.errorResponse(
            res,
            error_codes.UNAUTHORIZED_ACCESS
          );
        }
      }
    });
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
