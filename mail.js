const mailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const { Hello } = require('./views/hello_template');
const { Thanks } = require('./views/thanks_template');
const { Register } = require('./views/register_template');
const { Purchase } = require('./views/purchase_template');


const getEmailData = (to, name, template, dataa) => {
    let data = null;
    switch (template) {
        case "hello":
            data = {
                from: "Autumn shop <autumnshop180@gmail.com>",
                to,
                subject: `Hello ${name}`,
                html: Hello()
            }
            break;
        case "thanks":
            data = {
                from: "Autumn shop <autumnshop180@gmail.com>",
                to,
                subject: `Thư cảm ơn khách hàng ${name} đã quan tâm đến shop`,
                html: Thanks()
            }
            break;
        case "register":
            data = {
                from: "Autumn shop <autumnshop180@gmail.com>",
                to,
                subject: `Thư cảm ơn khách hàng ${name} đã đăng ký tài khoản thành công`,
                html: Register()
            }
            break;
        case "purchase":
            data = {
                from: "Autumn shop <autumnshop180@gmail.com>",
                to,
                subject: `Cảm ơn khách hàng ${name} đã mua hàng của shop`,
                html: Purchase(dataa)
            }
            break;
        default:
            data;
    }
    return data
}

const sendmail = (to, name, type, dataa) => {
    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mail = getEmailData(to, name, type, dataa);
    smtpTransport.sendMail(mail, function(error, response) {
        if(error) {
            console.log("Không gửi được mail");
            console.log(error);
            return false;
        } else {
            console.log("email sent successfully");
            smtpTransport.close();
            return true;
        }
    })
}

module.exports = { sendmail }