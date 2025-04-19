const router = require("express").Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const cryptoJs = require("crypto-js")
const User = require("../models/User")
const Restaurant = require("../models/Restaurant")

// UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = cryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others })
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ALL USERS
// TODO: ADD VERIFY TOKEN AND ADMIN
router.get("/", async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find({role: 'user'}).sort({ _id: -1 }).limit(10) : await User.find({role: 'user'})
        const safeUsers = users.map(user => {
            const { password, ...others } = user._doc;
            return others;
        });
        res.status(200).json(safeUsers)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ALL ADMIN USERS
// TODO: ADD VERIFY TOKEN AND ADMIN
router.get("/admins", async (req, res) => {
    try {
        const users = await User.find({ role: 'restaurant_owner' })
        const safeUsers = users.map(user => {
            const { password, ...others } = user._doc;
            return others;
        });
        // Get restaurant details for each admin user
        const adminUsersWithRestaurants = await Promise.all(
            safeUsers.map(async (user) => {
                const restaurant = await Restaurant.findOne({ ownerId: user._id });
                return {
                    ...user,
                    restaurantName: restaurant ? restaurant.name : null
                };
            })
        );

        res.status(200).json(adminUsersWithRestaurants)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Approve an admin
router.put("/admins/:id/accept", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedAdmin = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isVerified: true } },
            { new: true }
        );
        if (!updatedAdmin) return res.status(404).json({ success: false, message: "Admin not found" });
        res.status(200).json({ success: true, message: "Admin accepted", admin: updatedAdmin });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});

// Reject an admin
router.put("/admins/:id/reject", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedAdmin = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isVerified: false } },
            { new: true }
        );
        if (!updatedAdmin) return res.status(404).json({ success: false, message: "Admin not found" });
        res.status(200).json({ success: true, message: "Admin rejected", admin: updatedAdmin });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});
// GET USER STATS
router.get("/stats/", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
