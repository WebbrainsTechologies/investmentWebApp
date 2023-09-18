class Changepassword {
  Changepassword(password, name, email) {
    return (
      "<!DOCTYPE html>" +
      '<html lang="en">' +
      "" +
      "<head>" +
      '    <meta charset="UTF-8">' +
      "    <title>Document</title>" +
      "</head>" +
      "" +
      "<body> <h2>Your New login details</h2>" +
      "<p> Hi " +
      name +
      ",</p>" +
      "<p>Your password has been changed by admin" +
      "<br/>" +
      "<p>Email : " +
      email +
      "</p>" +
      // "<br/>" +
      "<p>Password : " +
      password +
      "</p>" +
      "<br/>" +
      "<br/>" +
      //  '<img width=100 height=100  src="https://gappqa.s3.ap-southeast-2.amazonaws.com/80.png">' +
      "</body></html>"
    );
  }
}
module.exports = new Changepassword();
