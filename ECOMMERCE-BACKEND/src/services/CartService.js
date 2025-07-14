const Cart = require('../models/CartModel');

const getCartByUserService = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    return {
      status: 'OK',
      data: cart ? cart.orderItems : [],
    };
  } catch (error) {
    return {
      status: 'ERR',
      message: 'Lỗi khi lấy giỏ hàng',
    };
  }
};

const updateCartService = async (userId, orderItems) => {
  try {
    if (!Array.isArray(orderItems)) {
      return {
        status: 'ERR',
        message: 'Dữ liệu giỏ hàng không hợp lệ',
      };
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.orderItems = orderItems;
    } else {
      cart = new Cart({ user: userId, orderItems });
    }

    await cart.save();

    return {
      status: 'OK',
      message: 'Cập nhật giỏ hàng thành công',
    };
  } catch (error) {
    return {
      status: 'ERR',
      message: 'Lỗi khi cập nhật giỏ hàng',
    };
  }
};

module.exports = {
  getCartByUserService,
  updateCartService,
};
