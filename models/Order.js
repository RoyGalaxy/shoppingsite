const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true},
        paymentIntentId: { type: String },
        cutomerId: { type: String },
        products: [{
            productId: { type: String },
            quantity: { type: Number, default: 1 }
        }],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, enum: ['pending', 'accepted', 'cancelled'] ,default: "pending" },
        payment_status: { type: String, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)