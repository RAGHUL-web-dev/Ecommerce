const Order = require("../models/ordersModel")
const Product = require('../models/productModels')
const catchAsyncError = require("../middleware/catchAsyncError")
const ErrorHandler = require("../utils/errorHandler")

// create new order - /api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        itemsprice,
        taxPrice,
        shippingPrice,
        totalPrice,
        quanity,
        paymentInfo
    } = req.body ;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsprice,
        taxPrice,
        shippingPrice,
        totalPrice,
        quanity,
        paymentInfo,
        paidAt : Date.now(),
        user : req.user.id
    })

    res.status(200).json({
        success : true,
        order
    })
})


// get single order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(!order) {
        return next(new ErrorHandler(`Order not found with this id : ${req.params.id}`), 401)
    }

    res.status(200).json({
        success : true,
        order
    })
})

// get logined user order - /api/v1/myorders
exports.myOrder = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({user : req.user.id});

    if(!orders){
        return next(new ErrorHandler(`${req.user.name} as not order anything`), 401)
    }

    res.status(201).json({
        success : true,
        orders
    })

})


// Admin : get all orders - api/v1/orders
exports.orders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(201).json({
        success : true,
        totalAmount,
        orders
    })

})


exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered'){
        return next(new ErrorHandler('Order has been allready deliverd to the user'), 400)
    }

    order.orderItems.forEach(async orderItems => {
        await updateStock(orderItems.product, orderItems.quantity)
    });

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success : true,
        
    })


})

async function updateStock (productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave : false})
}


// delete order 
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order was not Found"), 401)
    }

    await Order.deleteOne(order)

    res.status(201).json({
        success : true,
        message : "Order was Deleted"
    })
})