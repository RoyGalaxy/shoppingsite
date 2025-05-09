const router = require("express").Router()
const { verifyTokenAndAdmin } = require("./verifyToken")
const Product = require("../models/Product")
const formidable = require("formidable")
const path = require("path")
const fs = require("fs")

//  CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
        const [fields, files] = await form.parse(req)
        let strFields = {};
        // Getting fields
        for(let field in fields){
            strFields[field] = fields[field].join("")
        }
        for(let file in files){
            strFields[file] = files[file][0].filename
        }

        // uploading files
        for(let file in files){
            const oldPath = files[file][0].filepath
            const newPath = path.join(__dirname,`../public/${file}`) + "/" + files[file][0].newFilename
            const rawData = fs.readFileSync(oldPath)
            strFields[file] = "/" + file + '/' + files[file][0].newFilename
            
            fs.writeFile(newPath, rawData, (err) => err)
        }

        // Creating Product
        const newProduct = new Product(strFields)
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

// UPDATE
router.put("/:id",verifyTokenAndAdmin, async (req, res) => {
    try {
        const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true, allowEmptyFiles: true, minFileSize: 0 });
        const [fields, files] = await form.parse(req)
        let strFields = {};
        // Getting fields
        for(let field in fields){
            strFields[field] = fields[field].join("")
        }
        for(let file in files){
            strFields[file] = files[file][0].filename
        }

        // uploading files
        for(let file in files){
            if(files[file][0].size > 1){
                const oldPath = files[file][0].filepath
                const newPath = path.join(__dirname,`../public/${file}`) + "/" + files[file][0].newFilename
                const rawData = fs.readFileSync(oldPath)
                strFields[file] = path.join("/",file,files[file][0].newFilename)
                fs.writeFile(newPath, rawData, (err) => err)
            }
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
                $set: strFields
            },
            { new: true }
        )
        res.status(200).json({success: true, message: "Product has been updated!"})
    } catch (err) {
        console.log(err)
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
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ALL PRODUCTS
router.get("/restaurant/:restaurantId", async (req, res) => {
    if(process.env.secured == "true"){
    	res.status(500).send("Some Error Occured")
    	return;
    }
    const restaurantId = req.params.restaurantId;
    const newOnly = req.query.new
    const category = req.query.category
    try {
        let products;

        if (newOnly) {
            products = await Product.find().sort({ createdAt: -1, restaurantId }).limit(5)
        } else if (category) {
            products = await Product.find({ category, restaurantId })
        } else {
            products = await Product.find({restaurantId})
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
