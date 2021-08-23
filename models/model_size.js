const db = require('./database'); //nhúng model database vào đế kết nối db


// MODEL BẢNG SIZE ÁO QUẦN THEO CHIỀU CAO-CÂN NẶNG:

// Danh sách tất cả size quần áo:
exports.list_Size = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM bang_size`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                hamOK(result);
            }
        })
    })
}
    // Lấy chi tiết 1 size theo masize:
exports.get_Size = async (masize) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM bang_size WHERE masize='${masize}'`;
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err);
                hamLoi(err);
            } else {
                if(result.length <= 0) {
                    hamOK(-1);
                } else {
                    hamOK(result[0]);
                }
            }
        })
    })
}
    // Lấy chi tiết 1 size theo tên size và giới tính:
exports.check_Size_Exist = async (size, gioitinh) => {
    return new Promise( (hamOK, hamLoi) => {
        let data = [];
        let sql = `SELECT * FROM bang_size WHERE size='${size}' AND gioitinh='${gioitinh}'`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                if(result.length <= 0) {
                    hamOK(-1);
                } else {
                    data = result;
                    hamOK(data);
                }
            }
        })
    })
}
    // Lấy chi tiết 1 size theo size:
exports.check_Size = async (gioitinh) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM bang_size WHERE gioitinh='${gioitinh}' ORDER BY chieucaoden ASC`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                if(result.length <= 0) {
                    hamOK(-1);
                } else {
                    hamOK(result);
                }
            }
        })
    })
}
    // Thêm size quần áo
exports.insert_Size = async (data) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `INSERT INTO bang_size SET ?`;
        db.query(sql, data, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                hamOK("Thêm size quần áo thành công !");
            }
        })
    })
}
    // Cập nhật size quần áo
exports.update_Size = (data) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE bang_size SET cannangtu='${data.cannangtu}', cannangden='${data.cannangden}', chieucaotu='${data.chieucaotu}', chieucaoden='${data.chieucaoden}' 
        WHERE masize='${data.masize}'`;
        let query = db.query(sql, (err, result) => {
            if(err){
                console.log(err);
                hamLoi(err);
            }else{
                hamOK("Cập nhật size quần áo thành công !");
            }
        });
    });
};
    // Xoá 1 size
exports.delete_Size = async (masize) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `DELETE FROM bang_size WHERE masize='${masize}'`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                hamOK(1);
            }
        })
    })
}