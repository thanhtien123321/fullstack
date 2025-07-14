// ✅ Dùng toàn bộ import
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export const useMutationHooks = (fnCallback) => {
  return useMutation({
    mutationFn: fnCallback
  });
};

export const updateUser = async (id, formData, token) => {
  const res = await axios.put(`/api/user/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
