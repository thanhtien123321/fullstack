const User = require("../models/UserModel")
const bcrypt = require("bcrypt");
const JwtService = require('./JwtService');
const { genneralAccessToken , genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    let { email, password, avatar } = newUser;

    // ✅ CHUẨN HÓA EMAIL
    email = email.trim().toLowerCase();

    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return resolve({ status: 'ERR', message: 'Email đã tồn tại' });
      }

      const hash = bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        email, // đã chuẩn hóa
        password,
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

  


  
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email, password } = userLogin;

      // ✅ CHUẨN HÓA EMAIL
      email = email.trim().toLowerCase();

      console.log('📩 Email nhập:', email);
      console.log('🔐 Password nhập:', password);

      const user = await User.findOne({ email });

      if (!user) {
        console.log('❌ Không tìm thấy user');
        return resolve({ status: 'error', message: 'Email không tồn tại' });
      }

      console.log('🧾 Password trong DB (hash):', user.password);

      const isMatch = bcrypt.compareSync(password, user.password);
      console.log('✅ So sánh kết quả:', isMatch);

      if (!isMatch) {
        return resolve({ status: 'error', message: 'Mật khẩu không đúng' });
      }

      const access_token = await genneralAccessToken({
        id: user.id,
        isAdmin: user.isAdmin,
      });

      const refresh_token = await genneralRefreshToken({
        id: user.id,
        isAdmin: user.isAdmin,
      });

      return resolve({
        status: 'ok',
        message: 'Đăng nhập thành công',
        access_token,
        refresh_token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          phone: user.phone,
        },
      });

    } catch (e) {
      reject(e);
    }
  });
};



  


const updateUser = (id , data) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const checkUser = await User.findById(id);
            console.log('checkUser' , checkUser)
            if (checkUser === null) {
                return resolve({
                    status: 'error',
                    message: 'The user is not defined',
                });
            }
 
            const updateUser = await User.findByIdAndUpdate(id , data , {new:true})
            console.log('updateUser' , updateUser)

            return resolve({
                status: 'ok',
                message: 'Success',
                data : updateUser
                
                
            });

        } catch (e) {
            reject(e);
        }
    });
};


const deleteUser = (id ) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const checkUser = await User.findById(id);
            
            if (checkUser === null) {
                return resolve({
                    status: 'error',
                    message: 'The user is not defined',
                });
            }
 
            await User.findByIdAndDelete(id)
            console.log('deleteUser' , deleteUser)

            return resolve({
                status: 'ok',
                message: 'delete user Success',
                
                
                
            });

        } catch (e) {
            reject(e);
        }
    });
};


const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
      try {
        await User.deleteMany({ _id: { $in: ids } }); 
  
        return resolve({
          status: 'ok',
          message: 'Delete users success',
        });
      } catch (e) {
        reject(e);
      }
    });
  };
  

const getAllUser = ( ) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const allUser = await User.find()

            return resolve({
                status: 'ok',
                message: 'Success',
                data : allUser
                
                
                
            });

        } catch (e) {
            reject(e);
        }
    });
};
const getDetailsUser = (id ) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const user = await User.findById(id); 
            if (user === null) {
                return resolve({
                    status: 'error',
                    message: 'The user is not defined',
                });
            }
            return resolve({
                status: 'ok',
                message: 'success',
                data : user
                
                
                
            });

        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
    

};
