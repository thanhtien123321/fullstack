const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.token;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({
      message: 'No token provided',
      status: 'error',
    });
  }
  

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(403).json({
        message: 'Token is invalid or expired',
        status: 'error',
      });
    }

    req.user = user;

    if (user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: 'You are not authorized',
        status: 'error',
      });
    }
  });
};

const authUserMiddleWare = (req, res, next) => {
  const authHeader = req.headers.token;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Missing or invalid token',
      status: 'error',
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(403).json({
        message: 'Token is invalid or expired',
        status: 'error',
      });
    }

    req.user = user;

    // ✅ Nếu không có req.params.id thì vẫn cho phép user đi tiếp
    // Nếu có thì mới kiểm tra ID hoặc là admin
    const userId = req.params.id;

    if (!userId || user?.isAdmin || String(user?.id || user?._id) === String(userId)) {
      next();
    } else {
      return res.status(403).json({
        message: 'You are not authorized to access this resource',
        status: 'error',
      });
    }
  });
};




module.exports = {
  authMiddleWare,
  authUserMiddleWare
};
