class QRCodeMailer {
    qr_code_pdfs(payload) {
        return (
            "<!DOCTYPE html>" +
            '<html lang="en">' +
            "" +
            "<head>" +
            '    <meta charset="UTF-8">' +
            "    <title>QR Codes</title>" +
            "</head>" +
            "" +
            "<body> <p>Hello " + payload.taxi.name + ",</p>" +
            "<p>Please find the PDF for the list of QR Codes attached.</p>" +
            "<p>If you have any questions, you can email kwix at info@kwixconnect.com.</p>" +
            "<br/>" +
            "<p>Regards,</p>" +
            "<p>Kwix Connect Team</p>" +
            "<br/>" +
            "</body></html>"
        );
    }
}
module.exports = new QRCodeMailer();