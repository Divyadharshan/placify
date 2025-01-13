const Campground = require("./models/campgrounds");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must sign in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    console.log(req.session.passport.user);
    const {id} = req.params;
        const campground = await Campground.findById(id);
        if(!campground.author.equals(req.user._id) && !req.session.passport.user===process.env.ADMIN_NAME){
                req.flash("error","You are not an author/admin!");
                res.redirect(`/campgrounds/${id}`);
        }
    next();
}