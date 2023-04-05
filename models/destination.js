'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    
    static associate(models) {
      // define association here
      Destination.hasMany(models.Image);
      Destination.belongsToMany(models.Tag, {through : models.DestinationTags});
      Destination.hasMany(models.Review);
      Destination.hasMany(models.Schedule);
    }
  }
  Destination.init({
    name: {
      type : DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull : {
          msg : 'Destination name cannot be null'
        },
        notEmpty : {
          msg : 'Destination name cannot be empty'
        }
      }
    },
    address: {
      type : DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull : {
          msg : 'Destination address cannot be null'
        },
        notEmpty : {
          msg : 'Destination address cannot be empty'
        }
      }
    },
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    price: DataTypes.FLOAT,
    openTime: DataTypes.TIME,
    closeTime: DataTypes.TIME,
    description: {
      type : DataTypes.TEXT,
      allowNull:false,
      validate: {
        notNull : {
          msg : 'Destination description cannot be null'
        },
        notEmpty : {
          msg : 'Destination description cannot be empty'
        }
      }
    },
    latitude : {
      type : DataTypes.FLOAT,
      allowNull:false,
      validate: {
        notNull : {
          msg : 'Latitude cannot be null'
        },
        notEmpty : {
          msg : 'Latitude cannot be empty'
        }
      }
    },
    longitude : {
      type : DataTypes.FLOAT,
      allowNull:false,
      validate: {
        notNull : {
          msg : 'Longitude cannot be null'
        },
        notEmpty : {
          msg : 'Longitude cannot be empty'
        }
      }
    },
    googlePlaceId : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Destination',
  });
  return Destination;
};