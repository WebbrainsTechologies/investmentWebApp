const InvoiceSchema = require("../../modal/Invoice/invoice");
const ObjectId = require("mongodb").ObjectId;
const pagination = require("../../helper/pagination");

class InvoiceService {
  constructor() {}
  // get invoice with pagination
  async getInvoice(payload, user, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      // console.log(payload, "check11");
      let sortField = {};
      sortField[sort_on] = sort === "asc" ? 1 : -1;
      let data = await InvoiceSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $lookup: {
            from: "usersubscriptions",
            localField: "usersubscriptionId",
            foreignField: "_id",
            as: "userSubscriptionDetails",
          },
        },
        {
          $unwind: "$userSubscriptionDetails",
        },
        {
          $sort: sortField,
        },
      ]);
      let paginateData = pagination(data, page, limit);

      return paginateData;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  // get invoice by user with pagination
  async getInvoiceByUser(payload, user, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      // console.log(payload, "check11");
      let sortField = {};
      sortField[sort_on] = sort === "asc" ? 1 : -1;
      let data = await InvoiceSchema.aggregate([
        {
          $match: {
            userId: user?._id,
          },
        },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "userId",
        //     foreignField: "_id",
        //     as: "userDetails",
        //   },
        // },
        // {
        //   $unwind: "$userDetails",
        // },
        {
          $lookup: {
            from: "usersubscriptions",
            localField: "usersubscriptionId",
            foreignField: "_id",
            as: "userSubscriptionDetails",
          },
        },
        {
          $unwind: "$userSubscriptionDetails",
        },
        {
          $sort: sortField,
        },
      ]);
      let paginateData = pagination(data, page, limit);

      return paginateData;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
}

module.exports = new InvoiceService();
