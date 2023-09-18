class Accesskeymail {
    Welcomeemail(email, password, name, taxi, redirectionUrl) {
        return (
            "<!DOCTYPE html>" +
            '<html lang="en">' +
            "" +
            "<head>" +
            '    <meta charset="UTF-8">' +
            "    <title>Document</title>" +
            "</head>" +
            "" +
            "<body> <p>Hello " + taxi.name + ",</p>" +
            "</br>" +
            "<p>You are successfully onboarded to the Kwix Connect Portal. Here are your login credentials:</p><br/>" +
            "<p>Email : " + email + "</p>" +
            "<p>Password : " + password + "</p>" +
            "<br/>" +
            "<p>You can click on the following link : <a href='"+redirectionUrl+"' target='_blank'>"+redirectionUrl+"</a> and use the credentials provided to login onto the portal.</p>" +
            "<p>You can email kwix at <a href='mailto:info@kwixconnect.com'>info@kwixconnect.com</a> in case of any issues.</p>" +
            //  '<img width=100 height=100  src="https://gappqa.s3.ap-southeast-2.amazonaws.com/80.png">' +
            "<br/>" +
            "<p>Regards,</p>" +
            "<p>Kwix Connect Team</p>" +
            // "<img width='100' height='50' src='cid:signatureimage' />" +
            "<br/>" +
            "</body></html>"
        );
    }
}
module.exports = new Accesskeymail();