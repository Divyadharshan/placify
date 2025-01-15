const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isAuth } = require('../middleware')
const jwt=require('jsonwebtoken');

router.get('/',isAuth, (req, res) => {
    let { id, token } = req.query;
    console.log(id,token);
    try {
        const check = jwt.verify(token, process.env.JWTSECRET)
        return res.render("users/resetpass", { id: id, token: token })
    } catch (error) {
        req.flash("error", "Link has expired")
        res.redirect('/changepwd')
    }

})
router.post('/',isAuth, async (req, res) => {
    const { newpassword } = req.body;
    const user = await User.findOne({ _id: req.query.id });
    if (user) {
        await user.setPassword(newpassword);
        await user.save()
        req.flash("success", "Password has been reset successfully")
        return res.redirect("/login");
    }
})

module.exports=router;