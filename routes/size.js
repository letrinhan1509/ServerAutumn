var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController')
const sizeController = require('../controllers/sizeController');


            // API SIZE:
router
    .route("/")
    .get(authController.isLoggedIn, sizeController.getListSize)
    .post(authController.isLoggedIn, authController.restrictTo, sizeController.postCreateSize)
    .put(authController.isLoggedIn, authController.restrictTo, sizeController.putEditSize);

router
    .route("/:id")
    .get(authController.isLoggedIn, authController.restrictTo, sizeController.getSize)
    .delete(authController.isLoggedIn, authController.restrictTo, sizeController.deleteSize);

router.post("/check-size", sizeController.postCheckSize);


module.exports = router;