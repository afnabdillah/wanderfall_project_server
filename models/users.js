'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Profile);
      Users.hasMany(models.Schedule);
      Users.hasMany(models.Review);
    }
  }
  Users.init({
    username: {
      type : DataTypes.STRING,
      allowNull:false,
      unique : {
        msg : 'This username is already taken'
      },
      validate: {
        notNull : {
          msg : 'Username cannot be null'
        },
        notEmpty : {
          msg : 'Username cannot be empty'
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull : {
          msg : 'Email cannot be null'
        },
        notEmpty : {
          msg : 'Email cannot be empty'
        },
        isEmail : {
          msg : 'Email must be in email format'
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull:false,
      validate: {
        len : {
          args : 5,
          msg : 'Minimum password length is 5'
        },
        notNull : {
          msg : 'Password cannot be null'
        },
        notEmpty : {
          msg : 'Password cannot be empty'
        }
      }
    },
    type : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  Users.beforeCreate(user => {
    user.type = 'normal';
    user.password = hashPassword(user.password);
  })
  return Users;
};