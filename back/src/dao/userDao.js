// const subscriptionPackageModel = require("../modal/subscriptionPackage");
const UserModel = require("../modal/User/user");

class UserDAO {
  constructor() {}

  findUserDetails(query) {
    return UserModel.findOne(query);
  }

  Admincreate(query) {
    return UserModel.create(query);
  }

  findAndUpdateUser(userId, userData) {
    return UserModel.findByIdAndUpdate({ _id: userId }, userData, {
      new: true,
    });
  }

  

  newpassword(query) {
    query["deleted_at"] = null;
    // query["password"] = null;
    return UserModel.find(query);
  }
}

module.exports = new UserDAO();