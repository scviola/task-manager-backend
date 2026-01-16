//Register/Login -  password hashing & authentication
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;

const register = async (req, res, next) => {
    try {
        const {name, email, password, role} = req.body;
        //check if email exists
        const existing = await User.findOne({email});
        if (existing)
            return res.status(400).json({message: "Email already exists"});

        const hashedPassword = await bcrypt.hash(password, 10); 

        const user = await User.create({name, email, password: hashedPassword, role});

        res.status(201).json({message: "User registered successfully"});

    } catch (error) {
        next(error);       
    }
};


//Login
const login = async(req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user)
            return res.status(401).json({message: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(401).json({message: "Invalid credentials"});

        const token = jwt.sign({id: user._id, role: user.role}, jwtSecret, {expiresIn: "7d"});
        
        res.status(200).json({           
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email, 
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

//to return currently authenticated user using data already stored in the JWT - for persistent client refresh
const me = async (req, res, next) => {
  try {
    if (!req.user)
        return res.status(401).json({ message: 'Not authenticated' });

    res.json({ user: req.user });

  } catch (error) {
    next(error);
  }
};

//PUT Update own profile - staff updates their own profile
const updateMe = async (req, res) => {
    try {
        const allowedFields = ["name", "email"];
        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field])
                updates[field] = req.body[field];
        });

        const updatedMe = await User.findByIdAndUpdate(
            req.user.id,        // logged-in user
            updates,
            {new: true, runValidators: true}
        );

        res.status(200).json({message: "Profile updated successfully", updated: updates});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//PUT update password
const updatePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword)
            return res.status(400).json({message: "Both passwords required"});

        const user = await User.findById(req.user.id).select("+password");

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(401).json({message: "Current password incorrect"});

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({message: "Password updated successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


module.exports = { register, login, me, updateMe, updatePassword };