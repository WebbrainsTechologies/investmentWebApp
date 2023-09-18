class PurchaseEmailTemplate {
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
      "</strong>,<br /><br /> Please find attach of invoice: " +
      "<br /><br />" +
      "<br /><strong><p>Regards,</p><p>Secure Fintec</p></strong><br /><div></div>" +
      "</body></html>"
    );
  }
}
module.exports = new PurchaseEmailTemplate();
