const CurrencySchema = require("../../modal/Currency/currency");
const imageUnlinkSync = require("../../helper/imageRemoval");
const AdminWalletData = require("../../modal/AdminWallet/adminwallet");

class CurrencyCrudService {
  constructor() {}
  // add currency
  async addCurrency(
    payload,
    //  filename,
    res
  ) {
    try {
      let currencyData = await CurrencySchema.find({
        name: payload.name,
        is_delete: false,
      });
      if (currencyData.length > 0) {
        imageUnlinkSync(filename);
        return "name exist";
      }
      let payloadMainData = JSON.parse(payload?.onmeta_data);
      payloadMainData = {
        ...payloadMainData,
        onmeta_name: payloadMainData.name,
      };
      let data = await CurrencySchema.create({
        ...payloadMainData,
        name: payload.name,
        // multiply_value: payload.multiply_value,
        // currency_logo: filename,
      });
      let adminWalletCreate = await AdminWalletData.create({
        currencyId: data?._id,
        amount: 0,
      });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // edit currency
  async editCurrency(
    _id,
    payload,
    // filename,
    res
  ) {
    try {
      let currencyData = await CurrencySchema.find({
        name: payload.name,
        is_delete: false,
        _id: { $ne: _id },
      });
      if (currencyData.length > 0) {
        imageUnlinkSync(filename);
        return "name exist";
      }

      // if (currencyData.length > 0) {
      //   imageUnlinkSync(filename);
      //   return "name exist";
      // }
      // let currencyDataById = await CurrencySchema.findById({ _id });
      // if (filename) {
      //   if (filename !== currencyDataById.currency_logo) {
      //     imageUnlinkSync(currencyDataById.currency_logo);
      //   }
      // }
      // payload = {
      //   ...payload,
      //   currency_logo: filename ? filename : currencyDataById.currency_logo,
      // };

      let payloadMainData = JSON.parse(payload?.onmeta_data);
      payloadMainData = {
        ...payloadMainData,
        onmeta_name: payloadMainData.name,
      };
      let data = await CurrencySchema.findByIdAndUpdate(
        { _id },
        {
          ...payloadMainData,
          name: payload.name,
        }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // delete currency
  async deleteCurrency(_id, res) {
    try {
      let currencyData = await CurrencySchema.findById({ _id });
      if (currencyData.currency_logo) {
        imageUnlinkSync(currencyData.currency_logo);
      }
      let data = await CurrencySchema.findByIdAndUpdate(
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

module.exports = new CurrencyCrudService();
