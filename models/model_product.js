var db = require('./database'); //nhúng model database vào đế kết nối db
var dataList=[]; // biến để chứa dữ liệu đổ về cho controller
var dataName = [];

// định nghĩa các hàm để tương tác vào mysql

    // Danh sách tất cả sản phẩm:
exports.list_products = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT SP.masp, SP.tensp, SP.gia, SP.chitiet, SP.tenhinh, SP.hinh, DATE_FORMAT(SP.ngaytao, '%e-%c-%Y') as ngaytao, 
        SP.trangthai, SP.mansx, nhasx.tennsx, SP.maloai, loaisp.tenloai, SP.madm, danhmuc.tendm
        FROM (((sanpham AS SP JOIN danhmuc ON SP.madm = danhmuc.madm) JOIN loaisp ON SP.maloai = loaisp.maloai)
        JOIN nhasx ON SP.mansx = nhasx.mansx)`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                hamOK(result);
            }
        })
    })
}
    // Check code:
exports.check_Code = async (code) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM sanpham WHERE code='${code}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length <= 0){
                    // Không tồn tại
                    hamOK(-1);
                } else{
                    hamOK(result);
                }
            }
        })
    })
};
    // Chi tiết 1 sản phẩm theo ID:
exports.get_By_Id = async (productId) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT SP.masp, SP.tensp, SP.gia, SP.chitiet, SP.tenhinh, SP.hinh, SP.tenhinhct, SP.hinhchitiet, SP.mota, 
        ngaytao, SP.trangthai, SP.mansx, nhasx.tennsx, SP.maloai, loaisp.tenloai, SP.madm, danhmuc.tendm
        FROM (((sanpham AS SP JOIN danhmuc ON SP.madm = danhmuc.madm) JOIN loaisp ON SP.maloai = loaisp.maloai)
        JOIN nhasx ON SP.mansx = nhasx.mansx) WHERE SP.masp='${productId}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length <= 0){
                    hamOK(-1);
                } else{
                    hamOK(result[0]);
                }
            }
        })
    })
};
    // Sản phẩm mới nhất
exports.newProduct = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT SP.masp, SP.tensp, SP.gia, SP.chitiet, SP.tenhinh, SP.hinh, DATE_FORMAT(SP.ngaytao, '%e-%c-%Y') as ngaytao, 
        SP.trangthai, SP.mansx, nhasx.tennsx, SP.maloai, loaisp.tenloai, SP.madm, danhmuc.tendm
        FROM (((sanpham AS SP JOIN danhmuc ON SP.madm = danhmuc.madm) JOIN loaisp ON SP.maloai = loaisp.maloai)
        JOIN nhasx ON SP.mansx = nhasx.mansx) ORDER BY ngaytao DESC LIMIT 4`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                hamOK(result);
            }
        })
    })
}
    // Lọc danh sách sản phẩm theo danh mục:
exports.get_by_category = async (madm) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT SP.masp, SP.tensp, SP.gia, SP.chitiet, SP.tenhinh, SP.hinh, DATE_FORMAT(SP.ngaytao, '%e-%c-%Y') as ngaytao, 
        SP.trangthai, SP.mansx, nhasx.tennsx, SP.maloai, loaisp.tenloai, SP.madm, danhmuc.tendm
        FROM (((sanpham AS SP JOIN danhmuc ON SP.madm = danhmuc.madm) JOIN loaisp ON SP.maloai = loaisp.maloai)
        JOIN nhasx ON SP.mansx = nhasx.mansx) WHERE SP.madm='${madm}' AND SP.trangthai = 1`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                console.log('List success');
                hamOK(result);
            }
        })
    })
}
    // Lọc danh sách sản phẩm theo loại:
exports.get_by_type = async (maloai) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT SP.masp, SP.tensp, SP.gia, SP.chitiet, SP.tenhinh, SP.hinh, DATE_FORMAT(SP.ngaytao, '%e-%c-%Y') as ngaytao, 
        SP.trangthai, SP.mansx, nhasx.tennsx, SP.maloai, loaisp.tenloai, SP.madm, danhmuc.tendm
        FROM (((sanpham AS SP JOIN danhmuc ON SP.madm = danhmuc.madm) JOIN loaisp ON SP.maloai = loaisp.maloai)
        JOIN nhasx ON SP.mansx = nhasx.mansx) WHERE SP.maloai='${maloai}' AND SP.trangthai = 1`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                console.log('List success');
                hamOK(result);
            }
        })
    })
}
    // Lọc danh sách sản phẩm theo nhà sản xuất:
exports.get_by_producer = async (mansx) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT SP.masp, SP.tensp, SP.gia, SP.chitiet, SP.tenhinh, SP.hinh, DATE_FORMAT(SP.ngaytao, '%e-%c-%Y') as ngaytao, 
        SP.trangthai, SP.mansx, nhasx.tennsx, SP.maloai, loaisp.tenloai, SP.madm, danhmuc.tendm
        FROM (((sanpham AS SP JOIN danhmuc ON SP.madm = danhmuc.madm) JOIN loaisp ON SP.maloai = loaisp.maloai)
        JOIN nhasx ON SP.mansx = nhasx.mansx) WHERE SP.mansx='${mansx}' AND SP.trangthai = 1`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                console.log('List success');
                hamOK(result);
            }
        })
    })
}
    // Lọc sản phẩm theo tên:
exports.get_By_productName = async (name) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM sanpham WHERE tensp='${name}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                if(result.length <= 0){
                    // Không tồn tại
                    hamOK(-1);
                } else{
                    hamOK(result);
                }
            }
        })
    })
};
    // Chi tiết sản phẩm theo tên:
exports.detailByName = async (name) => {
    return new Promise( (hamOK, hamLoi) => {
            let filterProduct;
            let sql = `SELECT * FROM sanpham`;
            let query = db.query(sql, (err, d) => {
                console.log('Detail success');
                dataName = d;
                for( i in dataName) {
                    let product = dataName[i];
                    //let newName = replaceNameProduct(product.tensp);
                    let newName = product.tensp;
                    if(newName == name) {
                        filterProduct = product;
                    }
                }
                hamOK(filterProduct);
            })     
    })
}
    // Thêm sản phẩm:
exports.create_product = (data) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = "INSERT INTO sanpham SET ?";
        let query = db.query(sql, data, (err, result) => {
            if(err) { hamLoi(err); }
            else { hamOK(1); }
        });
    });
}
    // Sửa sản phẩm:
exports.update_product = (masp, tensp, gia, chitiet, tenhinh, hinh, hinhchitiet, mota, trangthai, mansx, maloai, madm) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE sanpham SET   
        tensp='${tensp}', 
        gia='${gia}', 
        chitiet='${chitiet}', 
        tenhinh='${tenhinh}', 
        hinh='${hinh}',
        hinhchitiet='${hinhchitiet}',
        mota='${mota}',
        trangthai='${trangthai}',
        mansx='${mansx}',
        maloai='${maloai}',
        madm='${madm}'
        WHERE masp='${masp}'`;
        let query = db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            }else{
                hamOK(1);
            }
        });
    });
};
// Cập nhật số lượng sản phẩm:
exports.update_amount = (masp, chitiet) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE sanpham SET chitiet = '${chitiet}' WHERE masp = '${masp}'`;
        db.query(sql, (err, result) => {
            if(err){ hamLoi(err); } 
            else { 
                hamOK("Cập nhật chi tiết số lượng thành công !"); 
            }
        })
    })
}
// Cập nhật số lượng sản phẩm:
exports.update_amount_test = (masp, cart) => {
    const data = [];
    return new Promise( (hamOK, hamLoi) => {
        let sql = `SELECT * FROM sanpham WHERE masp = '${masp}'`;
        db.query(sql, (err, result) => {
            if(err){
                hamLoi(err);
            } else {
                var chitiet = JSON.parse(result[0].chitiet);
                chitiet.forEach(element => {
                    if(element.size == "S" && element.mau == "trắng") {
                        element.soluong = element.soluong - 1;
                    }
                });
                result[0].chitiet = JSON.stringify(chitiet);
                let sql_update = `UPDATE sanpham SET chitiet = '${result[0].chitiet}' WHERE masp = '${masp}'`;
                db.query(sql_update, (error, result1) => {
                    if(error){
                        hamLoi(error);
                    } else {
                        hamOK(result[0]);
                    }
                })  
            }
        })
    })
}
    // Khoá sản phẩm: (Ẩn sản phẩm )
exports.lock_product = (masp) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE sanpham SET trangthai = 0 WHERE masp = '${masp}'`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                console.log('Lock product success');
                hamOK(result);
            }
        })
    })
}
    // Mở khoá sản phẩm:
exports.unlock_product = (masp) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = `UPDATE sanpham SET trangthai = 1 WHERE masp = '${masp}'`;
        db.query(sql, (err, result) => {
            if(err) {
                hamLoi(err);
            } else {
                console.log('Unlock product success');
                hamOK(result);
            }
        })
    })
}
    // Xoá sản phẩm:
exports.delete = (masp) => {
    return new Promise( (hamOK, hamLoi) => {
        let sql_donhang = `SELECT * FROM chitietdh WHERE masp='${masp}'`;
        let query = db.query(sql_donhang, (error, result) => {
            if(error) { hamLoi(error); }
            else {
                if(result.length > 0) {
                    hamOK(-1);  // Có sản phẩm trong chi tiết đơn hàng nên ko thể xoá;
                } else {
                    let sql_sp = `DELETE FROM sanpham WHERE masp='${masp}'`;
                    let query1 = db.query(sql_sp, (err, result1) => {
                        if(err) { hamLoi(err); }
                        else { hamOK(1); }
                    });
                }
            }
        });
    });
}


exports.hotProduct = async () => {
    return new Promise( (hamOK, hamLoi) => {
        let sql = "SELECT * FROM product WHERE views > 0 ORDER BY views DESC LIMIT 5";
        db.query(sql, (err, d) => {
            console.log('List success');
            dataList = d;
            hamOK(dataList);
        })
        }
    )
}



function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "i");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
    str = str.replace(/Đ/g, "d");
    //str = str.split(' ').join('-');
    return str;
  }
  
  function replaceNameProduct(nameProduct) {
    var newNameProduct = xoa_dau(nameProduct);
    return newNameProduct;
  }