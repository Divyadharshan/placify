const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");

const getISTDate = () => {
    const now = new Date();
    return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
};

const userschema = new Schema({
    email:{
        type:String,
        required:true,
    },
    dateJoined:{
        type:Date,
        default:getISTDate,
        immutable:true
    },
    /*
    googleId:{
        type:String,
        unique:true,
    }*/
    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/di5q8uqqc/image/upload/v1752672038/dp_e8jusg.jpg",
    },

});

userschema.plugin(passportlocalmongoose);

module.exports=mongoose.model("User",userschema);