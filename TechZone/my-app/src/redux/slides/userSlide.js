import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  id: '',
  isAdmin: false,
  city: '',
};

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const payload = action.payload;
    
      if (payload.name !== undefined) state.name = payload.name;
      if (payload.email !== undefined) state.email = payload.email;
      if (payload.phone !== undefined) state.phone = payload.phone;
      if (payload.address !== undefined) state.address = payload.address;
      if (payload.avatar !== undefined) state.avatar = payload.avatar;
      if (payload.access_token !== undefined) state.access_token = payload.access_token;
      if (payload._id || payload.id) state.id = payload._id || payload.id;
      if (payload.city !== undefined) state.city = payload.city;
      if (payload.isAdmin !== undefined) state.isAdmin = payload.isAdmin;
    },
    

    resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.address = '';
      state.phone = '';
      state.avatar = '';
      state.id = '';
      state.access_token = '';
      state.city = '';
      state.isAdmin = false;
    },
  },
});

export const { updateUser, resetUser } = userSlide.actions;
export default userSlide.reducer;
