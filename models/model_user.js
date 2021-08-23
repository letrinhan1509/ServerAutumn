var db = require('./database'); //nhúng model database vào đế kết nối db

var dataList = [];
var dataName = [];

exports.checkEmail = (email) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM khachhang WHERE email = '${email}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                if(result.length <= 0)  // Không tìm thấy user có email này trong DB
                    hamOK(-1);
                else
                    hamOK(result[0]);
            }
        })
    })
}
    //Danh sách khách hàng
exports.list = () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = 'SELECT makh, tenkh, email, tenhinh, hinh, sodienthoai, diachi, trangthai FROM khachhang'
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK(result);
            }
        });
    });
};
    // Lọc khách hàng theo tên:
exports.detailByName = (nameUser) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT tenkh, email, tenhinh, hinh, sodienthoai, diachi FROM khachhang WHERE tenkh LIKE '${nameUser}'`;
        db.query(sql, (err, result) => {
            console.log('User Success!');
            hamOK(result[0]);
        })
    });
}
    // Lọc khách hàng theo ID:
exports.get_By_Id = (userId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT makh, tenkh, email, tenhinh, hinh, sodienthoai, diachi, trangthai FROM khachhang WHERE makh='${userId}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length <= 0){
                    console.log('Fail! No user!');
                    hamOK(-1);
                }else{
                    console.log('User Success!');
                    hamOK(result[0]);
                }
            }
        })
    });
}
    // Thêm tài khoản user:
exports.insert_User = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO khachhang SET ?";
        db.query(sql, data, (err, result) => {
            if(err){
                console.log('Insert user fail')
                reject(err);
            } else{
                resolve("Đăng ký tài khoản thành công !" );    // trả về kết quả nếu promise hoàn thành.
            }
        })
    })
}
    // Cập nhật thông tin khách hàng
exports.updateProfile = (email, ten, tenhinh, hinh, sdt, diachi) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE khachhang SET tenkh = '${ten}', tenhinh = '${tenhinh}', hinh = '${hinh}', sodienthoai = '${sdt}', diachi = '${diachi}' 
        WHERE email = '${email}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else {
                hamOK("Sửa thông tin tài khoản thành công !");
            };
        });
    });
}
    // Cập nhật mật khẩu khách hàng:
exports.updatePasswordUser = (email, pass) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE khachhang SET matkhau = '${pass}' WHERE email = '${email}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                console.log('Update success');
                hamOK(result);
            }
        })
        }
    )
}
    // Khoá tài khoản khách hàng:
exports.lock_User = (userId) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE khachhang SET trangthai = 0 WHERE makh = '${userId}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve("Khoá tài khoản khách hàng thành công");
            }
        })
    })
}
    // Mở khoá tài khoản khách hàng:
exports.unlock_User = (userId) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE khachhang SET trangthai = 1 WHERE makh = '${userId}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve("Mở khoá tài khoản khách hàng thành công");
            }
        })
    })
}
    // Xoá tài khoản khách hàng:
exports.delete_User = (userId) => {
    return new Promise( (resolve, reject) => {
        let sql_foreignKey_Order = `SELECT * FROM donhang WHERE makh = '${userId}'`;
        db.query(sql_foreignKey_Order, (error, result) => {
            if(error) { reject(error); } 
            else {
                if(result.length <= 0) {
                    let sql_foreignKey_Cmt = `SELECT * FROM binhluan WHERE makh = '${userId}'`;
                    db.query(sql_foreignKey_Cmt, (error_cmt, result_cmt) => {
                        if(error_cmt) { reject(error_cmt); } 
                        else { 
                            if(result_cmt.length <= 0) {
                                let sql_deleteCart = `DELETE FROM giohang WHERE makh = '${userId}'`;
                                db.query(sql_deleteCart, (error_cart, result_cart) => {
                                    if(error_cart) { reject(error_cart); } 
                                    else { 
                                        let sql_delete_User = `DELETE FROM khachhang WHERE makh = '${userId}'`;
                                        db.query(sql_delete_User, (error_user, result_user) => {
                                            if(error_user) { reject(error_user); }
                                            else {
                                                resolve(1);
                                            }
                                        })
                                    }
                                });
                            } else { 
                                let sql_lock = `UPDATE khachhang SET trangthai = 0 WHERE makh = '${userId}'`;
                                db.query(sql_lock, (error_lock, result_lock) => {
                                    if(error_lock) { reject(error_lock); }
                                    else {
                                        resolve(6);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    // Có khoá ngoại không thể xoá:
                    let sql_lock = `UPDATE khachhang SET trangthai = 0 WHERE makh = '${userId}'`;
                    db.query(sql_lock, (error_lock, result_lock) => {
                        if(error_lock) { reject(error_lock); }
                        else {
                            resolve(6);
                        }
                    });
                }
            }
        })
    })
}

///UserName
//Tất cả thành tài khoảng khách hàng
/* exports.listUserKH = () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = "SELECT * FROM khachhang";
        db.query(sql, (err, d) => {
            console.log('List success');
            dataList = d;
            hamOK(dataListUser);
        })
        }
    )
} */