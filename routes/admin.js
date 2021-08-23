const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const { json } = require('express');

const db = require('../models/database');
const modelAdmin = require('../models/model_admin');
const checkToken = require('../controllers/checkToken');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET_ADMIN , {
		expiresIn: '90d',
	});
};
    
            // API GET:
router
    .route("/")
    .get(adminController.getListAdmins) // Danh sách tất cả admins
    .post(adminController.signup)   // Tạo tài khoản admin
    .put(adminController.putEditProfile);   // Cập nhật thông tin tài khoản admin
//router.get('/', authController.restrictTo, adminController.getListAdmins)

router
    .route("/trang-thai-don-hang")
    .get(authController.isLoggedIn, adminController.getListOrderStatus)    // Danh sách trạng thái đơn hàng
    .post(authController.isLoggedIn, adminController.postStatusOrder)      // Thêm 1 trạng thái của đơn hàng
    .put(authController.isLoggedIn, adminController.putEditStatusOrder);  // Cập nhật trạng thái đơn hàng

router.get('/danh-sach', authController.isLoggedIn, authController.restrictTo, adminController.getListAdmins);

router
    .route("/:id")
    .get(adminController.getAdmin)  // Chi tiết 1 nhân viên theo mã
    .delete(authController.isLoggedIn, authController.restrictTo_QLNS, adminController.deleteAdmin)  // Xoá tài khoản nhân viên.

router
    .route("/trang-thai-don-hang/:id")
    .get(adminController.getOrderStatus)    // Chi tiết 1 trạng thái đơn hàng
    .delete(authController.isLoggedIn, authController.restrictTo, adminController.deleteStatusOrder); // Xoá trạng thái đơn hàng


router.get("/dang-xuat", adminController.logout);
router.post("/dev-dang-nhap", adminController.login);// Đăng nhập
router.put('/quen-mat-khau', adminController.putForgotPassword);
router.put('/doi-mat-khau', adminController.putEditPassword);// Đổi mật khẩu admin
router.put('/cap-nhat-trang-thai', adminController.putEditStatusAdmin);

    // Đăng nhập:
router.post('/dang-nhap', function (req, res, next) {
    let em = req.body.email;
    let mk = req.body.password;

    let sql = `SELECT * FROM admin WHERE admin = '${em}'`;
    db.query(sql, (err, rows) => {
        if(err){
            res.status(400).json({"status": "LoginFail", "message": "Không tìm thấy tài khoản!", "error": err});
        }
        if (rows.length == 0) {
            res.status(400).json({"status": "LoginFail", "message": "Không tìm thấy tài khoản admin này! Vui lòng kiểm tra lại email!", "error": err});
        }else{
            const admin = rows[0];
            let pass_fromdb = admin.matkhau;
            var kq = bcrypt.compareSync(mk, pass_fromdb);// So sánh mật khẩu từ người dùng và MK đã mã hoá dưới DB.
            const token = signToken(admin.manv);
            const cookieOptions = {
                expires: new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            }; 
            res.cookie("jwtAdmin", token, cookieOptions);
            //res.header("auth-token", token).send(token);
            //Remove password from output
            admin.matkhau = undefined;
            if (kq) {
                res.status(200).json({
                    status: "LoginSuccess",
                    message: "Đăng nhập thành công!",
                    admin: {
                        manv: admin.manv,
                        username: admin.tennv,
                        email: admin.admin,
                        img: admin.hinh,
                        phone: admin.sodienthoai,
                        address: admin.diachi,
                        permission: admin.quyen,
                        status: admin.trangthai   
                    },
                    token
                });
            }else{
                res.status(400).json({status: "LoginFail", message: "Đăng nhập không thành công! Vui lòng kiểm tra lại mật khẩu."});
            }
        }
    });
});
    // Thêm tài khoản admin:
/* router.post('/dang-ky', async function(req, res) {
    let email = req.body.email;
    let pass = req.body.pass;
    let pass1 = req.body.pass1;
    let name = req.body.name;
    let img = req.body.img;
    let address = req.body.address;
    let phone = req.body.phone;
    let permission = req.body.permission;
    let ward = req.body.ward;
    
    try {
        if (pass == pass1){
            if(img == undefined){
                img = 'https://firebasestorage.googleapis.com/v0/b/fashionshop-c6610.appspot.com/o/User_Img%2FuserICON.png?alt=media&token=b64576ab-18b6-4d7a-9864-c15f59d5717c&fbclid=IwAR0UVyyCkNoF_dfbguTVOkC5lzvHPk-0C4Ef_iFmPxl8lKX2xQsKObTo568';
            }
            if(ward != undefined){
                var url = "https://thongtindoanhnghiep.co/api/ward/" + ward;
                axios.get(url)
                    .then(async function (response) {
                        let tpho = response.data.TinhThanhTitle;
                        let quan = response.data.QuanHuyenTitle;
                        let phuong = response.data.Title;
                        let diachi = address + ', ' + phuong + ', ' + quan + ', ' + tpho;
                        var salt = bcrypt.genSaltSync(10); // Chuỗi cộng thêm vào mật khẩu để mã hoá.
                        var pass_mahoa = bcrypt.hashSync(pass, salt);   // Mã hoá password.
                        let data = {
                            admin: email,
                            matkhau: pass_mahoa,
                            tennv: name,
                            hinh: img,
                            diachi: diachi,
                            sodienthoai: phone,
                            quyen: permission
                        };
                        let query = await modelAdmin.insert_Admin(data);
                        res.status(200).json({ "status": "Success", "message": "Đăng ký tài khoản admin thành công!" });
                    })
                    .catch(function (error) {
                        res.status(400).json({ "status": "Fail", "message": "Lỗi GET DETAIL DISTRICT !!!", "error": error });
                    });
            } else{
                var salt = bcrypt.genSaltSync(10);
                var pass_mahoa = bcrypt.hashSync(pass, salt);
                let data = {
                    admin: email,
                    matkhau: pass_mahoa,
                    tennv: name,
                    hinh: img,
                    diachi: address,
                    sodienthoai: phone,
                    quyen: permission
                };
                let query = await modelAdmin.insert_Admin(data);
                res.status(200).json({ "status": "Success", "message": "Đăng ký tài khoản admin thành công!" });
            }
        } else
            res.status(400).json({ "status": "Fail", "message": "Hai mật khẩu ko trùng khớp! Đăng ký không thành công!" });
    } catch (error) {
        res.status(400).json({ "status": "Fail", "message": "Lỗi cú pháp! Đăng ký không thành công!", "error": error });
    } 
}); */
               

module.exports = router;