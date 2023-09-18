const UserSchema = require("../../modal/User/user");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");

const ObjectId = require("mongodb").ObjectId;

class MyTeamService {
  constructor() {}
  // add my team module
  async getTeamData(_id, user, res) {
    try {
      let data = await UserSchema.find(
        { referral_user_id: user?._id },
        { _id: 1, name: 1, createdAt: 1, profile_img: 1 }
      );
      let firstlineCount = data?.length;
      // console.log(data, "check15", data?.length);
      if (data && data?.length > 0) {
        let userId = data.map((val) => val._id);
        // console.log(userId, "check18");
        let userOwnInvestmentData = await UserSubscriptionSchema.aggregate([
          {
            $match: {
              userId: { $in: userId },
              currencyId: ObjectId(_id),
              usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
            },
          },
          {
            $group: {
              _id: "$userId",
              userowninvestment: { $sum: "$amount" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "userData",
            },
          },
          {
            $unwind: "$userData",
          },
          {
            $project: {
              _id: 1,
              name: "$userData.name",
              createdAt: "$userData.createdAt",
              userowninvestment: 1,
            },
          },
        ]);
        // console.log(
        //   userOwnInvestmentData,
        //   "check54",
        //   userOwnInvestmentData?.length
        // );
        userOwnInvestmentData = data.map((val) => {
          let findusedetails = userOwnInvestmentData.find((value) => {
            return value._id?.toString() === val._id?.toString();
          });
          if (findusedetails) {
            return findusedetails;
          } else {
            return {
              ...val._doc,
              userowninvestment: 0,
            };
          }
        });
        // console.log(
        //   userOwnInvestmentData,
        //   "check72",
        //   userOwnInvestmentData?.length
        // );
        let userFirstlinecount = await UserSchema.aggregate([
          {
            $match: {
              referral_user_id: { $in: userId },
            },
          },
          {
            $group: {
              _id: "$referral_user_id",
              count: { $sum: 1 },
            },
          },
        ]);
        // console.log(userFirstlinecount, "check80");

        userOwnInvestmentData = userOwnInvestmentData.map((val) => {
          let userlinecount = userFirstlinecount.find(
            (value) => val._id.toString() === value._id.toString()
          );
          if (userlinecount) {
            return {
              ...val,
              firstlineCount: userlinecount?.count,
            };
          } else {
            return {
              ...val,
              firstlineCount: 0,
            };
          }
        });
        // console.log(userOwnInvestmentData, "check108");
        let userFirstlineInvestmentData =
          await UserSubscriptionSchema.aggregate([
            {
              $match: {
                referral_user_id: { $in: userId },
                currencyId: ObjectId(_id),
                usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
              },
            },
            {
              $group: {
                _id: "$referral_user_id",
                userowninvestment: { $sum: "$amount" },
                // count: { $sum: 1 },
              },
            },
          ]);
        // console.log(userFirstlineInvestmentData, "check91");

        userFirstlineInvestmentData = data.map((val) => {
          let findusedetails = userFirstlineInvestmentData.find((value) => {
            return value._id?.toString() === val._id?.toString();
          });
          if (findusedetails) {
            return findusedetails;
          } else {
            return {
              _id: val._id,
              userowninvestment: 0,
              // count: 0,
            };
          }
        });
        // console.log(userFirstlineInvestmentData, "check107");
        let teamData = await UserSchema.find(
          { referral_user_id: { $in: userId } },
          { _id: 1, name: 1, createdAt: 1, referral_user_id: 1 }
        );
        // console.log(teamData, "check112");
        if (teamData && teamData.length > 0) {
          let teamDataId = teamData.map((val) => val._id);
          // console.log(teamDataId, "check115");
          let userSecondlineInvestmentData =
            await UserSubscriptionSchema.aggregate([
              {
                $match: {
                  referral_user_id: { $in: teamDataId },
                  usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
                },
              },
              {
                $group: {
                  _id: "$referral_user_id",
                  userowninvestment: { $sum: "$amount" },
                  // usercount: { $sum: 1 },
                },
              },
            ]);

          // console.log(userSecondlineInvestmentData, "check133");

          let teamcount = await UserSchema.aggregate([
            {
              $match: {
                referral_user_id: { $in: teamDataId },
              },
            },
            {
              $group: {
                _id: "$referral_user_id",
                usercount: { $sum: 1 },
              },
            },
          ]);
          // console.log(teamcount, "check183");
          teamData = teamData.map((val) => {
            let secondlineinvestmentData = teamcount.find((value) => {
              return val._id?.toString() === value._id?.toString();
            });
            return {
              ...val?._doc,
              teamcount: secondlineinvestmentData?.usercount
                ? secondlineinvestmentData?.usercount
                : 0,
            };
          });
          // console.log(teamData, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
          let teaminvestmentData = teamData.map((val) => {
            let secondlineinvestmentData = userSecondlineInvestmentData.find(
              (value) => {
                return val._id?.toString() === value._id?.toString();
              }
            );
            return {
              ...val,
              totalInvestment: secondlineinvestmentData?.userowninvestment
                ? secondlineinvestmentData?.userowninvestment
                : 0,
              // totalteamcount: secondlineinvestmentData?.usercount
              //   ? secondlineinvestmentData?.usercount
              //   : 0,
            };
          });
          // console.log(teaminvestmentData, "check154");
          // console.log(
          //   userOwnInvestmentData,
          //   "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
          // );
          // console.log(
          //   teaminvestmentData,
          //   "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
          // );
          let mergeFirstAndSecondLine = userOwnInvestmentData.map((val) => {
            let secondlineinvestmentData = teaminvestmentData.filter(
              (value) => {
                return (
                  val._id?.toString() === value.referral_user_id?.toString()
                );
              }
            );
            // console.log(secondlineinvestmentData, "####################");
            let totalinvestment;
            totalinvestment =
              secondlineinvestmentData?.length > 0 &&
              secondlineinvestmentData?.reduce(
                (total, val) => {
                  // console.log(val, "checkboth", total);
                  // console.log(
                  //   total.totalInvestment,
                  //   "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
                  //   val.totalInvestment,
                  //   total.totalInvestment + val.totalInvestment
                  // );
                  const totalInvestment = total.totalinvestmentValue || 0;
                  const teamcount = total.totalteamcount || 0;
                  return {
                    totalinvestmentValue:
                      totalInvestment + (val.totalInvestment || 0),
                    totalteamcount: teamcount + (val.teamcount || 0),
                  };
                },
                { totalinvestmentValue: 0, totalteamcount: 0 }
              );
            // console.log(totalinvestment, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            return {
              ...val,
              totalInvestment: totalinvestment?.totalinvestmentValue
                ? totalinvestment?.totalinvestmentValue
                : 0,
              teamcount: totalinvestment.totalteamcount
                ? totalinvestment.totalteamcount
                : 0,
            };
          });
          // console.log(mergeFirstAndSecondLine, "check196");
          let finalMerge = mergeFirstAndSecondLine.map((val) => {
            let finalobj = userFirstlineInvestmentData.find((value) => {
              return value._id.toString() === val._id.toString();
            });
            // console.log(finalobj, "check168", val);
            return {
              ...val,
              totalInvestment:
                val.totalInvestment + finalobj?.userowninvestment
                  ? val.totalInvestment + finalobj?.userowninvestment
                  : 0,
              firstlinecount: finalobj?.count ? finalobj?.count : 0,
              totalteamcount:
                val.firstlineCount + val?.teamcount
                  ? val.firstlineCount + val?.teamcount
                  : 0,
              firstlineinvestment: finalobj?.userowninvestment,
            };
          });
          // console.log(finalMerge, "check214");
          return finalMerge;
        } else {
          let finalMerge = userOwnInvestmentData.map((val) => {
            return {
              ...val,
              totalInvestment: 0,
              firstlinecount: 0,
              totalteamcount: 0,
              firstlineinvestment: 0,
            };
          });
          // console.log(finalMerge, "check226");
          return finalMerge;
        }
      } else {
        return true;
      }
      // return {};
    } catch (error) {
      console.log(error, "check161");
      throw new Error(error);
    }
  }

  // get user sponsor data
  async getSponsorData(_id, user, res) {
    try {
      // console.log(user?._id, "check245");
      let data = await UserSchema.findOne({ _id: user?.referral_user_id });
      let firstlineCount = await UserSchema.find({
        referral_user_id: user?._id,
      });
      let firstlineusersID = firstlineCount.map((val) => val._id);

      let firslineInvestmentData = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            userId: { $in: firstlineusersID },
            currencyId: ObjectId(_id),
            usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
          },
        },
        {
          $group: {
            _id: null,
            firstlineinvestment: { $sum: "$amount" },
          },
        },
      ]);

      // console.log(firslineInvestmentData, "check334");
      // console.log(firstlineusersID, "check252", firstlineusersID?.length);

      let secondlineuser = await UserSchema.find(
        {
          referral_user_id: { $in: firstlineusersID },
        },
        { _id: 1 }
      );

      // console.log(secondlineuser, "check254", secondlineuser?.length);
      let secondlineuserId = secondlineuser.map((val) => val._id);

      let totalTeamInvestmentData = await UserSubscriptionSchema.aggregate([
        {
          $match: {
            userId: { $in: secondlineuserId },
            currencyId: ObjectId(_id),
            usersubscriptionstatus: { $in: ["Accepted", "Closed"] },
          },
        },
        {
          $group: {
            _id: null,
            totalteaminvestment: { $sum: "$amount" },
          },
        },
      ]);

      // console.log(totalTeamInvestmentData, "check363");
      // let totalteamData = await UserSchema.countDocuments({
      //   referral_user_id: { $in: secondlineuserId },
      // });
      // console.log(totalteamData, "check265");
      let totalTeamCount =
        (firstlineusersID?.length ? firstlineusersID?.length : 0) +
        (secondlineuser?.length ? secondlineuser?.length : 0);
      // console.log(totalTeamCount, "check263");
      // console.log(data, "check241");
      let firslineInvestment = firslineInvestmentData[0]?.firstlineinvestment
        ? firslineInvestmentData[0]?.firstlineinvestment
        : 0;
      let totalTeamInvestment =
        (firslineInvestmentData[0]?.firstlineinvestment
          ? firslineInvestmentData[0]?.firstlineinvestment
          : 0) +
        (totalTeamInvestmentData[0]?.totalteaminvestment
          ? totalTeamInvestmentData[0]?.totalteaminvestment
          : 0);
      if (data) {
        return {
          sponsorData: data,
          firstlineCount: firstlineCount?.length ? firstlineCount?.length : 0,
          totalTeamCount: totalTeamCount,
          firslineInvestment: firslineInvestment,
          totalTeamInvestment: totalTeamInvestment,
        };
      } else {
        if (user?.referral_code === 332904) {
          return {
            sponsorData: true,
            firstlineCount: firstlineCount?.length ? firstlineCount?.length : 0,
            totalTeamCount: totalTeamCount,
            firslineInvestment: firslineInvestment,
            totalTeamInvestment: totalTeamInvestment,
          };
        }
      }
    } catch (error) {
      console.log(error, "check161");
      throw new Error(error);
    }
  }
}

module.exports = new MyTeamService();
