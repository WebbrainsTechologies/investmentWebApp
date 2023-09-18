class QRCodeApprovalMailer {
    mailcontent(payload) {
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
            "<p>Kwix Connect has "+payload.status+" your request for "+payload.count+" QR codes. You shall create the QR codes via the application in the device.</p>" +
            "<p>If you need more QR codes, you can create another request on the portal.</p>" +
            "<p>You can email kwix at <a href='mailto:info@kwixconnect.com'>info@kwixconnect.com</a> in case of any issues.</p>" +
            "<br/>" +
            "<p>Regards,</p>" +
            "<p>Kwix Connect Team</p>" +
            "<br/>" +
            "</body></html>"
        );
    }
}
module.exports = new QRCodeApprovalMailer();