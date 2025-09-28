import mongoose from "mongoose";


const schemeSchema=new mongoose.Schema({
  title: {
      type: String,
      required: true,
      trim: true
    },
    shortDesc: {
      type: String,
      required: true,
      trim: true
    },
    fullDescription: {
      type: String,
      required: true
    },
    eligibility: {
      type: String,
      required: true
    },
    benefits: {
      type: String,
      required: true
    },
    applyLink: {
      type: String,
      required: true
    },
    launchDate: {
      type: Date,
      required: true
    },
    deadLine: {
      type: Date,      
      default: null
    },
    imageUrl: {
      type: String,
      required: true
    },
    schemeType: {
      type: String,
      required: true
    },
    contactInfo: {
      type: String,    
      required: true
    }
},{timestamps:true})


const schemeModel=mongoose.model('schemes',schemeSchema)

export {schemeModel}