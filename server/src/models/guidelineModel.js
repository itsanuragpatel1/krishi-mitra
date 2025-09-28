import mongoose from "mongoose";


const guidelineSchema = new mongoose.Schema(
  {
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
    content: {
      type: String,
      required: true // full guideline text (HTML/Markdown)
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    publishDate: {
      type: Date,
      default: Date.now
    },
    author: {
      type: String,
      default: "Government",
      trim: true
    }
  },
  { timestamps: true }
);


const guidelineModel=mongoose.model('guidelines',guidelineSchema)

export {guidelineModel}