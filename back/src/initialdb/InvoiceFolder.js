const fs = require("fs");
const path = require("path");

let generateInvoiceFolder = async () => {
  const generateInvoiceFolderPath = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    "Invoice"
  );

  // console.log("Generated path:", generateInvoiceFolderPath);
  // console.log(
  //   "check5",
  //   generateInvoiceFolderPath,
  //   !fs.existsSync(generateInvoiceFolderPath)
  // );
  if (!fs.existsSync(generateInvoiceFolderPath)) {
    // If it doesn't exist, create the Invoice folder
    fs.mkdirSync(generateInvoiceFolderPath, { recursive: true });
    console.log("Invoice folder created.");
  } else {
    console.log("Invoice folder already exists.");
  }
};
module.exports = generateInvoiceFolder;
