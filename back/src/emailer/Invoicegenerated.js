class Invoicegenerated {
    InvoiceCreated(name, date) {
        return (
            "<!DOCTYPE html>" +
            '<html lang="en">' +
            "" +
            "<head>" +
            '    <meta charset="UTF-8">' +
            "    <title>Invoice upload by KC Admin</title>" +
            "</head>" +
            "" +
            "<body>" +
            "<p> Hello " +
            name +
            ",</p>" +
            "<p>Kwix Connect has uploaded an invoice dated:" +
            date +
            " on the portal</p><br/><p>You can login on the portal and view or download the invoice.</p><br><p>If you have any questions, you can email kwix at <a href='mailto:info@kwixconnect.com'>info@kwixconnect.com</a>.</p><br><p>Regards,Kwix Connect Team<br></p><br>" +
            '<img width=100 height=100  src="https://dev-admin.kwixconnect.com/assets/img/Logohd.png">' +
            "</body></html>"
        );
    }
}
module.exports = new Invoicegenerated();
