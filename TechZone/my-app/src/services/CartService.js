import axios from 'axios';

// Lấy access_token từ localStorage
const getToken = () => {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : '';
};

// 🔹 Lấy giỏ hàng người dùng
export const getCart = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
      headers: {
        token: getToken(),
      },
    });
    return res.data;
  } catch (err) {
    console.error('❌ Lỗi lấy giỏ hàng:', err);
    return { status: 'ERR', message: 'Lỗi khi lấy giỏ hàng' };
  }
};

// 🔹 Cập nhật giỏ hàng người dùng (thêm/sửa/xoá)
export const updateCart = async (orderItems) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/cart`,
      { orderItems },
      {
        headers: {
          token: getToken(),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error('❌ Lỗi cập nhật giỏ hàng:', err);
    return { status: 'ERR', message: 'Lỗi khi cập nhật giỏ hàng' };
  }
};
