const { Schema, model } = require("mongoose");


const restaurantSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true},
    arabicName: { type: String, required: true},
    phone: {type: String, required: true},
    email: { type: String, required: true},
    status: { type: Boolean, enum: ['approved', 'rejected', 'pending'], default: 'pending'},
    logoUrl: {type: String, requied: true}
})

module.exports = model("Restaurant", restaurantSchema)