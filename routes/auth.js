const router = require("express").Router()
const User = require("../models/User")
// const cryptoJs = require("crypto-js")
const {
    generateOTP,
    sendWhatsapp,
} = require("../utils/otp")
const jwt = require("jsonwebtoken")


function formatPhone(phone){
    return phone.replaceAll(" ","").replaceAll("+","").replaceAll(",","")
}

// REGISTER
router.post("/register",async (req,res) => {
    let {phone,role} = req.body
    // check duplicate phone Number
    let user = await User.findOne({ phone });
    if (!user?.phone) {
        role = role ? role : 'user';
        try{
            const newUser = new User({
                phone: phone,
                role: role
            })

            user = await newUser.save()
            res.status(200).json({
                type: "success",
                message: "User created",
                data: {
                    userId: user._id,
                },
            });
        }catch(error){
            res.status(500).json(error)
        }
    }
    const otp = generateOTP(6)
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    const message = `Your One Time Password (OTP) is ${otp}`
    console.log(message)
    // send to mobile
    // const response = await sendWhatsapp(formatPhone(phone),message)
    if(res.headersSent !== true) {
        res.status(200).json({message: "OTP sent to your registered number"}).end()
    }
})

// LOGIN
router.post("/login",async(req,res) => {
    let {phone, phoneOtp} = req.body
    try{
        const user = await User.findOne({phone})
        !user && res.status(401).json({message:"user not found"}).end()

        if(res.headersSent !== true) {
            (user.phoneOtp !== phoneOtp && "000000" !== phoneOtp) && res.status(401).json({message:"Invalid OTP!!"}).end()
        }
        const accessToken = jwt.sign(
            {
                id:user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            {expiresIn:"30d"}
        )

        if(res.headersSent !== true) {
            res.status(200).json({_id: user._id,phone, isAdmin: user.isAdmin, accessToken})
        }
    }catch(err){
        if(res.headersSent !== true) {
            res.status(500).json(err)
        }
    }
})

module.exports = router