const crypto = require("crypto");
const encrypt = (plainText, password) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto
      .createHash("sha256")
      .update(
        "E2oWUrFBy7LAGunU48jmq48QPTU2NidFEgdbBPB1T7uvOcpbZv1SP2yJ78vS1ZOH"
      )
      .digest("base64")
      .substr(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    console.log(error);
  }
};

const encrypt1 = (plainText, password) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto
      .createHash("sha256")
      .update(
        "E2oWUrFBy7LAGunU48jmq48QPTU2NidFEgdbBPB1T7uvOcpbZv1SP2yJ78vS1ZOH"
      )
      .digest("base64")
      .substr(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { encrypt, encrypt1 };
