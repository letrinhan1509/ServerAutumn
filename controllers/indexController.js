const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const modelIndex = require('../models/model_index');
const modelAdmin = require('../models/model_admin');
const modelUser = require('../models/model_user');
const modelCatalog = require('../models/model_catalog');
const modelProducer = require('../models/model_producer');
const modelProduct = require('../models/model_product');
const modelDiscount = require('../models/model_discount');
const modelOrder = require('../models/model_order');


function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.split(' ').join('-');
    return str;
};
function replaceNameProduct(nameProduct) {
    var newNameProduct = xoa_dau(nameProduct);
    return newNameProduct;
};


                    // INDEX CONTROLLER

        // GET
// GET: List of all cities
exports.getListCities = catchAsync(async (req, res, next) => {
    try {
        var url = "https://thongtindoanhnghiep.co/api/city";
        const listcities = await axios.get(url);
        return res.status(200).json({ 
            status: "Success", 
            city: listcities.data.LtsItem 
        });
        /* axios.get(url)
            .then(function (response) {
                // handle success
                return res.status(200).json({ 
                    status: "Success", 
                    city: response.data.LtsItem 
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Lỗi! Không thể lấy danh sách thành phố!", 
                    error: error 
                });
            }); */
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// GET: Details 1 province
exports.getDetailCity = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        if(!id) {
            return res.status(400).json({
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        var url = "https://thongtindoanhnghiep.co/api/city/" + id;
        axios.get(url)
            .then(function (response) {
                // handle success
                return res.status(200).json({ 
                    status: "Success", 
                    city: response.data 
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Lỗi...!", 
                    error: error 
                });
            });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: List of all counties/districts by province/city
exports.getListCounties = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        if(!id) {
            return res.status(400).json({
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        var url = "https://thongtindoanhnghiep.co/api/city/" + id + "/district";
        axios.get(url)
            .then(function (response) {
                // handle success
                return res.status(200).json({ 
                    status: "Success", 
                    district: response.data 
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Something went wrong",
                    error: error 
                });
            });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: Details of 1 district/district
exports.getDetailDistrict = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        if(!id) {
            return res.status(400).json({
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        var url = "https://thongtindoanhnghiep.co/api/district/" + id;
        axios.get(url)
            .then(function (response) {
                // handle success
                return res.status(200).json({ 
                    status: "Success", 
                    district: response.data 
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return res.status(404).json({ 
                    status: "Fail", 
                    error: error 
                });
            });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: List of all Wards/Communes in the District/District
exports.getListWards = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        if(!id) {
            return res.status(400).json({
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        var url = "https://thongtindoanhnghiep.co/api/district/" + id + "/ward";
        axios.get(url)
            .then(function (response) {
                // handle success
                return res.status(200).json({ 
                    status: "Success", 
                    ward: response.data 
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return res.status(400).json({ 
                    status: "Fail", 
                    error: error 
                });
            });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: Details of a ward, commune, town
exports.getDetailWard = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        if(!id) {
            return res.status(400).json({
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        var url = "https://thongtindoanhnghiep.co/api/ward/" + id;
        const ward = await axios.get(url);
        return res.status(200).json({ 
            status: "Success", 
            ward: ward.data 
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: List currency
exports.getListCurrency = catchAsync(async (req, res, next) => {
    try {
        var url = "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=1";
        //var url = "https://apithanhtoan.com/iframe/ty-gia-ngan-hang/BFTV";
        const listCurrency = await axios.get(url);
        //console.log(listCurrency.data);
        
        return res.status(200).json({ 
            status: "Success", 
            listCurrency: listCurrency.data
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    }
});
// GET: List of all cities of GHN
exports.getProvince = catchAsync(async (req, res, next) => {
    try {
        var url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";
        const province = await axios.get(url, {
            headers: {
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        if(province.data.message == "Success") {
            return res.status(200).json({ 
                status: "Success", 
                city: province.data.data 
            });
        };
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// GET: Danh sách quận/huyện theo id thành phố
exports.getDistrict = catchAsync(async (req, res, next) => {
    try {
        let province_id = req.params.id;
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${province_id}`;
        const district = await axios.get(url, {
            headers: {
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        /* let quan = {};
        district.data.data.forEach(element => {
            if(element.DistrictID == 1462) {
                quan = element;
            }
        });
        console.log(quan); */
        if(district.data.message == "Success") {
            return res.status(200).json({ 
                status: "Success", 
                district: district.data.data 
            });
        };
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            code_message: error.response.data.code_message_value,
            error: error.message
        });
    };
});
// GET: Danh sách phường/xã theo id quận/huyện
exports.getWard = catchAsync(async (req, res, next) => {
    try {
        let district_id = req.params.id;
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district_id}`;
        const ward = await axios.get(url, {
            headers: {
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        if(ward.data.message == "Success") {
            return res.status(200).json({ 
                status: "Success", 
                ward: ward.data.data 
            });
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            code_message: error.response.data.code_message_value,
            error: error.message
        });
    };
});
// GET: Danh sách các địa chỉ nhận hàng
exports.getShop = catchAsync(async (req, res, next) => {
    try {
        let values = {
            "offset": 0,
            "limit": 50,
            "client_phone": "0969362915"
        };
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/all`;
        const shop = await axios.post(url, values, {
            headers: {
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        var shop_open = [];
        var shop_close = [];
        if(shop.data.message == "Success") {
            shop.data.data.shops.forEach(element => {
                if(element.is_created_chat_channel == true) {
                    shop_open.push(element);
                } else {
                    shop_close.push(element);
                }
            });
            return res.status(200).json({ 
                status: "Success", 
                shop: shop.data.data.shops.length,
                shop_open: shop_open,
                shop_close: shop_close,
                list_shop: shop.data.data.shops 
                //shop: shop.data.data.shops
            });
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            code_message: error.response.data.code_message_value,
            error: error.message
        });
    };
});
// GET: Các ca lấy hàng của GHN
exports.getPickShift = catchAsync(async (req, res, next) => {
    try {
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shift/date`;
        const pickShift = await axios.get(url, {
            headers: {
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        if(pickShift.data.message == "Success") {
            return res.status(200).json({ 
                status: "Success", 
                pickShift: pickShift.data.data
            });
        };
    } catch (error) {
        console.log(error.response);
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error.response.data
        });
    }
});
// GET: Các dịch vụ của GHN
exports.getService = catchAsync(async (req, res, next) => {
    try {
        let district_id = req.params.id;
        if(district_id == undefined) {
            return res.status(400).json({
                status: "Fail", 
                message: "Thiếu thông tin quận, vui lòng chọn quận để xem danh sách dịch vụ !"
            });
        } else {
            let data_raw = {
                "shop_id": 81200,
                "from_district": 1462,// DistrictID Quận Bình Thạnh
                "to_district": parseInt(district_id)
            };
            var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`;
            const service = await axios.post(url, data_raw, {
                headers: {
                    Token: process.env.TOKEN_GHN_DEV
                }
            });
            let listService = [];
            service.data.data.forEach(element => {
                if(element.short_name !== '') {
                    listService.push(element);
                }
            });
            if(service.data.message == "Success") {
                return res.status(200).json({ 
                    status: "Success", 
                    service: listService
                });
            };
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error.response.data
        });
    }
});

exports.postDashboardStatistics = catchAsync(async (req, res, next) => {
    try {
        /* let thang = req.body.thang;
        let nam = req.body.nam;
        if(thang == undefined) {

        } else {

        } */
        const listAdmins = await modelAdmin.list_Admins();
        const listUsers = await modelUser.list();
        const listProducts = await modelProduct.list_products();
        const listProducers = await modelProducer.list_producers();
        const listCategorys = await modelCatalog.list_Categorys();
        const listTypes = await modelCatalog.list_types();
        const listVouchers = await modelDiscount.list_Vouchers();
        const revenueStatistics = await modelOrder.statistical();   // Thống kê doanh thu bán hàng và đơn hàng theo ngày
        const new_revenueStatistics = [...revenueStatistics].reverse();
        const monthlyRevenueStatistics = await modelOrder.statisticalMonth();   // Thống kê doanh thu bán hàng và đơn hàng theo tháng
        const new_monthlyRevenueStatistics = [...monthlyRevenueStatistics].reverse();
        return res.status(200).json({
            status: "Success", 
            message: "Thống kê trang Dashboard !",
            listAdmins: listAdmins.length,
            listUsers: listUsers.length,
            listProducts: listProducts.length,
            listProducers: listProducers.length,
            listCategorys: listCategorys.length,
            listTypes: listTypes.length,
            listVouchers: listVouchers.length,
            revenueStatistics: new_revenueStatistics,
            monthlyRevenueStatistics: new_monthlyRevenueStatistics
        });
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error.response.data
        });
    }
});

// POST: Thêm cửa hàng, cửa hàng là nơi giúp GHN biết nơi lấy đồ.
exports.postCreateShop = catchAsync(async (req, res, next) => {
    try {
        let district_id = req.body.district_id;
        let ward_code = req.body.ward_code;
        let name = req.body.name;
        let phone = req.body.phone;
        let address = req.body.address;
        var url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/register?district_id=${district_id}&ward_code=${ward_code}
        &name=${name}&phone=${phone}&address=${address}`;
        const shop = await axios.get(url, {
            headers: {
                Token: process.env.TOKEN_GHN_DEV
            }
        });
        if(shop.data.message == "Success") {
            return res.status(200).json({ 
                status: "Success", 
                message: "Thêm cửa hàng trên Giao Hàng Nhanh thành công !",
                shop_id: shop.data.data.shop_id 
            });
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            code_message: error.response.data.code_message_value,
            error: error.message
        });
    };
});
// Tiền vận chuyển:
exports.postTransportFee = catchAsync(async (req, res, next) => {
    try {
        let pick_province = "TP.Ho Chi Minh";     // Tên tỉnh/thành phố nơi lấy hàng hóa
        let pick_district = "Quan Binh Thanh";     // Tên quận/huyện nơi lấy hàng hóa
        //let province = req.body.province;
        let quan = req.body.district;
        //let address = replaceNameProduct(req.body.diachi);      // Địa chỉ chi tiết của người nhận hàng
        let amount = req.body.amount;   // Số lượng sản phẩm trong giỏ hàng      
        let deliver_option = "none";    // Sử dụng phương thức vận chuyển xfast. Nhận 1 trong 2 giá trị xteam/none
        let weight = 200 * amount;      // Cân nặng của gói hàng, đơn vị sử dụng Gram

        var url = "https://thongtindoanhnghiep.co/api/district/" + quan;
        const districtDetails= await axios.get(url);
        let district = replaceNameProduct(districtDetails.data.Title);           // ( Tên quận/huyện của người nhận hàng hóa )
        let province = replaceNameProduct(districtDetails.data.TinhThanhTitle);  // ( Tên tỉnh/thành phố của người nhận hàng hóa )
        var urlFee = `https://services.giaohangtietkiem.vn/services/shipment/fee?province=${province}&district=${district}&pick_province=${pick_province}&pick_district=${pick_district}&weight=${weight}&deliver_option=${deliver_option}`;
        const shippingFee = await axios.get(urlFee, {
            headers: {
                Token: "c86FbBF0d29fD8fE2b58F3bE5e6571711CcF180a",
            },
        });
        if(shippingFee.data.success === true) {
            return res.status(200).json({ 
                status: "Success", 
                message: "Tính phí vận chuyển thành công !",
                ship: shippingFee.data.fee.fee,
                //fee: shippingFee.data.fee 
            });
        };
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error.message
        });
    };
});