const path = require('path');
const fs = require('fs');
const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Tạo người dùng mới
// ✅ Đặt trong async function
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ status: 'fail', message: 'Thiếu thông tin' });

    if (password !== confirmPassword)
      return res.status(400).json({ status: 'fail', message: 'Mật khẩu không khớp' });

    const hashedPassword = await bcrypt.hash(password, saltRounds); // ✅ CHỈ gọi khi đã kiểm tra hợp lệ

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword, // ✅ Lưu password đã mã hóa
      avatar: req.file ? `/uploads/${req.file.filename}` : '',
    };

    const result = await UserService.createUser(userData);

    if (result.status === 'OK') {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    return res.status(500).json({ status: 'fail', message: err.message });
  }
};


// Đăng nhập
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if (!email || !password) {
      return res.status(400).json({ status: 'ERR', message: 'Vui lòng nhập đầy đủ Email và Mật khẩu' });
    }

    if (!reg.test(email)) {
      return res.status(400).json({ status: 'ERR', message: 'Email không đúng định dạng' });
    }

    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...data } = response;

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e.message || String(e) });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, password, confirmPassword } = req.body;
    const updateData = { name, email, phone };

    if (password && confirmPassword && password === confirmPassword) {
      updateData.password = password;
    }

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
      status: 'ok',
      message: 'Cập nhật thành công',
      data: user
    });
  } catch (err) {
    return res.status(500).json({ status: 'fail', message: err.message });
  }
};



// Xóa 1 người dùng
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ status: 'ERR', message: 'Thiếu ID người dùng' });
    }

    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || String(e) });
  }
};

const deleteMany = async (req, res) => {
    try {
      const ids = req.body; 
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ status: 'ERR', message: 'Danh sách IDs không hợp lệ' });
      }
  
      const response = await UserService.deleteManyUser(ids);
      return res.status(200).json(response);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: e.message || String(e) });
    }
  };
  

// Lấy tất cả người dùng
const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || String(e) });
  }
};

// Lấy chi tiết 1 người dùng
const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ status: 'ERR', message: 'Thiếu ID người dùng' });
    }

    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || String(e) });
  }
};

// Làm mới token
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(401).json({ status: 'ERR', message: 'Không tìm thấy token' });
    }

    const response = await JwtService.RefreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || String(e) });
  }
};

// Đăng xuất
const logoutUser = async (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({ status: 'OK', message: 'Đăng xuất thành công' });
  } catch (e) {
    return res.status(500).json({ message: e.message || String(e) });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deleteMany,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser,
};
