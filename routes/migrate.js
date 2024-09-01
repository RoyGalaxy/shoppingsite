const mongoose = require('mongoose');
const Product = require('../models/Product')
const Restaurant = require('../models/Restaurant')

async function migrateProducts() {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const products = await Product.find();

    for (const product of products) {
        // Assuming you have some logic to determine the restaurantId for each product
        // This could be based on the product's name, description, or any other data
        // Here, we'll just use a placeholder function getRestaurantIdForProduct
        const restaurantId = await getRestaurantIdForProduct(product);

        product.restaurantId = restaurantId;
        await product.save();
    }

    console.log('Migration completed.');
    mongoose.disconnect();
}

async function getRestaurantIdForProduct(product) {
    // Implement your logic to find the correct restaurantId for a product
    // This is just an example
    const restaurant = await Restaurant.findOne({ name: 'Lavash' });
    return restaurant ? restaurant._id : null;
}

migrateProducts().catch(error => {
    console.error('Migration failed:', error);
    mongoose.disconnect();
});