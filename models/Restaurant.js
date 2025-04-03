const { Schema, model } = require("mongoose");


const restaurantSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    arabicName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    logoUrl: { type: String, required: true },
    status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending'},
})

module.exports = model("Restaurant", restaurantSchema)