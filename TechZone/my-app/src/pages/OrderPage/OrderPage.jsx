import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, Form } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

import {
  WrapperCountOrder,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
} from './style';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';

import * as message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';
import { useNavigate} from 'react-router-dom'
import {
  setOrderItems,
  removeOrderProduct,
  removeAllOrderProduct,
} from '../../redux/slides/orderSlide';
import { updateUser } from '../../redux/slides/userSlide';

const OrderPage = () => {
  const dispatch = useDispatch();
  const order = useSelector(state => state.order);
  const user = useSelector(state => state.user);

  const [checkedItems, setCheckedItems] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isOpenModalUpdateInfor, setIsOpenModalUpdateInfor] = useState(false);
  const [formDrawer] = Form.useForm();
  const navigate = useNavigate()

  const handleChangeCheckboxAll = (e) => {
    const checked = e.target.checked;
    setIsCheckAll(checked);
    setCheckedItems(checked ? order.orderItems.map(item => item.product) : []);
  };

  const handleChangeCheckboxItem = (e, productId) => {
    const checked = e.target.checked;
    const updated = checked
      ? [...checkedItems, productId]
      : checkedItems.filter(id => id !== productId);
    setCheckedItems(updated);
    setIsCheckAll(updated.length === order.orderItems.length);
  };

  const handleRemoveAllOrder = () => {
    if (checkedItems.length === 0) return alert('Vui lòng chọn sản phẩm để xoá.');
    if (window.confirm(`Xoá ${checkedItems.length} sản phẩm khỏi giỏ hàng?`)) {
      dispatch(removeAllOrderProduct(checkedItems));
      setCheckedItems([]);
      setIsCheckAll(false);
    }
  };

  const handleDeleteOrder = (idProduct) => {
    if (window.confirm('Xoá sản phẩm này?')) {
      dispatch(removeOrderProduct({ idProduct }));
      setCheckedItems(prev => prev.filter(id => id !== idProduct));
    }
  };

  const handleChangeQuantity = (value, productId) => {
    const updatedOrder = order.orderItems.map(item =>
      item.product === productId
        ? { ...item, amount: value >= 1 ? value : 1 }
        : item
    );
    dispatch(setOrderItems(updatedOrder));
  };

  const handleChangeCount = (type, productId) => {
    const updatedOrder = order.orderItems.map(item =>
      item.product === productId
        ? {
            ...item,
            amount: type === 'increase' ? item.amount + 1 : Math.max(1, item.amount - 1),
          }
        : item
    );
    dispatch(setOrderItems(updatedOrder));
  };

  const handleAddCard = () => {
    if (!checkedItems.length) {
      message.error('Vui lòng chọn sản phẩm');
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfor(true);
    } else {
      const selectedItems = order.orderItems.filter(item =>
        checkedItems.includes(item.product)
      );
      const total = selectedItems.reduce((total, item) => total + item.price * item.amount, 0);
      
      // 🧹 Xoá sản phẩm đã chọn khỏi Redux giỏ hàng
      const remainingItems = order.orderItems.filter(item => !checkedItems.includes(item.product));
      dispatch(setOrderItems(remainingItems));
  
      // 👉 Truyền selectedItems qua trang thanh toán
      navigate('/payment', {
        state: {
          selectedItems,
          totalPrice: total,
        },
      });
    }
  };
  
  

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
        setTimeout(() => {
          handleAddCard({ ...user, ...values });
        }, 0);
      } else {
        message.error(res?.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      message.error('Lỗi hệ thống khi cập nhật thông tin');
    }
  };

  const totalPrice = order?.orderItems?.reduce((total, item) => {
    return checkedItems.includes(item.product)
      ? total + item.price * item.amount
      : total;
  }, 0);

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh' }}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }}>
                <Checkbox checked={isCheckAll} onChange={handleChangeCheckboxAll}>X</Checkbox>
                <span> Tất cả ({order?.orderItems?.length || 0}) sản phẩm</span>
              </span>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
              </div>
            </WrapperStyleHeader>

            <WrapperListOrder>
              {order?.orderItems?.map((item, index) => (
                <WrapperItemOrder key={item.product || index}>
                  <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Checkbox
                      checked={checkedItems.includes(item.product)}
                      onChange={(e) => handleChangeCheckboxItem(e, item.product)}
                    />
                    <img src={item.image} alt="product" style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                    <div>{item.name}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item.price.toLocaleString()}₫</span>
                    <WrapperCountOrder>
                      <button onClick={() => handleChangeCount('decrease', item.product)} style={{ border: 'none', background: 'transparent' }}>
                        <MinusOutlined />
                      </button>
                      <WrapperInputNumber
                        value={item.amount}
                        size="small"
                        onChange={(value) => handleChangeQuantity(value, item.product)}
                      />
                      <button onClick={() => handleChangeCount('increase', item.product)} style={{ border: 'none', background: 'transparent' }}>
                        <PlusOutlined />
                      </button>
                    </WrapperCountOrder>
                    <span style={{ color: 'rgb(255, 66, 78)' }}>
                      {(item.price * item.amount).toLocaleString()}₫
                    </span>
                    <DeleteOutlined onClick={() => handleDeleteOrder(item.product)} style={{ cursor: 'pointer' }} />
                  </div>
                </WrapperItemOrder>
              ))}
            </WrapperListOrder>
          </WrapperLeft>

          <WrapperRight>
  <div style={{ padding: 20, background: '#fff', borderRadius: 8 }}>
    
    <div style={{ marginBottom: 16 }}>
      <p><strong>Họ tên:</strong>{user?.name || 'Chưa có'}</p>
      <p><strong>Số điện thoại:</strong> {user?.phone || 'Chưa có'}</p>
      <p>
  <strong>Địa chỉ:</strong>{' '}
  <span>
    {user?.address || 'Chưa có'}, {user?.city || 'Chưa có'}
  </span>
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
      <span>Tổng thanh toán:</span>
      <strong>{totalPrice.toLocaleString()}₫</strong>
    </div>
    <ButtonComponent
      onClick={handleAddCard}
      textButton="Thanh toán"
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

      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfor}
        onCancel={() => setIsOpenModalUpdateInfor(false)}
        onOk={() => formDrawer.submit()}
      >
        <Form
          form={formDrawer}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleUpdateInforUser}
          initialValues={{
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
            city: user?.city || '',
          }}
        >
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <InputComponent />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <InputComponent />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <InputComponent />
          </Form.Item>
          <Form.Item name="city" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố' }]}>
            <InputComponent />
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
