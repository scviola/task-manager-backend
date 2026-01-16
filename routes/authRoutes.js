// /api/auth → register, login
const express = require("express");
const router = express.Router();

const { registerValidation, loginValidation } = require("../validators/authValidator");
const { validate } = require('../middleware/validateMiddleware');
const { register, login, me, updateMe, updatePassword } = require("../controllers/authController");
const { protect } = require('../middleware/authMiddleware');


// Register
router.post("/register", registerValidation, validate, register);

// Login
router.post("/login", loginValidation, validate, login);

// Get current user info
router.get("/me", protect, me);

//Update current logged-in user
router.put("/me", protect, updateMe);

//Update password
router.put("/me/password", protect, updatePassword);

module.exports = router;
