const axios = require('axios');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const modelOrder = require('../models/model_order');
const modelDiscount = require('../models/model_discount');
const modelUser = require('../models/model_user');
const modelCart = require('../models/model_cart');
const modelProduct = require('../models/model_product');
const { sendmail } = require('../mail');
const e = require('express');


                    // ORDER CONTROLLER

const kiemTraSoLuong = async() => {

}

const capNhatSoLuong_KhuyenMai = async(makm) => {
    let discount = await modelDiscount.get_By_discountId(makm);
    if(discount.voucher !== "null" && discount.soluong > 0) {
        let soluong = discount.soluong - 1;
        let query = await modelDiscount.update_AmountVoucher(makm, soluong);
    }
}

const capNhatSoLuong = async(product) => {
    let pro = await modelProduct.get_By_Id(product.masp);
    let chitiet = JSON.parse(pro.chitiet);
    chitiet.forEach(element => {
        if (product.size === element.size && product.mau === element.mau) {
            element.soluong = element.soluong - product.soluong;
        };
    });
    let temp_chitiet = JSON.stringify(chitiet);
    const updateAmountProduct = await modelProduct.update_amount(
        product.masp,
        temp_chitiet
    );
}

const create_order_GHTK = async(cart, madonhang, email, tel, name, address, province, district, ward, street, freeship, sumpay, note) => {
    try {
        let products = [];
        let temp = {};
        cart.forEach(element => {
            temp.name =  element.tensp;
            temp.weight = element.soluong * 0.1;
            products.push(temp);
        });
        const data = {
            "products": products,
            "order": {
                "id": String(madonhang),
                "pick_name": "Lê Trí Nhân",
                "pick_address": "82/72",
                "pick_province": "TP. Hồ Chí Minh",
                "pick_district": "Quận Bình Thạnh",
                "pick_ward": "Phường 1",
                "pick_email": "autumnshop180@gmail.com",
                "pick_tel": "0969362915",
                "return_name": "Lê Trí Nhân",
                "return_address": "82/72",
                "return_province": "TP. Hồ Chí Minh",
                "return_district": "Quận Bình Thạnh",
                "return_tel": "0969362915",
                "return_email": "autumnshop180@gmail.com",
                "email": email,
                "tel": tel,
                "name": name,
                "address": address,
                "province": province,
                "district": district,
                "ward": ward,
                "street": street,
                "hamlet": "Khác",
                "is_freeship": freeship, 
                "pick_money": sumpay,// Số tiền CoD. Nếu bằng 0 thì không thu tiền CoD. Tính theo VNĐ.
                "note": note,
                "value": 10000,//Giá trị đóng bảo hiểm, là căn cứ để tính phí bảo hiểm và bồi thường khi có sự cố.
                "transport": "road",//Phương thức vận chuyển
                "pick_option":"cod" ,// Đơn hàng xfast yêu cầu bắt buộc pick_option là COD     
                "deliver_option" : "xteam", // nếu lựa chọn kiểu vận chuyển xfast    
                "pick_session" : "8_mai", // Phiên lấy xfast 
            }
        }
        //var url = `https://services.giaohangtietkiem.vn/services/shipment/order`;   // URL môi trường thật
        var url = `https://services.ghtklab.com/services/shipment/order`; // URL môi trường thử nghiệm, sandbox
        const order = await axios.post(url, data, {
            //headers: { 'Token': 'c86FbBF0d29fD8fE2b58F3bE5e6571711CcF180a','Content-Type': 'application/json' }
            headers: { 'Token': 'c86FbBF0d29fD8fE2b58F3bE5e6571711CcF180a' }
        });
        if(order.status == 200) {
            return order.data;
        } else {
            return false;
        }
    } catch (error) {
        return error; 
    }
};
const pay_Momo = async(orderID, sumpay, note = "Thanh toán MoMo") => {
    try {
        var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
        var hostname = "https://test-payment.momo.vn"
        var path = "/gw_payment/transactionProcessor"
        var partnerCode = "MOMOWQQ420210821"
        var accessKey = "pq0MAaL8s5IGlDgx"
        var serectkey = "8KZPP1qp9laisbVdSAAX97FrTvpkbwPp"
        var orderInfo = note // Thông tin đơn hàng
        var returnUrl = "http://localhost:3000/hoan-tat-don-hang"
        var notifyurl = "https://server-autumn.herokuapp.com/api/v1/don-hang/ket-qua-thanh-toan"
        var amount = String(sumpay);    // Tổng tiền đơn hàng
        var orderId = String(orderID);     // Mã đơn hàng
        var requestId = String(orderID);   // Mã đơn hàng
        var requestType = "captureMoMoWallet"
        var extraData = "merchantName=[AutumnShop];merchantId=[AutumnShop180]"
        
        var rawSignature = "partnerCode="+partnerCode+"&accessKey="+accessKey+"&requestId="+requestId+"&amount="+amount+"&orderId="+orderId+"&orderInfo="+orderInfo+"&returnUrl="+returnUrl+"&notifyUrl="+notifyurl+"&extraData="+extraData
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', serectkey)
                        .update(rawSignature)
                        .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        var body = {
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            returnUrl : returnUrl,
            notifyUrl : notifyurl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
        }

        let url = `https://test-payment.momo.vn/gw_payment/transactionProcessor`;
        const momo = await axios.post(url, body);
        if(momo.data.errorCode == 0) {
            return momo.data;
            /* return res.status(200).json({ 
                status: "Success", 
                message: momo.data.localMessage,
                payUrl: momo.data.payUrl
            }); */
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};


        // GET
// GET: List order 
exports.getListOrders = catchAsync(async (req, res, next) => {
    try {
        let listOrders = await modelOrder.list_Orders();
        return res.status(200).json({ 
            status: "Success",
            data: listOrders
        });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// GET: An order
exports.getOrder = catchAsync(async (req, res, next) => {
    try {
        let orderId = req.params.id;
        if(!orderId) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        let order = await modelOrder.get_By_Id(orderId);
        if(order == -1) {
            return res.status(404).json({ 
                status: "Fail", 
                message: "Mã đơn hàng " + `${orderId}` + " này không tồn tại, vui lòng kiểm tra lại !"
            });
        } else {
            return res.status(200).json({ 
                status: "Success", 
                data: order
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// GET: List detail order
exports.getListDetailOrders = catchAsync(async (req, res, next) => {
    try {
        let orderId = req.params.id;
        if(!orderId) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        const orderExist = await modelOrder.get_By_Id(orderId);
        if(orderExist == -1) {
            return res.status(404).json({ 
                status: "Fail", 
                message: "Mã đơn hàng " + `${orderId}` + " này không tồn tại, vui lòng kiểm tra lại !"
            });
        } else {
            const listDetails = await modelOrder.get_detailOrder(orderId);
            return res.status(200).json({ 
                status: "Success", 
                data: listDetails
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// GET: Order list by customer code
exports.getListOrderUser = catchAsync(async (req, res, next) => {
    try {
        let makh = req.params.id;
        if(!makh) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        const userExist = await modelUser.get_By_Id(makh);
        if(userExist == -1) {
            return res.status(404).json({ 
                status: "Fail", 
                message: "Khách hàng không tồn tại, vui lòng kiểm tra lại !"
            });
        };
        const listOrder = await modelOrder.get_By_userId(makh);
        if(listOrder == -1) {
            return res.status(200).json({ 
                status: "Success", 
                message: "Không có đơn hàng nào !",
                data: []
            });
        } else {
            return res.status(200).json({ 
                status: "Success", 
                message: "Lấy danh sách đơn hàng của khách hàng " + `${userExist.tenkh}` + " thành công !",
                data: listOrder
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// GET: Order list by phone number
exports.getListOrderPhone = catchAsync(async (req, res, next) => {
    try {
        let phone = req.params.phone;
        if(!phone) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu số điện thoại, vui lòng kiểm tra lại !"
            });
        };
        const listOrder = await modelOrder.get_By_Phone(phone);
        if(listOrder == -1) {
            return res.status(200).json({ 
                status: "Success", 
                message: "Không có đơn hàng nào cho số điện thoại này !",
                data: []
            });
        } else {
            return res.status(200).json({ 
                status: "Success", 
                message: "Lấy đơn hàng theo số điện thoại: " + `${phone}` + " thành công !",
                data: listOrder
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// GET: Order list by customer code
exports.getListStatus = catchAsync(async (req, res, next) => {
    try {
        let listStatus = await modelOrder.list_Order_Status();
        return res.status(200).json({ 
            status: "Success",
            data: listStatus
        });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});


        // POST
// POST: Tạo đơn hàng trên web của shop 
exports.postCreateOrder = catchAsync(async (req, res, next) => {
    try {
        const chitiet = "NULL";
        var makh = req.body.order.makh;
        var tenkh = req.body.order.tenkh;
        var email = req.body.order.email;
        var sodienthoai = req.body.order.sodienthoai;
        var diachi = req.body.order.address;
        var ward_id = req.body.order.ward;
        var tongtien = req.body.order.sumpay;
        var makm = req.body.order.makm;
        var ship = req.body.order.ship;
        var ghichu = req.body.note;
        var hinhthuc = req.body.pay;
        var vanchuyen = req.body.order.delivery;
        var today = new Date();
        var ngaydat = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var cart = req.body.order.cart; // Mảng danh sách các sản phẩm
        var freeship = req.body.is_freeship; 
        let momo = req.body.momo;
    
        if(!tenkh || !email || !sodienthoai || !diachi || !tongtien || !hinhthuc || !vanchuyen) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin đơn hàng, vui lòng kiểm tra lại thông tin !" });
        };
        if(!cart) {
            return res.status(400).json({ status: "Fail", message: "Giỏ hàng rỗng không thể tạo đơn hàng, vui lòng kiểm tra lại giỏ hàng !" });
        };
        //var diachi = address;
        if(vanchuyen == "GHN") {
            let province_GHN = req.body.chitiet.ProvinceID;
            let district_GHN = req.body.chitiet.DistrictID;
            let ward_GHN = req.body.chitiet.WardCode;
            let url_city_GHN = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`;
            var url_district_GHN = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=` + province_GHN;
            var url_ward_GHN = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=` + district_GHN;
            const listProvince = await axios.get(url_city_GHN, {
                headers: { Token: process.env.TOKEN_GHN_DEV }
            });
            const listDistrict = await axios.get(url_district_GHN, {
                headers: { Token: process.env.TOKEN_GHN_DEV }
            });
            const listWard = await axios.get(url_ward_GHN, {
                headers: { Token: process.env.TOKEN_GHN_DEV }
            });
            let diachi_GHN = {};
            listProvince.data.data.forEach(element => {
                if(element.ProvinceID === province_GHN) { diachi_GHN['province'] = element.ProvinceName; }
            });
            listDistrict.data.data.forEach(element => {
                if(element.DistrictID == district_GHN) { diachi_GHN['district'] = element.DistrictName; };
            });
            listWard.data.data.forEach(element => {
                if(element.WardCode === ward_GHN) { diachi_GHN['ward'] = element.WardName; }
            });
            diachi = diachi+ ', ' +diachi_GHN.ward+ ', ' +diachi_GHN.district+ ', ' +diachi_GHN.province;
            chitiet = JSON.stringify(req.body.chitiet);
        } else {
            if(ward_id == undefined) {
                return res.status(400).json({ status: "Fail", message: "Thiếu thông tin địa chỉ đơn hàng, vui lòng kiểm tra lại !" });
            } else {
                var url = "https://thongtindoanhnghiep.co/api/ward/" + ward_id;
                const list = await axios.get(url);
                var phuong_API = list.data.Title;
                var quan = list.data.QuanHuyenTitle;
                var thanhpho = list.data.TinhThanhTitle;
                diachi = diachi+ ', ' +list.data.Title+ ', ' +list.data.QuanHuyenTitle+ ', ' +list.data.TinhThanhTitle;
            }
        };
        const data_Order = {
            madonhang : "",
            tenkh : tenkh,
            email : email,
            sodienthoai : sodienthoai,
            diachi : diachi,
            tongtien : tongtien,
            tienship : ship,
            ngaydat : ngaydat
        }
        if(makh == undefined){
            // Tạo đơn hàng cho khách không có tài khoản
            if(vanchuyen == "GHTK") {
                let queryNotUserDiscount = await modelOrder.insert_Order(tenkh, email, sodienthoai, diachi, ship, tongtien, ghichu, makm, hinhthuc, vanchuyen, chitiet, ngaydat, cart);
                const order_GHTK = await create_order_GHTK(cart, queryNotUserDiscount, email, sodienthoai, tenkh, diachi, thanhpho, quan, phuong_API, diachi, freeship, tongtien, ghichu);
                if(order_GHTK.success) {
                    console.log("Tạo đơn hàng trên GHTK thành công");
                    if(momo === "YES") {
                        const pay_MOMO = await pay_Momo(queryNotUserDiscount, tongtien, ghichu);
                        if(pay_MOMO) {
                            for (let i = 0; i < cart.length; i++) {
                                await capNhatSoLuong(cart[i]);
                            }
                            data_Order.madonhang = queryNotUserDiscount;
                            await sendmail(email, tenkh, "purchase", data_Order);
                            return res.status(200).json({
                                status: "Success",
                                message: "Tạo đơn hàng với phương thức vận chuyển là Giao Hàng Tiết Kiệm thành công !",
                                order: order_GHTK.order,
                                message_momo: pay_MOMO.localMessage,
                                payUrl: pay_MOMO.payUrl
                            });
                        } else {
                            const delete_Order = await modelOrder.delete_GHTK(queryNotUserDiscount);
                            return res.status(400).json({
                                status: "Fail",
                                message: "Thanh toán đơn hàng Giao Hàng Tiết Kiệm bằng Momo thất bại !",
                            });
                        }
                    } else {
                        for (let i = 0; i < cart.length; i++) {
                            await capNhatSoLuong(cart[i]);
                        };
                        data_Order.madonhang = queryNotUserDiscount;
                        await sendmail(email, tenkh, "purchase", data_Order);
                        return res.status(200).json({
                            status: "Success",
                            message: "Tạo đơn với phương thức vận chuyển là Giao Hàng Tiết Kiệm thành công !",
                            order: order_GHTK.order
                        });
                    }
                } else {
                    const delete_Order = await modelOrder.delete_GHTK(queryNotUserDiscount);
                    return res.status(400).json({
                        status: "Fail",
                        message: "Tạo đơn hàng bằng phương thức vận chuyển Giao Hàng Tiết Kiệm thất bại, quý khách vui lòng chọn phương thức vận chuyển khác !",
                        message_error: order_GHTK.message
                    });
                }
            } else {
                // Tạo đơn hàng thành công vs hình thức giao hàng là: "SHOP", "GHN"
                let queryNotUserDiscount = await modelOrder.insert_Order(tenkh, email, sodienthoai, diachi, ship, tongtien, ghichu, makm, hinhthuc, vanchuyen, chitiet, ngaydat, cart);
                if(momo === "YES") {
                    const pay_MOMO = await pay_Momo(queryNotUserDiscount, tongtien, ghichu);
                    if(pay_MOMO) {
                        for (let i = 0; i < cart.length; i++) {
                            await capNhatSoLuong(cart[i]);
                        };
                        data_Order.madonhang = queryNotUserDiscount;
                        await sendmail(email, tenkh, "purchase", data_Order);
                        return res.status(200).json({
                            status: "Success",
                            message: "Tạo đơn hàng thành công !",
                            message_momo: pay_MOMO.localMessage,
                            payUrl: pay_MOMO.payUrl
                        });
                    } else {
                        const delete_Order = await modelOrder.delete_GHTK(queryNotUserDiscount);
                        return res.status(400).json({
                            status: "Fail",
                            message: "Thanh toán đơn hàng bằng Momo thất bại !",
                        });
                    }
                } else {
                    for (let i = 0; i < cart.length; i++) {
                        await capNhatSoLuong(cart[i]);
                    };
                    data_Order.madonhang = queryNotUserDiscount;
                    await sendmail(email, tenkh, "purchase", data_Order);
                    return res.status(200).json({
                        status: "Success",
                        message: "Tạo đơn hàng thành công !",
                        payUrl: ""
                    });
                }
            }
        } else {
            // Tạo đơn hàng cho khách có tài khoản
            const userExist = await modelUser.get_By_Id(makh);
            if(userExist == -1) {
                return res.status(400).json({
                    status: "Fail", 
                    message: "Tài khoản khách hàng này không tồn tại, vui lòng kiểm tra lại !"
                });
            } else {
                // Tạo đơn hàng với hình thức giao hàng là: GHTK:
                if(vanchuyen == "GHTK") {
                    let madonhang = "DH51703846";
                    let queryUserDiscount = await modelOrder.insert_Order_User(makh, tenkh, email, sodienthoai, diachi, ship, tongtien, ghichu, makm, hinhthuc, vanchuyen, chitiet, ngaydat, cart);
                    const order_GHTK = await create_order_GHTK(cart, madonhang, email, sodienthoai, tenkh, diachi, thanhpho, quan, phuong_API, diachi, freeship, tongtien, ghichu);
                    if(order_GHTK.success) {
                        if(momo === "YES") {
                            const pay_MOMO = await pay_Momo(queryUserDiscount, tongtien, ghichu);
                            if(pay_MOMO) {
                                for (let i = 0; i < cart.length; i++) {
                                    await capNhatSoLuong(cart[i]);
                                }
                                let delet_cart = await modelCart.deleteCart_Customer(makh);
                                /* if(makm != undefined) {
                                    await capNhatSoLuong_KhuyenMai(makm);
                                }; */
                                data_Order.madonhang = queryUserDiscount;
                                await sendmail(email, tenkh, "purchase", data_Order);
                                return res.status(200).json({
                                    status: "Success",
                                    message: "Tạo đơn hàng với phương thức vận chuyển là Giao Hàng Tiết Kiệm thành công !",
                                    order: order_GHTK.order,
                                    message_momo: pay_MOMO.localMessage,
                                    payUrl: pay_MOMO.payUrl
                                });
                            } else {
                                const delete_Order = await modelOrder.delete_GHTK(queryUserDiscount);
                                return res.status(400).json({
                                    status: "Fail",
                                    message: "Thanh toán đơn hàng Giao Hàng Tiết Kiệm bằng Momo thất bại !",
                                });
                            }
                        } else {
                            for (let i = 0; i < cart.length; i++) {
                                await capNhatSoLuong(cart[i]);
                            }
                            let delet_cart = await modelCart.deleteCart_Customer(makh);
                            data_Order.madonhang = queryUserDiscount;
                            await sendmail(email, tenkh, "purchase", data_Order);
                            return res.status(200).json({
                                status: "Success",
                                message: "Tạo đơn với phương thức vận chuyển là Giao Hàng Tiết Kiệm thành công !",
                                order: order_GHTK.order
                            });
                        }
                    } else {
                        const delete_Order = await modelOrder.delete_GHTK(queryUserDiscount); // Tạo đơn trên GHTK thất bại => Xoá đơn hàng vừa tạo khỏi DB.
                        return res.status(400).json({
                            status: "Fail",
                            message: "Tạo đơn hàng bằng phương thức vận chuyển Giao Hàng Tiết Kiệm thất bại, quý khách vui lòng chọn phương thức vận chuyển khác !",
                            message_error: order_GHTK.message
                        });
                    }
                } else {
                    // Tạo đơn hàng với hình thức giao hàng là: "SHOP", "GHN"
                    let queryUserDiscount = await modelOrder.insert_Order_User(makh, tenkh, email, sodienthoai, diachi, ship, tongtien, ghichu, makm, hinhthuc, vanchuyen, chitiet, ngaydat, cart);
                    if(momo === "YES") { 
                        const pay_MOMO = await pay_Momo(queryUserDiscount, tongtien, ghichu);
                        if(pay_MOMO) { 
                            for (let i = 0; i < cart.length; i++) {
                                await capNhatSoLuong(cart[i]);
                            }
                            let delet_cart = await modelCart.deleteCart_Customer(makh);
                            data_Order.madonhang = queryUserDiscount;
                            await sendmail(email, tenkh, "purchase", data_Order);
                            return res.status(200).json({
                                status: "Success",
                                message: "Tạo đơn hàng thành công !",
                                message_momo: pay_MOMO.localMessage,
                                payUrl: pay_MOMO.payUrl
                            });
                        } else {
                            const delete_Order = await modelOrder.delete_GHTK(queryUserDiscount);
                            return res.status(400).json({
                                status: "Fail",
                                message: "Thanh toán đơn hàng bằng Momo thất bại !",
                            });
                        }
                    } else {
                        for (let i = 0; i < cart.length; i++) {
                            await capNhatSoLuong(cart[i]);
                        }
                        let delet_cart = await modelCart.deleteCart_Customer(makh);
                        data_Order.madonhang = queryUserDiscount;
                        await sendmail(email, tenkh, "purchase", data_Order);
                        return res.status(200).json({
                            status: "Success",
                            message: "Tạo đơn hàng thành công !",
                            payUrl: ""
                        });
                    }
                };
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// POST: Tạo đơn hàng trên GHN: 
exports.postCreateOrderGHN = catchAsync(async (req, res, next) => {
    try {
        let payment_type_id = 2;
        let madonhang = req.body.madonhang;
        const orderExist = await modelOrder.get_By_Id(madonhang);
        if(orderExist == -1) {
            return res.status(400).json({
                status: "Fail",
                message: "Không tìm thấy đơn hàng này, không thể tạo đơn hàng trên Giao Hàng Nhanh ! Vui lòng kiểm tra lại !"
            });
        };
        if(orderExist.vanchuyen !== "GHN") {
            return res.status(400).json({
                status: "Fail",
                message: "Phương thức vận chuyển không đúng. Vui lòng kiểm tra lại !"
            });
        };
        if(orderExist.makm !== null) {
            const discountExist = await modelDiscount.get_By_discountId(orderExist.makm);
            if(discountExist !== -1) {
                if(discountExist.voucher === "FREESHIP") { payment_type_id = 1; }
            };
        };
        var tongtien = parseInt(req.body.tongtien);
        if(orderExist.hinhthuc !== "Thanh toán khi nhận hàng") {
            tongtien = 0;
        };
        let chitiet = JSON.parse(req.body.chitiet);
        let cart = req.body.giohang;
        let products = [];
        let temp = {};
        cart.forEach(element => {
            temp.name =  element.tensp;
            temp.quantity = element.soluong;
            temp.size =  element.size;
            temp.mau =  element.mau;
            products.push(temp);
        });
        let data_raw = {
            "payment_type_id": payment_type_id,// Người trả phí vận chuyển. (1: Shop, 2: Khách hàng)
            "note": req.body.ghichu,// Lưu ý của khách hàng cho người gửi hàng.
            "required_note": "CHOXEMHANGKHONGTHU",// Lưu ý của đơn hàng vận chuyển.
            "return_phone": "0969362915",// SĐT của shop, để liên hệ để trả lại bưu kiện. 
            "return_address": "82/72 Lê Văn Duyệt, Quận Bình Thạnh, TP.Hồ Chí Minh",// Địa chỉ trả lại bưu kiện.
            "return_district_id": 1462,
            "return_ward_code": "21601",
            "to_name": req.body.tenkh,// Tên người nhận.
            "to_phone": req.body.sodienthoai,// SĐT người nhận.
            "to_address": req.body.diachi, // Địa chỉ người nhận.
            "to_ward_code": chitiet.WardCode,// Require
            "to_district_id": chitiet.DistrictID,// Require
            "cod_amount": tongtien,// Tổng tiền đơn hàng.
            "content": "Cửa hàng thời trang Autumn",// Nội dung đặt hàng.
            "weight": parseInt(req.body.trongluong),// Trọng lượng gói hàng.(gram) - Maximum : 1600000gram
            "length": parseInt(req.body.dai),// Chiều dài gói hàng.(cm) - Maximum : 200cm
            "width": parseInt(req.body.rong),// Chiều rộng gói hàng.(cm) - Maximum : 200cm
            "height": parseInt(req.body.cao),// Chiều cao gói hàng.(cm) - Maximum : 200cm
            //"pick_station_id": 1444,
            //"deliver_station_id": null,
            //"insurance_value": 10000000,
            "service_id": parseInt(req.body.dichvuID),// Require: Chọn dịch vụ phù hợp với gói vận chuyển của bạn(Nhanh, Tiêu chuẩn hoặc Tiết kiệm). Mỗi ID dịch vụ có phí và thời gian thực hiện khác nhau.
            "service_type_id": parseInt(req.body.service_type_id),// Require: (1: Hàng không, 2: Xe tải).
            //"order_value":130000,// 
            //"coupon":null,// Not required: Mã khuyến mãi giảm giá.
            "pick_shift":[req.body.ca],// Not required: Chọn ca lấy hàng.
            "items": products
        };
        console.log(data_raw);
        if(!data_raw.to_name || !data_raw.to_phone || !data_raw.to_address || !data_raw.to_ward_code || !data_raw.to_district_id 
            || !data_raw.cod_amount || !data_raw.weight || !data_raw.length || !data_raw.width || !data_raw.height || !data_raw.service_id 
            || !data_raw.service_type_id || !data_raw.pick_shift || !data_raw.items) {
                return res.status(400).json({
                    status: "Fail", 
                    message: "Thiếu thông tin đơn hàng, vui lòng kiểm tra lại !"
                });
            };
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create`;
        const order = await axios.post(url, data_raw, {
            headers: {
                ShopId: 81200,
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        console.log("Mã đơn hàng: ", order.data.data.order_code);
        console.log("Phí vận chuyển: ", order.data.data.total_fee);
        if(order.status == 200) {
            if(order.data.code == 200) {
                let tongtien = orderExist.tongtien + order.data.data.total_fee;
                let code_GHN = order.data.data.order_code;
                let tienship = order.data.data.total_fee;
                const update_Order = await modelOrder.update_GHN(madonhang, code_GHN, tienship, tongtien);
                return res.status(200).json({ 
                    status: "Success", 
                    message: "Tạo đơn hàng trên Giao Hành Nhanh thành công! " + order.data.code_message_value,
                    message_display: order.data.message_display,
                    order_code: order.data.data.order_code,
                    order: order.data.data 
                });
            }
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error.response.data
        });
    }
});
// POST: Chi tiết 1 đơn hàng của GHN dựa vào mã đơn hàng.
exports.postDetailOrderGHN = catchAsync(async (req, res, next) => {
    try {
        //let order_code = req.body.madonhang;
        let order_code = "5ENLKKHD";
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail`;
        const order = await axios.post(url, order_code, {
            headers: {
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        if(order.data.message == "Success") {
            return res.status(200).json({ 
                status: "Success", 
                message: "",
                order: order.data.data 
            });
        };
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error.response.data 
        });
    }
});

exports.postResult = catchAsync(async (req, res, next) => {
    console.log(req.body);
    console.log("ok");
    try {
        if(req.body.errorCode == 0) {
            // Thanh toán thành công
            let hinhthuc = "Đã thanh toán bằng MOMO";
            let extraData = req.body.extraData;
            let signature = req.body.signature;

        } else {
            // Thanh toán không thành công

        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error.response.data 
        });
    }
});

// Thống kê đơn hàng theo tháng và năm:
exports.postOrderStatistics = catchAsync(async (req, res, next) => {
    try {
        let month = req.body.month;
        let year = req.body.year;
        if(!month && !year) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng chọn tháng hoặc năm để thống kê !"
            });
        };
        if(month && year) {
            let query = await modelOrder.statisticsOrder_By_MonthYear(month, year);
            return res.status(200).json({
                status: "Success",
                message: "Thống kê đơn hàng tháng " + `${month}` + "-" + `${year}` + " !",
                total_Order: query.length,
                data: query
            });
        };
        if(month && !year) {
            let query_month = await modelOrder.statisticsOrder_By_Month(month);
            return res.status(200).json({
                status: "Success",
                message: "Thống kê đơn hàng tháng " + `${month}` + " !",
                total_Order: query_month.length,
                data: query_month
            });
        }
        if(!month && year) {
            let query_year = await modelOrder.statisticsOrder_By_Year(year);
            return res.status(200).json({
                status: "Success",
                message: "Thống kê đơn hàng năm " + `${year}` + " !",
                total_Order: query_year.length,
                data: query_year
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});


        // PUT
// PUT: Update order status
exports.putEditStatus = catchAsync(async (req, res, next) => {
    try {
        let data = {
            madonhang: req.body.madonhang,
            ngaygiao: req.body.ngaygiao,
            trangthai: req.body.trangthai
        };
        if(!data.madonhang || data.trangthai == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        const orderExist = await modelOrder.get_By_Id(data.madonhang);
        if(orderExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Đơn hàng này không tồn tại, vui lòng kiểm tra lại mã đơn hàng !"
            });
        } else {
            // Đơn hàng tồn tại
            let query = await modelOrder.update_Status(data);
            return res.status(200).json({
                status: "Success",
                message: query
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});


        // DELETE
// Delete order
exports.deleteOrder = catchAsync(async (req, res, next) => {
    try {
        let madh = req.params.id;
        if(!madh) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu mã đơn hàng, vui lòng kiểm tra lại !"
            });
        };
        const orderExist = await modelOrder.get_By_Id(madh);
        if(orderExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Đơn hàng này không tồn tại, vui lòng kiểm tra lại !"
            });
        } else {
            if(orderExist.trangthai == 1) {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Đơn hàng đã được duyệt không thể huỷ !"
                });
            };
            if(orderExist.trangthai == 2) {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Đơn hàng đang được giao không thể huỷ !"
                });
            } else if(orderExist.trangthai == 3) {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Đơn hàng đã hoàn thành không thể huỷ !"
                });
            };
            if(orderExist.trangthai == 4) {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Đơn hàng đã được huỷ !"
                });
            };
            if(orderExist.trangthai == 0) {
                const query_delete = await modelOrder.delete(madh);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query_delete
                });
            };
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// Huỷ đơn hàng vận chuyển từ GHN
exports.deleteOrderGHN = catchAsync(async (req, res, next) => {
    try {
        let order_codes = req.params.id;
        let data_raw = { "order_codes": order_codes };
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel`;
        const deleteOrder = await axios.post(url, data_raw, {
            headers: {
                ShopId: 81200,
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        if(deleteOrder.data.message == "Success") {
            return res.status(200).json({ 
                status: "Success", 
                message: "Huỷ đơn hàng trên GIAO HÀNG NHANH thành công !"
            });
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error.response.data
        });
    }
});