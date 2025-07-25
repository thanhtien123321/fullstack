// controllers/OrderController.js
const Order = require('../models/OrderProduct');
const Cart = require('../models/CartModel'); 
//tạo đơn hàng mới từ giỏ hàng hiện tại 
const createOrder = async (req, res) => {
  console.log("✅ Dữ liệu đơn hàng gửi lên:", req.body);

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (
      !Array.isArray(orderItems) || orderItems.length === 0 ||
      !shippingAddress || !shippingAddress.fullName || !shippingAddress.address || 
      !shippingAddress.city || !shippingAddress.phone ||
      typeof paymentMethod !== 'string' ||
      typeof itemsPrice !== 'number' ||
      typeof shippingPrice !== 'number' ||
      typeof taxPrice !== 'number' ||
      typeof totalPrice !== 'number'
    ) {
      return res.status(400).json({ status: 'ERR', message: 'Thiếu hoặc sai định dạng thông tin đơn hàng' });
    }

    const newOrder = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user.id,
    });

    const savedOrder = await newOrder.save();

   // sau khi đặt xong thì xóa 
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.orderItems = [];
      await cart.save();
    }

    return res.status(201).json({
      status: 'OK',
      message: 'Tạo đơn hàng thành công và đã xoá giỏ hàng',
      data: savedOrder,
    });
  } catch (error) {
    console.error('❌ Lỗi khi tạo đơn hàng:', error);
    return res.status(500).json({
      status: 'ERR',
      message: 'Lỗi server khi tạo đơn hàng',
    });
  }
};

// lấy đơn hàng cho admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'email name');
    return res.status(200).json({
      status: 'OK',
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'ERR',
      message: 'Lỗi khi lấy danh sách đơn hàng',
    });
  }
};

// Thêm vào exports:
module.exports = {
  createOrder,
  getAllOrders
};

