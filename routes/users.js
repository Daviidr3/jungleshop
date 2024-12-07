const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User Sign In
router.post('/signin', userController.signIn);

// User Sign Up
router.post('/signup', userController.signUp);

module.exports = router;
