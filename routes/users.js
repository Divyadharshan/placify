const express = require("express");
const router = express.Router();
const User = require("../models/user")
const passport = require("passport")
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn} = require("../middleware");
const Campground = require("../models/campgrounds")
const review = require("../models/review")

router.get("/login",(req,res)=>{
    res.render("users/login")
})

//login using passportjs
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(req,res,next)=>{
    req.flash("success","Welcome Back to Placify!");
    res.redirect("/places");
})


router.get("/register",(req, res) => {
    res.render("users/register")
})

router.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        //password is not required; bcoz it needs to be hashed
        const user = new User({ email, username });
        //due to usage of passport
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Placify!")
            res.redirect("/places");
        })
        
    }
    catch (e) {
        if (e.name === "UserExistsError") {
        req.flash("error", "Username already exists. Please try another.");
      } else if (e.message.includes("duplicate key")) {
         req.flash("error", "Email already registered. Please try another.");
      } else {
        req.flash("error", e.message);
      }
       res.redirect("/register");
    }
}))


router.get("/logout", (req, res, next) => {
        req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "See you again!");
        res.redirect("/");
    });
}); 

router.get("/profile",isLoggedIn,async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const campcount = await Campground.countDocuments({author:req.user._id});
    const reviewcount = await review.countDocuments({author:req.user._id});
    res.render("places/yourprofile",{user,campcount,reviewcount});
})

module.exports = router;