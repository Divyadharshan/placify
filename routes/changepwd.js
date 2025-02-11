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
    const resetURL = `https://${req.headers.host}/resetpassword?id=${user._id}&token=${token}`;
    const username = user.username;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Placify - Forgot Password/Username',
        text: `
You are receiving this mail because you(or someone else) have requested to know username/change password.\n
Your username is: ${username}\n
In case you need to change password use the link below:
${resetURL}\n
If you did not request this, please ignore this email, and your password will remain unchanged.\n
Best regards,
The Placify Team 🌟`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            req.flash("error", 'Invalid email')
            return res.redirect("/changepwd")

        } else {
            req.flash("success", 'Password reset link has been sent to your mail')
            return res.redirect("/changepwd")
        }
    });
})
module.exports=router;
