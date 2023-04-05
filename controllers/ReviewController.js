const { Destination, Review } = require('../models');

class ReviewController {

  static async addReviewToDestination(req, res, next) {
    try {
      const UserId = req.user.id;
      const DestinationId = req.params.destinationId;
      const destination = await Destination.findByPk(DestinationId);
      if (!destination) {
        throw { name: 'NotFound' };
      }
      const newReview = await Review.create({ ...req.body, UserId, DestinationId });
      res.status(201).json({ newReview, message : `Post Review Success!` });
    } catch (err) {
      next(err);
    }
  }

  static async updateReviewToDestination(req, res, next) {
    try {
      const user = req.user;
      const DestinationId = req.params.destinationId;
      const reviewId = req.params.reviewId;
      const destination = await Destination.findByPk(DestinationId);
      const review = await Review.findByPk(reviewId);
      if (!destination || !review || review.DestinationId !== destination.id) {
        throw { name: 'NotFound' };
      }
      if (review.UserId !== user.id) {
        throw { name : 'Forbidden' }
      }
      await Review.update(req.body, { where: { id: reviewId } });
      res.status(200).json({ message : `Update Review Success!` });
    } catch (err) {
      next(err);
    }
  }

  static async deleteReview(req, res, next) {
    try {
      const DestinationId = req.params.destinationId;
      const reviewId = req.params.reviewId;
      const destination = await Destination.findByPk(DestinationId);
      const review = await Review.findByPk(reviewId);
      if (!destination || !review) {
        throw { name: 'NotFound' };
      }
      await Review.destroy({ where: { id: reviewId } });
      res.status(200).json({ review, message : `Delete review success!` });
    } catch(err) {
      next(err);
    }
  }

}

module.exports = ReviewController;