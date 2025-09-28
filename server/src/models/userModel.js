import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        lowercase:true,
        // unique:true,
        index:true
    },
    mobileNo:{
        type:Number,
        trim:true,
        // unique:true,
        index:true
    },
    name:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    language: {
      type: String,
      default: "en", // ml = Malayalam, en = English
    },
    location: {
      village: String,
      district: String,
      state: { type: String },
      pincode: String,
      coordinates: {
        lat: Number,
        lon: Number,
      },
    },
    soilType:{
        type:String
    }
},{timestamps:true})

const userModel=mongoose.model('user',userSchema)

export {userModel}