'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Destination);
      Schedule.belongsTo(models.Users);
    }
  }
  Schedule.init({
    UserId: DataTypes.INTEGER,
    DestinationId: DataTypes.INTEGER,
    scheduleDate: {
      type : DataTypes.DATE,
      allowNull:false,
      validate : {
        dateChecker(date) {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate()-1);
          if (new Date(date) < currentDate) {
            throw new Error ('Cannot set date before today')
          }
        },
        notNull : {
          msg : 'Date cannot be null'
        },
        notEmpty : {
          msg : 'Date cannot be empty'
        }
      }
    },
    scheduleTime: {
      type : DataTypes.TIME,
      allowNull:false,
      validate : {
        notNull : {
          msg : 'Time cannot be null'
        },
        notEmpty : {
          msg : 'Time cannot be empty'
        }
      }
    },
    scheduleEnd : DataTypes.TIME,
    eventId : DataTypes.STRING,
    link : DataTypes.STRING,
    isSyncWithGoogleCalendar : DataTypes.BOOLEAN,
    plan : {
      type : DataTypes.TEXT,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Plan is required'
        },
        notEmpty : {
          msg : 'Plan is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  // Schedule.beforeCreate(schedule => {
  //   schedule.scheduleDate = new Date(schedule.scheduleDate);
  // })
  return Schedule;
};