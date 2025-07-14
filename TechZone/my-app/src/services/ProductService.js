import axios from 'axios';
import { axiosJWT } from './UserService'; // Hoặc nơi bạn khai báo axiosJWT
const API_URL = process.env.REACT_APP_API_URL;

// ✅ Lấy tất cả sản phẩm
export const getAllProduct = async ({ name = '', type = '' } = {}, useToken = true) => {
  let queryParams = [];

  if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
  if (type) queryParams.push(`type=${encodeURIComponent(type)}`);

  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  const url = `${API_URL}/product/get-all${queryString}`;

  const client = useToken ? axiosJWT : axios;
  const res = await client.get(url);
  return res.data;
};





// ✅ Tạo sản phẩm
export const createProduct = async (formData) => {
  const res = await axiosJWT.post(`${API_URL}/product/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// ✅ Lấy chi tiết sản phẩm
export const getDetailsProduct = async (id) => {
  const res = await axiosJWT.get(`${API_URL}/product/get-details/${id}`);
  return res.data;
};

// ✅ Cập nhật sản phẩm
export const updateProduct = async (id, formData) => {
  const res = await axiosJWT.put(`${API_URL}/product/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// ✅ Xoá 1 sản phẩm
export const deleteProduct = async (id) => {
  const res = await axiosJWT.delete(`${API_URL}/product/delete/${id}`);
  return res.data;
};

// ✅ Xoá nhiều sản phẩm
export const deleteManyProduct = async (ids) => {
  const res = await axiosJWT.post(`${API_URL}/product/delete-many`, { ids });
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axiosJWT.get(`${API_URL}/product/get-all-type`);
  return res.data;
};
