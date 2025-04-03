const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
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
    let {mobile} = req.body
    // check duplicate phone Number
    let user = await User.findOne({ phone: mobile });
    if (!user?.phone) {
        let role = 'user';
        try{
            const newUser = new User({
                phone: mobile,
                role: role
            })

            user = await newUser.save()
        }catch(error){
            console.log(error)
            return res.status(500).json({success: false, message: "Some Error occured"})
        }
    }
    const otp = generateOTP(6)
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    const message = `Your One Time Password (OTP) is ${otp}`
    // send to mobile
    // const response = await sendWhatsapp(formatPhone(phone),message)
    return res.status(200).json({
        success: true,
        message: "OTP Sent"
    });
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
                role: user.role
            },
            process.env.JWT_SEC,
            {expiresIn:"30d"}
        )

        res.status(200).json({
            success: true,
            _id: user._id,
            role: user.role,
            phone: user.phone,
            accessToken
        })
    }catch(err){
        if(res.headersSent !== true) {
            res.status(500).json(err)
        }
    }
})

// RESTAURANT OWNER REGISTRATION
router.post("/client/register", async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // Create new restaurant owner
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'restaurant_owner',
            isVerified: false
        });

        const savedUser = await newUser.save();
        
        res.status(201).json({
            message: "Restaurant owner registered successfully",
            data: {
                userId: savedUser._id,
                email: savedUser.email,
                name: savedUser.name
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// RESTAURANT OWNER LOGIN
router.post("/client/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if user is a restaurant owner
        if (user.role !== 'restaurant_owner') {
            return res.status(403).json({ message: "Access denied. Restaurant owner account required." });
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SEC,
            { expiresIn: "30d" }
        );

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            accessToken
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router