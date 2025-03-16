const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users with risk data
router.get('/users', userController.getUsers);

// Get specific user with risk data
router.get('/users/:id', userController.getUser);

// Ban a user
router.post('/users/ban', userController.banUser);

// Unban a user
router.post('/users/unban', userController.unbanUser);

// Send warning to a user
router.post('/users/warn', userController.sendWarning);

// Search users
router.get('/users/search/:query', userController.searchUsers);

module.exports = router;