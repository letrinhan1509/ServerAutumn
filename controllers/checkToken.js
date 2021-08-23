const authController = require('./authController');
const modelAdmin = require('../models/model_admin');


exports.isAuth_Admin = async (req, res, next) => {
    // Lấy token được gửi lên từ phía client:
    const tokenFromClient = req.body.token || req.headers["auth-token"];
    console.log(tokenFromClient);
    if (tokenFromClient) {
        // Nếu tồn tại token:
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await authController.verifyToken(tokenFromClient);
            const currentAdmin = await modelAdmin.get_Admin_Id(decoded.id);
            // Kiểm tra xem user này có tồn tại trong DB hay ko?
            if(currentAdmin == -1) {
                return res.status(401).json({
                    status: 'Fail',
                    message: 'The user belonging to this token does no longer exist.'
                });
            }
            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
            req.jwtDecoded = decoded;
            // Cho phép req đi tiếp sang controller.
            next();
        } catch (error) {
            // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
            // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
            return res.status(401).json({
                status: 'Fail',
                message: 'Unauthorized.',
                error: error
            });
        }
    } else {
        // Không tìm thấy token trong request:
        return res.status(403).send({
            status: 'Fail',
            message: 'No token provided.',
        });
    }
}