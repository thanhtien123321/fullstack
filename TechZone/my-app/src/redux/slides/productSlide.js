import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: '',
}

export const productSlide = createSlice({
  name: 'product',
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload.trim();  // ✔️ Gán đúng giá trị, bỏ khoảng trắng
    },
  },
});


// Action creators are generated for each case reducer function
export const { searchProduct } = productSlide.actions

export default productSlide.reducer