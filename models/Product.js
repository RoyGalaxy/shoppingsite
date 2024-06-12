const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        name: { type: String, required: true, unique: true },
        arabicName: { type: String, required: true, unique: true },
        description: { type: String, default: "" },
        arabicDescription: { type: String, default: "" },
        image: { type: String, required: true },
        catagory: { type: String, required: true },
        arabicCatagory: { type: String, required: true },
        price: { type: Number, required: true },
        model3d: { type: String, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", OrderSchema)