const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        paymentIntentId: { type: String },
        cutomerId: { type: String },
        products: [{
            productId: { type: String },
            quantity: { type: Number, default: 1 }
        }],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "pending" },
        payment_status: { type: String, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)