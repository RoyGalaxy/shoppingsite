const mongoose = require("mongoose");
const dotenv = require("dotenv")
const Product = require("./models/Product"); // Import your Mongoose model

const DEFAULT_RESTAURANT_ID = "67ee445c35a33e71f6eb65ef"; // Replace with actual restaurant ID

// Map categories to restaurant IDs (Modify as needed)

dotenv.config()

async function migrateProducts() {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(async () => {  
      const products = await Product.find({ catagory: { $exists: true } });

    for (const product of products) {
        const updatedCategory = product.catagory; // Get old `catagory` value

        await Product.updateOne(
            { _id: product._id },
            [
              {
                '$set': {
                  'category': '$catagory'
                }
              }, {
                '$unset': 'catagory'
              }
            ]
        );
    }

      mongoose.connection.close()
  
      console.log(`Updated ${products.length} products.`);
    })

    
}

migrateProducts();