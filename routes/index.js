const express = require('express');
const destinationRouter = require('./destinationRoutes');
const scheduleRouter = require('./scheduleRoutes');
const router = express.Router();
const userRouter = require('./userRoutes');

router.use('/', userRouter);
router.use('/destinations', destinationRouter);
router.use('/schedules', scheduleRouter)

module.exports = router;