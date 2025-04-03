const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        // Common fields
        role: { 
            type: String, 
            enum: ['user', 'restaurant_owner', 'super_admin'], 
            required: true, 
            default: 'user'
        },
        
        // OTP-based authentication fields (for normal users)
        phone: {
            type: String,
            trim: true,
            sparse: true, // Allows null values to be unique
            unique: true
        },
        phoneOtp: {
            type: String
        },
        phoneOtpExpiry: {
            type: Date
        },
        
        // Email/Password authentication fields (for restaurant owners)
        email: {
            type: String,
            trim: true,
            sparse: true, // Allows null values to be unique
            unique: true
        },
        password: {
            type: String
        },
        
        // Additional fields
        name: {
            type: String,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

// Add validation to ensure either phone or email is present
UserSchema.pre('save', function(next) {
    if (!this.phone && !this.email) {
        next(new Error('Either phone or email must be provided'));
    }
    next();
});

module.exports = mongoose.model("User", UserSchema)