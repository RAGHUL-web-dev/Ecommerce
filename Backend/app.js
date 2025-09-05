const express = require('express');
const path = require('path');
const app = express();
const products = require('./routes/product');
const auth = require("./routes/auth");
const order = require('./routes/order');
const payment = require('./routes/payment');
const cookieParser = require('cookie-parser');
const errorMiddleware = require("./middleware/error");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/mern-ecommerce/build")));
    app.get("/*splat", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/mern-ecommerce/build/index.html"))
    }) 
}

// Error handling middleware
app.use(errorMiddleware);

module.exports = app; 