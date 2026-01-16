const express = require('express');
const router = express.Router();

const { getUsers, getUser, createUser, updateUserByAdmin, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');


router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, authorize("admin"), getUser);
router.post("/", protect, authorize("admin"), createUser);
router.put("/:id", protect, authorize("admin"), updateUserByAdmin);
router.delete("/:id", protect, authorize("admin"), deleteUser);


module.exports = router;