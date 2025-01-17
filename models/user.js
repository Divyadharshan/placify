const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");

const userschema = new Schema({
    email:{
        type:String,
        required:true,
    },
    dateJoined:{
        type:Date,
        default:Date.now,
        immutable:true
    },
    /*
    googleId:{
        type:String,
        unique:true,
    }*/
    profilePicture: {
        type: String,
        default: "https://static-00.iconduck.com/assets.00/profile-circle-icon-256x256-cm91gqm2.png",
    },

});

userschema.plugin(passportlocalmongoose);

module.exports=mongoose.model("User",userschema);