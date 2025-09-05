const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')


const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Enter the Name"]
    },

    email : {
        type : String,
        required : [true, "Please Enter the email"],
        unique : true,
        validate: {validator: validator.isEmail,message: "Please enter a valid email"}
    },
    password : {
        type : String,
        required : [true, "Please Enter Password"],
        maxLength : [6, "Password cannot exceed 6 character"],
        select : false
    },
    avatar : {
        type : String,
    },
    role : {
        type : String,
        default : "user"
    },
    resePasswordToken : String,
    resePasswordTokenExpire : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
})

userSchema.pre('save', async function(next){
    const saltRounds = 10;
    // this.password = bcrypt.hash(this.password, 10)
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(this.password, salt, function(err, hash) {
            this.password = hash
        });
    });
})

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id : this.id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES
    })
}

userSchema.methods.isValidPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// In your User model file
userSchema.methods.getResetToken = function() {
    const token = crypto.randomBytes(20).toString("hex");
    

    this.resePasswordToken = crypto.createHash("sha256")
        .update(token)
        .digest("hex");

    this.resePasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 15 min
    return token;
};



let userModel = mongoose.model('user', userSchema);

module.exports = userModel;