var express = require('express');
var router = express.Router();
const catalogController = require('../controllers/catalogController');

            // API CATALOG
router
      .route("/")
      .get(catalogController.getListCategorys)  // Danh sách danh mục sản phẩm
      .post(catalogController.postCategory)     // Thêm danh mục
      .put(catalogController.putEditCategory);  // Cập nhật danh mục

router
      .route("/loai")
      .get(catalogController.getListTypes)      // Danh sách loại sản phẩm
      .post(catalogController.postType)   // Thêm loại
      .put(catalogController.putEditType) // Cập nhật loại

router
      .route("/:id")
      .get(catalogController.getCategory)       // Chi tiết 1 danh mục theo mã danh mục
      .delete(catalogController.deleteCategory) // Xoá danh mục sản phẩm

router
      .route("/loai/:id")
      .get(catalogController.getType)     // Chi tiết 1 loại theo mã loại
      .delete(catalogController.deleteType)     // Xoá loại sản phẩm

router.get('/:id/loai', catalogController.getTypeCategory); // Tất cả loại theo mã danh mục.

//router.post('/them', catalogController.postCategory);    // Thêm danh mục
//router.put('/cap-nhat', catalogController.putEditCategory);    // Cập nhật danh mục

router.put('/cap-nhat-trang-thai', catalogController.putEditCategoryStatus);  // Cập nhật trạng thái danh mục
router.put('/cap-nhat-trang-thai-loai', catalogController.putEditTypeStatus); // Cập nhật trạng thái loại   


module.exports = router;