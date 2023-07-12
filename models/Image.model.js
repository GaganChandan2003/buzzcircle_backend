const mongoose = require("mongoose");

const profileSchema =new mongoose.Schema({
    email:String,
    profile:{
        data:Buffer,
        contentType:String
    }
});

const ProfileModel=mongoose.model("profile",profileSchema);

module.exports=ProfileModel