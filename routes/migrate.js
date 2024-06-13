const mongoose = require('mongoose');
const Product = require('../models/Product')
const Restaurant = require('../models/Restaurant')

async function mirgrateProducts(){
    await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const products = await Product.find();

    for(const product of products){
        
    }
}