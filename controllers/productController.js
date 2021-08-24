const catchAsync = require("../utils/catchAsync");
const modelProduct = require("../models/model_product"); //nhúng model products vào controller này để sử dụng
const modelComment = require("../models/model_comment");
const modelCatalog = require("../models/model_catalog");
const modelProducer = require("../models/model_producer");
const modelDiscount = require("../models/model_discount");
const modelOrder = require('../models/model_order');
const { sendmail } = require('../mail');
const e = require("express");
const { json } = require("body-parser");


// PRODUCT CONTROLLER

// GET
// GET: List products
exports.getListProducts = catchAsync(async (req, res, next) => {
  try {
    let listProducts = await modelProduct.list_products();
    return res.status(200).json({
      status: "Success",
      data: listProducts,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});
// GET: New product
exports.getNewProduct = catchAsync(async (req, res, next) => {
  try {
    let newProduct = await modelProduct.newProduct();
    return res.status(200).json({
      status: "Success",
      listProducts: newProduct,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});

exports.getProduct = catchAsync(async (req, res, next) => {
  try {
    let masp = req.params.id;
    if (!masp) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu mã sản phẩm, vui lòng kiểm tra lại !",
      });
    }
    var today = new Date();
    const productExist = await modelProduct.get_By_Id(masp);
    //const productExist = await modelProduct.update_amount_test(masp);

    /* var ngaytao = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        console.log(ngaytao);
        console.log(productExist.ngaytao);
        if(productExist.ngaytao === '23-7-2021') {
            console.log("ok");
        } */

    //console.log(productExist.chitiet);
    /* var chitiet = JSON.parse(productExist.chitiet);
        console.log(chitiet);
        chitiet.forEach(element => {
            //console.log(element.size);
            temp.forEach(e => {
                if(element.size === e.size && element.mau === e.mau) {
                    console.log(element.soluong);
                    element.soluong = element.soluong - e.soluong;
                }
            });
            if(element.size == 'S' && element.mau === "đen") {
                console.log(element.soluong);
                element.soluong = element.soluong - 1;
            }
        });
        console.log(chitiet); */

    /* const khuyenmai = await modelDiscount.get_By_discountId();
    const sale = {}; */
    if (productExist == -1) {
      return res.status(400).json({
        status: "Fail",
        message: "Không tìm thấy sản phẩm này, vui lòng kiểm tra lại !",
      });
    } else {
      const listCmts = await modelComment.get_by_productId(masp);
      return res.status(200).json({
        status: "Success",
        dataSpham: productExist,
        dataCmt: listCmts,
        //sale: sale,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});

exports.getProductType = catchAsync(async (req, res, next) => {
  try {
    let maloai = req.params.id;
    if (!maloai) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu mã loại sản phẩm, vui lòng kiểm tra lại !",
      });
    }
    const typeExist = await modelCatalog.get_Type_Id(maloai);
    if (typeExist == -1) {
      return res.status(400).json({
        status: "Fail",
        message: "Không tìm thấy mã loại này, vui lòng kiểm tra lại !",
      });
    }
    let listProduct = await modelProduct.get_by_type(maloai);
    if (listProduct.length > 0) {
      return res.status(200).json({
        status: "Success",
        data: listProduct,
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "Không có sản phẩm nào thuộc loại này !",
        data: [],
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});

exports.getProductCategory = catchAsync(async (req, res, next) => {
  try {
    let madm = req.params.id;
    if (!madm) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu mã danh mục sản phẩm, vui lòng kiểm tra lại !",
      });
    }
    const categoryExist = await modelCatalog.get_Category_Id(madm);
    if (categoryExist == -1) {
      return res.status(400).json({
        status: "Fail",
        message: "Không tìm thấy danh mục này, vui lòng kiểm tra lại !",
      });
    }
    let listProduct = await modelProduct.get_by_category(madm);
    if (listProduct.length > 0) {
      return res.status(200).json({
        status: "Success",
        data: listProduct,
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "Không có sản phẩm nào thuộc danh mục này !",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});
// GET:
exports.getProductProducer = catchAsync(async (req, res, next) => {
  try {
    let mansx = req.params.id;
    if (!mansx) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu mã nhà sản xuất, vui lòng kiểm tra lại !",
      });
    }
    const producerExist = await modelProducer.get_By_Id(mansx);
    if (producerExist == -1) {
      return res.status(400).json({
        status: "Fail",
        message: "Không tìm thấy nhà sản xuất này, vui lòng kiểm tra lại !",
      });
    }
    let listProduct = await modelProduct.get_by_producer(mansx);
    if (listProduct.length > 0) {
      return res.status(200).json({
        status: "Success",
        data: listProduct,
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "Không có sản phẩm nào thuộc nhà sản xuất này !",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});

// POST
// Post: Create product
exports.postProduct = catchAsync(async (req, res, next) => {
  try {
    var today = new Date();
    var ngaytao =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    const data = {
      tensp: req.body.ten,
      gia: req.body.gia,
      chitiet: req.body.chitiet,
      tenhinh: req.body.imgName,
      hinh: req.body.img,
      //tenhinhct: req.body.imgNameDetail,
      hinhchitiet: req.body.hinhchitiet,
      mota: req.body.mota,
      ngaytao: ngaytao,
      trangthai: req.body.trangthai,
      mansx: req.body.mansx,
      maloai: req.body.maloai,
      madm: req.body.madm,
    };
    if (
      !data.tensp ||
      !data.gia ||
      !data.chitiet ||
      !data.tenhinh ||
      !data.hinh ||
      !data.mansx ||
      !data.maloai ||
      !data.madm
    ) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu thông tin sản phẩm, vui lòng kiểm tra lại !",
      });
    }
    const nameExist = await modelProduct.get_By_productName(data.tensp);
    if (nameExist == -1) {
      // Tên sản phẩm không bị trùng:
      const query = await modelProduct.create_product(data);
      if (query == 1) {
        const listProducts = await modelProduct.list_products();
        return res.status(200).json({
          status: "Success",
          message: "Thêm sản phẩm thành công !",
          listProducts: listProducts,
        });
      } else {
        return res.status(400).json({
          status: "Fail",
          message: "Thêm sản phẩm thất bại !",
        });
      }
    } else {
      // Trùng tên sản phẩm:
      return res.status(400).json({
        status: "Fail",
        message: "Tên của sản phẩm này đã tồn tại, vui lòng nhập tên khác !",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});

// PUT
// Put: Edit product
exports.putEditProduct = catchAsync(async (req, res, next) => {
  try {
    let masp = req.body.masp;
    let tensp = req.body.tensp;
    let gia = req.body.gia;
    let chitiet = req.body.chitiet;
    let tenhinh = req.body.imgName;
    let hinh = req.body.img;
    //let tenhinhct = req.body.imgNameDetail;
    let hinhchitiet = req.body.hinhchitiet;
    let mota = req.body.mota;
    let trangthai = req.body.trangthai;
    let mansx = req.body.mansx;
    let maloai = req.body.maloai;
    let madm = req.body.madm;

    if (
      !masp ||
      !tensp ||
      !chitiet ||
      !gia ||
      !tenhinh ||
      !hinh ||
      !trangthai ||
      !mansx ||
      !maloai ||
      !madm
    ) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu thông tin sản phẩm, vui lòng kiểm tra lại !",
      });
    }
    const productExist = await modelProduct.get_By_Id(masp);
    if (productExist == -1) {
      return res.status(400).json({
        status: "Fail",
        message:
          "Không tìm thấy sản phẩm này, vui lòng kiểm tra lại thông tin !",
      });
    } else {
      let query = await modelProduct.update_product(
        masp,
        tensp,
        gia,
        chitiet,
        tenhinh,
        hinh,
        hinhchitiet,
        mota,
        trangthai,
        mansx,
        maloai,
        madm
      );
      if(query == 1) {
        const listProducts = await modelProduct.list_products();
        return res.status(200).json({
          status: "Success",
          message: "Cập nhật thông tin sản phẩm thành công !",
          listProducts: listProducts,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});
// Put: Edit status product
exports.putEditStatus = catchAsync(async (req, res, next) => {
  try {
    let masp = req.body.masp;
    let trangthai = req.body.trangthai;
    console.log(req.body);
    if (!masp || trangthai == undefined) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu thông tin, vui lòng kiểm tra lại !",
      });
    }
    const productExist = await modelProduct.get_By_Id(masp);
    if (productExist == -1) {
      return res.status(400).json({
        status: "Fail",
        message: "Không tìm thấy sản phẩm này, vui lòng kiểm tra lại !",
      });
    } else {
      if (trangthai == 1) {
        let queryUnlock = await modelProduct.unlock_product(masp);
        return res.status(200).json({
          status: "Success",
          message: "Hiện sản phẩm thành công !",
        });
      } else {
        let queryLock = await modelProduct.lock_product(masp);
        return res.status(200).json({
          status: "Success",
          message: "Ẩn sản phẩm thành công !",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});

// DELETE
// Delete: Xoá sản phẩm
exports.deleteProduct = catchAsync(async (req, res, next) => {
  try {
    let masp = req.params.id;
    if (!masp) {
      return res.status(400).json({
        status: "Fail",
        message: "Thiếu mã sản phẩm, vui lòng kiểm tra lại !",
      });
    }
    const productExist = await modelProduct.get_By_Id(masp);
    if (productExist == -1) {
      return res.status(400).json({
        status: "Fail",
        message: "Không tìm thấy sản phẩm này, vui lòng kiểm tra lại !",
      });
    } else {
      const query = await modelProduct.delete(masp);
      if (query == -1) {
        return res.status(400).json({
          status: "Fail",
          message:
            "Sản phẩm đã có trong đơn hàng! Không thể xoá sản phẩm này !",
        });
      }
      if (query == 1) {
        const listProducts = await modelProduct.list_products();
        return res.status(200).json({
          status: "Success",
          message: "Xoá sản phẩm thành công !",
          listProducts: listProducts,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
      error: error,
    });
  }
});
