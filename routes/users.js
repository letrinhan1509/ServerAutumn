var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');


            // API
    // GET
router.get('/', userController.getListUsers);   // Danh sách tất cả khách hàng
router
    .route('/:id')
    .get(userController.getDetailUser)   // Chi tiết 1 khách hàng bằng id
    .delete(userController.deleteUser); // Xoá tài khoản khách hàng 

router.get('/ten/:name', userController.getUserName);   // Tìm khách hàng bằng tên: "async"->Bất đồng bộ
    // POST
router.post('/dang-ky', userController.postUser);   // Đăng ký tài khoản
router.post('/dang-nhap', userController.postUserLogin);    // Đăng nhập tài khoản
router.post('/dang-ky/gmail', userController.postUser);   // Đăng ký tài khoản khi đăng nhập bằng gmail
router.post('/dang-nhap/gmail', userController.postUserLogin);    // Đăng nhập tài khoản thông qua tài khoản gmail
router.post('/quen-mat-khau', userController.putForgotPassword);
    // PUT
router.put('/quen-mat-khau', userController.putForgotPassword);
router.put('/doi-mat-khau', userController.putChangePassword);  // Đổi mật khẩu tài khoản user
router.put('/cap-nhat-tai-khoan', userController.putEditUser); // Cập nhật thông tin tài khoản user
router.put('/cap-nhat-trang-thai', userController.putEditUserStatus);   // Cập nhật trạng thái tài khoản user
    // DELETE
//router.delete('/xoa/:id', userController.deleteUser);    


module.exports = router;