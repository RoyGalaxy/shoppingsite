const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        title:{type:String,required:true,unique:true},
        description:{type:String,required:true},
        image:{type:String,required:true},
        category:{type:String,required:true},
        price:{type:String,required:true},
        model3d:{type:Number,required:true}
    },
    {timestamps:true}
)

module.exports = mongoose.model("Product",OrderSchema)