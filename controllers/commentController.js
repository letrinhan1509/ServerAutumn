const catchAsync = require('../utils/catchAsync');
const modelComment = require('../models/model_comment');


                    // COMMENT CONTROLLER

        // GET:
// GET List Comment
exports.getListComments = catchAsync(async (req, res, next) => {
    try {
        const listComments = await modelComment.list_Comments();
        return res.status(200).json({ status: "Success", listComments: listComments });
      } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    };
});
// GET Comment
exports.getComment = catchAsync(async (req, res, next) => {
    try {
        let idCmt = req.params.id;
        const comment = await modelComment.get_by_Id(idCmt);
        if(comment == -1)
            return res.status(400).json({ status: "Fail", message: "Không có bình luận nào !" });
        else
            return res.status(200).json({ status: "Success", comment: comment });
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Lỗi...!", error: error })
    };
});
// GET Comment Of Client
exports.getCommentClient = catchAsync(async (req, res, next) => {
    try {
        let idUser = req.params.id;
        let listCmt = await modelComment.get_by_userId(idUser);
        if(listCmt == -1)
            return res.status(400).json({ status: "Fail", message: "Không có bình luận nào !" });
        else
            return res.status(200).json({ status: "Success", listComment: listCmt });
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Lỗi...Không thể lấy danh sách bình luận!", error: error })
    };
});
// GET comment by product code
exports.getCommentByProduct = catchAsync(async (req, res, next) => {
    try {
        let idSpham = await req.params.idPro;
        let listCmt = await modelComment.get_by_productId(idSpham);
        if(listCmt == -1) {
            return res.status(200).json({ 
                status: "Success", 
                message: "Sản phẩm này không có bình luận nào !",
                listComment: []
            });
        } else {
            return res.status(200).json({ 
                status: "Success", 
                listComment: listCmt 
            });
        }
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Lỗi...!", error: error })
    };
});
// GET Detail A Comment
exports.getDetailComment = catchAsync(async (req, res, next) => {
    try {
        let idCmt = req.params.id;
        let listCmt = await modelComment.get_detailComment(idCmt);
        if(listCmt == -1) {
            return res.status(200).json({ 
                status: "Success", 
                message: "Không có chi tiết bình luận nào! Hoặc bình luận đó đã bị khoá" 
            });
        } else {
            return res.status(200).json({ 
                status: "Success", 
                listComment: listCmt 
            });
        }
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Lỗi...!", error: error })
    };
});


        // POST:
// Create Comment
exports.postComment = catchAsync(async (req, res, next) => {
    try {
        var today = new Date();
        var ngaybl = req.body.ngay;
        var ngay = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var gio = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let data = {
            masp: req.body.masp,
            makh: req.body.makh,
            noidung: req.body.content,
            ngaybl: ngay +' '+ gio,
            //ngaybl: ngaybl +' '+ gio
        };
        if(!data.masp || !data.makh || !data.noidung || !data.ngaybl) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" 
            });
        } else {
            let query = await modelComment.create_Comment(data);
            const listComments = await modelComment.list_Comments();
            return res.status(200).json({ 
                status: "Success", 
                message: query,
                listComments: listComments 
            });
        };
    } catch (error) {
        return res.status(400).json({ 
            status: "Fail", 
            message: "Something went wrong!", 
            error: error 
        });
    };
});
// Create Rep Comment
exports.postAdminReplyComment = catchAsync(async (req, res, next) => {
    try {
        var today = new Date();
        var ngay = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var gio = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const role = req.user.quyen;
        let data = {
            ten: req.body.tennv,
            noidung: req.body.noidung,
            ngaybl: ngay +' '+ gio,
            manv: req.body.manv,
            mabl: req.body.mabl
        };
        if(data.mabl == undefined || !data.ten || !data.noidung || !data.ngaybl || data.manv == undefined) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin phản hồi, vui lòng nhập đầy đủ thông tin để thêm phản hồi !" });
        };
        const cmtExist = await modelComment.get_by_Id(data.mabl);
        if(cmtExist == -1) {
            return res.status(400).json({ status: "Fail", message: "Không tìm thấy bình luận này, vui lòng kiểm tra lại để thêm phản hồi !" });
        } else {
            if(role === 'NVBH') {
                let query = await modelComment.create_AdminRepComment(data);
                const cmt = await modelComment.get_by_Id(data.mabl);
                return res.status(200).json({ status: "Success", message: query, comment: cmt });
            } else {
                return res.status(400).json({ status: "Fail", message: "Bạn không có quyền thêm phản hồi !" });
            }
        }
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong!", error: error });
    };
});


        // PUT:
// Edit Comment
exports.putEditCommnet = catchAsync(async (req, res, next) => {
    try {
        let mabl = req.body.mabl;
        let makh = req.user.makh;// Lấy makh từ token
        let noidung = req.body.noidung;
        if(mabl == undefined || makh == undefined || !noidung) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin, vui lòng kiểm tra lại thông tin !" });
        };
        const comment = await modelComment.get_by_Id(mabl);
        if(comment == -1) {
            return res.status(400).json({ status: "Fail", message: "Mã bình luận " + `${mabl}` + " này không tồn tại, vui lòng kiểm tra lại !" });
        } else {
            if(comment.makh === makh) {
                let query = await modelComment.update_Comment(mabl, noidung);
                const listComments = await modelComment.list_Comments();
                return res.status(200).json({ status: "Success", message: query, listComments: listComments });
            } else {
                return res.status(400).json({ status: "Fail", message: "Bạn không có quyền sửa bình luận này !" });
            };
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// Edit Reply Comment
exports.putAdminEditRepComment = catchAsync(async (req, res, next) => {
    try {
        let mact = req.body.mact;
        let mabl = req.body.mabl;
        let noidung = req.body.noidung;
        let manv = req.user.manv; // Lấy mã của admin từ token
        if(mact == undefined || manv == undefined || !noidung) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin bình luận, vui lòng kiểm tra lại thông tin !" });
        };
        const commentDetail = await modelComment.get_detailComment_Id(mact);
        if(commentDetail == -1) {
            return res.status(400).json({ status: "Fail", message: "Không tìm thấy bình luận này, vui lòng kiểm tra lại !" });
        } else {
            console.log(commentDetail);
            // Bình luận tồn tại:
            if(commentDetail.manv == manv && commentDetail.mabl == mabl) {
                let query = await modelComment.update_AdminRepComment(mact, noidung);
                const cmt = await modelComment.get_by_Id(mabl);
                return res.status(200).json({status: "Success", message: query, comment: cmt });
            } else {
                return res.status(400).json({ status: "Fail", message: "Bạn không có quyền sửa nội dung của bình luận này !" });
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: "Fail", 
            message: "Something went wrong",
            error: error
        });
    };
});
// Edit Comment Status Client
exports.putEditCommentStatus = catchAsync(async (req, res, next) => {
    try {
        let mabl = req.body.mabl;
        let trangthai = req.body.trangthai;
        console.log(req.body);
        // 1) Check null
        if(!mabl || trangthai == undefined) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Thiếu thông tin, vui lòng nhập đầy đủ thông tin !" 
            });
        };
        // 2) Check comment exists
        const comment = await modelComment.get_by_Id(mabl);
        if(comment == -1) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Mã bình luận " + `${mabl}` + " này không tồn tại, vui lòng kiểm tra lại !" 
            });
        };
        if(trangthai == 0) {
            let queryLock = await modelComment.lock_Comment(mabl);
            return res.status(200).json({ 
                status: "Success", 
                message: queryLock 
            });
        } else if(trangthai == 1) {
            let queryUnlock = await modelComment.unlock_Comment(mabl);
            return res.status(200).json({ 
                status: "Success", 
                message: queryUnlock 
            });
        } else
            return res.status(400).json({ 
                status: "Fail", 
                message: "Lỗi...! Cập nhật trạng thái bình luận không thành công !" 
            }); 
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong!", error: error });
    };
});


        // DELETE:
// Xoá bình luận (cha)
exports.deleteComment = catchAsync(async (req, res, next) => {
    try {
        let mabl = req.params.id;
        const makh = req.user.makh;
        if(mabl == undefined) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin, xoá bình luận thất bại !" });
        };
        const cmtExist = await modelComment.get_by_Id(mabl);
        if(cmtExist == -1) {
            return res.status(400).json({ status: "Fail", message: "Không tìm thấy bình luận này, vui lòng kiểm tra lại !" });
        } else {
            if(cmtExist.makh === makh) {
                let query = await modelComment.delete_Comment(mabl);
                const listComments = await modelComment.list_Comments();
                return res.status(200).json({ status: "Success", message: query, listComments: listComments });
            } else {
                return res.status(400).json({ status: "Fail", message: "Bạn không có quyền xoá bình luận này !" });
            }
        }
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong!", error: error });
    };
});
// Xoá 1 chi tiết bình luận (con)
exports.deleteAdminRepComment = catchAsync(async (req, res, next) => {
    try {
        let mact = req.params.id;
        const manv = req.user.manv; // Lấy mã của admin từ token 
        if(mact == undefined) {
            return res.status(400).json({ status: "Fail", message: "Thiếu thông tin, xoá bình luận thất bại !" });
        };
        const cmtExist = await modelComment.get_detailComment_Id(mact);
        if(cmtExist == -1) {
            return res.status(400).json({ status: "Fail", message: "Không tìm thấy bình luận này, vui lòng kiểm tra lại !" });
        } else {
            if(cmtExist.manv === manv) {
                var mabl = cmtExist.mabl;
                let query = await modelComment.delete_AdminRepComment(mact);
                const cmt = await modelComment.get_by_Id(mabl);
                return res.status(200).json({ status: "Success", message: query, comment: cmt });
            } else {
                return res.status(400).json({ status: "Fail", message: "Bạn không có quyền xoá bình luận này !" });
            }
        }
    } catch (error) {
        return res.status(400).json({ status: "Fail", message: "Something went wrong !", error: error });
    }
});