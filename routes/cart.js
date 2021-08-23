var express = require('express');
var router = express.Router();

const cartController = require('../controllers/cartController');


            // GET:
router
    .route("/")
    .get(cartController.getListCarts)// Danh sách tất cả giỏ hàng
    .post(cartController.postAddCart)// Thêm sản phẩm vào giỏ hàng
    .put(cartController.putEditCart);// Cập nhật 1 sản phẩm trong giỏ hàng

router
    .route("/:id")
    .get(cartController.getCart)// Chi tiết giỏ hàng
    .delete(cartController.deleteCart);// Xoá 1 sản phẩm trong giỏ hàng thông qua id giỏ hàng.

router.get('/khach-hang/:id', cartController.getUserCarts);// Giỏ hàng theo mã khách hàng.
router.get('/san-pham/:id', cartController.getCartProduct);// Giỏ hàng theo mã sản phẩm.          


module.exports = router;