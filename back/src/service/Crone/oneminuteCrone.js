const moment = require("moment");
const UserTokenSchema = require("../../modal/User/userToken");

// remove user token which inactive for 15 minutes
let removeUserTokens = async () => {
  const thresholdMinutes = 15;
  // Calculate the threshold timestamp (current time - 15 minutes)
  const thresholdTimestamp = new Date();
  thresholdTimestamp.setMinutes(
    thresholdTimestamp.getMinutes() - thresholdMinutes
  );
  let data = await UserTokenSchema.deleteMany({
    updatedAt: { $lt: thresholdTimestamp },
  });
  console.log(data, "check15");
  //   // Delete documents with updatedAt older than the threshold
  //   db.collection.deleteMany({
  //     updatedAt: { $lt: thresholdTimestamp },
  //   });
};

module.exports = {
  removeUserTokens,
};
