import jwt from "jsonwebtoken"
import User from "../models/users.model.js"

export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
           return res.status(401).json({message:"Unauthorized - No token Provided"})
        }
        //To decode the token which holds the user._id when signed up. Generated in generateToken() in lib/utils.js
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        if(!decodedToken){
           return res.status(401).json({message:"Unauthorized - Token Invalid"})
        }

        const user = await User.findById(decodedToken.userId).select("-password")
        if(!user){
           return res.status(404).json({message:"User not found"})
        }

        req.user = user
        next()
    } catch (error) {
        console.log("Error in proctedRoute middleware", error.message)
        res.status(500).json({message:"Internal server error"})
    }
    
}