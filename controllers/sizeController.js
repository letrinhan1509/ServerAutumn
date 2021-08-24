const catchAsync = require('../utils/catchAsync');
const modelSize = require('../models/model_size');


                    // SIZE CONTROLLER

// GET: Danh sách tất cả size
exports.getListSize = catchAsync(async(req, res, next) => {
    try {
        let listSize = await modelSize.list_Size();
        return res.status(200).json({ 
            status: "Success", 
            message: "Lấy danh sách size quần áo thành công", 
            listSize: listSize
        });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// GET: Lấy chi tiết 1 size
exports.getSize = catchAsync(async(req, res, next) => {
    try {
        let masize = req.params.id;
        const size = await modelSize.get_Size(masize);
        return res.status(200).json({ 
            status: "Success",  
            size: size
        });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// Post: Create size
exports.postCreateSize = catchAsync(async (req, res, next) => {
    try {
        let body = req.body;
        if(!body.size || !body.gioitinh || body.cannangtu == undefined || body.cannangden == undefined || body.chieucaotu == undefined || body.chieucaoden == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        let data = {
            size: body.size,
            gioitinh: body.gioitinh,
            cannangtu: body.cannangtu,
            cannangden: body.cannangden,
            chieucaotu: body.chieucaotu,
            chieucaoden: body.chieucaoden
        };
        const sizeExist = await modelSize.check_Size_Exist(data.size, data.gioitinh);
        if(sizeExist == -1) {
            const size = await modelSize.insert_Size(data);
            const listSize = await modelSize.list_Size();
            return res.status(200).json({ 
                status: "Success", 
                message: size,
                listSize: listSize
            });
        } else {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Mã size và giới tính này đã tồn tại, vui lòng kiểm tra lại !"
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
// Post: Check size
exports.postCheckSize = catchAsync(async (req, res, next) => {
    try {
        let gioitinh = req.body.gioitinh;
        let cannang = req.body.cannang;
        let chieucao = req.body.chieucao;
        console.log(req.body);
        if(!gioitinh || cannang == undefined || chieucao == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu số cân nặng hoặc chiều cao, vui lòng kiểm tra lại !"
            });
        };
        if(gioitinh === 'Nữ') {
            gioitinh = "Nữ";
        }
        const size = await modelSize.check_Size(gioitinh);
        size.some(element => {
            if(chieucao <= element.chieucaoden && cannang <= element.cannangden) {
                return res.status(200).json({ 
                    status: "Success", 
                    message: "Bạn cao "+`${chieucao}`+" cm, Cân nặng "+`${cannang}`+" kg, Size "+`${element.size}`+" phù hợp nhất với bạn.",
                    size: element
                });
            } else if(chieucao <= element.chieucaoden) {
                if(cannang <= element.cannangden) {
                    return res.status(200).json({ 
                        status: "Success", 
                        message: "Bạn cao "+`${chieucao}`+" cm, Cân nặng "+`${cannang}`+" kg, Size "+`${element.size}`+" phù hợp nhất với bạn.",
                        size: element
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// Put: Adjust the size of clothes
exports.putEditSize = catchAsync(async (req, res, next) => {
    try {
        let body = req.body;
        if(body.masize == undefined || !body.size || !body.gioitinh || body.cannangtu == undefined || body.cannangden == undefined || body.chieucaotu == undefined || body.chieucaoden == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        let data = {
            masize: body.masize,
            /* size: body.size,
            gioitinh: body.gioitinh, */
            cannangtu: body.cannangtu,
            cannangden: body.cannangden,
            chieucaotu: body.chieucaotu,
            chieucaoden: body.chieucaoden
        };
        const sizeExist = await modelSize.get_Size(data.masize);
        if(sizeExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy mã size quần áo này, vui lòng kiểm tra lại !"
            });
        } else {
            const size = await modelSize.update_Size(data);
            const listSize = await modelSize.list_Size();
            return res.status(200).json({ 
                status: "Success", 
                message: size,
                listSize: listSize
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
// Delete: 
exports.deleteSize = catchAsync(async (req, res, next) => {
    try {
        let masize = req.params.id;
        if(masize == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !"
            });
        };
        const sizeExist = await modelSize.get_Size(masize);
        if(sizeExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy mã size này, vui lòng kiểm tra lại !"
            });
        } else {
            const size = await modelSize.delete_Size(masize);
            if(size == 1) {
                const listSize = await modelSize.list_Size();
                return res.status(200).json({ 
                    status: "Success", 
                    message: "Xoá size quần áo thành công !",
                    listSize: listSize
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