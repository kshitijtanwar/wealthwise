const mongoose = require('mongoose');

const bcrypt = require("bcryptjs")



 

const userSchema = new mongoose.Schema({

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    salary: { type: Number, default: 0.0 },

    breakdown: {

        savings: {

            type: Number,

            default: 0.0

        },

        expenses: {

            type: Number,

            default: 0.0

        },

        misc: {

            type: Number,

            default: 0.0

        }

    }

},

    { timestamps: { createdAt: true, updatedAt: false } }

);


 

//Hash password if modified

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)

    next();

})

//Helper to set password

userSchema.methods.setPassword = async function (plainPassword) {

    this.password = await bcrypt.hash(plainPassword, 10)

}

//Helper to validate password

userSchema.methods.validatePassword = async function (plainPassword) {

    return bcrypt.compare(plainPassword, this.password)

}

module.exports = mongoose.model("User", userSchema);

