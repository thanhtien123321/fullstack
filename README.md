# Dự Án Website Bán Hàng Online

## Mô tả
Website thương mại điện tử:
- Xem và tìm kiếm sản phẩm 
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng và thanh toán
- Quản lý thông tin cá nhân

Trang quản trị (admin) có thêm quyền:
- Quản lý sản phẩm
- Quản lý người dùng
- Quản lý đơn hàng

## Chức năng hiện có 

###  Xác thực
- Đăng ký và đăng nhập , mật khẩu (được mã hóa bằng hash) , nhập đúng mới cho vào 
- Sử dụng JWT để xác thực người dùng , với access token kéo dài khoảng 365 ngày ( hết hạn tự log acc)
- Lỗi hiện tại: khi đăng xuất 1 tài khoản nào đó và đăng nhập lại , nó sẽ đề xuất tài khoản admin và mật khẩu (chưa xử lý xong)

### Mua sắm
- Mỗi acc là 1 giỏ hàng khác nhau 
- Xem danh sách sản phẩm, tìm kiếm theo tên 
- Xem mục lục 
- Thêm sản phẩm vào giỏ hàng
- Xóa sản phẩm khỏi giỏ hàng 
- Hiển thị tiền cần trả khi tích vào sản phẩm
- Yêu cầu người dùng nhập địa chỉ và tỉnh/thành phố mới được đặt hàng
- Khi đặt hàng và thanh toán thành công, sản phẩm sẽ tự động xoá khỏi giỏ hàng

### Thanh toán
- 2 hình thức:
  - Tiền mặt khi nhận hàng (đã hoàn thành)
  - Chuyển khoản bằng mã QR (đã hoàn thành)
- Chức năng trả góp ( đối với sản phâmr giá cao ) : đang phát triển

### Hồ sơ cá nhân
- Người dùng có thể cập nhật: avatar, tên, email, số điện thoại, địa chỉ
- Người dùng không thể thay đổi mật khẩu hoặc quên mật khẩu (chưa làm xong)

## Chức năng dành cho Admin (isAdmin === true)

Ngoài toàn bộ chức năng người dùng, admin có thêm mục quản lý bao gồm:

### Quản lý sản phẩm
- Xem chi tiết sản phẩm ( giá , tên , rating)
- Thêm sản phẩm mới (preview ảnh bằng getBase64 hiện bị lỗi nhưng vẫn hiển thị và upload tốt(bên trang chủ và trang quản lý sản phẩm)).
- Chỉnh sửa sản phẩm (ảnh, mô tả, giá, loại…)
- Xoá 1 hoặc nhiều sản phẩm cùng lúc
- Thay đổi sẽ đồng bộ ngay ra trang chủ người dùng.

### Quản lý người dùng
- Xem email, sửa thông tin cá nhân của người dùng ( k thấy được mật khẩu )
- Thêm người dùng ( không được trùng email )
- Xoá 1 hoặc nhiều user ( acc bị xóa k thể đăng nhập )

### Quản lý đơn hàng
Hiển thị toàn bộ đơn hàng đã được đặt:
- Tên người đặt
- Email
- Số điện thoại
- Phương thức thanh toán
- Tổng tiền
- Tỉnh/thành phố
- Địa chỉ chi tiết
- Tổng số lượng sản phẩm đã đặt 
- Tên sản phẩm 

## Công nghệ sử dụng
Frontend  : React.js, Ant Design, Redux
Backend : Node.js, Express.js
Auth : JSON Web Token (JWT)
Database : Mongodb
File Upload : Multer, FormData, FileReader  
Gọi API :  Axios, React Query      
Test : Postman         




## Các tính năng chưa hoàn thiện
- Ít sản phẩm
- Đăng nhập lại đôi khi gợi ý tài khoản admin (bug chưa xử lý)
- Người dùng chưa thể đổi hoặc khôi phục mật khẩu.
- Chưa có thời gian giao hàng dự kiến cho user
- Chưa có các sự kiện khuyến mãi 
- Khi thanh toán bằng QR thì hiện mã QR kèm button `OK` , khi user click `OK` 
thì sản phẩm được đặt nhưng hiện chưa có cách để admin biết là user có thật sự chuyển tiền hay chưa 

## Nguồn tham khảo
Dự án này được tham khảo dựa theo tutorial của https://youtu.be/IIoW2IhKWmE?si=BWaGQWl_qxz_W11q


## Công cụ hỗ trợ 
ChatGPT , Blackbox

## Tác giả
- **Châu Thanh Tiến**
