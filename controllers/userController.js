const User = require('../models/User');

//CRUD
// GET/ Find users - admin sees all, others see only themselves
const getUsers =  async(req, res) => {
    try {
        let users;

        if (req.user.role === "admin")
            users = await User.find();
        else
            users = await User.findById(req.user.id);

        if (!users || users.length === 0)
            return res.status(200). json({message: "Users not found"})

        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// GET/:id Find one user - admin can see anyone, staff only themselves
const getUser = async(req, res) => {
    try {
        let user;

        if (req.user.role === "admin")
            user = await User.findById(req.params.id);
        else
            if (req.user.id !== req.params.id)
                return res.status(403).json({message: "Access denied"});

        user = await User.findById(req.params.id);

        if(!user)
            return res.status(404).json({message: "User not found"})
        
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// POST/ create user - admin only
const createUser = async(req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({message: "Access denied"});

        const {name, email, password, role} = req.body;

        if (!name || !email || !password || !role)
            return res.status(400).json({message: "All fields required"})

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({name, email, password: hashedPassword, role});
        res.status(201).json({message: "User created successfully", newUser})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

// PUT/:id Update user - admin updates
const updateUserByAdmin = async(req, res) => {
    try {
        const allowedFields = ["name", "email", "role"];
        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field])
                updates[field] = req.body[field];
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            {new: true, runValidators: true}
        );

        if (!updatedUser)
            return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "User updated successfully", updated: updates});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// DELETE/ Delete user
const deleteUser = async(req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({message: "Access denied"});

        const deleted = await User.findByIdAndDelete(req.params.id);
        
        if (!deleted)
            return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "User deleted successfully", deleted})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

module.exports = { getUsers, getUser, createUser, updateUserByAdmin, deleteUser };