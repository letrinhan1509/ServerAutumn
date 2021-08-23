var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const indexController = require('../controllers/indexController');


router.get('/dang-nhap', (req, res, next) => { 
    res.status(200).render('dang-nhap');
});


            // API 
    //GET:
router.get('/tien-te', indexController.getListCurrency);
router.get("/ca-lay-hang-GHN", indexController.getPickShift);   // Chọn ca để GHN lấy hàng
router.get('/city', indexController.getListCities);         // Danh sách tất cả thành phố
router.get('/city-GHN', indexController.getProvince);       // API danh sách thành phố GHN
router
    .route("/shop")
    .get(indexController.getShop)
    .post(indexController.postCreateShop);

router.get('/thong-ke', authController.isLoggedIn, indexController.postDashboardStatistics);   // Thống kê ở trang Dashboard

router.get('/city/:id', indexController.getDetailCity);     // Chi tiết 1 Tỉnh/Thành phố
router.get('/dich-vu-GHN/:id', indexController.getService); // Danh sách các dịch vụ của GHN
router.get('/district/:id', indexController.getDetailDistrict); // Chi tiết 1 Quận/Huyện
router.get('/district-GHN/:id', indexController.getDistrict);   // API danh sách quận GHN
router.get('/ward-GHN/:id', indexController.getWard);       // API danh sách phường GHN

router.get('/city/:id/district', indexController.getListCounties);  // Danh sách toàn bộ Quận/Huyện theo Tỉnh/Thành phố
router.get('/district/:id/ward', indexController.getListWards); // Danh sách toàn bộ Phường/Xã thuộc Quận/Huyện
router.get('/ward/:id', indexController.getDetailWard); // Chi tiết 1 phường, xã, thị trấn

router.post('/fee', indexController.postTransportFee);



module.exports = router;