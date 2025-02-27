const express = require("express")
const router = express.Router();
const methodOverride = require("method-override");
const Campground = require("../models/campgrounds");
const Review = require("../models/review")
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const{isAuthor,isLoggedIn} = require("../middleware");

//adding images
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.get("/",catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({}).populate("author");
    res.render("places/index",{campgrounds});
}));

router.get("/new",isLoggedIn,catchAsync(async(req,res,next)=>{
    res.render("places/new");
}))


router.post("/",upload.array("image"),catchAsync(async(req,res,next)=>{
        //if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
        const campground = new Campground(req.body.campground);
        campground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
        campground.author=req.user._id;
        await campground.save();
        req.flash("success","Successfully added a new place")
        res.redirect(`/places/${campground._id}`);
}))

router.get("/:id",catchAsync(async(req,res,next)=>{
        const { id } = req.params;
        //checks if "/campgrounds/id" is valid(if we enter random is prints not found)
        if (!mongoose.Types.ObjectId.isValid(id)) {
                req.flash("error", "Cannot find that place");
                return res.redirect("/places");
        }
        const c = await Campground.findById(req.params.id).populate({
                path:"reviews",
                populate:{
                        path:"author"
                }
        }).populate("author");
        if(!c){
                req.flash("error","Cannot find that campground");
                return res.redirect("/places");
        }
        res.render("places/show",{c});
}))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(async(req,res,next)=>{
        const campground = await Campground.findById(req.params.id);
        res.render("places/edit",{campground});
}))

router.post("/:id/like", isLoggedIn,async(req,res) => {
        const campground = await Campground.findById(req.params.id);
        if(!campground.likes.includes(req.user._id)) {
          //like
          campground.likes.push(req.user._id);
        } 
        else{ 
          //unlike
          campground.likes = campground.likes.filter(id => id.toString() !== req.user._id.toString());
        }
       await campground.save();
       res.json({ likes: campground.likes.length });
});

router.put("/:id",isLoggedIn,isAuthor,upload.array("image"),catchAsync(async(req,res,next)=>{
        const {id} = req.params;
        const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
        const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
        campground.images.push(...imgs);
        await campground.save();
        req.flash("success","Updated Successfully")
        res.redirect(`/places/${campground._id}`);
}))

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","Deleted successfully")
    res.redirect("/places");
}))

module.exports=router;