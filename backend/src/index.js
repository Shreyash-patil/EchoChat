import express from 'express'
import cors from "cors"
import path from 'path'

// Authentication Routes 
import authRoutes from "../routes/auth.route.js"
import messageRoutes from "../routes/message.route.js"
import userRoutes from "../routes/user.route.js"

//Socket.io 
import {app, SocketServer} from "../lib/socket.js"

// User Credentials
import dotenv from 'dotenv'

//DB Connection
import { connectDB } from '../lib/db.js'

//To grab cookie
import cookieParser from "cookie-parser"

dotenv.config()

// const app= express()
// now this app comes from Socket.js
app.use(express.json({ limit: '20mb' })); // Increase to 10MB or more
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser())
app.use(cors(
    {
    origin:"http://localhost:5173",
    credentials:true
}
))

const PORT = process.env.PORT
const __dirname = path.resolve()


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes);

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}


app.get("/",(req,res)=>{
    res.send("Hellow")
})





SocketServer.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}/`);
    connectDB()
    
})