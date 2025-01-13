const express = require("express")
const router = express.Router({mergeParams:true});
const methodOverride = require("method-override");
const Campground = require("../models/campgrounds");
const Review = require("../models/review")
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn} = require("../middleware");

router.post("/",isLoggedIn,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","Review is added")
    res.redirect(`/places/${campground._id}`);
}))

router.delete("/:reviewId",isLoggedIn,catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    //await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted")
    res.redirect(`/places/${id}`);
}))

module.exports=router;