const router = require("express").Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const Cart = require("../models/Cart")
const { update } = require("../models/Cart")

//  CREATE

router.post("/",verifyToken,async(req,res)=> {
    console.log(req.body)
    const newCart = new Cart(req.body)
    try{
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }
})

// UPDATE
router.put("/:id",verifyTokenAndAuthorization,async(req,res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            {new:true}
        )
        console.log(updatedCart)
        res.status(200).json(updatedCart).end()
    }catch(err){
        res.status(500).json(err).end()
    }
})

// DELETE
router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})

// GET User Cart
router.get("/find/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
        const cart = await Cart.findOne({id: req.params.id})
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})
// GET ALL
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router
