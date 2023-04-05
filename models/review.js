'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Users);
      Review.belongsTo(models.Destination);
    }
  }
  Review.init({
    UserId: DataTypes.INTEGER,
    DestinationId: DataTypes.INTEGER,
    review: {
      type : DataTypes.TEXT,
      validate : {
        len : {
          args : [10, 250],
          msg : 'Review length must be between 10 and 250 characters'
        }
      }
    },
    rating: DataTypes.INTEGER,
    visitDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};