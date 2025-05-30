import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token  = req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({error:"Unauthorized"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({error:"Unauthorized"})
        console.log(error);
        
    }
}

export default protectRoute;