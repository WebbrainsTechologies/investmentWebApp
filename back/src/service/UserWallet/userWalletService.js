const UserWalletSchema = require("../../modal/UserWallet/userwallet");
const paginate = require("../../helper/pagination");
class UserWalletService {
  constructor() {}
  // get user transaction with pagination
  async getUserTransaction(payload, user, res) {
    try {
      let { page, limit, sort_on, sort } = payload;

      let sortField = {};
      sortField[sort_on] = sort === "asc" ? 1 : -1;

      let query = [
        {
          $match: {
            userId: user?._id,
            is_withdraw: true,
          },
        },
        {
          $lookup: {
            from: "usersubscriptions",
            localField: "userSubscriptionId",
            foreignField: "_id",
            as: "userSubscriptionId",
          },
        },
        { $unwind: "$userSubscriptionId" },
        {
          $sort: sortField,
        },
      ];

      let data = await UserWalletSchema.aggregate(query);
      const paginatedData = paginate(data, page, limit); // Custom function for pagination
      return paginatedData;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // get admin transaction with pagination
  async getAdminTransaction(payload, user, res) {
    try {
      let { page, limit, sort_on, sort } = payload;

      let sortField = {};
      sortField[sort_on] = sort === "asc" ? 1 : -1;
      let query = [
        {
          $match: {
            adminId: user?._id,
          },
        },
        {
          $lookup: {
            from: "usersubscriptions",
            localField: "userSubscriptionId",
            foreignField: "_id",
            as: "userSubscriptionId",
          },
        },
        { $unwind: "$userSubscriptionId" },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
        {
          $sort: sortField,
        },
      ];

      let data = await UserWalletSchema.aggregate(query);
      function paginate(data, page, limit) {
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = data.length;
        const totalPages = total !== 0 ? Math.ceil(total / limit) : 1;

        const results = {};

        if (endIndex < total) {
          results.hasNextPage = true;
          results.nextPage = page + 1;
        } else {
          results.hasNextPage = false;
          results.nextPage = null;
        }

        if (startIndex > 0) {
          results.hasPrevPage = true;
          results.prevPage = page - 1;
        } else {
          results.hasPrevPage = false;
          results.prevPage = null;
        }
        results.totalDocs = total;
        results.totalPages = totalPages;
        results.page = page;
        results.limit = limit;
        results.docs = data.slice(startIndex, endIndex);

        return results;
      }

      const paginatedData = paginate(data, page, limit); // Custom function for pagination
      return paginatedData;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new UserWalletService();
