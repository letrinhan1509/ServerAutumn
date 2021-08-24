exports.Purchase = (data) => {
    let tienship = (data.tienship).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let tongtien = (data.tongtien).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `
        <!DOCTYPE html>
        <html lang="en" style="margin: 0; padding: 0;">

        <head>
            <title>Xin kính chào quý khách !</title>
        </head>

        <body style="margin: 0; padding: 0;">
            <br />
            <div>Rất cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm thời trang của cửa hàng chúng tôi.</div>
            <div>Shop mong rằng bạn sẽ có những trải nghiệm tuyệt vời khi sử dụng sản phẩm.</div>
            <br />
            <div>
                &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; THÔNG TIN ĐƠN HÀNG
            </div>
            <div>
                &nbsp;&nbsp;&nbsp;&nbsp; Mã đơn hàng: ${data.madonhang}, <br />
                &nbsp;&nbsp;&nbsp;&nbsp; Tên khách hàng: ${data.tenkh}, <br />
                &nbsp;&nbsp;&nbsp;&nbsp; Email: ${data.email}, <br />
                &nbsp;&nbsp;&nbsp;&nbsp; Số điện thoại: ${data.sodienthoai}, <br />
                &nbsp;&nbsp;&nbsp;&nbsp; Địa chỉ: ${data.diachi}, <br />
                &nbsp;&nbsp;&nbsp;&nbsp; Tiền ship: ${tienship} đ, <br />
                &nbsp;&nbsp;&nbsp;&nbsp; Tổng tiền thanh toán: ${tongtien} đ, <br />
                &nbsp;&nbsp;&nbsp;&nbsp; Ngày đặt hàng: ${data.ngaydat}
            </div>
            <br />
            <div>
                Quý khách cũng có thể gửi phản hồi về chất lượng sản phẩm, thái độ phục vụ của nhân viên 
                qua gmail của shop: autumnshop180@gmail.com hoặc liên hệ qua số điện thoại và hotline của shop.
            </div>
            <div>Chúc quý khách có nhiều trải nghiệm thú vị trên website của cửa hàng.</div>
            <br />
            <div>Trân trọng cảm ơn!</div>
            <br />
            <br />
            <br />
            <div>Người gửi: AutumnShop</div>
            <br />
            <div>----------------------------------------------------------------------------</div>
            <div>CỬA HÀNG THỜI TRANG AUTUMN</div>
            <div>Địa chỉ: 180 Cao Lỗ, Phường 04, Quận 08, Tp.Hồ Chí Minh</div>
            <div>Điện thoại: 0969362xxx</div>
            <div>Hotline: (028)xxxxxxxx</div>
            <br />
            <br />

        </body>
    `;

}