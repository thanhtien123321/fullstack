import { axiosJWT } from "./UserService";
const API_URL = process.env.REACT_APP_API_URL;

export const createOrder = async (orderData) => {
  const res = await axiosJWT.post(`${API_URL}/order/create`, orderData); // ✅ KHÔNG cần headers multipart
  return res.data;
};
export const getAllOrders = async () => {
  const res = await axiosJWT.get(`${API_URL}/order/all`);
  return res.data;
};
