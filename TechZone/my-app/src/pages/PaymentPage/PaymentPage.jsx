import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Radio } from 'antd';
import { useLocation } from 'react-router-dom';

import {
  WrapperLeft,
  WrapperRight,
} from './style';
import qrImage from '../../assets/images/qrmain.jpg';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';

import * as message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';
import { updateUser } from '../../redux/slides/userSlide';
import * as OrderService from '../../services/OrderService';
const PaymentPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isShowQRModal, setIsShowQRModal] = useState(false);
  const [isBankConfirmed, setIsBankConfirmed] = useState(false);


  const { selectedItems = [], totalPrice = 0 } = location.state || {};
  const [isOpenModalUpdateInfor, setIsOpenModalUpdateInfor] = useState(false);
  const [formDrawer] = Form.useForm();

  const [deliveryMethod, setDeliveryMethod] = useState('fast');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const shippingFee = deliveryMethod === 'fast' ? 25000 : 20000;
  const finalPrice = totalPrice + shippingFee;
  
  const handleUpdateInforUser = async (values) => {
    if (!user?.id) {
      message.error('Không tìm thấy ID người dùng');
      return;
    }

    try {
      const res = await UserService.updateUser(user.id, values);
      if (res?.status === 'ok' || res?.status === 'OK') {
        message.success('Cập nhật thông tin giao hàng thành công');
        dispatch(updateUser({ ...user, ...values }));
        setIsOpenModalUpdateInfor(false);
      } else {
        message.error(res?.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      message.error('Lỗi hệ thống khi cập nhật thông tin');
    }
  };

  const handlePayment = async () => {
    console.log("🛒 selectedItems gửi lên:", selectedItems);

    if (!selectedItems.length) {
      message.error('Không có sản phẩm nào được chọn');
      return;
    }
  
    if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfor(true);
      return;
    }
  
    const orderData = {
      orderItems: selectedItems,
      shippingAddress: {
        fullName: user.name,
        address: user.address,
        city: user.city,
        phone: user.phone,
        Country: "Việt Nam" // hoặc lấy từ form nếu có
      },
      paymentMethod,
      itemsPrice: totalPrice,
      shippingPrice: shippingFee,
      taxPrice: 0, // bạn có thể thay đổi tuỳ logic thuế
      totalPrice: finalPrice,
    };
    if (paymentMethod === 'bank_qr') {
      setIsShowQRModal(true); // Mở QR modal thay vì gửi đơn
      return;
    }
    
  
    try {
      const res = await OrderService.createOrder(orderData);
      if (res?.status === 'OK') {
        message.success('Đặt hàng thành công!');
        console.log('✅ Đơn hàng:', res.data);
      } else {
        message.error(res?.message || 'Đặt hàng thất bại!');
      }
    } catch (err) {
      console.error('❌ Lỗi khi gửi đơn hàng:', err);
      message.error('Lỗi hệ thống khi tạo đơn hàng!');
    }
  };

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh' }}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <h3>Phương thức thanh toán</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <h4>Chi tiết sản phẩm</h4>
            {selectedItems.map((item) => (
              <div
                key={item.product}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                  padding: 10,
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 12 }}
                />
                <div>
                  <p><strong>{item.name}</strong></p>
                  <p>{item.amount} x {item.price.toLocaleString()}₫</p>
                </div>
              </div>
            ))}

            {/* PHƯƠNG THỨC GIAO HÀNG */}
            <div style={{ marginTop: 20, background: '#fff', padding: 16, borderRadius: 8 }}>
              <h4>Phương thức giao hàng</h4>
              <Radio.Group
                onChange={(e) => setDeliveryMethod(e.target.value)}
                value={deliveryMethod}
              >
                <Radio value="fast">Fast - Giao hàng tiết kiệm (25.000₫)</Radio>
                <Radio value="gojek">Go_Jek - Giao hàng tiết kiệm (20.000₫)</Radio>
              </Radio.Group>
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div style={{ marginTop: 20, background: '#fff', padding: 16, borderRadius: 8 }}>
              <h4>Phương thức thanh toán</h4>
              <Radio.Group
  onChange={(e) => setPaymentMethod(e.target.value)}
  value={paymentMethod}
>
  <Radio value="cash">Thanh toán tiền mặt khi nhận hàng</Radio>
  <Radio value="bank_qr">Chuyển khoản qua mã QR</Radio> {/* ✅ Thêm dòng này */}
</Radio.Group>

            </div>
          </WrapperLeft>

          <WrapperRight>
            <div style={{ padding: 20, background: '#fff', borderRadius: 8 }}>
              <div style={{ marginBottom: 16 }}>
                <p><strong>Họ tên:</strong> {user?.name || 'Chưa có'}</p>
                <p><strong>Số điện thoại:</strong> {user?.phone || 'Chưa có'}</p>
                <p>
                  <strong>Địa chỉ:</strong>{' '}
                  <span>{user?.address || 'Chưa có'}, {user?.city || 'Chưa có'}</span>
                  <span
                    style={{
                      color: 'blue',
                      marginLeft: 8,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={() => setIsOpenModalUpdateInfor(true)}
                  >
                    Thay đổi
                  </span>
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Tạm tính:</span>
                <strong>{totalPrice.toLocaleString()}₫</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Phí giao hàng:</span>
                <strong>{shippingFee.toLocaleString()}₫</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Tổng thanh toán:</span>
                <strong>{finalPrice.toLocaleString()}₫</strong>
              </div>

              <ButtonComponent
                onClick={handlePayment}
                textButton="Xác nhận thanh toán"
                styleButton={{
                  background: 'rgb(255, 57, 69)',
                  color: '#fff',
                  padding: '10px 16px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              />
            </div>
          </WrapperRight>
        </div>
      </div>

      {/* MODAL CẬP NHẬT THÔNG TIN */}
      <ModalComponent
  open={isShowQRModal}
  onCancel={() => setIsShowQRModal(false)}
  onOk={async () => {
    try {
      const res = await OrderService.createOrder({
        orderItems: selectedItems,
        shippingAddress: {
          fullName: user.name,
          address: user.address,
          city: user.city,
          phone: user.phone,
          Country: 'Việt Nam'
        },
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: shippingFee,
        taxPrice: 0,
        totalPrice: finalPrice
      });

      if (res?.status === 'OK') {
        message.success('Đặt hàng thành công!');
        setIsShowQRModal(false);
      } else {
        message.error(res?.message || 'Đặt hàng thất bại!');
      }
    } catch (err) {
      console.error('❌ Lỗi khi gửi đơn hàng:', err);
      message.error('Lỗi hệ thống khi tạo đơn hàng!');
    }
  }}
  title="Quét mã QR để chuyển khoản"
>
  <div style={{ textAlign: 'center' }}>
    <p>Quét mã bên dưới để chuyển khoản</p>
    <img
  src={qrImage}
  alt="Mã QR ngân hàng"
  style={{ width: 250, height: 250, marginBottom: 20 }}
/>

    <p><strong>Ngân hàng:</strong> SCB</p>
    <p><strong>Số tài khoản:</strong> 0902697231</p>
    <p><strong>Chủ tài khoản:</strong> Châu Thanh Tiến</p>
    <p><strong>Nội dung chuyển khoản:</strong> {user?.name} - {user?.phone}</p>
  </div>
</ModalComponent>

    </div>
  );
};

export default PaymentPage;
