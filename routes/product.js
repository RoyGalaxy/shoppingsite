const router = require("express").Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const Product = require("../models/Product")
const multer = require("multer")
const path = require("path")
const uuid = require("uuid")

var StorageImage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null,path.join(__dirname,"../public",file.fieldname));
    },
    filename: function(req, file, callback) {
        const path = uuid.v4()+file.originalname
        req.body[file.fieldname] = `${file.fieldname}/${path}`
        callback(null,path);
    }
});


var upload = multer({
    storage: StorageImage
})

//  CREATE 
router.post("/",verifyTokenAndAdmin,upload.any("image"), async (req, res) => {
    console.log(req.body)
    if (res.status(200)) {
        console.log("Your file has been uploaded successfully.");
        console.log(req.body);
        const newProduct = new Product(req.body)
        try{
            const savedProduct = await newProduct.save()
            res.status(200).json(savedProduct)
        }catch(err){
            res.status(500).json(err)
        }
    }
})

// UPDATE
router.put("/:id",verifyTokenAndAdmin,upload.any("image"), async (req, res) => {
    console.log(req.body)
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET Product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (qCategory) {
            products = await Product.find({ category: qCategory })
        } else {
            products = await Product.find()
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
