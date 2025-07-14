const express = require("express");
const router = express.Router()
const userController = require('../controllers/UserController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const upload = require('../middleware/upload');

router.post('/sign-up', upload.single('avatar'), userController.createUser);
router.post('/sign-in' , userController.loginUser)
const multer = require('multer');
const User = require('../models/UserModel');


router.put('/update-user/:id', upload.single('avatar'), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (req.file) {
    updates.avatar = `/uploads/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  res.status(200).json({
    status: 'ok',
    message: 'Cập nhật thành công',
    data: user
  });
});

router.post('/log-out' , userController.logoutUser)
router.delete('/delete-user/:id' ,authMiddleWare,  userController.deleteUser)
router.get('/getAll' ,  authMiddleWare, userController.getAllUser)
router.get('/get-details/:id' ,  authUserMiddleWare ,userController.getDetailsUser)
router.post('/refresh-token'  ,userController.refreshToken)
router.delete('/delete-many' ,authMiddleWare , userController.deleteMany);

module.exports = router