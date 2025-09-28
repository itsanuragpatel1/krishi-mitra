import app from './app.js'
import dotenv from "dotenv"
import mongoose from 'mongoose'


dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("server is listening at port ", port) 
})