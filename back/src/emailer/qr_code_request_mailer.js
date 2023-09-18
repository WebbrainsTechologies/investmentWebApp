class QrCodeRequestMailer {
    mailcontent(taxi, qr_code_number) {
        return (
            "<!DOCTYPE html>" +
            '<html lang="en">' +
            "" +
            "<head>" +
            '    <meta charset="UTF-8">' +
            "    <title>Document</title>" +
            "</head>" +
            "" +
            "<body> <p>Hello Kwix Connect Admin,</p>" +
            "<p>"+taxi.name+" have sent you a request for "+qr_code_number+" QR codes. Please login into your portal to accept or reject the request.</p>"+
            "<p>Please note once you accept, you will not be able to edit or reject that request.</p>" +
            "<br/>" +
            "<p>Regards,</p>" +
            "<p>Kwix Connect Team</p>" +
            // "<img width='100' height='50' src='cid:signatureimage' />" +
            "<br/>" +
            "</body></html>"
        );
    }
}
module.exports = new QrCodeRequestMailer();