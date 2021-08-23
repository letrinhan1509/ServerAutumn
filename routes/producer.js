var express = require('express');
var router = express.Router();
const producerController = require('../controllers/producerController');


            // API PRODUCER (TRADEMARK)
router
    .route("/")
    .get(producerController.getListProducers)   // Danh sách tất cả nhà sản xuất
    .post(producerController.postProducer)      // Thêm nhà sản xuất
    .put(producerController.putEditProducer);   // Cập nhật thông tin nhà sản xuất
 
router
    .route("/:id")
    .get(producerController.getProducer) // Nhà sản xuất theo id
    .delete(producerController.deleteProducer); // Xoá nhà sản xuất theo id

router.put("/cap-nhat-trang-thai", producerController.putEditStatus); // Cập nhật trạng thái nhà sản xuất


module.exports = router;