import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import dayjs from 'dayjs';

// Tạo instance Axios
export const axiosJWT = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  
  withCredentials: true,
});

// Hàm refresh token
export const refreshToken = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/refresh-token`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

// Queue khi token hết hạn
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Interceptor xử lý token tự động
axiosJWT.interceptors.request.use(
  async (config) => {
    let access_token = localStorage.getItem('access_token');
    if (access_token) {
      const decoded = jwtDecode(access_token);
      const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;

      if (isExpired) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const res = await refreshToken();
            const newToken = res.access_token;
            localStorage.setItem('access_token', newToken);
            config.headers.token = `Bearer ${newToken}`;
            processQueue(null, newToken);
          } catch (err) {
            processQueue(err, null);
            throw err;
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              config.headers.token = `Bearer ${token}`;
              resolve(config);
            },
            reject: (err) => reject(err),
          });
        });
      }

      config.headers.token = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// ===== API METHODS =====
// =======================

// Đăng nhập
export const loginUser = async (data) => {
  console.log('📤 Dữ liệu gửi lên BE:', data);
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-in`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

// Đăng ký
export const signupUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-up`,
    data
  );
  return res.data;
};

// Lấy thông tin người dùng
export const getDetailsUser = async (id) => {
  const res = await axiosJWT.get(`/user/get-details/${id}`);
  return res.data;
};

// Cập nhật thông tin người dùng
export const updateUser = async (id, data) => {
  const res = await axiosJWT.put(`/user/update-user/${id}`, data);
  return res.data;
};

// Lấy tất cả người dùng
export const getAllUser = async () => {
  const res = await axiosJWT.get(`/user/getAll`);
  return res.data;
};

// Đăng xuất
export const logoutUser = async () => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`);
  return res.data;
};

// Tạo người dùng mới (admin)
export const createUser = async (data) => {
  const res = await axiosJWT.post(`/user/sign-up`, data);
  return res.data;
};

// Xoá 1 người dùng
export const deleteUser = async (id) => {
  const res = await axiosJWT.delete(`/user/delete-user/${id}`);
  return res.data;
};

// Xoá nhiều người dùng
export const deleteManyUser = async (data) => {
  const res = await axiosJWT.delete(`/user/delete-many`, { data });
  return res.data;
};
