const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        name: { type: String, required: true, unique: true },
        arabicName: { type: String, required: true, unique: true },
        description: { type: String, default: "" },
        arabicDescription: { type: String, default: "" },
        image: { type: String, required: true },
        category: { type: String, required: true },
        arabicCategory: { type: String, required: true },
        price: { type: Number, required: true },
        model3d: { type: String, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", ProductSchema)