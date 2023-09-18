const KycSchema = require("../../modal/Kyc/kyc");
const UserSchema = require("../../modal/User/user");
const NotificationSchema = require("../../modal/Notification/notification");
const imageUnlinkSync = require("../../helper/imageRemoval");
const pagination = require("../../helper/pagination");
const encryptFun = require("../../helper/encryption");
const ObjectId = require("mongodb").ObjectId;

class KycCrudService {
  constructor() {}
  // add kyc
  async addKyc(_id, payload, files, res) {
    try {
      let data = await KycSchema.create({
        userId: ObjectId(_id),
        ...payload,
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  // edit kyc
  async editKyc(_id, payload, files, user, res) {
    try {
      let kycData = await KycSchema.findById({ _id });
      if (files && Object.keys(files).length > 0) {
        let front_image_file =
          Object.keys(files)?.includes("front_image") &&
          files.front_image[0]?.filename;
        let back_image_file =
          Object.keys(files)?.includes("back_image") &&
          files.back_image[0]?.filename;
        let selfi_image =
          Object.keys(files)?.includes("selfi_image") &&
          files.selfi_image[0]?.filename;
        if (front_image_file && kycData?.front_image) {
          if (front_image_file !== kycData.front_image) {
            imageUnlinkSync(kycData.front_image);
          }
        }
        if (back_image_file && kycData?.back_image) {
          if (back_image_file !== kycData.back_image) {
            imageUnlinkSync(kycData.back_image);
          }
        }
        if (selfi_image && kycData?.selfi_image) {
          if (selfi_image !== kycData.selfi_image) {
            imageUnlinkSync(kycData.selfi_image);
          }
        }
      }
      payload = {
        ...payload,
        is_verified:
          payload.status !== "Pending"
            ? payload.status === "Approve"
              ? true
              : false
            : false,
        front_image:
          files &&
          Object.keys(files)?.includes("front_image") &&
          files?.front_image[0]?.filename
            ? files?.front_image[0]?.filename
            : payload.front_image,
        back_image:
          files &&
          Object.keys(files)?.includes("back_image") &&
          files.back_image[0]?.filename
            ? files.back_image[0]?.filename
            : payload.back_image,
        selfi_image:
          files &&
          Object.keys(files)?.includes("selfi_image") &&
          files.selfi_image[0]?.filename
            ? files.selfi_image[0]?.filename
            : payload.selfi_image,
      };
      if (Number(payload.step) === 4 && !user?.is_superadmin) {
        payload = {
          ...payload,
          rejected_section: [],
        };
      }
      // console.log(payload, "checkpayload");
      let data = await KycSchema.findByIdAndUpdate(
        { _id },
        {
          ...payload,
        },
        { new: true }
      );
      if (
        data?.status !== "Pending" &&
        data?.status !== "" &&
        user?.is_superadmin
      ) {
        let userNotificationCreate = await NotificationSchema.create({
          userId: data?.userId,
          title: `Kyc update`,
          body: `Your kyc details is ${
            data.status === "Approve" ? "approved" : "rejected"
          } by admin`,
          n_type: "user",
          n_link: "/userkyc",
        });
        var encreptedFirstName = "";
        var encreptedLastName = "";
        var encreptedaadhar_number = "";
        var encreptedpan_number = "";
        var encreptedFirstName1 = "";
        var encreptedLastName1 = "";
        var encreptedaadhar_number1 = "";
        var encreptedpan_number1 = "";
        if (data?.status === "Approve") {
          let updateUser = await UserSchema.updateOne(
            {
              _id: data?.userId,
            },
            {
              is_kyc_verified: true,
            },
            { new: true }
          );
          encreptedFirstName = encryptFun.encrypt(data.firstName);
          encreptedLastName = encryptFun.encrypt(data.lastName);
          encreptedaadhar_number = encryptFun.encrypt(data.aadhar_number);
          encreptedpan_number = encryptFun.encrypt(data.pan_number);

          encreptedFirstName1 = encryptFun.encrypt1(data.firstName);
          encreptedLastName1 = encryptFun.encrypt1(data.lastName);
          encreptedaadhar_number1 = encryptFun.encrypt1(data.aadhar_number);
          encreptedpan_number1 = encryptFun.encrypt1(data.pan_number);

          // console.log(encreptedFirstName, "name", encreptedFirstName1);
          // console.log(encreptedLastName, "name1", encreptedLastName1);
          // console.log(encreptedaadhar_number, "name2", encreptedaadhar_number1);
          // console.log(encreptedpan_number, "name3", encreptedpan_number1);
        }
      }
      // console.log(data, "checkdata");
      let obj = {
        ...data,
        encreptedFirstName: encreptedFirstName1,
        encreptedLastName: encreptedLastName1,
        encreptedaadhar_number: encreptedaadhar_number1,
        encreptedpan_number: encreptedpan_number1,
      };
      return obj;
    } catch (error) {
      console.error(error, "check60");
      throw new Error(error);
    }
  }

  // get all kyc
  async getAllKyc(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;

      let sortField = {};
      sortField[sort_on] = sort === "asc" ? 1 : -1;
      // console.log(payload, "checkpayload");
      let query = [
        {
          $match: {
            status: { $ne: "" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        { $unwind: "$userData" },
        {
          $sort: sortField,
        },
      ];
      let data = await KycSchema.aggregate(query);
      // console.log(data, "check115");

      let paginateData = pagination(data, page, limit);

      return paginateData;
    } catch (error) {
      throw new Error(error);
    }
  }

  // get kyc by user id
  async getKycByUserId(_id, user, res) {
    try {
      let data;
      if (!user?.is_superadmin) {
        data = await KycSchema.findOne({
          userId: ObjectId(user?._id),
        }).populate("userId");
      } else {
        let userUniqueId = await UserSchema.findOne({ _id });
        data = await KycSchema.findOne({ userId: userUniqueId._id }).populate(
          "userId"
        );
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new KycCrudService();
