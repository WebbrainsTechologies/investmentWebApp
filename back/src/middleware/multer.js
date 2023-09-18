var multer = require("multer");
var fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.fieldname === "file_image" ||
      file.fieldname === "profile_img" ||
      file.fieldname === "currency_logo" ||
      file.fieldname === "front_image" ||
      file.fieldname === "back_image" ||
      file.fieldname === "selfi_image" ||
      file.fieldname === "manual_purchase_image" ||
      file.fieldname === "withdrawal_file"
    ) {
      if (!fs.existsSync(process.env.UPLOAD_DIR)) {
        fs.mkdirSync(process.env.UPLOAD_DIR);
      }
      cb(null, `./${process.env.UPLOAD_DIR}`);
    } else {
      let path = "";
      return path;
    }
  },

  filename: (req, file, cb) => {
    let fileExt = file.originalname.split(".").pop();
    cb(null, Date.now() + "_" + `${file.originalname}`.split(" ").join("_"));
  },
});

exports.upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "file_image" ||
      file.fieldname === "profile_img" ||
      file.fieldname === "currency_logo" ||
      file.fieldname === "front_image" ||
      file.fieldname === "back_image" ||
      file.fieldname === "selfi_image" ||
      file.fieldname === "manual_purchase_image" ||
      file.fieldname === "withdrawal_file"
    ) {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/svg" ||
        file.mimetype === "image/svg+xml" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/gif"
      ) {
        cb(null, true);
      } else {
        return cb(null, false);
      }
    }
  },
});
