const express = require('express');
const DestinationController = require('../controllers/DestinationController');
const authentication = require('../middlewares/authentication');
const scheduleRouter = express.Router();

scheduleRouter.get('/', authentication, DestinationController.getSchedules);
scheduleRouter.put('/:scheduleId', authentication, DestinationController.updateSchedule);
scheduleRouter.delete('/:scheduleId', authentication, DestinationController.deleteSchedule);

module.exports = scheduleRouter;