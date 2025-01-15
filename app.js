if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash")
const ejsMate = require("ejs-mate");
const campgroundsroutes = require("./routes/campgrounds");
const reviewsroutes = require("./routes/reviews");
const userroutes = require("./routes/users");
const changepwdroutes = require("./routes/changepwd");
const resetpwdroutes = require("./routes/passreset");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local");
const User = require("./models/user")
const mongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongo");
const { transporter } = require("./mailconfig");

const dbUrl = process.env.DB_URL;
//const dbUrl = "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection errror :"));
db.once("open", () => {
    console.log("Database Connected");
})

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")) //for overriding post to delete
app.use(express.static(path.join(__dirname, "public")))
app.use(mongoSanitize({
    replaceWith: "_",
}));



const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SESSIONSECRET,
    touchAfter: 24 * 60 * 60
})

//setting up session
const sessionConfig = {
    store,
    name: "session",
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires 7 days from now
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://placify-djb3.onrender.com/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: "Welcome to Placify!",
                    text: `
Dear ${user.username},\n
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
                await user.save();
            }
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for flashing messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/auth/google", passport.authenticate("google", {
    access_type: "offline",
    scope: ["profile", "email"]
}));

app.get("/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome to Placify!");
        res.redirect("/places");
    }
);


app.use("/changepwd", changepwdroutes);
app.use("/resetpassword", resetpwdroutes);
app.use("/", userroutes);
app.use("/places", campgroundsroutes);
app.use("/places/:id/reviews", reviewsroutes);


app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError("Page not Found"));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!!!";
    }
    res.status(statusCode).render("error", { err });
})

app.listen(3000 || process.env.PORT, () => {
    console.log("Listening to PORT 3000");
})