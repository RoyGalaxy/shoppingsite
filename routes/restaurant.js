const router = require("express").Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndSuperAdmin } = require("./verifyToken")
const formidable = require("formidable")
const path = require("path")
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const fs = require("fs")

// Create New Restaurant
router.post('/create/:id', verifyTokenAndAdmin, async (req,res) => {
    try{
        const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
        const [fields, files] = await form.parse(req)
        fields['ownerId'] = [req.params.id];

        // Check for existing retaurant with same name
        const restaurant = await Restaurant.findOne({name: fields['name'][0]})
        if(restaurant) {
            res.status(400).json('Restaurant With same name exists').end()
            return;
        }
        let strFields = {};
        // Getting fields
        for(let field in fields){
            if(field == "status") continue;
            strFields[field] = fields[field].join("")
        }
        for(let file in files){
            strFields[file] = files[file][0].filename;
        }

        console.log(strFields)

        // uploading files
        for(let file in files){
            const oldPath = files[file][0].filepath
            const newPath = path.join(__dirname,`../public/${file}`) + '/' + files[file][0].newFilename
            const rawData = fs.readFileSync(oldPath)
            strFields[file] = "/" + file + '/' + files[file][0].newFilename;
            
            fs.writeFile(newPath, rawData, (err) => err)
        }

        // Creating Restaurant
        const newRestaurant = new Restaurant(strFields)
        await newRestaurant.save()
        res.status(200).json({success: true, restaurantId: newRestaurant._id, message:"Restaurant Applied for verification"})
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

// View Restaurants
router.get('/:filter', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const filter = req.params.filter;
        let query = {};

        // Apply filters based on the filter parameter
        switch (filter) {
            case 'all':
                // Get all restaurants
                query = {};
                break;
            case 'approved':
                // Get only approved restaurants
                query = { status: 'approved' };
                break;
            case 'pending':
                // Get pending restaurants
                query = { status: 'pending' };
                break;
            case 'rejected':
                // Get rejected restaurants
                query = { status: 'rejected' };
                break;
            default:
                return res.status(400).json('Invalid filter parameter');
        }

        const restaurants = await Restaurant.find(query);
        res.status(200).json(restaurants);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

// Get All restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching restaurants", error: err.message });
    }
});


// Approve restaurant
router.post('/approve/:id',verifyTokenAndSuperAdmin, async (req,res) => {
    // Check For existence of restaurant and Owner
    const restaurant = await Restaurant.findById(req.params.id);
    if(!restaurant) res.status(404).json('Restaurant Not Found').end();
    const user = await User.findById(restaurant.ownerId);
    if(!user) res.status(404).json('Restaurant Owner Not Found').end();

    // Approve The Restaurant
    restaurant.status = "approved";
    user.role = "restaurant_owner";

    await restaurant.save()
    await user.save()
    res.status(200).json("Restaurant Approved").end();
})

// Get Restaurant by User ID
router.get('/client/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.params.userId });
        
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Populate owner details if needed
        const populatedRestaurant = await Restaurant.findById(restaurant._id)
            .populate('ownerId', 'name email phone role');

        res.status(200).json(populatedRestaurant);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching restaurant details", error: err.message });
    }
});

module.exports = router;