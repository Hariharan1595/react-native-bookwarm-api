import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const profilePic = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password: hashedPassword,
      profilePic,
    });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(400).json("Something went wrong");
    console.log(error);
  }
};
export const signin = async(req, res) => {
  try {
    const{email,password}=req.body;
    if(!email||!password){
      return res.status(400).json({error:"All fields are required"})
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Invalid credentials"})
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({error:"Invalid credentials"})
    }
    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user:{
        id:user._id,
        username:user.username,
        email:user.email,
        profilePic:user.profilePic
      }
    })
  } catch (error) {
    res.status(400).json("Something went wrong");
    console.log(error);
    
  }
};
export const signout = (req, res) => {
  res.send("signout route");
};
