const SubscriptionSchema = require("../../modal/Subscription/subscription");
const responseHandler = require("../../handler/responsehandler");

class SubscriptionService {
  constructor() {}
  // change subscription status
  async changeSubscriptionStatus(_id, payload, res) {
    try {
      // console.log(payload, "check9");
      let data = await SubscriptionSchema.findByIdAndUpdate(
        { _id },
        { status: payload.status }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // get subscription by id
  async getSubscriptionById(_id, payload, res) {
    try {
      let data = await SubscriptionSchema.findById({ _id });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // getall subscription
  async getallSubscription(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      };
      let query = { is_delete: false };
      let data = await SubscriptionSchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // getall subscription without pagination
  async getallSubscriptionWithOutPagination(res) {
    try {
      let data = await SubscriptionSchema.find({
        is_delete: false,
        status: true,
      });
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // getall subscription without pagination for subscriberpage
  async getallSubscriptionWithOutPaginationForSubscriberPage(res) {
    try {
      let data = await SubscriptionSchema.find({
        is_delete: false,
      });
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new SubscriptionService();
