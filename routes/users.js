const express = require("express");
const router = express.Router();
const User = require("../models/user")
const passport = require("passport")
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuth } = require("../middleware");
const Campground = require("../models/campgrounds")
const review = require("../models/review")
const jwt = require("jsonwebtoken");
const { transporter } = require("../mailconfig");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
router.get("/login", isAuth, (req, res) => {
    res.render("users/login")
})

//login using passportjs
router.post("/login", isAuth, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), (req, res, next) => {
    req.flash("success", "Welcome Back to Placify!");
    res.redirect("/places");
})


router.get("/register", isAuth, (req, res) => {
    res.render("users/register")
})

router.post("/register", isAuth, async (req, res) => {
    try {
        const { email, username } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            req.flash("error", "Username or Email already exists. Please try another.");
            return res.redirect("/register");
        }
        const token = jwt.sign({ email, username }, process.env.JWTSECRET, { expiresIn: "300s" });
        const verifylink = `https://${req.headers.host}/verifyaccount/${token}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verify Your Account - Placify",
            text: `
Dear ${username},
Click the link below to verify your account:
${verifylink}
This link expires in 5 minutes.\n
Happy exploring,
Placify Team 🌟`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                req.flash("error", "Invalid email!");
                return res.redirect("/register");
            }
            else {
                req.flash("success", "Verification link has been sent to your mail");
                return res.redirect("/login");
            }
        })
    }
    catch (ex) {
        req.flash("error", ex.message);
        res.redirect("/register");
    }
})

router.get("/verifyaccount/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        const { email, username } = decoded;
        res.render("users/setpassword", { username, email });
    }
    catch (e) {
        req.flash("error", "Invalid or expired token");
        res.redirect("/register");
    }
})

router.post("/setpassword", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Welcome to Placify!",
            text: `
Dear ${user.username},\n
    Welcome to Placify! 🎉. We’re thrilled to have you join our growing community of explorers and place enthusiasts. Whether you’re here to discover new destinations, share your favorite spots, or manage your explorations effortlessly, you’ve come to the right place.\n
    Here’s how you can get started:
        - Explore Places: Dive into a world of amazing destinations curated for you.
        - Share Your Favorites: Let others know about the places you love.\n
    We can’t wait to see where Placify takes you!\n\n
Happy exploring,
The Placify Team 🌟`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                req.flash("error", 'Invalid email!!!')
                return res.redirect("/register")

            }

        });
        req.login(user, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Placify!");
            res.redirect("/places");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
})

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "See you again!");
        res.redirect("/");
    });
});

router.get("/yourprofile", isLoggedIn, async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const campcount = await Campground.countDocuments({ author: req.user._id });
    const reviewcount = await review.countDocuments({ author: req.user._id });
    res.render("places/yourprofile", { user, campcount, reviewcount });
})

router.get("/profile/:username",async(req,res)=>{
    const{username}=req.params;
    const user = await User.findByUsername(username);
    if(user){
        const campcount = await Campground.countDocuments({ author: user._id });
        const reviewcount = await review.countDocuments({ author: user._id });
        res.render("places/yourprofile", { user, campcount, reviewcount });
    }
    else{
        req.flash("error","Username doesn't exist!");
        return res.redirect("/places");
    }
})

router.get("/editprofile", isLoggedIn, async (req, res, next) => {
    res.render("places/editprofile");
})

router.put("/editprofile", upload.single("image"), async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (req.body.user.username) {
            user.username = req.body.user.username;
        }
        if (req.file) {
            user.profilePicture = req.file.path;
        }
        await user.save();
        req.login(user, (err) => {
            if (err) {
                return res.redirect("/editprofile");
            }

            req.flash("success", "Username updated successfully!");
            res.redirect("/profile");
        });
    }
    catch (e) {
        req.flash("error", "Username already exists");
        return res.redirect("/editprofile");
    }
})

module.exports = router;