const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Enter the Product Name"],
        trim : true,
        maxLength : [100, "Product name can't execeed 100 character"]
    },
    price : {
        type : Number,
        required : true,
        default : 0.0
    },
    description : {
        type : String,
        required : [true, "Please Enter Product Description"]
    },
    ratings : {
        type : Number,
        default : 0
    },
    images : [
        {
            image : {
                type : String,
                required : true
            }
        }
    ],
    category : {
        type : String,
        required : [true, "Please Enter the Product Category"],
        enum : {
            values : [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message : "Please Select correct Category"
        }
    },
    seller : {
        type : String,
        required : [true, "Please Ennter the Product Seller"]
    },
    stock : {
        type  : Number,
        required : [true, "Please Enter Product Stock"],
        maxLength : [20, "Product stock exceed 20"]
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    reviews : [
        {
            user : { 
                type : mongoose.Schema.Types.ObjectId,
                ref : 'user'
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            }
        }
    ],
    user : {
        type : mongoose.Schema.Types.ObjectId
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

const productModel = mongoose.model('Product', productSchema)

module.exports = productModel;