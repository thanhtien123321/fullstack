const Cart = require('../models/CartModel');

// Lấy giỏ hàng theo từng user hiện tại
const getCartByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({ status: 'OK', data: [] });
    }

    return res.status(200).json({ status: 'OK', data: cart.orderItems });
  } catch (error) {
    return res.status(500).json({ status: 'ERR', message: 'Lỗi khi lấy giỏ hàng' });
  }
};


const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderItems } = req.body;

    if (!Array.isArray(orderItems)) {
      return res.status(400).json({ status: 'ERR', message: 'Dữ liệu giỏ hàng không hợp lệ' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Cập nhật giỏ hàng đã có
      cart.orderItems = orderItems;
    } else {
      // Tạo giỏ hàng mới
      cart = new Cart({ user: userId, orderItems });
    }

    await cart.save();

    return res.status(200).json({ status: 'OK', message: 'Cập nhật giỏ hàng thành công' });
  } catch (error) {
    return res.status(500).json({ status: 'ERR', message: 'Lỗi khi cập nhật giỏ hàng' });
  }
};

module.exports = {
  getCartByUser,
  updateCart,
};
