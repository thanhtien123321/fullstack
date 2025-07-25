const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//xác thực người dùng
const genneralAccessToken = async (user) => {
  const payload = {
    id: user.id || user._id, // ✅ hỗ trợ cả 2 trường hợp
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '365d' });
};

//gia hạn người dùng 
const genneralRefreshToken = async (user) => {
  const payload = {
    id: user._id,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken
};
