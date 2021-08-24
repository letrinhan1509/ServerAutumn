const catchAsync = require('../utils/catchAsync');
const modelDiscount = require('../models/model_discount');



                    // PROMOTION CONTROLLER

        // GET
// GET Promotion list
exports.getList = catchAsync(async (req, res, next) => {
    try {
        let list = await modelDiscount.list_Discounts();
        return res.status(200).json({ 
            status: "Success", 
            message: "Lấy danh sách các khuyến mãi thành công !", 
            discount: list 
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// GET Promotion list by product
exports.getPromotionListProduct = catchAsync(async (req, res, next) => {
    try {
        let list = await modelDiscount.list_Dis_Product();
        return res.status(200).json({ 
            status: "Success", 
            message: "Lấy danh sách khuyến mãi theo sản phẩm thành công !", 
            discount: list 
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// GET Discount code list (voucher)
exports.getDiscountCodeList = catchAsync(async (req, res, next) => {
    try {
        let listVouchers = await modelDiscount.list_Vouchers();
        return res.status(200).json({ 
            status: "Success", 
            message: "Lấy danh sách mã giảm giá thành công !",
            voucher: listVouchers 
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// GET Details of a promotion by "makm"
exports.getDetailPromotion = catchAsync(async (req, res, next) => {
    try {
        let makm = req.params.id;
        let detailPromotion = await modelDiscount.get_By_discountId(makm);
        if(detailPromotion == -1) {
            return res.status(400).json({
                status: "Fail",
                message: "Chương trình khuyến mãi này không tồn tại, vui lòng kiểm tra lại !",
            });
        } else {
            return res.status(200).json({ 
                status: "Success", 
                message: "Lấy chi tiết chương trình khuyến mãi thành công !", 
                detailPromotion: detailPromotion 
            });
        };
      } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// GET Details of a promotion by code "voucher"
exports.getDetailPromotionVoucher = catchAsync(async (req, res, next) => {
    try {
        let maVoucher = req.params.ma;
        var today = new Date();
        var ngayhientai = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        let voucher = await modelDiscount.check_By_voucherName(maVoucher.toUpperCase());
        if(voucher == false){
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy mã voucher này, vui lòng kiểm tra lại !!!" 
            });
        } else {
            if(parseInt(ngayhientai) > parseInt(voucher.ngaykt)) {
                return res.status(400).json({
                    status: "Fail", 
                    message: "Mã voucher này đã hết hạn sử dụng !"
                });
            } else {
                if(voucher.soluong == 0) {
                    return res.status(400).json({ 
                        status: "Fail", 
                        message: "Số lượng voucher này đã hết !" 
                    });
                } else {
                    return res.status(200).json({ 
                        status: "Success", 
                        message: "Áp dụng voucher thành công !", 
                        voucher: voucher 
                    });
                }
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});


        // POST
// POST: Create 1 promotion is a discount code
exports.postPromotionCODE = catchAsync(async (req, res, next) => {
    try {
        let data = {
            tenkm: req.body.tenkm,
            voucher: req.body.voucher.toUpperCase(),
            ghichu: req.body.ghichu,
            tenhinh: req.body.imgName,
            hinh: req.body.img,
            dieukien: req.body.dieukien,
            giagiam: req.body.giagiam,
            soluong: req.body.soluong,
            ngaybd: req.body.ngaybd,
            ngaykt: req.body.ngaykt,
            //trangthai: req.body.trangthai
        };
        if(!data.tenkm || !data.voucher || !data.ghichu || !data.tenhinh || !data.hinh || !data.giagiam || !data.ngaybd) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin voucher. Vui lòng kiểm tra lại thông tin !!!"
            });
        };
        // Kiểm tra xem mã voucher đã tồn tại hay chưa?(false là ko tồn tại)
        let voucherExist = await modelDiscount.check_By_voucherName(data.voucher);
        if(voucherExist == false) {
            let voucher = await modelDiscount.create_Voucher(data);
            return res.status(200).json({ 
                status: "Success", 
                message: voucher
            });
        } else {
            // Trùng mã code
            return res.status(400).json({ 
                status: "Fail", 
                message: "Trùng mã voucher, vui lòng nhập mã voucher khác !!!" 
            });
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// POST: Create 1 promotion is the products
exports.postPromotionProduct = catchAsync(async (req, res, next) => {
    // Cách tính giá khuyến mãi: giakm = giasp - (giasp * (chietkhau/100));
    try {
        let data = {
            tenkm: req.body.tenkm,
            ghichu: req.body.ghichu,
            ngaybd: req.body.ngaybd,
            ngaykt: req.body.ngaykt
        }
        let chitietKM = req.body.sanphamCK;
        /* chitietKM.forEach(element => {
            element.sanpham.forEach(ele => {
                let dataCTKM = {
                    masp: ele.masp,
                    chitiet_km: ele.chitiet,
                    chietkhau: element.chietkhau,
                    giagiam: ele.gia - (ele.gia * (element.chietkhau/100))
                };
                ele.chitiet.forEach(e => {
                    e.giagiam = dataCTKM.giagiam
                });
            });
        });
        console.log(chitietKM[0].sanpham[0].chitiet); */
        if(!data.tenkm || !data.ghichu || !data.ngaybd || !data.ngaykt || !chitietKM) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin chương trình khuyến mãi. Vui lòng kiểm tra lại thông tin !!!" });
        };
        let query = await modelDiscount.create_Discount(data, chitietKM);
        return res.status(200).json({ 
            status: "Success", 
            message: query 
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});


        // PUT
// PUT: Update 1 promotion by code voucher
exports.putEditPromotionCODE = catchAsync(async (req, res, next) => {
    try {
        let data = {
            makm: req.body.makm,
            tenkm: req.body.tenkm,
            voucher: req.body.voucher.toUpperCase(),
            ghichu: req.body.ghichu,
            tenhinh: req.body.imgName,
            hinh: req.body.img,
            dieukien: req.body.dieukien,
            giagiam: req.body.giagiam,
            soluong: req.body.soluong,
            ngaybd: req.body.ngaybd,
            ngaykt: req.body.ngaykt
        };
        if(data.makm == undefined || !data.tenkm || !data.voucher || !data.ghichu || !data.tenhinh || !data.hinh || !data.giagiam || !data.ngaybd) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin voucher. Vui lòng kiểm tra lại thông tin !!!"
            });
        };
        // Kiểm tra xem voucher đã tồn tại hay chưa?(false là ko tồn tại)
        const voucherExist = await modelDiscount.get_By_discountId(data.makm);
        if(voucherExist == -1) {
            // Voucher không tồn tại
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy chương trình khuyến mãi này, vui lòng kiểm tra lại thông tin !!!" 
            });
        } else {
            // Có voucher trong database
            if(data.voucher != voucherExist.voucher || data.makm == voucherExist.makm){
                const query = await modelDiscount.update_Voucher(data);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query 
                });
            } else {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Trùng mã CODE, vui lòng nhập mã CODE khác !" 
                });
            }
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// PUT: Update 1 promotion is the products
exports.putEditPromotionProduct = catchAsync(async (req, res, next) => {
    try {
        let makm = req.body.makm;
        let tenkm = req.body.tenkm;
        let ghichu = req.body.ghichu;
        let ngaykt = req.body.ngaykt;
        let deleteMact = req.body.deleteMact;

        if(makm == undefined || !tenkm || !ghichu || !ngaykt) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin chương trình khuyến mãi. Vui lòng kiểm tra lại thông tin !!!"
            });
        };
        const promotionExist = await modelDiscount.get_By_discountId(makm);
        if(promotionExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy chương trình khuyến mãi này, vui lòng kiểm tra lại thông tin !!!" 
            });
        } else {
            if(deleteMact.length == 0) {
                const query = await modelDiscount.update_PromotionProduct(makm, tenkm, ghichu, ngaykt);
                if(query == 1) {
                    return res.status(200).json({ 
                        status: "Success", 
                        message: "Cập nhật thông tin chương trình khuyến mãi theo sản phẩm thành công !" 
                    });
                };
            } else {
                for (let i = 0; i < deleteMact.length; i++) {
                    const query_delete = await modelDiscount.delete_DetailProduct(deleteMact[i]);
                };
                const query = await modelDiscount.update_PromotionProduct(makm, tenkm, ghichu, ngaykt);
                if(query == 1) {
                    return res.status(200).json({ 
                        status: "Success", 
                        message: "Cập nhật thông tin chương trình khuyến mãi theo sản phẩm thành công !" 
                    });
                };
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
// Delete 1 promotion by code
exports.deletePromotion = catchAsync(async (req, res, next) => {
    try {
        let makm = req.params.id;
        if(!makm) {
            return res.status(400).json({
                status: "Fail",
                message: "Thiếu thông tin. Vui lòng kiểm tra lại thông tin !!!"
            });
        };
        let promotionExist = await modelDiscount.get_By_discountId(makm);
        if(promotionExist == -1) {
            // Promotion không tồn tại
            return res.status(400).json({
                status: "Fail",
                message: "Chương trình khuyến mãi này không tồn tại, vui lòng kiểm tra lại !!!"
            });
        } else {
            // Promotion tồn tại
            let query = await modelDiscount.delete(makm);
            if(query == 6) {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Tạm thời không thể xoá chương trình khuyến mãi này !" 
                });
            };
            if(query == 1) {
                const listPromotions = await modelDiscount.list_Dis_Product();
                const listVouchers = await modelDiscount.list_Vouchers();
                return res.status(200).json({ 
                    status: "Success", 
                    message: "Xoá chương trình khuyến mãi thành công !!!",
                    listPromotions: listPromotions,
                    listVouchers: listVouchers
                });
            }
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});