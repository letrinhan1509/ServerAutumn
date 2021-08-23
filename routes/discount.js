const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');


            // API DISCOUNT
router
    .route("/")
    .get(promotionController.getList)    // Danh sách tất cả các khuyến mãi (Voucher + Khuyến mãi theo sản phẩm)

router
    .route("/san-pham")
    .get(promotionController.getPromotionListProduct)   // Danh sách các khuyến mãi theo sản phẩm
    .post(promotionController.postPromotionProduct)     // Tạo chương trình khuyến mãi theo sản phẩm
    .put(promotionController.putEditPromotionProduct);  // Cập nhật khuyến mãi theo sản phẩm

router
    .route("/voucher")
    .get(promotionController.getDiscountCodeList)   // Danh sách các mã giảm giá (voucher)
    .post(promotionController.postPromotionCODE)    // Tạo chương trình khuyến mãi là voucher
    .put(promotionController.putEditPromotionCODE); // Cập nhật khuyến mãi là voucher

router
    .route("/:id")
    .get(promotionController.getDetailPromotion)     // Chi tiết 1 khuyến mãi theo "mã khuyến mãi"
    .delete(promotionController.deletePromotion)    // Xoá 1 chương trình khuyến mãi theo makm

router.get('/voucher/:ma', promotionController.getDetailPromotionVoucher);    // Chi tiết 1 khuyến mãi voucher theo mã voucher
    

//router.post('/them-voucher', promotionController.postPromotionCODE);    
//router.post('/them-khuyen-mai/san-pham', promotionController.postPromotionProduct); 

//router.put('/cap-nhat-voucher', promotionController.putEditPromotionCODE);
//router.put('/cap-nhat/san-pham', promotionController.putEditPromotionProduct);
//router.put('/cap-nhat-trang-thai', promotionController.putEditPromotionStatus);

//router.delete('/xoa-khuyen-mai/:id', promotionController.deletePromotion);


module.exports = router;