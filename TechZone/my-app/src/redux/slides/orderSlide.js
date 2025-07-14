import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../../services/CartService'; // 👉 import API updateCart

const initialState = {
  orderItems: [],
  shippingAddress: {},
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  isDelivered: false,
  paidAt: '',
  deliveredAt: '',
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state.orderItems.find(item => item.product === orderItem.product);
      if (itemOrder) {
        itemOrder.amount += orderItem.amount;
      } else {
        state.orderItems.push(orderItem);
      }

      // 🆕 Gọi API cập nhật server
      updateCart(state.orderItems).catch(err =>
        console.error('❌ Lỗi khi cập nhật giỏ hàng:', err)
      );
    },

    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      state.orderItems = state.orderItems.filter(item => item.product !== idProduct);

      // 🆕 Gọi API cập nhật server
      updateCart(state.orderItems).catch(err =>
        console.error('❌ Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err)
      );
    },

    removeAllOrderProduct: (state, action) => {
      const idsToRemove = action.payload;
      state.orderItems = state.orderItems.filter(item => !idsToRemove.includes(item.product));

      // 🆕 Gọi API cập nhật server
      updateCart(state.orderItems).catch(err =>
        console.error('❌ Lỗi khi xóa nhiều sản phẩm khỏi giỏ hàng:', err)
      );
    },

    setOrderItems: (state, action) => {
      state.orderItems = action.payload;

      // 🆕 Gọi API cập nhật server
      updateCart(state.orderItems).catch(err =>
        console.error('❌ Lỗi khi set giỏ hàng:', err)
      );
    },
  },
});

export const {
  addOrderProduct,
  removeOrderProduct,
  setOrderItems,
  removeAllOrderProduct,
} = orderSlice.actions;

export default orderSlice.reducer;
