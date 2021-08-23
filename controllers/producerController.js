const catchAsync = require('../utils/catchAsync');
const modelProducer = require('../models/model_producer');


                    // PRODUCER CONTROLLER

        // GET
// GET: 
exports.getListProducers = catchAsync(async (req, res, next) => {
    try {
        let listProducers = await modelProducer.list_producers();
        return res.status(200).json({ 
            status: "Success", 
            data: listProducers
        });
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    }
});
// GET: 
exports.getProducer = catchAsync(async (req, res, next) => {
    try {
        let producerId = req.params.id;
        if(!producerId) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu mã nhà sản xuất, vui lòng kiểm tra lại !"
            });
        };
        const producerExist = await modelProducer.get_By_Id(producerId);
        if(producerExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy nhà sản xuất này, vui lòng kiểm tra lại !"
            });
        } else {
            return res.status(200).json({ 
                status: "Success", 
                data: producerExist
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


        // POST
// Post: Create producer
exports.postProducer = catchAsync(async (req, res, next) => {
    try {
        let data = {
            mansx: req.body.mansx,
            tennsx: req.body.tennsx,
            xuatxu: req.body.xuatxu
        }
        if(!data.mansx || !data.tennsx || !data.xuatxu) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin nhà sản xuất, vui lòng kiểm tra lại !"
            });
        };
        const producerExist = await modelProducer.get_By_Id(data.mansx);
        if(producerExist == -1) {
            const nameExist = await modelProducer.get_By_Name(data.tennsx);
            if(nameExist == -1) {
                let query = await modelProducer.insert(data);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query
                });
            } else {
                // Trùng tên nhà sản xuất
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Trùng tên nhà sản xuất, vui lòng nhập tên khác !"
                });
            }
        } else {
            // Trùng mã nhà sản xuất
            return res.status(400).json({ 
                status: "Fail", 
                message: "Trùng mã nhà sản xuất, vui lòng nhập mã khác !"
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


        // PUT
// Put: 
exports.putEditProducer = catchAsync(async (req, res, next) => {
    try {
        let producerId = req.body.mansx;
        let name = req.body.tennsx;
        let origin = req.body.xuatxu;
        if(!producerId || !name || !origin) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin nhà sản xuất, vui lòng kiểm tra lại !"
            });
        };
        const producerExist = await modelProducer.get_By_Id(producerId);
        if(producerExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy nhà sản xuất này, vui lòng kiểm tra lại !"
            });
        } else {
            const nameExist = await modelProducer.get_By_Name(name);
            if(nameExist == -1 || producerId == nameExist.mansx) {
                let query = await modelProducer.update(producerId, name, origin);
                return res.status(200).json({ 
                    status: "Success", 
                    message: query
                });
            } else {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Trùng tên nhà sản xuất, vui lòng nhập tên khác !"
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
// Put: 
exports.putEditStatus = catchAsync(async (req, res, next) => {
    try {
        let mansx = req.body.mansx;
        let trangthai = req.body.trangthai;
        if(!mansx || trangthai == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng kiểm tra lại !" 
            });
        };
        const producerExist = await modelProducer.get_By_Id(mansx);
        if(producerExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy nhà sản xuất này, vui lòng kiểm tra lại !"
            });
        } else {
            if(trangthai == 1) {
                let queryUnlock = await modelProducer.unlock(mansx);
                return res.status(200).json({ 
                    status: "Success", 
                    message: queryUnlock 
                });
            } else if (trangthai == 0) {
                let queryLock = await modelProducer.lock(mansx);
                return res.status(200).json({ 
                    status: "Success", 
                    message: queryLock 
                });
            } else {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Thiếu thông tin cập nhật trạng thái nhà sản xuất !" 
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


        // DELETE
// Delete producer
exports.deleteProducer = catchAsync(async (req, res, next) => {
    try {
        let producerId = req.params.id;
        if(!producerId) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu mã nhà sản xuất, vui lòng kiểm tra lại !"
            });
        };
        const producerExist = await modelProducer.get_By_Id(producerId);
        if(producerExist == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Không tìm thấy nhà sản xuất này, vui lòng kiểm tra lại !"
            });
        } else {
            let queryDelete = await modelProducer.delete(producerId);
            if(queryDelete == 6) {
                return res.status(400).json({ 
                    status: "Fail", 
                    message: "Có ràng buộc khoá ngoại. Không thể xoá nhà sản xuất này !"
                });
            };
            if(queryDelete == 1) {
                const listProducers = await modelProducer.list_producers();
                return res.status(200).json({ 
                    status: "Success", 
                    message: "Xoá nhà sản xuất thành công !", 
                    listProducers: listProducers
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