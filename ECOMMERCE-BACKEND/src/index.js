const express = require("express");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
require('./models/CartModel');
const { default: mongoose } = require("mongoose");
const routes = require('./routes'); 
const bodyParser = require('body-parser')
const path = require('path'); // 👈 Cần thiết để path.join hoạt động
const cors = require('cors')
const app = express();
app.use(cookieParser());
const port = process.env.PORT;
app.use(express.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'token'], // 👈 rất quan trọng nếu bạn dùng 'token' thay vì 'Authorization'
  };
  
  app.use(cors(corsOptions));
  
  
  
routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)

.then(() => { 
    console.log('connected to database');
})
.catch((err) => {
    console.log(err);
    console.log('Password used:', process.env.MONGO_DB);
});


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
