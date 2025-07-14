const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // lưu trong thư mục /uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // tránh trùng tên
  }
});


const upload = multer({ storage });
const express = require("express");
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleWare } = require('../middleware/authMiddleware');


router.post('/create', authMiddleWare, upload.single('image'), ProductController.createProduct);
router.put('/update/:id', authMiddleWare, upload.single('image'), ProductController.updateProduct);

router.get('/get-details/:id', ProductController.getDetailsProduct);
router.delete('/delete/:id', authMiddleWare, ProductController.deleteProduct);
router.get('/get-all', ProductController.getAllProduct);
router.post('/delete-many', authMiddleWare, ProductController.deleteMany);
router.get('/get-all-type', ProductController.getAllType);
module.exports = router;
