const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapasync.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../Controllers/users.js")


// For signup route****************************************
router.get("/signup",userController.signUpForm)


router.post("/signup",wrapAsync(userController.signUpUser))



// for Login route*******************
router.get('/login',userController.loginForm)

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), userController.loginUser)


// For logout route
router.get("/logout",userController.logOutUser)


module.exports = router