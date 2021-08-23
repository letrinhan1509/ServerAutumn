var db = require('./database'); //nhúng model database vào đế kết nối db
var itemCat=[]; // biến để chứa dữ liệu đổ về cho controller
var dataList=[];
var dataListPro=[];

// định nghĩa các hàm để tương tác vào mysql

            // DANH MỤC:
    // Danh sách các danh mục:
exports.list_Categorys = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM danhmuc`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK(result);
            }
        })
    })
}
    // Get danh mục theo id:
exports.get_Category_Id = async (id) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM danhmuc WHERE madm='${id}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                if(result.length <= 0){  // Không có trong DB:
                    hamOK(-1);
                }else{
                    hamOK(result[0]);
                }
            }
        })
    })
}
    // Get danh mục theo tên:
exports.get_Category_Name = async (name) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM danhmuc WHERE tendm='${name}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                if(result.length <= 0){  // Không có trong DB:
                    hamOK(-1);
                }else{
                    hamOK(result[0]);
                }
            }
        })
    })
}
    // Thêm danh mục:
exports.insert_category = async (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO danhmuc SET ?";
        db.query(sql, data, (err, result) => {
            if(err)
                reject(err);
            else{
                console.log('Insert category successfully')
                resolve("Thêm danh mục thành công !");    // trả về kết quả nếu promise hoàn thành.
            }
        })
    })
}
    // Sửa danh mục:
exports.update_category = async (categoryId, name, imgName, img) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE danhmuc SET tendm = '${name}', tenhinh = '${imgName}', hinh = '${img}' WHERE madm = '${categoryId}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else
                hamOK("Cập nhật thông tin danh mục thành công !");
        })
    });
}
    // Khoá danh mục:
exports.lock_category = async (categoryId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE danhmuc SET trangthai = 0 WHERE madm = '${categoryId}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else
                hamOK("Ẩn danh mục thành công !");
        })
    });
}
    // Mở khoá danh mục:
exports.unlock_category = async (categoryId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE danhmuc SET trangthai = 1 WHERE madm = '${categoryId}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else
                hamOK("Hiện danh mục thành công !");
        })
    });
}
    // Delete danh mục:
exports.delete_Category = async (madm) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql_type = `SELECT sanpham.masp, sanpham.tensp 
        FROM sanpham JOIN danhmuc 
        ON sanpham.madm = danhmuc.madm 
        WHERE sanpham.madm = '${madm}'`;
        db.query(sql_type, (error, result) => {
            if(error) { hamLoi(error); }
            else {
                if(result.length <= 0) { 
                    let sql = `DELETE FROM danhmuc WHERE madm='${madm}'`;
                    db.query(sql, (err, result) => {
                        if(err)
                            hamLoi(err);
                        else
                            hamOK(1);
                    }) 
                } else { hamOK(6); }
            }
        })
    });
};


            // LOẠI:
    // Danh sách loại sản phẩm:
exports.list_types = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = "SELECT * FROM loaisp";
        db.query(sql, (err, d) => {
            if(err) {
                hamLoi(err);
            } else {
                dataList = d;
                hamOK(dataList);
            }
        })
    })
}
    // Lọc sản phẩm theo tên loại:
exports.listByName = async (nameCat) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM loaisp WHERE maloai='${nameCat}'`;
        db.query(sql, (err, result) => {
            console.log('Get idCat by nameCat success');
            itemCat = result[0].maloai;
        })
        let sql2 = `SELECT * FROM sanpham WHERE maloai='${itemCat}'`;
        db.query(sql2, (err, result1) => {
            console.log('Get list product by id Cat success');
            dataListPro = result1;
            hamOK(dataListPro);
        })
        }
    )
}
    // Get loại theo id:
exports.get_Type_Id = async (typeId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM loaisp WHERE maloai='${typeId}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else {
                if(result.length <= 0){
                    hamOK(-1);
                } else {
                    hamOK(result[0]);
                }
            }
        })
    })
}
    // Get loại theo tên:
exports.get_Type_Name = async (name) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM loaisp WHERE tenloai='${name}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else {
                if(result.length <= 0){
                    hamOK(-1);
                } else {
                    hamOK(result[0]);
                }
            }
        })
    })
}
    // Get loại theo mã danh mục:
exports.get_Type_Catalog = async (madm) => {
    let data = [];
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM loaisp WHERE madm='${madm}'`;
        db.query(sql, (err, result) => {
            if(err)
                hamLoi(err);
            else{
                if(result.length <= 0){
                    hamOK(-1);
                }else{
                    data = result;
                    hamOK(data);
                }
            }
        })
    })
}
    // Thêm loại sản phẩm:
exports.insert_Type = (data) => {
    return new Promise( (resolve, reject) => {
        let sql = "INSERT INTO loaisp SET ?";
        db.query(sql, data, (err, result) => {
            if(err)
                reject(err);
            else{
                console.log('Insert type successfully');
                resolve("Thêm loại sản phẩm thành công !");    // trả về kết quả nếu promise hoàn thành.
            }
        })
    })
}
    // Cập nhật loại sản phẩm:
exports.update_Type = (maloai, ten, tenhinh, hinh, madm) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE loaisp SET tenloai = '${ten}', tenhinh = '${tenhinh}', hinh = '${hinh}', madm = '${madm}' WHERE maloai = '${maloai}'`;
        db.query(sql, (err, result) => {
            if(err)
                reject(err);
            else
                resolve("Cập nhật thông tin loại sản phẩm thành công !");
        })
    })
};
    // Ẩn loại sản phẩm:
exports.lock_Type = async (maloai) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE loaisp SET trangthai = 0 WHERE maloai = '${maloai}'`;
        db.query(sql, (err, result) => {
            if(err)
                reject(err);
            else
                resolve("Ẩn loại sản phẩm thành công !");
        })
    });
};
    // Hiện loại sản phẩm:
exports.unlock_Type = async (maloai) => {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE loaisp SET trangthai = 1 WHERE maloai = '${maloai}'`;
        db.query(sql, (err, result) => {
            if(err)
                reject(err);
            else
                resolve("Hiện loại sản phẩm thành công !");
        })
    });
}
    // Xoá loại sản phẩm:
exports.delete_Type = (typeId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql_type = `SELECT sanpham.masp, sanpham.tensp 
        FROM sanpham JOIN loaisp 
        ON sanpham.maloai = loaisp.maloai 
        WHERE sanpham.maloai = '${typeId}'`;
        db.query(sql_type, (err, result) => {
            if(err)
                hamLoi(err);
            else if(result.length <= 0) {
                console.log("Xoá được!");
                let sql = `DELETE FROM loaisp WHERE maloai='${typeId}'`;
                db.query(sql, (err, result) => {
                    console.log('Delete type success');
                    hamOK(1);
                })
            }else{
                console.log("Không xoá được!");
                hamOK(6);
            }
        })
    });
};