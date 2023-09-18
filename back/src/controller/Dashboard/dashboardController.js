const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const DashboardService = require("../../service/Dashboard/dashboardservice");
class DashboardController {
  constructor() {}
  // get user dashboard data for total investment
  async getUserDashboardDataForTotalInvestment(req, res) {
    try {
      let details =
        await DashboardService.getUserDashboardDataForTotalInvestment(
          req.params.id,
          req.user,
          res
        );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user dashboard data for total assets
  async getUserDashboardDataForTotalAsset(req, res) {
    try {
      let details = await DashboardService.getUserDashboardDataForTotalAsset(
        req.params.id,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user dashboard data for currentmonth income
  async getUserDashboardDataForCurrentMonthIncome(req, res) {
    try {
      let details =
        await DashboardService.getUserDashboardDataForCurrentMonthIncome(
          req.params.id,
          req.user,
          res
        );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user dashboard data for user wallet amount
  async getUserDashboardDataForWalletAmount(req, res) {
    try {
      let details = await DashboardService.getUserDashboardDataForWalletAmount(
        req.params.id,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user purchased subscription
  async getUserPurchesedSubscription(req, res) {
    try {
      let details = await DashboardService.getUserPurchesedSubscription(
        req.body,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard subscription
  async getAdminDashboardSubscriptionData(req, res) {
    try {
      let details = await DashboardService.getAdminDashboardSubscriptionData(
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard subscription
  async getAdminDashboardSubscription(req, res) {
    try {
      let details = await DashboardService.getAdminDashboardSubscription(
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard data
  async getAdminDashboardData(req, res) {
    try {
      let details = await DashboardService.getAdminDashboardData(
        req.params.id,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard withdrawal data by month selection
  async getAdminDashboardWithdrawalDatabyMonth(req, res) {
    try {
      let details =
        await DashboardService.getAdminDashboardWithdrawalDatabyMonth(
          req.params.id,
          req.body,
          req.user,
          res
        );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard data of pending withdrawal
  async getAdminDashboardPendingWithdrawalData(req, res) {
    try {
      let details =
        await DashboardService.getAdminDashboardPendingWithdrawalData(
          req.params.id,
          req.user,
          res
        );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard chart data
  async getAdminDashboardChartData(req, res) {
    try {
      let details = await DashboardService.getAdminDashboardChartData(
        req.params.id,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // edit admin dashboard balance data
  async editAdminWalletBalance(req, res) {
    try {
      req.checkBody("amount").notEmpty().withMessage("Please enter amount.");

      const errors = req.validationErrors();
      if (errors) {
        imageUnlinkSync(req.file?.filename);

        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      let details = await DashboardService.editAdminWalletBalance(
        req.params.id,
        req.body,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.ADMIN_WALLET_UPDATE,
        details
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard balance data
  async getAdminWalletBalance(req, res) {
    try {
      let details = await DashboardService.getAdminWalletBalance(
        req.params.id,
        req.body,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.ADMIN_WALLET_UPDATE,
        details
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get admin dashboard total asset by currency id
  async getAdminDashboardTotalAsset(req, res) {
    try {
      let details = await DashboardService.getAdminDashboardTotalAsset(
        req.params.id,
        req.body,
        req.user,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new DashboardController();
