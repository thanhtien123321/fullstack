console.log('🚀 Script bắt đầu...');

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/UserModel'); // Đường dẫn đúng với cấu trúc thư mục của bạn

const MONGO_URI = process.env.MONGO_DB;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Đã kết nối MongoDB');

    const users = await User.find();
    let fixed = 0;

    for (let user of users) {
      if (user.password && !user.password.startsWith('$2b$')) {
        user.password = bcrypt.hashSync(user.password, 10);
        await user.save();
        console.log(`🔒 Đã mã hóa lại mật khẩu cho user: ${user.email}`);
        fixed++; 
      }
    }

    if (fixed === 0) {
      console.log('✅ Không có user nào cần mã hóa lại.');
    } else {
      console.log(`🎉 Đã mã hóa lại mật khẩu cho ${fixed} user.`);
    }

    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối MongoDB');
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });
