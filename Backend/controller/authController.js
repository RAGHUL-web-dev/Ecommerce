const catchAsyncError = require("../middleware/catchAsyncError")
const userModel = require("../models/usersModel")
const User = require("../models/usersModel")
const ErrorHandler = require("../utils/errorHandler")
const sendToken = require("../utils/jwt")
const sendEmail = require('../utils/email')
const crypto = require('crypto')

// get all users
exports.getUsers = catchAsyncError(async (erq, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success : true,
        users
    })
})


// create new user - /api/v1/register
exports.registerUser = catchAsyncError( async (req, res, next) => {
    // if (!req.body) {
    // return res.status(400).json({ success: false, message: "No data received in the request body" });
    // }
        const {name, email, password} = req.body
        // console.log(name)
    
        // if (!name || !email || !password) {
        //     // return res.status(400).json({ success: false, message: "Please enter name, email, and password" })
        //     return next(new ErrorHandler("Please, Enter the name, email, and password"), 400)
        // }

        let avatar;

        let BASE_URL = process.env.BACKEND_URL;
        if(process.env.NODE_ENV === "production"){
            BASE_URL = `${req.protocol}://${req.get('host')}`
        }
        if (req.file) {
            avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
        }

        const user = await User.create({
            name, 
            email,
            password, 
            avatar
        })
    
        sendToken(user, 201, res);

})


// login page - /api/v1/login (POST)
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please Enter the email and password"), 400)
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler("Invalid email and password"), 401)
    }

    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler("Invalid email and password"), 401)
    }

    sendToken(user, 201, res);
})


// Logout - /api/v1/logedout (GET)
exports.logOut = catchAsyncError((req, res, next) => {
    res.cookie('token', null, {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    .status(200)
    .json({
        success : true,
        message : "Successfully Logedouted"
    })
})


// forgot password - /api/v1/forgot/password (POST)
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({email : req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found with this email"), 401)
    }

    const resetToken = user.getResetToken()
    await user.save({validateBeforeSave : false})

    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`
    const message = `Your reset url is as follow \n\n
    ${resetUrl} \n\n
    if you not requested this email, then ingored it`

    try {
        
        sendEmail({
            email : user.email,
            subject : 'shopnow password recovery',
            message
        })

        res.status(200).json({
            success : true,
            message : `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resePasswordToken = undefined;
        user.resePasswordTokenExpire = undefined;
        user.save({validateBeforeSave : false});
        return next(new ErrorHandler(error.message), 500)
    }
})


// reset password -  /api/v1/password/reset/:token (POST)
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resePasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resePasswordToken,
        resePasswordTokenExpire : {
            $gt : Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or expired'))
    }

    if( req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match'))
    }

    user.password = req.body.password
    user.resePasswordToken = undefined
    user.resePasswordTokenExpire = undefined
    await user.save({validateBeforeSave : false})

    sendToken(user, 201, res)
})



// get single user  -  
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(201).json({
        success : true,
        user
    })
})


// change password  -  /api/v1/password/change
exports.changepassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler("Old password is incorrect"), 401)
    }

    user.password = req.body.password;
    await user.save()

    res.status(200).json({
        success : true
    })
})


// update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        name : req.body.name,
        email : req.body.email
    }

    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
        newUserData = {...newUserData, avatar}
    }

    if(!newUserData.email && !newUserData.name){
        return next (new ErrorHandler("Enter the reuired fields"), 401)
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators : true,
    })

    res.status(200).json({
        success : true,
        user
    })
})


// Admin Routes

// get all users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(201).json({
        success : true,
        users
    })
})


///get specific user data - /api/v1/admin/users/id
exports.getUserData = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User was not found"), 401)
    }

    res.status(201).json({
        success : true,
        user
    })
})


// update user profile - /api/v1/admin/users/
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name : req.body.name,
        emial : req.body.email,
        role : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id ,newUserData, {
        new : true,
        runValidators : true,
    })

    if(!user){
        return next(new ErrorHandler("User was not found"), 401)
    }

    res.status(201).json({
        success : true,
        user
    }) 
})


// delete user  -  /api/v1/admin/users/id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler("User was not found"), 401)
    }

    await User.findByIdAndDelete(user)


    res.status(201).json({
        success : true,
        message : "User waas deleted"
    })
})