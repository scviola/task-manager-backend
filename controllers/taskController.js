const Task = require('../models/Task');

//CRUD
//GET/ all tasks 
const getTasks = async(req, res) => {
    try {
        let filter;

        if (req.user.role === "admin")
            filter = {};   // get all tasks
        else 
            filter = {owner: req.user.id};   // get only staff tasks

        const tasks = await Task.find(filter);

        if (tasks.length === 0)
            return res.status(200). json({message: "No tasks found"})

        res.status(200).json(tasks)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

//GET/:id task by ID - single task access control
const getTask = async(req, res) => {
    try {
        let task;

        if (req.user.role === "admin")
            task = await Task.findById(req.params.id);
        else
            task = await Task.findOne({
                _id: req.params.id,
                owner: req.user.id
            });

        if(!task)
            return res.status(404).json({message: "Task not found"})

        res.status(200).json(task)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

//POST/ create task - admin only
const createTask = async(req, res) => {
    try {
        const {title, status, owner} = req.body;

        if (!title || !owner)
            return res.status(400).json({message: "Title and owner required"})

        const newTask = await Task.create({title, status, owner});
        res.status(201).json({message: "Task created successfully", newTask})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

//PUT/ update task 
const updateTask = async(req, res) => {
    try {
        let task;

        if (req.user.role === "admin")      //admin can update any task
            task = await Task.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new: true, runValidators: true}
            );      
        else
            task = await Task.findByIdAndUpdate(        //staff can update only their own tasks
                {_id: req.params.id, owner: req.user.id},
                req.body,
                {new: true, runValidators: true}
            );      

        if (!task)
            return res.status(404).json({message: "Task not found"})

        res.status(200).json({message: "Task updated successfully", updated: req.body});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};


//DELETE/ delete task - admin only
const deleteTask = async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task)
            return res.status(404).json({message: "Task not found"})

        res.status(200).json({message: "Task deleted successfully", task})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };