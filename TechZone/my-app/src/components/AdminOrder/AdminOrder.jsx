import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { getAllOrders } from '../../services/OrderService';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders(); // gọi API
        setOrders(res.data);
      } catch (error) {
        console.error('❌ Lỗi khi lấy đơn hàng:', error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Người đặt',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['shippingAddress', 'phone'],
      key: 'phone',
    },
    
    

    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value) => value.toLocaleString('vi-VN') + 'đ',
    },
    {
      title: 'Thành phố',
      dataIndex: ['shippingAddress', 'city'],
      key: 'city',
    },
    {
      title: 'Địa chỉ chi tiết',
      dataIndex: ['shippingAddress', 'address'],
      key: 'address',
    },
    {
      title: 'Tổng SL',
      key: 'totalAmount',
      render: (_, record) => {
        const totalAmount = record.orderItems.reduce((sum, item) => sum + item.amount, 0);
        return <strong>{totalAmount}</strong>;
      },
    },
    
    
    {
        title: 'Sản phẩm đã đặt',
        dataIndex: 'orderItems',
        key: 'orderItems',
        render: (items) =>
          items.map((item, index) => (
            <div key={index}>
              <span>{item.name} x {item.amount}</span>
            </div>
          )),
      },
  ];

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AdminOrder;
