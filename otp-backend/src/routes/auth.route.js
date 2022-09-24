const express = require("express");
const router = express.Router();


const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  fetchCurrentUser, //perfect
  loginWithPhoneOtp, //perfect
  createNewUser,
  verifyPhoneOtp, //perfect
  handleAdmin //perfect
} = require("../controllers/auth.controller");


router.post("/register", createNewUser);

router.post("/login_with_phone", loginWithPhoneOtp);


router.post("/verify", verifyPhoneOtp);

router.get("/me", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

module.exports = router;