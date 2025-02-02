const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isAuth } = require('../middleware')
const {transporter}=require('../mailconfig')
const jwt=require('jsonwebtoken')

router.get('/',isAuth,(req, res) => {
    res.render("users/changepwd")
})

router.post('/',isAuth,async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        req.flash("error", "User doesn't exists");
        return res.redirect("/changepwd")
    }
    const token = jwt.sign({ id: user._id, email: user.email },process.env.JWTSECRET, { expiresIn: '120s' });
    const resetURL = `https://placify-three.vercel.app/resetpassword?id=${user._id}&token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Placify - Forgot Password',
        text: `
    You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
    Please click on the following link, or paste this into your browser to complete the process:\n
    ${resetURL}\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            req.flash("error", 'Invalid email')
            return res.redirect("/changepwd")

        } else {
            req.flash("success", 'Successfully reset link has been sent')
            return res.redirect("/changepwd")
        }
    });
})
module.exports=router;
