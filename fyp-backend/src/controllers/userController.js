const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register a new User

exports.registerUser= async (req,res)=>{
    try {
        const {name,email,password} = req.body;

        //check if user already exists

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:'User already exists'});
        }

        //Hash the password
       // const hashedPassword=away bcrypt.hash(password,10);
        
       const newUser = new User({name, email,password:hashedPassword, role});
        await newUser.save();


        res.status(201).json({message:"User registered Sussfully", user:newUser});
    } catch(error){
        res.status(500).json({message:"Server error"});
    }
};

//Login a User
exports.loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        // Check if the User exist
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'Invalid credentials'});
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: 'Invalid credentials'});
        }


        //Generate JWT token
        const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET,{expires:"1h"});

        res.status(200).json({message:"Login Successfuly",token,user});

    } catch(error){
        res.status(500).json({message:"Server error"});
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }
        res.status(200).jason(user);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};



// Get User Profile

exports.getProfile=async(req, res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};



// Update User Profile
exports.updateProfile = async (req, res) => {
    try{
        const {name, email}=req.body;
        const updateUser= await User.findByIdAndUpdate(req.user.Id,{name,email},{new:true});
        res.status(200).json({message:"User information udpated", updateUser});
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};


// Delete User Profile
exports.deleteProfile = async (req, res) => {
    try{
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({message:"User Deleted Successfully"});
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};