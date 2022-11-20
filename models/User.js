const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        phone: {type: String,required: true,trim: true,unique: true},
        phoneOtp:{type: String},
        isAdmin:{
            type:Boolean,
            default: false
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("User",UserSchema)