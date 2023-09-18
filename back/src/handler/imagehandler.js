require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
class ImageController {
  async fileUpload(fileName, folderPath, fileType, s3FolderPath) {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESSKEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: "",
      Body: "",
      ACL: "public-read",
      ContentType: fileType,
    };
    uploadParams.Key = fileName;
    uploadParams.Body = fs.readFileSync(process.cwd() + "/" + folderPath);
    // console.log(uploadParams);
    return s3
      .upload(uploadParams)
      .promise()
      .then((data) => {
        return data;
      })
      .catch((err) => {
        // console.log(err);
        return false;
      });
  }
}
module.exports = new ImageController();
