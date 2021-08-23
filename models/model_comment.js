const db = require('./database'); //nhúng model database vào đế kết nối db

var dataList=[]; // biến để chứa dữ liệu đổ về cho controller

    // Danh sách tất cả comment:
exports.list_Comments = async () => {
    return new Promise( (hamOK, hamLoi) => {
        var data = [];
        let dataListCmt = {};
        let sql = `SELECT binhluan.mabl, binhluan.masp, sanpham.tensp, sanpham.hinh as hinhsp, binhluan.makh, khachhang.tenkh, 
        khachhang.hinh, binhluan.noidung, TIME(binhluan.ngaybl) as giobl, DATE_FORMAT(binhluan.ngaybl, '%e-%c-%Y') as ngaybl, binhluan.trangthai 
        FROM ((binhluan JOIN khachhang ON binhluan.makh = khachhang.makh) JOIN sanpham ON binhluan.masp = sanpham.masp)`;
        db.query(sql, (error, result) => {
            if(error) { hamLoi(error); } 
            else { hamOK(result); }
        })
    })
}
    // Comment theo id_cmt:
exports.get_by_Id = async (cmtId) => {
    return new Promise( (hamOK, hamLoi) => {
        const data = [];
        let sql = `SELECT binhluan.mabl, binhluan.masp, sanpham.tensp, binhluan.makh, khachhang.tenkh, khachhang.hinh, binhluan.noidung,
        TIME(binhluan.ngaybl) as giobl, TIME(binhluan.ngaybl) as ngaybl, binhluan.trangthai FROM ((binhluan JOIN khachhang ON binhluan.makh = khachhang.makh)
        JOIN sanpham ON binhluan.masp = sanpham.masp) WHERE binhluan.mabl = '${cmtId}'`;
        db.query(sql, (error, result) => {
            if(error) { hamLoi(error); }
            else {
                if(result.length > 0){
                    result.forEach(element => {
                        let sql_detail = `SELECT chitietbl.mact, chitietbl.ten, chitietbl.noidung, DATE_FORMAT(chitietbl.ngaybl, '%e-%c-%Y') as ngaybl, 
                        DATE_FORMAT(chitietbl.ngaybl, '%e-%c-%Y') as giobl, chitietbl.manv, admin.hinh as hinhnv, chitietbl.mabl
                        FROM ((chitietbl JOIN binhluan ON chitietbl.mabl = binhluan.mabl) JOIN admin ON chitietbl.manv = admin.manv) 
                        WHERE chitietbl.mabl = '${element.mabl}'`;
                        db.query(sql_detail, (err, result1) => {
                            if(err){
                                hamLoi(err);
                            }else{
                                element.traLoiBL = result1;
                                data.push(element);
                                hamOK(data);
                            } 
                        })     
                    });
                }else{
                    // Không có trong database
                    hamOK(-1);
                }
            }   
        })
    })
}
    // Danh sách comment theo id sản phẩm:
exports.get_by_productId = async (productId) => {
    return new Promise( async (hamOK, hamLoi) => {
        const data = [];
        let sql = `SELECT binhluan.mabl, binhluan.masp, sanpham.tensp, binhluan.makh, khachhang.tenkh, khachhang.hinh, binhluan.noidung,
        TIME(binhluan.ngaybl) as giobl, DATE_FORMAT(binhluan.ngaybl, '%e-%c-%Y') as ngaybl, binhluan.trangthai 
        FROM ((binhluan JOIN khachhang ON binhluan.makh = khachhang.makh) JOIN sanpham ON binhluan.masp = sanpham.masp) 
        WHERE binhluan.masp = '${productId}' AND binhluan.trangthai = 1`;  
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else{
                if(result.length > 0){
                    //dataList = result;
                    hamOK(result);
                }else{
                    hamOK(-1);
                }
            }
        })
    })
}
    // Danh sách comment theo id khách hàng:
exports.get_by_userId = async (userId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT binhluan.mabl, binhluan.masp, sanpham.tensp, binhluan.makh, khachhang.tenkh, khachhang.hinh, binhluan.noidung,
        TIME(binhluan.ngaybl) as giobl, DATE_FORMAT(binhluan.ngaybl, '%e-%c-%Y') as ngaybl FROM ((binhluan JOIN khachhang ON binhluan.makh = khachhang.makh)
        JOIN sanpham ON binhluan.masp = sanpham.masp) WHERE binhluan.makh = '${userId}' AND binhluan.trangthai = 1`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length > 0){
                    //dataList = result;
                    hamOK(result);
                }else{
                    hamOK(-1);
                }
            }
        })
    })
}
    // Danh sách chi tiết comment:
exports.get_detailComment = async (commentId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT chitietbl.mact, chitietbl.ten, chitietbl.noidung, TIME(chitietbl.ngaybl) as giobl, DATE_FORMAT(chitietbl.ngaybl, '%e-%c-%Y') as ngaybl, chitietbl.mabl
        FROM (chitietbl JOIN binhluan ON chitietbl.mabl = binhluan.mabl) WHERE chitietbl.mabl = '${commentId}' AND binhluan.trangthai=1`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length > 0){
                    //dataList = result;
                    hamOK(result);
                }else{
                    hamOK(-1);
                }
            }
        })
    })
}
    // Get 1 chi tiết comment:
exports.get_detailComment_Id = async (id) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM chitietbl WHERE mact = '${id}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length > 0){
                    //dataList = result;
                    hamOK(result[0]);
                }else{
                    hamOK(-1);
                };
            };
        });
    });
};
    // Tạo comment:
exports.create_Comment = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO binhluan SET ?";
        db.query(sql, data, (err, d) => {
            if(err)
                reject(err);
            else {
                console.log('Insert successfully')
                resolve("Thêm bình luận thành công !");
            };
        });
    });
};
    // Admin Rep cmt:
exports.create_AdminRepComment = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO chitietbl SET ?";
        db.query(sql, data, (err, d) => {
            if(err) { reject(err); }
            else { resolve("Thêm phản hồi bình luận thành công !"); };
        });
    });
};
    // User Rep cmt:
exports.create_UserRepComment = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO chitietbl SET ?";
        db.query(sql, data, (err, d) => {
            if(err) { reject(err); }
            else { resolve("Thêm bình luận thành công !"); };
        });
    });
};
    // Chỉnh sửa comment:
exports.update_Comment = (mabl, noidung) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE binhluan SET noidung='${noidung}' WHERE mabl='${mabl}'`;
        let query = db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK("Chỉnh sửa bình luận thành công !");
            }
        });
    });
};
    // Chỉnh sửa chi tiết comment:
exports.update_AdminRepComment = (mact, noidung) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE chitietbl SET noidung='${noidung}' WHERE mact='${mact}'`;
        let query = db.query(sql, (err, result) => {
            if(err) { hamLoi(err); }
            else { hamOK("Chỉnh sửa bình luận thành công !"); }
        });
    });
};
    // Xoá comment:
exports.delete_Comment = (mabl) => {
    return new Promise( (hamOK, hamLoi) => {
        let deleteCT = `DELETE FROM chitietbl WHERE mabl='${mabl}'`;
        let delete_query = db.query(deleteCT, (error, result) => {
            if(error) { hamLoi(error); };
        });
        let sql = `DELETE FROM binhluan WHERE mabl='${mabl}'`;
        let query = db.query(sql, (err, result1) => {
            if(err) { hamLoi(err); } 
            else { hamOK("Xoá bình luận thành công !"); };
        });
    });
};
    // Xoá chi tiết comment:
exports.delete_AdminRepComment = (mact) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `DELETE FROM chitietbl WHERE mact='${mact}'`;
        let query = db.query(sql, (err, result) => {
            if(err) { hamLoi(err); } 
            else { hamOK("Xoá bình luận thành công !"); };
        });
    });
};    
    // Khoá comment:
exports.lock_Comment = (mabl) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE binhluan SET trangthai=0 WHERE mabl='${mabl}'`;
        let query = db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK("Ẩn bình luận thành công !");
            }
        });
    });
};
    // Mở khoá comment:
exports.unlock_Comment = (mabl) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE binhluan SET trangthai=1 WHERE mabl='${mabl}'`;
        let query = db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK("Hiện bình luận thành công !");
            }
        });
    });
};
    // Khoá chi tiết comment:
exports.lock_RepComment = (mact) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE chitietbl SET trangthai=0 WHERE mact='${mact}'`;
        let query = db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK(result);
            }
        });
    });
};
    // Mở khoá chi tiết comment:
exports.unlock_RepComment = (mact) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE chitietbl SET trangthai=1 WHERE mact='${mact}'`;
        let query = db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK(result);
            }
        });
    });
};


exports.getComment = (idProduct) => {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT * FROM comment WHERE idProduct=${idProduct}`;
        db.query(sql, (err, d) => {
            resolve(d);
        })
    })
}

/* `SELECT binhluan.mabl, binhluan.masp, khachhang.tenkh,binhluan.noidung, binhluan.ngaybl 
FROM binhluan JOIN khachhang
ON binhluan.makh = khachhang.makh
WHERE mabl = 4;

SELECT chitietbl.mact, chitietbl.ten, chitietbl.noidung, chitietbl.ngaybl
FROM chitietbl JOIN binhluan
ON chitietbl.mabl = binhluan.mabl
WHERE binhluan.mabl = 4` */