const { json } = require('body-parser');
const express = require('express');
const db = require('./database');

var dataList = [];
var dataName = [];

            // ADMIN:
    // Danh sách tất cả admin:
exports.list_Admins = async () => {
    return new Promise( (hamOk, hamLoi) => {
        let sql = `SELECT A.manv, A.admin, A.tennv, A.hinh, A.diachi, A.sodienthoai, A.quyen, A.trangthai 
        FROM admin as A`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } 
            dataList = result;
            hamOk(dataList);
        });
    });
};
    // Tìm kiếm admin theo id:
exports.get_Admin_Id = async (adminId) => {
    return new Promise( (hamOk, hamLoi) => {
        let sql = `SELECT * FROM admin WHERE manv = ${adminId}`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err)
            else{
                if(result.length <= 0)
                    hamOk(-1);
                else {
                    hamOk(result[0]);
                }
            }
        });
    });
};
    // Tìm kiếm admin theo tên:
exports.getByName = async (admin_name) => {
    return new Promise( (hamOk, hamLoi) => {
        let sql = `SELECT * FROM admin WHERE tennv LIKE '%${admin_name}%'`;
        db.query(sql, (err, result) => {
            dataName = result;
            hamOk(dataName);
        });
    });
};
    // Tìm kiếm admin bằng số điện thoại:
exports.getByPhone = async (phone) => {
    return new Promise( (hamOk, hamLoi) => {
        let sql = `SELECT * FROM admin WHERE sodienthoai=${phone}`;
        db.query(sql, (err, result) => {
            if(err) { hamLoi(err); }
            else {
                if(result.length <= 0) { hamOk(-1); }
                else { hamOk(result[0]); }
            }
        });
    });
};
exports.check_Admin = async (email) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM admin WHERE admin = '${email}'`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                if(result.length <= 0)
                    hamOK(-1);
                else
                    hamOK(result[0]);
            }
        })
        }
    )
}
    // Thêm tài khoản admin:
exports.insert_Admin = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO admin SET ?";
        db.query(sql, data, (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve("Đăng ký tài khoản admin thành công !");    // trả về kết quả nếu promise hoàn thành.
            }
        })
    })
}
    // Cập nhật thông tin tài khoản admin:
exports.update_Profile_Admin = (id, ten, tenhinh, hinh, diachi, sdt) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE admin SET tennv = '${ten}', tenhinh = '${tenhinh}', hinh = '${hinh}', diachi = '${diachi}', sodienthoai = '${sdt}'
        WHERE manv = '${id}'`;
        db.query(sql, (err, result) => {
            if(err){
                console.log('Fail');
                reject(err)
            }else{
                resolve("Cập nhật thông tin tài khoản thành công !")
            }     
        })
    })
}
    // Đổi mật khẩu tài khoản admin:
exports.update_Password = (email, pas) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE admin SET matkhau = '${pas}' WHERE admin = '${email}'`;
        db.query(sql, (err, result) => {
            if(err){
                reject(err)
            }else{
                resolve("Đổi mật khẩu thành công !")
            }     
        })
    })
}
    // Khoá tài khoản admin:
exports.lock_Admin = (adminId) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE admin SET trangthai = 0 WHERE manv = '${adminId}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve("Khoá tài khoản admin thành công !");
            };
        });
    });
};
    // Mở khoá tài khoản admin:
exports.unlock_Admin = (adminId) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE admin SET trangthai = 1 WHERE manv = '${adminId}'`;
        db.query(sql, (err, result) => {
            if(err)
                reject(err);
            else
                resolve("Mở khoá tài khoản admin thành công !");
        })
    })
}
    // Xoá tài khoản quản trị viên:
exports.delete_Admin = (adminId) => {
    return new Promise( (resolve, reject) => {
        let sql_foreignKey_Order = `SELECT * FROM donhang WHERE manv = '${adminId}'`;
        db.query(sql_foreignKey_Order, (error, result) => {
            if(error) { reject(error); } 
            else {
                if(result.length <= 0) {
                    let sql_foreignKey_DetailCmt = `SELECT * FROM chitietbl WHERE manv = '${adminId}'`;
                    db.query(sql_foreignKey_DetailCmt, (error_detailCmt, result_detailCmt) => {
                        if(error_detailCmt) { reject(error_detailCmt); } 
                        else {
                            if(result_detailCmt.length <= 0) {
                                // Tài khoản có thể xoá
                                let sql_delete = `DELETE FROM admin WHERE manv = '${adminId}'`;
                                db.query(sql_delete, (err_delete, result_delete) => {
                                    if(err_delete) { reject(err_delete); } 
                                    else { resolve("Xoá tài khoản quản trị viên thành công !"); }
                                })
                            } else {
                                let sql_lock = `UPDATE admin SET trangthai = 0 WHERE manv = '${adminId}'`;
                                db.query(sql_lock, (err, result) => {
                                    if(err) { reject(err); }
                                    else {
                                        resolve(6);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    let sql_lock = `UPDATE admin SET trangthai = 0 WHERE manv = '${adminId}'`;
                    db.query(sql_lock, (err, result) => {
                        if(err) { reject(err); }
                        else {
                            resolve(6);
                        }
                    });
                }
            }
        });
    })
}


            // TRẠNG THÁI CỦA ĐƠN HÀNG:
    // Danh sách trạng thái đơn hàng:
exports.list_Status_Order = async () => {
    return new Promise( (resolve, reject) => {
        let sql = "SELECT * FROM trangthai";
        db.query(sql, (err, result) => {
            if(err)
                reject(err);
            else
                resolve(result);          
        })
    })
}
    // Chi tiết 1 trạng thái đơn hàng:
exports.status_Order = async (id) => {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT * FROM trangthai WHERE trangthai='${id}'`;
        db.query(sql, (err, result) => {
            if(err)
                reject(err);
            else{
                if(result.length <= 0)
                    resolve(-1);
                else
                    resolve(result[0]);
            }
                          
        })
    })
}
    // Chi tiết 1 trạng thái đơn hàng theo tên:
exports.status_Order_Name = async (name) => {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT * FROM trangthai WHERE tentt='${name}'`;
        db.query(sql, (err, result) => {
            if(err) { reject(err); }
            else{
                if(result.length <= 0) { resolve(-1); }
                else { resolve(result[0]); }
            }
                          
        })
    })
}
    // Thêm trạng thái:
exports.insert_Status_Or = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO trangthai SET ?";
        db.query(sql, data, (err, result) => {
            if(err)
                reject(err);
            else{
                resolve("Thêm trạng thái đơn hàng thành công !");
            }
        })
    })
}
    // Cập nhật trạng thái đơn hàng:
exports.update_Status_Or = (sttId, name) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE trangthai SET tentt = '${name}' WHERE trangthai = '${sttId}'`;
        db.query(sql, (err, result) => {
            if(err) { hamLoi(err); } 
            else {
                hamOK("Cập nhật trạng thái đơn hàng thành công !")
            };
        });
    });
}
    // Xoá trạng thái:
exports.delete_Status_Order = (sttId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql_type = `SELECT donhang.madonhang, donhang.makh, TT.trangthai
        FROM donhang JOIN trangthai TT
        ON donhang.trangthai = TT.trangthai
        WHERE donhang.trangthai = '${sttId}'`;
        db.query(sql_type, (error, result) => {
            if(error) { hamLoi(error); } 
            else {
                if(result.length <= 0){
                    console.log("Xoá được!");
                    let sql = `DELETE FROM trangthai WHERE trangthai='${sttId}'`;
                    db.query(sql, (err, result1) => {
                        if(err) {
                            hamLoi(err);
                        } else {
                            hamOK(1);
                        };
                    });
                }else{
                    console.log("Không xoá được!");
                    hamOK(6);
                };
            };
        });
    });
};