const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controller/productController');
const router = express.Router();
const { isAutenicatedUser, authorizenRoles } = require("../middleware/authenicate")
const multer = require('multer')
const path = require('path')

const upload = multer({storage : multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname,'../','uploads/products'))
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})})

router.route("/products").get( getProducts);
router.route("/product/:id")
                            .get(getSingleProduct)

router.route("/review").put(isAutenicatedUser, createReview)
        
                            // Admin routes
router.route("/admin/products/new").post(isAutenicatedUser, authorizenRoles('admin'), upload.array("images"), newProduct);
router.route("/admin/products").get(isAutenicatedUser, authorizenRoles('admin'), getAdminProducts);
router.route("/admin/product/:id").delete(isAutenicatedUser, authorizenRoles('admin'), deleteProduct);
router.route("/admin/product/:id").put(isAutenicatedUser, authorizenRoles('admin'), upload.array('images'), updateProduct);
router.route("/admin/reviews").get(isAutenicatedUser, authorizenRoles('admin'), getReviews);
router.route("/admin/review/:id").delete(isAutenicatedUser, authorizenRoles('admin'), deleteReview);
module.exports = router;