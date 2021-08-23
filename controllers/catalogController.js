const catchAsync = require('../utils/catchAsync');
const modelCatalog = require('../models/model_catalog');


                    // CATALOG CONTROLLER
         
        // GET:
// GET List Category
exports.getListCategorys = catchAsync(async (req, res, next) => {
    try {
        let listCategorys = await modelCatalog.list_Categorys();
        return res.status(200).json({ 
            status: "Success", 
            listCategorys: listCategorys 
        });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong", 
            error: error 
        });
    };
});
// GET List Type
exports.getListTypes = catchAsync(async (req, res, next) => {
    try {
        let listTypes = await modelCatalog.list_types();
        return res.status(200).json({ status: "Success", data: listTypes });
      } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong!", error: error })
    };
});
// GET Category
exports.getCategory = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        let category = await modelCatalog.get_Category_Id(id);
        if (category == -1) {
            return res.status(400).json({ status: "Fail", message: "Mã danh mục " + `${id}` + " này không tồn tại !" });
        } else
            return res.status(200).json({ status: "Success", data: category });
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong!", error: error });
    };
});
// GET Type
exports.getType = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        let type = await modelCatalog.get_Type_Id(id);
        if (type == -1) {
            return res.status(400).json({ status: "Fail", message: "Mã loại " + `${id}` + " này không tồn tại !" });
        } else
            return res.status(200).json({ status: "Success", data: type });
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong!", error: error });
    };
});
// GET Type By Category Code
exports.getTypeCategory = catchAsync(async (req, res, next) => {
    let madm = req.params.id;
    if(!madm){
        return res.status(400).json({ status: "Fail", message: "Vui lòng cung cấp mã danh mục !" });
    }
    try {
        let type = await modelCatalog.get_Type_Catalog(madm);
        if (type == -1) {
            return res.status(400).json({ status: "Fail", message: "Không tìm thấy loại sản phẩm thuộc danh mục này !" });
        } else
            return res.status(200).json({ status: "Success", data: type });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        })
    };
});


        // POST:
// Thêm danh mục sản phẩm
exports.postCategory = catchAsync(async (req, res, next) => {
    try {   
        let data = {
            madm: req.body.madm,
            tendm: req.body.tendm,
            tenhinh: req.body.imageName,
            hinh: req.body.img
        };
        if(!data.madm || !data.tendm || !data.tenhinh || !data.hinh) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" });
        };
        const categoryCode = await modelCatalog.get_Category_Id(data.madm);
        if(categoryCode == -1) {
            const categoryName = await modelCatalog.get_Category_Name(data.tendm);
            if(categoryName == -1) {
                let query = await modelCatalog.insert_category(data);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query 
                });
            } else {
                // Trùng tên danh mục
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Trùng tên danh mục, vui lòng nhập tên khác !" 
                });
            }
        } else {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Mã danh mục " + `${data.madm}` + " này đã tồn tại, vui lòng nhập mã khác !" 
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// Thêm loại sản phẩm
exports.postType = catchAsync(async (req, res, next) => {
    try {
        let data = {
            maloai: req.body.maloai,
            tenloai: req.body.tenloai,
            tenhinh: req.body.imgName,
            hinh: req.body.img, 
            madm: req.body.madm
        };
        if(!data.maloai || !data.tenloai || !data.tenhinh || !data.hinh || !data.madm) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" });
        };
        const typeCode = await modelCatalog.get_Type_Id(data.maloai);
        if(typeCode == -1) {
            const typeName = await modelCatalog.get_Type_Name(data.tenloai);
            if(typeName == -1) {
                let query = await modelCatalog.insert_Type(data);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query 
                });
            } else {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Trùng tên loại, vui lòng nhập tên khác !" 
                });
            }
        } else {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Mã loại " + `${data.maloai}` + " này đã tồn tại, vui lòng nhập mã khác !" 
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    };
});


        // PUT:
// Cập nhật danh mục sản phẩm
exports.putEditCategory = catchAsync(async (req, res, next) => {
    try {
        let madm = req.body.madm;
        let tendm = req.body.tendm;
        let tenhinh = req.body.imgName;
        let hinh = req.body.img;
        if(!madm || !tendm || !tenhinh || !hinh) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" 
            });
        };
        const categoryExist = await modelCatalog.get_Category_Id(madm);
        if(categoryExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy danh mục này, vui lòng kiểm tra lại !" 
            });
        } else {
            const CategoryName = await modelCatalog.get_Category_Name(tendm);
            if(CategoryName == -1 || madm === CategoryName.madm) {
                let query = await modelCatalog.update_category(madm, tendm, tenhinh, hinh);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query 
                });
            } else {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Trùng tên danh mục, vui lòng nhập tên khác !" 
                });
            }   
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// Cập nhật loại sản phẩm
exports.putEditType = catchAsync(async (req, res, next) => {
    try {
        let maloai = req.body.maloai;
        let ten = req.body.tenloai;
        let madm = req.body.madm;
        let tenhinh = req.body.imgName;
        let hinh = req.body.img;
        if(!maloai || !ten || !tenhinh || !hinh || !madm) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" 
            });
        };
        const typeExist = await modelCatalog.get_Type_Id(maloai);
        if(typeExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy loại sản phẩm này, vui lòng kiểm tra lại !" 
            });
        } else {
            const typeName = await modelCatalog.get_Type_Name(ten);
            if(typeName == -1 || maloai === typeName.maloai) {
                let query = await modelCatalog.update_Type(maloai, ten, tenhinh, hinh, madm);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query 
                }); 
            } else {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Trùng tên loại, vui lòng nhập tên khác !" 
                });
            }
        }
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    };
});
// Cập nhật trạng thái danh mục
exports.putEditCategoryStatus = catchAsync(async (req, res, next) => {
    try {
        let madm = req.body.madm;
        let trangthai = req.body.trangthai;
        if(!madm || trangthai == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" 
            });
        };
        if(trangthai == 1) {
            let queryUnlock = await modelCatalog.unlock_category(madm);
            return res.status(200).json({ 
                status: "Success", 
                message: queryUnlock 
            });
        } else if(trangthai == 0) {
            let queryLock = await modelCatalog.lock_category(madm);
            return res.status(200).json({ 
                status: "Success", 
                message: queryLock 
            });
        } else
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin cập nhật trạng thái danh mục !" });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    };
});
// Cập nhật trạng thái loại sản phẩm
exports.putEditTypeStatus = catchAsync(async (req, res, next) => {
    try {
        let maloai = req.body.maloai;
        let trangthai = req.body.trangthai;

        if(!maloai || trangthai == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" 
            });
        };
        if(trangthai == 1) {
            let queryUnlock = await modelCatalog.unlock_Type(maloai);
            return res.status(200).json({ status: "Success", message: queryUnlock });
        } else if(trangthai == 0) {
            let queryLock = await modelCatalog.lock_Type(maloai);
            return res.status(200).json({ status: "Success", message: queryLock });
        } else
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin cập nhật trạng thái loại !" });
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong!", error: error })
    };
});


        // DELETE:
// Xoá danh mục sản phẩm
exports.deleteCategory = catchAsync(async (req, res, next) => {
    try {
        let madm = req.params.id;
        if(!madm) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !" 
            });
        };
        let categoryExist = await modelCatalog.get_Category_Id(madm);
        if(categoryExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Mã danh mục " + `${madm}` + " này không tồn tại, vui lòng kiểm tra lại !" 
            });
        };
        let query = await modelCatalog.delete_Category(madm);
        if(query == 6) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Danh mục này đã có sản phẩm, tạm thời không thể xoá !" 
            });
        };
        if(query == 1) {
            const listCategorys = await modelCatalog.list_Categorys();
            return res.status(200).json({ 
                status: "Success", 
                message: "Xoá danh mục sản phẩm thành công !", 
                listCategorys: listCategorys
            });
        }; 
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// Xoá loại sản phẩm
exports.deleteType = catchAsync(async (req, res, next) => {
    try {
        let maloai = req.params.id;
        if(!maloai) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin !" 
            });
        };
        let query = await modelCatalog.delete_Type(maloai);
        if(query == 6) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Loại này đã có sản phẩm, tạm thời không thể xoá !" 
            });
        };
        if(query == 1) {
            const listTypes = await modelCatalog.list_types(); 
            return res.status(200).json({ 
                status: "Success", 
                message: "Xoá loại sản phẩm thành công !", 
                listTypes: listTypes
            });
        };
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});