const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');


                // API COMMENT
router
        .route("/")
        .get(commentController.getListComments) // Danh sách các bình luận
        .post(authController.isLoggedInUser, commentController.postComment)    // Tạo bình luận
        .put(authController.isLoggedInUser, commentController.putEditCommnet)  // Chỉnh sửa bình luận

router
        .route("/:id")
        .get(commentController.getComment)      // Chi tiết 1 bình luận
        .delete(authController.isLoggedInUser, commentController.deleteComment)// Xoá bình luận

router.get('/:id/chi-tiet-bluan', commentController.getDetailComment);  // Danh sách chi tiết 1 bình luận theo mã bình luận
router.get('/khach-hang/:id', commentController.getCommentClient);      // Danh sách bình luận theo mã khách hàng
router.get('/san-pham/:idPro', commentController.getCommentByProduct);  // Danh sách bình luận theo mã sản phẩm
        // POST
router.post('/tra-loi/admin', authController.isLoggedIn, commentController.postAdminReplyComment); // Admin: Thêm Rep Comment
        // PUT    
router.put('/cap-nhat-tra-loi/admin', authController.isLoggedIn, commentController.putAdminEditRepComment); // Admin: Chỉnh sửa chi tiết bình luận
router.put('/cap-nhat-trang-thai', authController.isLoggedIn, commentController.putEditCommentStatus); // Cập nhật trạng thái bình luận
        // DELETE
router.delete('/xoa-tra-loi/admin/:id', authController.isLoggedIn, commentController.deleteAdminRepComment);  // Admin: Xoá chi tiết bình luận
    

module.exports = router;