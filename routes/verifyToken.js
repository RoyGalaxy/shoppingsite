const jwt = require("jsonwebtoken")
const User = require("../models/User")

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err,user) => {
            if(err) res.status(401).json("You are not authenticated").end()
            req.user = user;
            next()
        })
    }else{
        return res.status(401).json("You are not authenticated")
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,async ()=>{

        const user = await User.findById(req?.user?.id);
        if(!user) res.status(403).json('{"message":"You are not authenticated"}')
        if(user._id == req.body.userId || user.role === 'super_admin' || user.role === 'restaurant_owner'){
            next()
        }else{
            res.status(403).json('{"message":"You are not authenticated"}')
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,async ()=>{
        const user = req.user.id != 'admin' ? await User.findById(req.user.id) : req.user;
        if(user.role == 'admin' || user.role == 'restaurant_owner'){
            next()
        }else{
            res.status(403).json({message: "You are not allowed to do that!"})
        }
    })
}

const verifyTokenAndSuperAdmin = (req, res, next) => {
    verifyToken(req, res, async () => {
        // const user = await User.findById(req.user.id);
        
        // // Check if the user credentials match environment variables
        // if (user.email === process.env.ADMIN_EMAIL && 
        //     user.password === process.env.ADMIN_PASSWORD && 
        //     user.role === 'super_admin') {
        if(req.user.role == 'admin') {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
}

module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndSuperAdmin}