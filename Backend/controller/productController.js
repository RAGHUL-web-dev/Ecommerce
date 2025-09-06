const Product = require("../models/productModels")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apiFeatures");

// get all products - /api/v1/products
exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 10;
        
        // Build query with search and filters
        const apiFeatures = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter();

        // Get filtered count and total count
        const filteredProductsCount = await apiFeatures.query.countDocuments();
        const totalProductsCount = await Product.countDocuments();
        
        // Paginate the results
        const products = await apiFeatures.paginate(resPerPage).query;

        res.status(200).json({
            success: true,
            count: filteredProductsCount,
            resPerPage,
            totalProducts: totalProductsCount,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// create new product - /api/v1/products/new
exports.newProduct = catchAsyncError (async (req, res, next) => {
    let images = [];

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0){
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/products/${file.originalname}`
            images.push({image : url})
        })
    }
    req.body.images = images
    req.body.user = req.user.id;
    const products = await Product.create(req.body);
    res.status(201).json({
        success : true,
        products
    })
})

// Get Single Product - /api/v1/products/68585bc990bed0bda6a33fdc
exports.getSingleProduct = catchAsyncError (async (req, res, next) => {
    const id = req.params.id
    const product = await Product.findById(id).populate('reviews.user', 'name email');
       

    if(!product){
       return next(new ErrorHandler("Product Not found", 400));
    }

     res.status(201).json({
        success : true,
        product
    })
})

// Update Product - /api/v1/products/68585bc990bed0bda6a33fdc
exports.updateProduct = catchAsyncError (async(req, res, next) => {
    let product = await Product.findById(req.params.id);

    let images = [];

    if(req.body.imagesCleared == "false"){
        images = product.images
    }

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0){
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/products/${file.originalname}`
            images.push({image : url})
        })
    }
    req.body.images = images
       

    if(!product){
        res.status(404).json({
            error : "Product not found"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    })

    res.status(200).json({
        success : true,
        product
    })
})

// Delete product - /api/v1/products/68585bc990bed0bda6a33fde
exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id
    let product = await Product.findById(id);
       

    if(!product){
        res.status(404).json({
            error : "Product not found"
        })
    }

    await Product.findByIdAndDelete(product);

    res.status(200).json({
        success : true,
        message : "Product Deleted"
    })

}


// create product review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, comment, rating } = req.body;

    const review = {
        user : req.user.id,
        comment,
        rating
    }

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })

        product.markModified('reviews');
    }else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    // calculating the avg of the ratings
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc
    }, 0) / product.reviews.length;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings

    await product.save({validateBeforeSave : false})

    res.status(200).json({
        success : true,
        message : "commented succesfully"
    })
})


// getting all reviews - api/v1/reviews
exports.getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate("reviews.user", "name email")

    if(!product) {
        return next(new ErrorHandler("Product of the review was not found"), 401)
    }

    res.status(200).json({
        success : true,
        reviews : product.reviews
    })
})


// delete reviews
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    const reviews = product.reviews.filter(
        review => review._id.toString() !== req.params.id.toString()
    );

    const numOfReviews = reviews.length;
    const ratings = numOfReviews > 0
        ? reviews.reduce((acc, review) => review.rating + acc, 0) / numOfReviews
        : 0;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    });

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});



// get products for admin - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).send({
        success : true,
        products
    })
})