const express = require('express');
const db = require('./database');

// resolve: Hàm trả về kết quả đúng.
// reject: Hàm trả về nếu bị err.
var dataList = [];


exports.list_Carts = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM giohang`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else if(result.length <= 0){
                hamOK(0);
            } else{
                hamOK(result);
            }
        });
    });
};

exports.get_Cart = async (id) => {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT * FROM giohang WHERE magiohang = '${id}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else if(result.length <= 0){
                resolve(0);
            } else{
                resolve(result[0]);
            }
        });
    });
};

exports.get_By_userId = async (userId) => {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT SP.hinh, SP.tensp, GH.magiohang, GH.makh, GH.masp, GH.size, GH.mau, GH.gia, GH.soluong, GH.thanhtien 
        FROM giohang as GH JOIN sanpham as SP ON GH.masp = SP.masp 
        WHERE makh = '${userId}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else if(result.length <= 0){
                resolve(0);
            } else{
                resolve(result);
            }
        });
    });
};

exports.get_By_productId = async (id) => {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT * FROM giohang WHERE masp = '${id}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else if(result.length <= 0){
                resolve(0);
            } else{
                resolve(result);
            }
        });
    });
};

exports.check_productId = async (makh, masp, size, mau) => {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT * FROM giohang WHERE makh ='${makh}' AND  masp = '${masp}' AND  size = '${size}' AND  mau = '${mau}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else if(result.length <= 0){
                resolve(0);
            } else{
                resolve(result[0]);
            }
        });
    });
};

exports.create = async (data) => {
    return new Promise( (resolve, reject) => {
        let sql = `INSERT INTO giohang SET ?`;
        db.query(sql, data, (error, result) => {
            if(error) {
                reject(error);
            } else{
                let sql_Magiohang = `SELECT LAST_INSERT_ID() as LastID;`;
                db.query(sql_Magiohang, (err, result1) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result1[0].LastID);
                    }
                });
            }
        });
    });
};

exports.put = async (magiohang, soluong, thanhtien) => {
    console.log(magiohang, soluong, thanhtien);
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE giohang SET soluong='${soluong}', thanhtien='${thanhtien}'
        WHERE magiohang = '${magiohang}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else{
                resolve("Cập nhật sản phẩm trong giỏ hàng thành công !!!");
            }
        });
    });
};
// Cập nhật số lượng sản phẩm trong giỏ hàng:
exports.put_Amount = async (magiohang, soluong) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE giohang SET soluong='${soluong}'
        WHERE magiohang = '${magiohang}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else{
                resolve("Cập nhật số lượng sản phẩm trong giỏ hàng thành công !!!");
            }
        });
    });
};
// Xoá 1 sản phẩm trong giỏ hàng theo mã giỏ hàng:
exports.delete = async (id) => {
    return new Promise( (resolve, reject) => {
        let sql = `DELETE FROM giohang WHERE magiohang = '${id}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else{
                resolve("Xoá sản phẩm trong giỏ hàng thành công !!!");
            }
        });
    });
};
// Xoá 1 sản phẩm trong giỏ hàng theo mã sản phẩm:
exports.delete_Product = async (masp) => {
    return new Promise( (resolve, reject) => {
        let sql = `DELETE FROM giohang WHERE masp = '${masp}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else{
                resolve("Xoá sản phẩm trong giỏ hàng thành công !!!");
            }
        });
    });
};
// Xoá giỏ hàng theo mã khách hàng:
exports.deleteCart_Customer = async (makh) => {
    return new Promise( (resolve, reject) => {
        let sql = `DELETE FROM giohang WHERE makh = '${makh}'`;
        db.query(sql, (err, result) => {
            if(err) {
                reject(err);
            } else{
                resolve("Xoá giỏ hàng thành công !!!");
            }
        });
    });
};