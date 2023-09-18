const fs = require("fs");

const imageUnlinkSync = (filename) => {
  if (
    fs.existsSync(
      `${__dirname.replace("src/helper", "")}/${
        process.env.UPLOAD_DIR
      }/${filename}`
    )
  ) {
    fs.unlinkSync(`${process.env.UPLOAD_DIR}/${filename}`);
  }
};

module.exports = imageUnlinkSync;
