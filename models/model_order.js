const { json } = require('body-parser');
var db = require('./database'); //nhúng model database vào đế kết nối db

var dataList=[]; // biến để chứa dữ liệu đổ về cho controller
var dataName = [];


    // Danh sách tất cả đơn hàng:
exports.list_Orders = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT DH.madonhang, DH.code_GHN, DH.makh, DH.tenkh, DH.email, DH.sodienthoai, DH.diachi, DH.tienship, DH.tongtien, DH.ghichu, DH.makm,
        DH.hinhthuc, DH.vanchuyen, DATE_FORMAT(DH.ngaydat, '%e-%c-%Y') as ngaydat, DATE_FORMAT(DH.ngaygiao, '%e-%c-%Y') as ngaygiao, 
        DH.trangthai, TT.tentt as tentt FROM (donhang AS DH JOIN trangthai AS TT ON DH.trangthai = TT.trangthai)`;
        db.query(sql, (err, result) => {
            if(err){
                console.log(err);
                hamLoi(err);
            }else{
                //dataList = result;
                hamOK(result);
            }
        })
    })
}
    // Đơn hàng theo mã đơn hàng:
exports.get_By_Id = async (orderId) => {
    return new Promise( (hamOK, hamLoi) => {
        //const data = [];
        let sql = `SELECT DH.madonhang, DH.code_GHN, DH.makh, DH.tenkh, DH.email, DH.sodienthoai, DH.diachi, DH.tienship, DH.tongtien, DH.ghichu, 
        DH.makm, DH.hinhthuc, DH.vanchuyen, DH.chitiet, DH.ngaydat, DH.ngaygiao, DH.trangthai, TT.tentt as tentt 
        FROM (donhang AS DH JOIN trangthai AS TT ON DH.trangthai = TT.trangthai) WHERE DH.madonhang = '${orderId}'`;
        db.query(sql, (err, result) => {
            //console.log(result[0].madonhang);
            if(err){
                hamLoi(err);
            }else{
                if(result.length > 0){
                    let sql = `SELECT CTDH.mact, CTDH.masp, sanpham.tensp, CTDH.size, CTDH.mau, CTDH.gia, CTDH.giagiam, CTDH.soluong, 
                    CTDH.thanhtien, CTDH.madonhang FROM (chitietdh AS CTDH JOIN sanpham ON CTDH.masp = sanpham.masp)
                    WHERE CTDH.madonhang = ?`;
                    db.query(sql, result[0].madonhang, (err, result1) => {
                        if(err){
                            hamLoi(err);
                        } else {
                            result[0].chitietDH = result1;
                            //data.push(result);
                            hamOK(result[0]);
                        }
                    })
                }else{
                    hamOK(-1);
                }
            }
        })
    })
}
    // Đơn hàng theo mã khách hàng:
exports.get_By_userId = async (userId) => {
    return new Promise( (hamOK, hamLoi) => {
        var data = [];
        let sql = `SELECT DH.madonhang, DH.makh, DH.tenkh, DH.email, DH.sodienthoai, DH.diachi, DH.tienship, DH.tongtien, DH.ghichu, DH.makm, DH.hinhthuc, DH.ngaydat, DH.ngaygiao, DH.trangthai, TT.tentt as tentt 
        FROM (donhang AS DH JOIN trangthai AS TT ON DH.trangthai = TT.trangthai)
        WHERE DH.makh = '${userId}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else {
                if(result.length > 0){
                    data = result;
                    hamOK(data);
                } else
                    hamOK(-1);
            }
        })
    })
}
    // Đơn hàng theo số điện thoại:
exports.get_By_Phone = async (phone) => {
    return new Promise( (hamOK, hamLoi) => {
        let data = [];
        let sql = `SELECT DH.madonhang, DH.makh, DH.tenkh, DH.email, DH.sodienthoai, DH.diachi, DH.tienship, DH.tongtien, DH.ghichu, DH.makm, DH.hinhthuc, DH.ngaydat, DH.ngaygiao, DH.trangthai, TT.tentt as tentt 
        FROM (donhang AS DH JOIN trangthai AS TT ON DH.trangthai = TT.trangthai)
        WHERE DH.sodienthoai = '${phone}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length > 0){
                    data = result;
                    hamOK(data);
                }else{
                    hamOK(-1);
                }
            }
        })
    })
}
    // Danh sách chi tiết đơn hàng:
exports.get_detailOrder = async (orderId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT CTDH.mact, sanpham.tensp, CTDH.gia, CTDH.giagiam, CTDH.soluong, CTDH.thanhtien,
        CTDH.makm, CTDH.madonhang FROM (chitietdh AS CTDH JOIN sanpham ON CTDH.masp = sanpham.masp)
        WHERE CTDH.madonhang = '${orderId}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length > 0){
                    hamOK(result);
                } else {
                    hamOK(-1);
                }
            }
        })
    })
};
    // Thống kê doanh thu bán hàng và số đơn hàng theo ngày:
exports.statistical = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT DATE_FORMAT(ngaydat, '%e-%c-%Y') as ngaydat, SUM(tongtien) as tongdoanhthu, COUNT(ngaydat) as tongdonhang FROM donhang
        GROUP BY ngaydat ORDER BY ngaydat DESC LIMIT 7`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK(result);
            }
        })
    })
};
    // Thống kê doanh thu bán hàng và số đơn hàng theo tháng:
exports.statisticalMonth = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT MONTH (ngaydat) as doanhthuthang, SUM(tongtien) as tongdoanhthu, COUNT(ngaydat) as tongdonhang 
        FROM donhang GROUP BY MONTH (ngaydat) ORDER BY doanhthuthang DESC`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK(result);
            }
        })
    })
};
    // Thống kê đơn hàng theo tháng:
exports.statisticsOrder_By_Month = async (month) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT DH.madonhang, DH.code_GHN, DH.makh, DH.tenkh, DH.email, DH.sodienthoai, DH.diachi, DH.tienship, DH.tongtien, 
        DH.ghichu, DH.makm, DH.hinhthuc, DH.vanchuyen, DH.chitiet, DH.ngaydat, DH.ngaygiao, DH.trangthai, TT.tentt as tentt 
        FROM (donhang AS DH JOIN trangthai AS TT ON DH.trangthai = TT.trangthai) WHERE MONTH (DH.ngaydat) = '${month}'`;
        db.query(sql, (err, result) => {
            if(err) { hamLoi(err); }
            else { hamOK(result); }
        })
    })
};
    // Thống kê đơn hàng theo năm:
exports.statisticsOrder_By_Year = async (year) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT DH.madonhang, DH.code_GHN, DH.makh, DH.tenkh, DH.email, DH.sodienthoai, DH.diachi, DH.tienship, DH.tongtien, 
        DH.ghichu, DH.makm, DH.hinhthuc, DH.vanchuyen, DH.chitiet, DH.ngaydat, DH.ngaygiao, DH.trangthai, TT.tentt as tentt 
        FROM (donhang AS DH JOIN trangthai AS TT ON DH.trangthai = TT.trangthai) WHERE YEAR (DH.ngaydat) = '${year}'`;
        db.query(sql, (err, result) => {
            if(err) { hamLoi(err); }
            else { hamOK(result); }
        })
    })
};
    // Thống kê đơn hàng theo tháng và năm:
exports.statisticsOrder_By_MonthYear = async (month, year) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT DH.madonhang, DH.code_GHN, DH.makh, DH.tenkh, DH.email, DH.sodienthoai, DH.diachi, DH.tienship, DH.tongtien, 
        DH.ghichu, DH.makm, DH.hinhthuc, DH.vanchuyen, DH.chitiet, DH.ngaydat, DH.ngaygiao, DH.trangthai, TT.tentt as tentt 
        FROM (donhang AS DH JOIN trangthai AS TT ON DH.trangthai = TT.trangthai) 
        WHERE MONTH (DH.ngaydat) = '${month}' AND YEAR (DH.ngaydat) = '${year}'`;
        db.query(sql, (err, result) => {
            if(err) { hamLoi(err); }
            else { hamOK(result); }
        })
    })
};
    // Cập nhật trạng thái đơn hàng:
exports.update_Status = (data) => {
    return new Promise( (hamOK, hamLoi) => {
        if(!data.ngaygiao) {
            console.log("ok");
            let sql = `UPDATE donhang SET trangthai='${data.trangthai}' WHERE madonhang='${data.madonhang}'`;
            db.query(sql, (err, result) => {
                if(err)
                    hamLoi(err);
                else
                    hamOK("Cập nhật thông tin đơn hàng thành công !");
            })
        } else {
            let sql = `UPDATE donhang SET ngaygiao='${data.ngaygiao}', trangthai='${data.trangthai}' WHERE madonhang='${data.madonhang}'`;
            db.query(sql, (err, result) => {
                if(err)
                    hamLoi(err);
                else
                    hamOK("Cập nhật thông tin đơn hàng thành công !");
            })
        }
    })
}
    // Cập nhật kết quả tạo đơn hàng trên GHTK - GHN:
exports.update_GHN = (madonhang, code_GHN, tienship, tongtien) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE donhang SET code_GHN='${code_GHN}', tienship='${tienship}', tongtien='${tongtien}' WHERE madonhang='${madonhang}'`;
            db.query(sql, (err, result) => {
                if(err) { hamLoi(err); } 
                else { hamOK("Cập nhật thông tin đơn hàng thành công !"); }
        })
    })
}
    // Tạo đơn hàng cho khách không có tài khoản: (cart là 1 mảng các sản phẩm)
exports.insert_Order = (name, email, phone, address, ship, total, note, promoCode, formality, delivery, detail, orderDate, cart) => {
    return new Promise( (hamOK, hamLoi) => {
        if(promoCode == undefined){
            // Đơn hàng không dùng mã khuyến mãi
            let sql = `INSERT INTO donhang(tenkh, email, sodienthoai, diachi, tienship, tongtien, ghichu, hinhthuc, vanchuyen, chitiet, ngaydat) 
        VALUES ('${name}', '${email}', '${phone}', '${address}', '${ship}', '${total}', '${note}', '${formality}', '${delivery}', '${detail}', '${orderDate}')`;
            db.query(sql, (err, result) => {
                if(err) { hamLoi(err); }  
            });
            let sql_orderId = "SELECT LAST_INSERT_ID() as LastID;"; // Kết quả trả về là id đơn hàng vừa tạo.
            db.query(sql_orderId, (err, resultId) => {    // result sẽ trả về id đơn hàng vừa tạo.
                console.log(resultId[0].LastID);
                if(err) { hamLoi(err); } 
                else {
                    let sql_orderDetail = `INSERT INTO chitietdh SET ?`;
                    cart.forEach(element => {
                        let thanhtien = element.gia * element.soluong;
                        let data = {
                            masp: element.masp,
                            size: element.size,
                            mau: element.mau,
                            gia: element.gia,
                            //giagiam: element.giagiam,
                            soluong: element.soluong,
                            thanhtien: thanhtien,
                            //makm: element.makm,
                            madonhang: resultId[0].LastID
                        };
                        db.query(sql_orderDetail, data, (err, result1) => {    // Câu lệnh tạo chi tiết đơn hàng.
                            if(err) {
                                let sql_delete = `DELETE FROM donhang WHERE madonhang='${resultId[0].LastID}'`;
                                db.query(sql_orderDetail, data, (error2, result2) => {
                                    if(error2) { hamLoi(error2); }
                                });
                                hamLoi(err);
                            }
                        });
                    });
                    hamOK(resultId[0].LastID);
                }
            });
        } else {
            // Đơn hàng dùng mã khuyến mãi
            let sql = `INSERT INTO donhang(tenkh, email, sodienthoai, diachi, tienship, tongtien, ghichu, makm, hinhthuc, vanchuyen, chitiet, ngaydat) 
        VALUES ('${name}', '${email}', '${phone}', '${address}', '${ship}', '${total}', '${note}', '${promoCode}','${formality}', '${delivery}', '${detail}', '${orderDate}')`;
            db.query(sql, (err, result) => {
                if(err) { hamLoi(err); }  
            })
            let sql_orderId = "SELECT LAST_INSERT_ID() as LastID;"; // Kết quả trả về là id đơn hàng vừa tạo.
            db.query(sql_orderId, (err, resultId) => {    // result sẽ trả về id đơn hàng vừa tạo.
                if(err) { hamLoi(err); } 
                else {
                    let sql_orderDetail = `INSERT INTO chitietdh SET ?`;
                    cart.forEach(element => {
                        let thanhtien = element.gia * element.soluong;
                        let data = {
                            masp: element.masp,
                            size: element.size,
                            mau: element.mau,
                            gia: element.gia,
                            soluong: element.soluong,
                            thanhtien: thanhtien,
                            madonhang: resultId[0].LastID
                        };
                        db.query(sql_orderDetail, data, (err, result1) => {    // Câu lệnh tạo chi tiết đơn hàng.
                            if(err) {
                                let sql_delete = `DELETE FROM donhang WHERE madonhang='${resultId[0].LastID}'`;
                                db.query(sql_orderDetail, data, (error2, result2) => {
                                    if(error2) { hamLoi(error2); }
                                });
                                hamLoi(err);
                            }
                        });
                    });
                    hamOK(resultId[0].LastID);
                }
            });
        };
    });
};

    // Tạo đơn hàng cho khách hàng có tài khoản:
exports.insert_Order_User = (userId, name, email, phone, address, ship, total, note, promoCode, formality, delivery, detail, orderDate, cart) => {
    return new Promise( (hamOK, hamLoi) => {
        if(promoCode == undefined){
            // Đơn hàng không dùng mã khuyến mãi 
            let sql = `INSERT INTO donhang(makh, tenkh, email, sodienthoai, diachi, tienship, tongtien, ghichu, hinhthuc, vanchuyen, chitiet, ngaydat) 
        VALUES ('${userId}', '${name}', '${email}', '${phone}', '${address}', '${ship}', '${total}', '${note}', '${formality}', '${delivery}', '${detail}', '${orderDate}')`;
            db.query(sql, (err, result) => {
                if(err){
                    hamLoi(err);
                }  
            })
            let sql_orderId = "SELECT LAST_INSERT_ID() as LastID;"; // Kết quả trả về là id đơn hàng vừa tạo
            db.query(sql_orderId, (err, resultId) => {    // result sẽ trả về id đơn hàng vừa tạo
                if(err){
                    hamLoi(err)
                } else{
                    let sql_orderDetail = `INSERT INTO chitietdh SET ?`;
                    cart.forEach(element => {
                        let thanhtien = element.gia * element.soluong;
                        let data = {
                            masp: element.masp,
                            size: element.size,
                            mau: element.mau,
                            gia: element.gia,
                            soluong: element.soluong,
                            thanhtien: thanhtien,
                            madonhang: resultId[0].LastID
                        };
                        db.query(sql_orderDetail, data, (err, result1) => {    // Câu lệnh tạo chi tiết đơn hàng.
                            if(err){
                                let sql_delete = `DELETE FROM donhang WHERE madonhang='${resultId[0].LastID}'`;
                                db.query(sql_orderDetail, data, (error2, result2) => {
                                    if(error2) { hamLoi(error2); }
                                });
                                hamLoi(err);
                            }
                        });
                    });
                    hamOK(resultId[0].LastID);
                }
            });
        } else {
            // Đơn hàng dùng mã khuyến mãi
            let sql = `INSERT INTO donhang(makh, tenkh, email, sodienthoai, diachi, tienship, tongtien, ghichu, makm, hinhthuc, vanchuyen, chitiet, ngaydat) 
        VALUES ('${userId}', '${name}', '${email}', '${phone}', '${address}', '${ship}', '${total}', '${note}', '${promoCode}', '${formality}', '${delivery}', '${detail}', '${orderDate}')`;
            db.query(sql, (err, result) => {
                if(err){
                    hamLoi(err);
                }  
            })
            let sql_orderId = "SELECT LAST_INSERT_ID() as LastID;"; // Kết quả trả về là id đơn hàng vừa tạo.
            db.query(sql_orderId, (err, resultId) => {    // result sẽ trả về id đơn hàng vừa tạo.
                if(err){
                    hamLoi(err)
                } else{
                    let sql_orderDetail = `INSERT INTO chitietdh SET ?`;
                    cart.forEach(element => {
                        let thanhtien = element.gia * element.soluong;
                        let data = {
                            masp: element.masp,
                            size: element.size,
                            mau: element.mau,
                            gia: element.gia,
                            soluong: element.soluong,
                            thanhtien: thanhtien,
                            madonhang: resultId[0].LastID
                        };
                        db.query(sql_orderDetail, data, (err, result1) => {    // Câu lệnh tạo chi tiết đơn hàng.
                            if(err){
                                let sql_delete = `DELETE FROM donhang WHERE madonhang='${resultId[0].LastID}'`;
                                db.query(sql_orderDetail, data, (error2, result2) => {
                                    if(error2) { hamLoi(error2); }
                                });
                                hamLoi(err);
                            }
                        });
                    });
                    hamOK(resultId[0].LastID);
                }
            });
        };
    })
}
    // Xoá đơn hàng:
exports.delete = (madh) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE donhang SET trangthai='4' WHERE madonhang='${madh}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else
                hamOK("Huỷ đơn hàng thành công !");
        })
    })
};

    // Xoá đơn hàng khi chọn phương thức GHTK:
exports.delete_GHTK = (madh) => {
    return new Promise( (resolve, reject) => {
        let sql_deleteDetail = `DELETE FROM chitietdh WHERE madonhang='${madh}'`;
        db.query(sql_deleteDetail, (err, result) => {
            if(err) { reject(err); }
            else { 
                let sql_delete = `DELETE FROM donhang WHERE madonhang='${madh}'`;
                db.query(sql_delete, (error, result1) => {
                    if(error) { hamLoi(error); }
                });
                resolve("Xoá đơn hàng thành công !");
            }
        })
    })
};