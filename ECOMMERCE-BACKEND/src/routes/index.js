const express = require('express');
const path = require('path'); // cũng cần nếu bạn dùng path.join
const UserRouter = require('./UserRouter')
const OrderRouter = require('./OrderRouter')
const cartRouter = require('./CartRouter'); // đường dẫn đúng
const ProductRouter = require('./ProductRouter.js')
const routes = (app) => {
app.use('/api/user' , UserRouter ) 
app.use('/api/order' , OrderRouter ) 
app.use('/api/product' , ProductRouter ) 
app.use('/api/cart', cartRouter) // <--- mount đúng path!


}
module.exports = routes 