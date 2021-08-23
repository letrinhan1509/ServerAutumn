const mailer = require("nodemailer");

const getEmailData = (to, name, template) => {
    let data = null;
    switch (template) {
        case "hello":
            data = {
                from: "Autumn shop <autumnshop180@gmail.com>",
                to,
                subject: `Hello ${name}`,
                html: `Cửa hàng thời trang autumn xin chào quý khách!`
            }
            break;
        case "thanks":
            data = {
                from: "Autumn shop <autumnshop180@gmail.com>",
                to,
                subject: `Thanks ${name}`,
                html: `Cửa hàng thời trang autumn xin cảm ơn quý khách!`
            }
            break;
        default:
            data;
    }
    return data
}

const sendmail = (to, name, type) => {
    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: "autumnshop180@gmail.com",
            pass: "autumn@180CaoLo"
        }
    });
    const mail = getEmailData(to, name, type);
    smtpTransport.sendMail(mail, function(error, response) {
        if(error) {
            console.log("Không gửi được mail");
            console.log(error);
        } else {
            console.log("email sent successfully");
        }
        smtpTransport.close();
    })
}

module.exports = { sendmail }