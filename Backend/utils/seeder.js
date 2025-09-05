const productsData = require("../data/product.json");
const Product = require("../models/productModels");
const dotenv = require('dotenv');
const connectDatabse = require("../config/db");

dotenv.config({path : "config/config.env"})
connectDatabse();


const seederData = async () => {
    try {
        await Product.deleteMany();
        console.log("Product deleted successflly");
        await Product.insertMany(productsData);
        console.log("Prouct inserted successfuly")
    } catch (error) {
        console.log(error.message)
    }
    process.exit();
}

seederData();