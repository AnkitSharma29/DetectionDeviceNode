const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//Schema
const RegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//generete token
RegisterSchema.methods.genereteAuthToken = async function() {
    try {
        // console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;

    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}

//middleware
RegisterSchema.pre("save", async function(next) {

    if (this.isModified("password")) {
        // console.log(`current password: ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`current password: ${this.password}`);
        this.confirmPassword = await bcrypt.hash(this.password, 10);
        // this.confirmPassword = undefined;
    }
    next();
});


// we will create a new colleton
const Register = new mongoose.model('Register', RegisterSchema);

module.exports = Register;