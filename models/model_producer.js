const e = require('express');
const db = require('./database'); //nhúng model database vào đế kết nối db

var itemCat=[]; // biến để chứa dữ liệu đổ về cho controller
var dataList=[];
var dataListPro=[];

    // Danh sách các nhà sản xuất:
exports.list_producers = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = "SELECT * FROM nhasx";
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else
                hamOK(result);          
        })
    })
}
    // Get nhà sản xuất theo id:
exports.get_By_Id = async (producerId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM nhasx WHERE mansx='${producerId}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                if(result.length <= 0)
                    hamOK(-1)   // Không có nhà sản xuất này trong DB.
                else
                    hamOK(result[0]);// Trả về nhà sản xuất tìm thấy trong DB.
            }            
        })
    })
};
    // Get nhà sản xuất theo tên:
exports.get_By_Name = async (name) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM nhasx WHERE tennsx='${name}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                if(result.length <= 0)
                    hamOK(-1)   // Không có nhà sản xuất này trong DB.
                else
                    hamOK(result[0]);// Trả về nhà sản xuất tìm thấy trong DB.
            }            
        })
    })
};
    // Thêm nhà sản xuất:
exports.insert = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO nhasx SET ?";
        db.query(sql, data, (err, result) => {
            if(err)
                reject(err);
            else{
                console.log('Insert producer successfully')
                resolve("Thêm nhà sản xuất thành công !");    // trả về kết quả nếu promise hoàn thành.
            }
        })
    })
};
    // Ẩn nhà sản xuất:
exports.unlock = (mansx) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE nhasx SET trangthai=1  WHERE mansx = '${mansx}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                hamOK("Hiện nhà sản xuất thành công !");
            }
        })
    })
};
    // Hiện nhà sản xuất:
exports.lock = (mansx) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE nhasx SET trangthai=0  WHERE mansx = '${mansx}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                hamOK("Ẩn nhà sản xuất thành công !");
            }
        })
    })
}
    // Cập nhật nhà sản xuất:
exports.update = (producerId, name, origin) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE nhasx SET tennsx = '${name}', xuatxu = '${origin}' WHERE mansx = '${producerId}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                console.log('Update type success');
                hamOK("Cập nhật thông tin nhà sản xuất thành công !");
            }
        })
    })
}
    // Xoá nhà sản xuất:
exports.delete = (producerId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql_type = `SELECT sanpham.masp, sanpham.tensp, nhasx.tennsx
        FROM sanpham JOIN nhasx
        ON sanpham.mansx = nhasx.mansx
        WHERE sanpham.mansx='${producerId}'`;
        db.query(sql_type, (error, result) => {
            if(error)
                hamLoi(error);
            else{
                if(result.length == 0){
                    console.log("Xoá được!");
                    let sql = `DELETE FROM nhasx WHERE mansx='${producerId}'`;
                    db.query(sql, (err, result) => {
                        if(err) {
                            hamLoi(err);
                        } else {
                            console.log('Delete type success');
                            hamOK(1);
                        };
                    })
                } else {
                    // Có ràng buộc khoá ngoại không thể xoá
                    console.log("Không xoá được!");
                    hamOK(6);
                }
            }
        })
    })  
}