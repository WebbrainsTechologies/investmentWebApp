const FuturePaymentSchema = require("../../modal/FuturePayment/futurePayment");
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

class FuturePaymentService {
  constructor() {}
  // get user future payout without pagination
  async getUserFuturePayout(payload, user, res) {
    try {
      // let { page, limit, sort_on, sort, year } = payload;

      // Get the current year
      // let subscriptionyearfirstDate;
      // let subscriptionyearlastDate;
      // if (payload.year > 1) {
      //   subscriptionyearfirstDate = moment(payload.createdAt)
      //     .add(payload.year - 1, "year")
      //     .startOf("day");
      //   subscriptionyearlastDate = moment(subscriptionyearfirstDate)
      //     .add(1, "year")
      //     .endOf("day");
      // } else {
      //   subscriptionyearfirstDate = moment(payload.createdAt).startOf("day");
      //   subscriptionyearlastDate = moment(payload.createdAt)
      //     .add(1, "year")
      //     .endOf("day");
      // }
      // console.log(
      //   subscriptionyearfirstDate,
      //   "firstDate",
      //   subscriptionyearlastDate,
      //   "lastDate"
      // );
      let query = {
        userId: user._id,
        userSubscriptionId: ObjectId(payload.userSubscriptionId),
        // roi_date: {
        //   $gte: new Date(subscriptionyearfirstDate),
        //   $lte: new Date(subscriptionyearlastDate),
        // },
      };
      // let data = await FuturePaymentSchema.paginate(query, options);
      // console.log(data, "checkdata");
      let data = await FuturePaymentSchema.find(query).sort({ roi_date: 1 });

      let dataWithProgressBar = data.map((val) => {
        let createdAtDate = moment(val.createdAt).utc().startOf("day");
        let roiDate = moment(val.roi_date).utc().startOf("day");
        let today = moment(new Date()).utc();
        let totaldays = roiDate.diff(createdAtDate, "days");
        let completedDate = today.diff(createdAtDate, "days");
        let progresswith = (completedDate * 100) / totaldays;
        // console.log(progresswith, "check53");
        return {
          ...val?._doc,
          progress: progresswith,
        };
      });
      return dataWithProgressBar;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get user dashboard future payout without pagination
  async getUserDashboardFuturePayout(payload, user, res) {
    try {
      let { page, limit } = payload;

      // Get the current year
      const currentYear = moment().year();

      // Get the first day of the current year with start of the day time in UTC
      let firstDayOfYear = moment
        .utc()
        .year(currentYear)
        .startOf("year")
        .format("YYYY-MM-DDTHH:mm:ss[Z]");

      // Get the last day of the current year with end of the day time in UTC
      let lastDayOfYear = moment
        .utc()
        .year(currentYear)
        .endOf("year")
        .format("YYYY-MM-DDTHH:mm:ss[Z]");

      // console.log(firstDayOfYear, "checkboth", lastDayOfYear);
      // console.log(
      //   new Date(firstDayOfYear),
      //   "checkboth1",
      //   new Date(lastDayOfYear)
      // );
      let data = await FuturePaymentSchema.find({
        userId: user._id,
        roi_date: {
          $gte: new Date(firstDayOfYear),
          $lte: new Date(lastDayOfYear),
        },
      })
        .populate("userSubscriptionId")
        .sort({ roi_date: 1 })
        .limit(10);
      return data;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
}

module.exports = new FuturePaymentService();
