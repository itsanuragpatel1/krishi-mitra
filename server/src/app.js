import express from "express"
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
// app.use(cors({credentials:true}))
app.use(cors({
  origin:['http://localhost:5173','https://krishi-mitra-coral.vercel.app'] ,  
  credentials: true                // allow cookies
}));


app.get('/',(req,res)=>{
    res.send("hello sir")
})


app.use('/api/user',userRoutes)

export default app