const SubscriptionSchema = require("../../modal/Subscription/subscription");
const CurrencySchema = require("../../modal/Currency/currency");
const userSubscription = require("../../modal/UserSubscription/userSubscription");
const ObjectId = require("mongodb").ObjectId;

class SubscriptionCrudService {
  constructor() {}
  // add subscription
  async addSubscription(payload, res) {
    try {
      let subscriptionData = await SubscriptionSchema.find({
        name: payload.name,
        is_delete: false,
      });
      if (subscriptionData.length > 0) {
        return "name exist";
      }
      let currencyData = await CurrencySchema.findById({
        _id: payload.currency,
      });
      let data = await SubscriptionSchema.create({
        name: payload.name,
        currencyId: ObjectId(payload.currency),
        currency: currencyData.name,
        amount: Number(payload.amount),
        // multiply_value: payload.multiply_value,
        duration: Number(payload.duration),
        roi: Number(payload.roi),
        roi_duration: payload.roi_duration,
        principal_withdrawal: Number(payload.principal_withdrawal),
        commision: Number(payload.commision),
        description: payload.description,
        status: payload.status,
        maximum_value: payload.maximum_value
          ? Number(payload.maximum_value)
          : 0,
        minimum_value: Number(payload.minimum_value),
        commision_method: "one time",
      });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // edit subscription
  async editSubscription(_id, payload, res) {
    try {
      let subscriptionData = await SubscriptionSchema.find({
        name: payload.name,
        is_delete: false,
        _id: { $ne: _id },
      });
      if (subscriptionData.length > 0) {
        return "name exist";
      }
      // console.log(payload, "checkpayload");
      let currencyData = await CurrencySchema.findById({
        _id: payload.currency,
      });
      // console.log(payload.currency, "checkcurrency");
      let data = await SubscriptionSchema.findByIdAndUpdate(
        { _id },
        {
          ...payload,
          currencyId: ObjectId(payload.currency),
          currency: currencyData.name,
          amount: Number(payload.amount),
          duration: Number(payload.duration),
          roi: Number(payload.roi),
          roi_duration: payload.roi_duration,
          principal_withdrawal: Number(payload.principal_withdrawal),
          commision: Number(payload.commision),
          minimum_value: Number(payload.minimum_value),
          maximum_value: payload.maximum_value
            ? Number(payload.maximum_value)
            : 0,
          commision_method: "one time",
        }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // delete subscription
  async deleteSubscription(_id, res) {
    try {
      let isSubscriptionPurchased = await userSubscription.find({
        subscriptionId: _id,
      });
      if (isSubscriptionPurchased && isSubscriptionPurchased?.length > 0) {
        return "subscription already purchased";
      }
      let data = await SubscriptionSchema.findByIdAndUpdate(
        { _id },
        {
          is_delete: true,
        }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new SubscriptionCrudService();
