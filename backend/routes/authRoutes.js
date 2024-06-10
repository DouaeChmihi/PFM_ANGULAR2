// routes/authRoutes.js
const express = require('express');
const { register, login, logout, getUser } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
router.get('/user', getUser)
router.post('/logout', logout)

module.exports = router;
