const express = require('express');
const DestinationController = require('../controllers/DestinationController');
const ReviewController = require('../controllers/ReviewController');
const authentication = require('../middlewares/authentication');
const destinationRouter = express.Router();

destinationRouter.get('/', DestinationController.destinations);
destinationRouter.get('/tags', DestinationController.getTags);
destinationRouter.get('/:destinationId', DestinationController.destinationDetails);
destinationRouter.post('/:destinationId/schedule', authentication, DestinationController.addDestinationToSchedule);
destinationRouter.post('/:destinationId/reviews', authentication, ReviewController.addReviewToDestination);
destinationRouter.put('/:destinationId/reviews/:reviewId', authentication, ReviewController.updateReviewToDestination);
destinationRouter.delete('/:destinationId/reviews/:reviewId', authentication, ReviewController.deleteReview);

module.exports = destinationRouter;