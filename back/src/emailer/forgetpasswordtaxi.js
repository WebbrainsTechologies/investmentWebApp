class ForgetpasswordTaxi {
    ForgetpasswordTaxi(link, taxi) {
        return (
            "<!DOCTYPE html>" +
            '<html lang="en">' +
            "" +
            "<head>" +
            '    <meta charset="UTF-8">' +
            "    <title>Document</title>" +
            "</head>" +
            "" +
            "<body>" +
            "<p>Hello " +
            taxi.name +
            ",</p>" +
            "<p>Please find below the link to reset your password. After clicking on the link you will be able to create your new password.</p>" +
            "<p><a href='" +
            link +
            "'>" +
            link +
            "</a></p>" +
            "<p>If you have any issues, you can contact Kwix Connect Admin at info@kwixconnect.com.</p>" +
            "<p>Regards,</p>" +
            "<p>Kwix Connect Team</p>" +
            "</body></html>"
        );
    }
}
module.exports = new ForgetpasswordTaxi();
