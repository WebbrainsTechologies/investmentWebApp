class WithdrawEmailTemplate {
  MailSent(data) {
    return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <title>Document</title>
      <style>p{margin:0px;}</style></head>
      <body>Hello<strong>s
      ${data.username}</strong>,
      <p>Greetings for the day!!</p>
      <p>Your withdrawal has been successfully credited to your given deposit address.</p>
      <p>If you have any further questions, please contact us: <a href="mailto:info@securefintec.com" style="color:blue;">info@securefintec.com</a></P>
      <br />
      <a href="https://securefintec.com" style="color:blue;">
      https://securefintec.com
      </a>
      </body></html>`;
  }
}
module.exports = new WithdrawEmailTemplate();
