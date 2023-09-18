const { body } = require("express-validator/check");

class Forgetpassword {
  Forgetpassword(link) {
    return (
      "<!DOCTYPE html>" +
      '<html lang="en">' +
      "" +
      "<head>" +
      '    <meta charset="UTF-8">' +
      "    <title>Document</title>" +
      "</head>" +
      "" +
      "<body> <h2>Your login details</h2>" +
      "<p> Hi " +
      ",</p>" +
      "<p>Please click <a style='color:blue' href=" +
      link+
      ">here </a>" +
      "to reset your password. Please note this link will not be valid after 24 hours." +
      "<br/>" +
      "<br/>" +
      //  '<img width=100 height=100  src="https://gappqa.s3.ap-southeast-2.amazonaws.com/80.png">' +
      "</body></html>"
    );
  }
}
module.exports = new Forgetpassword();
