const express = require("express");
const router = express.Router();
const User = require("../models/user")
const passport = require("passport")
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuth } = require("../middleware");
const Campground = require("../models/campgrounds")
const review = require("../models/review")
const {transporter} = require("../mailconfig");

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

router.post("/register", isAuth, catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        //password is not required; bcoz it needs to be hashed
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Welcome to Placify!",
            text: `
Dear ${username},\n
    Welcome to Placify! 🎉. We’re thrilled to have you join our growing community of explorers and place enthusiasts. Whether you’re here to discover new destinations, share your favorite spots, or manage your explorations effortlessly, you’ve come to the right place.\n
    Here’s how you can get started:\n
        - Explore Places: Dive into a world of amazing destinations curated for you.\n
        - Share Your Favorites: Let others know about the places you love.\n
    We can’t wait to see where Placify takes you!\n\n
Happy exploring,\n
The Placify Team 🌟`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                req.flash("error", 'Invalid email!!!')
                return res.redirect("/register")

            }
        });
        const user = new User({ email, username });
        //due to usage of passport
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
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


router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "See you again!");
        res.redirect("/");
    });
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const campcount = await Campground.countDocuments({ author: req.user._id });
    const reviewcount = await review.countDocuments({ author: req.user._id });
    res.render("places/yourprofile", { user, campcount, reviewcount });
})

module.exports = router;