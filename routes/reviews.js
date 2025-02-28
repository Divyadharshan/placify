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

router.post("/:reviewId/like",isLoggedIn,catchAsync(async(req,res)=>{
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.likes.includes(req.user._id)){
        review.likes.push(req.user._id);
    }
    else{
        review.likes=review.likes.filter(id=>id.toString()!==req.user._id.toString());
    }
    await review.save();
    return res.json({likes : review.likes.length});
}))

module.exports=router;