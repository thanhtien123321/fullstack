const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare } = require('../middleware/authMiddleware');

// POST /api/order/create
router.post('/create', authUserMiddleWare, OrderController.createOrder);
router.get('/all', authUserMiddleWare, OrderController.getAllOrders);

module.exports = router;
