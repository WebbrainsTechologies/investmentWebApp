class RegisterEmailTemplate {
  MailSent(data) {
    return (
      "<!DOCTYPE html>" +
      '<html lang="en">' +
      "" +
      "<head>" +
      '    <meta charset="UTF-8">' +
      "    <title>Document</title>" +
      "<style>p{margin:0px;}</style></head>" +
      "" +
      "<body>Hello <strong>" +
      data.username +
      "</strong>,<br /><br /> You are successfully onboarded to the Secure Fintec. Here are your login credentials: <br /><br /> Email ID:<strong> " +
      data.email +
      "</strong><br /> Password : <strong>" +
      data.password +
      "</strong><br/><br/><a style='color:blue' href=" +
      process.env.domainURL +
      "><strong>click here</strong></a> to access your account.</p>" +
      "<br /><strong><p>Regards,</p><p>Secure Fintec</p></strong><br /><div></div>" +
      "</body></html>"
    );
  }
}
module.exports = new RegisterEmailTemplate();
