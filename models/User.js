const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        phone: {type: String,required: true,trim: true,unique: true},
        phoneOtp:{type: String},
        role: { type: String, enum: ['user', 'restaurant_owner', 'super_admin'], required: true, default: 'user'}
    },
    {timestamps:true}
)

module.exports = mongoose.model("User",UserSchema)