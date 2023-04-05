const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController');
const authentication = require('../middlewares/authentication');

userRouter.post('/signup', UserController.signup);
userRouter.post('/login', UserController.login);
userRouter.get('/profile', authentication, UserController.getUserProfile);
userRouter.put('/profile', authentication,  UserController.updateUserProfile);


module.exports = userRouter;