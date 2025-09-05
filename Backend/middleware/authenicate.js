const User = require("../models/usersModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken')

exports.isAutenicatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
        return next(new ErrorHandler("Login first to handlle the products link"))
    }

    const deocde = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(deocde.id);
    next();
})

exports.authorizenRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`), 401)
        }

        next();
    }
}