const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true},
        paymentIntentId: { type: String },
        items: [{
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }],
        amount: { type: Number, required: true },
        address: {
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            postalCode: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
        },
        status: { type: String, enum: ['pending', 'accepted', 'cancelled'], default: "pending" },
        paymentMethod: { type: String, default: "COD" },
        paymentStatus: { type: String, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)