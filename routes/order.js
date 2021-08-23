const axios = require('axios');
var express = require('express');
var router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');


            // API ORDER
router
    .route("/")
    .get(orderController.getListOrders)     // Danh sách đơn hàng
    .post(orderController.postCreateOrder)  // Tạo đơn hàng
    .put(orderController.putEditStatus);    // Cập nhật trạng thái đơn hàng

router
    .route("/:id")
    .get(orderController.getOrder)  // Chi tiết 1 đơn hàng theo mã đơn hàng
    .delete(orderController.deleteOrder);   // Huỷ(xoá) đơn hàng

router.get('/:id/chi-tiet-dhang', orderController.getListDetailOrders); // Danh sách các chi tiết đơn hàng theo mã đơn hàng
router.get('/khach-hang/:id', orderController.getListOrderUser);        // Đơn hàng theo mã khách hàng
router.get('/so-dien-thoai/:phone', orderController.getListOrderPhone); // Đơn hàng theo số điện thoại

router.post("/pay-momo", orderController.postPaymentMomo);
router.post("/ket-qua-thanh-toan", orderController.postResult);
router.post('/thong-ke-don-hang', orderController.postOrderStatistics);

router.delete("/GHN/cancel/:id", orderController.deleteOrderGHN);   // Huỷ đơn hàng vận chuyển từ GHN
router.post("/GHN/create", orderController.postCreateOrderGHN); // Tạo đơn hàng của GHN
router.post("/GHN/detail", orderController.postDetailOrderGHN); // Thông tin chi tiết 1 đơn hàng




//router.post('/tao-don-hang', orderController.postCreateOrder);
//router.put('/cap-nhat-trang-thai', orderController.putEditStatus);
//router.delete('/xoa/:id', orderController.deleteOrder);


/* router.post('/tao-don-hang', async function(req, res) {
    let makh = req.body.order.makh;
    let tenkh = req.body.order.tenkh;
    let email = req.body.order.email;
    let sodienthoai = req.body.order.sodienthoai;
    let address = req.body.order.address;
    let ward = req.body.order.ward;
    let tongtien = req.body.sumpay;
    let makm = req.body.makm;
    let ship = req.body.ship;
    let ghichu = req.body.note;
    let hinhthuc = req.body.pay; 
    var today = new Date();
    var ngaydat = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let cart = req.body.order.cart;
    
    try {
        if(makm == undefined){
            console.log("Không có mã km");
            var url = "https://thongtindoanhnghiep.co/api/ward/" + ward;
            axios.get(url)
                .then(async function (response) {
                    let tpho = response.data.TinhThanhTitle;
                    let quan = response.data.QuanHuyenTitle;
                    let phuong = response.data.Title;
                    let diachi = address + ', ' + phuong + ', ' + quan + ', ' + tpho;
                    let query = await modelOrder.insert_Order(makh, tenkh, email, sodienthoai, diachi, ship, tongtien, ghichu, hinhthuc, ngaydat, cart);
                    res.status(200).json({"status": "Success", "message": "Tạo đơn hàng thành công !"});
                })
                .catch(function (error) {
                    res.status(400).json({ "status": "Fail", "message": "Lỗi... GET DETAIL DISTRICT !!!", "error": error });
                });
        } else {
            // Trường hợp đơn hàng có mã khuyến mãi:
            var url = "https://thongtindoanhnghiep.co/api/ward/" + ward;
            axios.get(url)
                .then(async function (response) {
                    let tpho = response.data.TinhThanhTitle;
                    let quan = response.data.QuanHuyenTitle;
                    let phuong = response.data.Title;
                    let diachi = address + ', ' + phuong + ', ' + quan + ', ' + tpho;
                    let query = await modelOrder.insert_Order_PromoCode(makh, tenkh, email, sodienthoai, diachi, ship, tongtien, ghichu, makm, hinhthuc, ngaydat, cart);
                    res.status(200).json({"status": "Success", "message": "Tạo đơn hàng thành công !"});
                })
                .catch(function (error) {
                    res.status(400).json({ "status": "Fail", "message": "Lỗi... GET DETAIL DISTRICT !!!", "error": error });
                });
        } 
    } catch (error) {
        res.status(400).json({"status": "Fail", "message": "Lỗi...! Tạo đơn hàng không thành công!", "error": error });
    }
}); */


module.exports = router;