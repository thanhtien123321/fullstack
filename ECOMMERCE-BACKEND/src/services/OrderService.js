const User = require("../models/UserModel")
const bcrypt = require("bcrypt");
const JwtService = require('./JwtService');
const { genneralAccessToken , genneralRefreshToken } = require("./JwtService");

const createOrder = (newOther) => {
  return new Promise(async (resolve, reject) => {
    const { email, password, confirmPassword  , avatar} = newUser;

    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return resolve({ status: 'ERR', message: 'Email đã tồn tại' });
      }

      const hash = bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        email,
        password: hash,
        name: newUser.name || '',
        phone: newUser.phone || '',
        avatar: avatar || ''
      });

      return resolve({
        status: 'OK',
        message: 'Đăng ký thành công',
        data: {
          _id: createdUser._id,
          email: createdUser.email,
          name: createdUser.name,
          phone: createdUser.phone,
          avatar: createdUser.avatar || ''
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};



module.exports = {
    createOrder,
};
