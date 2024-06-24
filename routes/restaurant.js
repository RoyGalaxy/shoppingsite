const router = require("express").Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndSuperAdmin } = require("./verifyToken")
const formidable = require("formidable")
const path = require("path")
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const fs = require("fs")

// Create New Restaurant
router.post('/create/:id',verifyTokenAndAuthorization, async (req,res) => {
    try{
        const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
        const [fields, files] = await form.parse(req)
        fields['ownerId'] = [req.params.id];

        // Check for existing retaurant with same name
        const restaurant = await Restaurant.findOne({name: fields['name'][0]})
        if(restaurant) {
            res.status(400).json('Restaurnat With same name exists').end()
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

        // uploading files
        for(let file in files){
            const oldPath = files[file][0].filepath
            const newPath = path.join(__dirname,`../public/${file}`) + "/" + files[file][0].newFilename
            const rawData = fs.readFileSync(oldPath)
            strFields[file] = path.join("/",file,files[file][0].newFilename)
            
            fs.writeFile(newPath, rawData, (err) => err)
        }

        // Creating Restaurant
        const newRestaurant = new Restaurant(strFields)
        const savedRestaurant = await newRestaurant.save()
        console.log(savedRestaurant)
        res.status(200).json("Restaurant Applied for verification")
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

// View Restaurants
router.get('/:filter', verifyTokenAndAuthorization, (req, res) => {

})

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

    console.log(restaurant, user)
    await restaurant.save()
    await user.save()
    res.status(200).json("Restaurant Approved").end();
})

module.exports = router;