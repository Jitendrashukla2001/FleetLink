import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";


export const createUser=async (req,res)=>{
          try {
        const {name,email,password}=req.body;

        if(!name || !email || !password)
        {
            return res.status(400).json({success:false,message:"Missing input fields!!!"});
        }
        let check=await User.findOne({email});
        if(check)
        {
         return res.status(400).json({success:false,message:"Email Already Exists"});
        }
        const hashPassword=await bcrypt.hash(password,10);
        const user=new User({name,email,password:hashPassword});
        await user.save();

        return res.status(201).json({success:true,message:'User registered !!'});

          } catch (error) {
            console.log(error)
          }
}

export const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
         if(!email || !password)
        {
            return res.status(400).json({success:false,message:"Missing input fields!!!"});
        }
        let user=await User.findOne({email});
        if(!user)
        {
           return res.status(400).json({success:false,message:"Email not exist"}); 
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch)
        {
         return res.status(400).json({success:false,message:"Invalid password!!"});
        }

        const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      // include other fields if needed
       };
        generateToken(res,userWithoutPassword,`Welcome back ${user.name}`)

    } catch (error) {
        console.log(error)
    }
}

export const logout=async (req,res)=>{
    try {
     return res.status(200).cookie("token","",{maxAge:0}).json({
        message:"Logged out successfully",
        success:true
     })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}