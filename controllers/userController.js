const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require('../utils/catchAsync');
const authController = require('../controllers/authController');
const modelUser = require('../models/model_user');
const { sendmail } = require('../mail');


const signToken = (id, email) => {
	return jwt.sign({ _id: id, email: email }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};


                    // USER CONTROLLER

// GET
// GET: List of customers
exports.getListUsers = catchAsync(async (req, res, next) => {
    try {
        let listUsers = await modelUser.list();
        return res.status(200).json({
            status: "Success", 
            data: listUsers
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong!",
            error: error
        });
    }
});
// GET: Detail 1 customer by id
exports.getDetailUser = catchAsync(async (req, res, next) => {
    try {
        let userId = req.params.id;
        if(!userId) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !!!"
            }); 
        }
        let user = await modelUser.get_By_Id(userId);
        if(user == -1){     // Kiểm tra user_id trong DB.
            return res.status(400).json({
                status: "Fail", 
                message: "Tài khoản khách hàng này không tồn tại !"
            });
        } else {
            return res.status(200).json({
                status: "Success", 
                data: user
            });
        }  
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: 
exports.getUserName = catchAsync(async (req, res, next) => {
    try {
        let nameUser = req.params.name;
        let User = await modelUser.detailByName(nameUser);
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: Logouts
exports.getLogouts = catchAsync(async (res, req, next) => {
    try {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        return res.status(200).json({ 
            status: 'Success', 
            message: "Đăng xuất thành công"
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});


        // POST
// POST: Create customer account
exports.postUser = catchAsync(async (req, res, next) => {
    try {
        let hinh = "https://firebasestorage.googleapis.com/v0/b/fashionshop-c6610.appspot.com/o/User_Img%2Fuser.png?alt=media&token=6ec247df-90ab-4cc9-b671-7261ef37215f&fbclid=IwAR2WTfoELEQhDxDpM3qKj0XcNtFNZyR1_5AYxYWNWpzzoIsuOWOIOqH9K9k";
        let nhaplaimk = req.body.nhaplaimk;
        const data = {
            tenkh: req.body.tenkh,
            email: req.body.email,
            matkhau: req.body.matkhau,
            hinh: hinh,
            sodienthoai: req.body.sodienthoai,
            diachi: req.body.diachi,   
        };
        if(!data.tenkh || !data.email || !data.matkhau || !data.sodienthoai || !data.diachi) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !"
            });
        }
        const userExist = await modelUser.checkEmail(data.email);
        if(userExist == -1) {
            // Email không tồn tại:
            if(data.matkhau.length < 8) {
                return res.status(400).json({
                    status: "Fail",
                    message: "Mật khẩu phải lớn hơn 8 ký tự, vui lòng nhập lại mật khẩu !"
                });
            };
            if(data.sodienthoai.length <= 9 || data.sodienthoai.length > 10) {
                return res.status(400).json({
                    status: "Fail",
                    message: "Số điện thoại không được ít hơn 9 số và không vượt quá 10 số, vui lòng kiểm tra lại !"
                }); 
            };
            if(data.matkhau == nhaplaimk) {
                var salt = bcrypt.genSaltSync(10);  // Chuỗi cộng thêm vào mật khẩu để mã hoá
                var mk_mahoa = bcrypt.hashSync(data.matkhau, salt);   // Mã hoá password
                data.matkhau = mk_mahoa;
                const query_Create = await modelUser.insert_User(data);
                await sendmail(data.email, data.tenkh, "register");
                return res.status(200).json({ 
                    status: "Success", 
                    message: query_Create
                });
            } else {
                return res.status(400).json({
                    status: "Fail", 
                    message: "Mật khẩu và xác nhận mật khẩu không trùng khớp, vui lòng kiểm tra lại !"
                });
            }
        } else {
            // Email đã tồn tại tồn tại
            return res.status(400).json({
                status: "Fail",
                message: "Email " + `${data.email}` + " này đã tồn tại, vui lòng nhập lại email khác !"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// POST: Customer account login
exports.postUserLogin = catchAsync(async (req, res, next) => {
    try {
        let em = req.body.email;
        let mk = req.body.matkhau;
        if(!em || !mk) {
            return res.status(400).json({
                status: "LoginFail",
                message: "Thiếu thông tin đăng nhập. Vui lòng kiểm tra lại thông tin !"
            });
        };
        const userExist = await modelUser.checkEmail(em);
        if(userExist == -1) {
            // Email này không tồn tại
            return res.status(400).json({
                status: "LoginFail",
                message: "Tài khoản email " + `${em}` + " này không tồn tại, vui lòng kiểm tra lại thông tin !"
            });
        } else {
            // Email này tồn tại
            if(userExist.trangthai === 0){
                return res.status(400).json({
                    status: "LoginFail",
                    message: "Tài khoản này hiện đang tạm khoá, vui lòng liên nhân viên để mở khoá !"
                });
            };
            let pass_fromdb = userExist.matkhau;
            var kq = bcrypt.compareSync(mk, pass_fromdb);
            const token = signToken(userExist.makh, userExist.email);
            const cookieOptions = {
                expires: new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            };
            res.cookie("jwt", token, cookieOptions);
            if(kq) {
                // Đăng nhập thành công
                userExist.matkhau = undefined;
                return res.status(200).json({
                    status: "LoginSuccess",
                    message: "Đăng nhập thành công.",
                    data: userExist,
                    token
                });
            } else {
                // Đăng nhập thất bại
                return res.status(400).json({
                    status: "LoginFail",
                    message: "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu !!!"
                });
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});


        // PUT
// PUT: Update user account information
exports.putEditUser = catchAsync(async (req, res, next) => {
    try {
        //let makm = req.body.makh;
        let email = req.body.email;
        let ten = req.body.username;
        let tenhinh = req.body.imgName;
        let hinh = req.body.img;
        let diachi = req.body.diachi;
        let sdt = req.body.sdt;
        if(!email || !ten || !tenhinh || !hinh || !diachi || !sdt) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !"
            });
        };
        const userExist = await modelUser.checkEmail(email);
        if(userExist == -1) {
            return res.status(400).json({
                status: "Fail",
                message: "Không tìm thấy tài khoản có email " + `${email}` + " này, vui lòng kiểm tra lại email !"
            });
        } else {
            if(sdt.length <= 9 || sdt.length > 10) {
                return res.status(400).json({
                    status: "Fail",
                    message: "Số điện thoại không được ít hơn 9 số và không vượt quá 10 số, vui lòng kiểm tra lại !"
                });
            };
            let query = await modelUser.updateProfile(email, ten, tenhinh, hinh, sdt, diachi);
            const user = await modelUser.checkEmail(email);
            user.matkhau = undefined;   // Xoá mật khẩu khi trả về 1 user
            return res.status(200).json({ 
                status: "Success", 
                message: query,
                user: user
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// PUT: Change Password
exports.putChangePassword = catchAsync(async (req, res, next) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let newPassword = req.body.newPassword;
        let confirmPassword = req.body.confirmPassword;
        if(!email || !password || !newPassword || !confirmPassword) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !"
            });
        };
        const userExist = await modelUser.checkEmail(email);
        if(userExist == -1) {
            return res.status(400).json({
                status: "Fail",
                message: "Không tìm thấy tài khoản có email " + `${email}` + " này !"
            });
        };
        var kq = bcrypt.compareSync(password, userExist.matkhau);
        if(kq) {
            if(newPassword === confirmPassword) {
                var salt = bcrypt.genSaltSync(10);
                var pass_mahoa = bcrypt.hashSync(newPassword, salt);
                let query = await modelUser.updatePasswordUser(email, pass_mahoa);
                return res.status(200).json({ 
                    status: "Success", 
                    message: "Đổi mật khẩu thành công !" 
                });
            } else {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Mật khẩu mới và xác nhận mật khẩu mới không trùng nhau, vui lòng nhập lại !" 
                });
            };
        } else {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Mật khẩu cũ không đúng, vui lòng kiểm tra lại thông tin !" 
            });
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong!",
            error: error
        });
    }
});

exports.putForgotPassword = catchAsync(async (req, res, next) => {
    try {
        let email = req.body.email;
        if(!email) {
            return res.status(400).json({
                status: "Fail",
                message: "Vui lòng nhập Email để lấy lại mật khẩu !"
            });
        };
        const userExist = await modelUser.checkEmail(email);
        if(userExist == -1) {
            return res.status(400).json({
                status: "Fail",
                message: "Không tìm thấy tài khoản có email này, vui lòng kiểm tra lại !"
            });
        } else {
            let newPassword = Math.random().toString(36).substring(7);

            var nodemailer = require('nodemailer');

            const smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "autumnshop180@gmail.com",
                    pass: "autumn@180CaoLo"
                }
            });

            var mailOptions = {
                from: "Autumn shop <autumnshop180@gmail.com>", //Email người gửi
                to: `${email}`, // Email người nhận
                subject: 'Lấy lại mật khẩu',
                text: 'Lấy lại mật khẩu',
                html: `Cửa hàng thời trang AutumnShop xin gửi lại mật khẩu của bạn. <br>
            Mật khẩu mới: <b style="padding: 5px 7px; background: #eee; color: red"> '${newPassword}' </b>`, // Nội dung thư, có thể có code html
            };

            smtpTransport.sendMail(mailOptions, async(error, info) => {
                if (error){
                    console.log(error);
                    return res.status(400).json({status: "Fail", message: "Lỗi. Không thể gửi mail!"});
                } else {
                    console.log('Đã gửi mail: ' + info.response);
                    var salt = bcrypt.genSaltSync(10);
                    var pass_mahoa = bcrypt.hashSync(newPassword, salt);
                    const pass = await modelUser.updatePasswordUser(email, pass_mahoa);
                    smtpTransport.close();
                    return res.status(200).json({
                        status: "Success",
                        message: "Mật khẩu mới đã được gửi qua email của bạn. Vui lòng kiểm tra lại email để nhận mật khẩu !",
                        /* pass: newPassword */
                    });
                }
            })
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong!",
            error: error
        });
    }
});

// PUT: Update customer account status
exports.putEditUserStatus = catchAsync(async (req, res, next) => {
    try {
        let makh = req.body.userId;
        let stt = req.body.stt;
        if(!makh || stt == undefined) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !"
            });
        }
        const userExist = await modelUser.get_By_Id(makh);
        if(userExist == -1) {
            return res.status(400).json({
                status: "Fail",
                message: "Tài khoản này không tồn tại, vui lòng kiểm tra lại !"
            });
        } else {
            if(stt == 0) {
                const query_lock = await modelUser.lock_User(makh);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query_lock 
                });
            } else if (stt == 1) {
                const query_unlock = await modelUser.unlock_User(makh);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query_unlock 
                });
            } else {
                return res.status(400).json({
                    status: "Fail",
                    message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !"
                });
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});


        // DELETE
// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
    try {
        let makh = req.params.id;
        if(makh == undefined) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !"
            });
        }
        const userExist = await modelUser.get_By_Id(makh);
        if(userExist == -1) {
            return res.status(400).json({
                status: "Fail",
                message: "Tài khoản này không tồn tại, vui lòng kiểm tra lại !"
            });
        } else {
            const query = await modelUser.delete_User(makh);
            // error_Code = 6 : Có ràng buộc khoá ngoại ko thể xoá.
            if(query == 6) {
                return res.status(400).json({
                    status: "Fail",
                    message: "Hiện tại không thể xoá tài khoản này, đã chuyển trạng thái tài khoản thành khoá !"
                });
            };
            if(query == 1) {
                const listUsers = await modelUser.list();
                return res.status(200).json({ 
                    status: "Success", 
                    message: "Xoá tài khoản user thành công !",
                    listUsers: listUsers 
                });
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});