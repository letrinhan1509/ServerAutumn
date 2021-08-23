const jwt = require("jsonwebtoken");
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const modelAdmin = require('../models/model_admin');
const modelUser = require('../models/model_user');


// Tạo token cho admin
const signToken = (user) => {
    return new Promise((resolve, reject) => {
        // Định nghĩa những thông tin của user muốn lưu vào token ở đây:
        const userData = {
            _id: user.manv,
            email: user.admin
        }
        // Thực hiện ký và tạo token:
        jwt.sign({ data: userData }, process.env.JWT_SECRET_ADMIN,
            { expiresIn: JWT_EXPIRES_IN },
            (error, token) => {
            if (error) {
                return reject(error);
            } else {
                resolve(token);
            }
        });
    });
};

exports.protectUser = Model => catchAsync(async (req, res, next) => {
    //1) getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log(token);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
        return res.status(401).json({
            status: 'Fail',
            message: 'You are not logged in! Please log in to get access.'
        });
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_ADMIN);
  
    // 3) Check if user still exists
    const currentUser = await modelAdmin.get_Admin_Id(decoded._id);
    if (currentUser == -1) {
        return res.status(401).json({
            status: 'Fail',
            message: 'You are not logged in! Please log in to get access.'
        });
    } else {
        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    }
});

exports.isLoggedInUser = async (req, res, next) => {
    if(req.headers.token) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.headers.token,
                process.env.JWT_SECRET
            );
            if(decoded._id == undefined) {
                return res.status(403).json({ 
                    status: "Fail", 
                    message: "This token does not exist !"
                });
            };
            // 2) Check if user still exists
            const currentUser = await modelUser.get_By_Id(decoded._id);
            if (currentUser == -1) {
                return res.status(403).json({ 
                    status: "Fail", 
                    message: "This token does not exist !"
                });
            } else {
                req.user = currentUser;
                res.locals.user = currentUser;
                return next();
            }
        } catch (error) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Something went wrong!", 
                error: error 
            });
        };
    };
    return res.status(401).json({ 
        status: "Fail", 
        message: "No login !"
    });
};

exports.isLoggedIn = async (req, res, next) => {
    if(req.headers.token) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                //req.cookies.jwtAdmin,
                req.headers.token,
                process.env.JWT_SECRET_ADMIN
            );
            if(decoded._id == undefined) {
                return res.status(403).json({ 
                    status: "Fail", 
                    message: "This token does not exist !"
                });
            };
            // 2) Check if user still exists
            const adminExist = await modelAdmin.get_Admin_Id(decoded._id);
            if (adminExist == -1) {
                return res.status(403).json({ 
                    status: "Fail", 
                    message: "This token does not exist !"
                });
            } else {
                req.user = adminExist;
                res.locals.user = adminExist;
                return next();
            }
            //return next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ 
                status: "Fail", 
                message: "This token does not exist!", 
                error: error.message
            });
        };
    } else {
        return res.status(401).json({ 
            status: "Fail", 
            message: "No login !"
        });
    }
};

exports.restrictTo = catchAsync(async (req, res, next) => {
    const role = req.user.quyen;
    if(role == 'Admin' || role == 'QLCH') {
        return next();
    } else {
        return res.status(403).json({
            status: 'Fail',
            message: 'Bạn không có quyền truy cập vào đây !'
        })
    }
});
exports.restrictTo_QLNS = catchAsync(async (req, res, next) => {
    const role = req.user.quyen;
    if(role == 'Admin' || role == 'QLNS') {
        return next();
    } else {
        return res.status(403).json({
            status: 'Fail',
            message: 'Bạn không có quyền truy cập vào đây !'
        })
    }
});