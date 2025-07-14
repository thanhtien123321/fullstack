const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { authUserMiddleWare } = require('../middleware/authMiddleware');
// CartRouter.js



// ✅ Route đúng
router.get('/', authUserMiddleWare, CartController.getCartByUser);
router.post('/', authUserMiddleWare, CartController.updateCart);

module.exports = router;
