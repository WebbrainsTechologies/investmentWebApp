const responseHandler = require("../../handler/responsehandler");
const Messageconstant = require("../../constant/messageconstant");
const KycCrudServices = require("../../service/Kyc/kycCrudService");
const imageUnlinkSync = require("../../helper/imageRemoval");
class KycCrudController {
  constructor() {}
  // add kyc
  async addKyc(req, res) {
    try {
      // req
      //   .checkBody("document_type")
      //   .notEmpty()
      //   .withMessage("Please enter document type.");

      // const errors = req.validationErrors();
      // if (errors) {
      //   imageUnlinkSync(req.files?.front_image[0]?.filename);
      //   imageUnlinkSync(req.files?.back_image[0]?.filename);

      //   return responseHandler.errorResponse(
      //     res,
      //     400,
      //     Messageconstant.SOMETHING_WRONG,
      //     []
      //   );
      // }
      const Detail = await KycCrudServices.addKyc(
        req.params.id,
        req.body,
        req.files,
        res
      );
      if (Detail) {
        return responseHandler.successResponse(
          res,
          200,
          Messageconstant.CURRENCY_ADD,
          Detail
        );
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // edit Kyc
  async editKyc(req, res) {
    try {
      // req
      //   .checkBody("document_type")
      //   .notEmpty()
      //   .withMessage("Please enter document type.");

      // const errors = req.validationErrors();

      // if (errors) {
      //   imageUnlinkSync(req.files?.front_image[0]?.filename);
      //   imageUnlinkSync(req.files?.back_image[0]?.filename);

      //   return responseHandler.errorResponse(
      //     res,
      //     400,
      //     Messageconstant.SOMETHING_WRONG,
      //     []
      //   );
      // }
      const Detail = await KycCrudServices.editKyc(
        req.params.id,
        req.body,
        req.files,
        req.user,
        res
      );

      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.KYC_UPDATED,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get all kyc
  async getAllKyc(req, res) {
    try {
      const Detail = await KycCrudServices.getAllKyc(req.body, res);
      if (Detail) {
        return responseHandler.successResponse(res, 200, "", Detail);
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get kyc by user id
  async getKycByUserId(req, res) {
    try {
      const Detail = await KycCrudServices.getKycByUserId(
        req.params.id,
        req.user,
        res
      );

      responseHandler.successResponse(res, 200, "", Detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new KycCrudController();
