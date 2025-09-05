const express = require("express");
const { registerUser, getUsers, loginUser, logOut, forgotPassword, resetPassword, getUserProfile, changepassword, updateProfile, getAllUsers, getUserData, deleteUser, updateUserProfile } = require("../controller/authController");
const { isAutenicatedUser, authorizenRoles } = require("../middleware/authenicate")
const router = express.Router();
const multer = require('multer')
const path = require('path')

const upload = multer({storage : multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname,'../','uploads/user'))
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})})

router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/users").get(getUsers);
router.route("/login").post(loginUser);
router.route('/logedout').get(logOut);
router.route('/forgot/password').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myprofile').get(isAutenicatedUser, getUserProfile)
router.route('/password/change').put(isAutenicatedUser, changepassword)
router.route('/update/profile').put(isAutenicatedUser,upload.single('avatar'), updateProfile)

// Admin Routes
router.route('/admin/users').get(isAutenicatedUser, authorizenRoles('admin' || 'ADMIN'),  getAllUsers)
router.route('/admin/users/:id').get(isAutenicatedUser, authorizenRoles('admin' || 'ADMIN'),  getUserData)
                                 .put(isAutenicatedUser, authorizenRoles('admin' || 'ADMIN'),  updateUserProfile)
                                  .delete(isAutenicatedUser, authorizenRoles('admin' || 'ADMIN'),  deleteUser)

module.exports = router 