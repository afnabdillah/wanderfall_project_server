'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users',
          key:'id'
        }
      },
      DestinationId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Destinations',
          key:'id'
        }
      },
      scheduleDate: {
        type: Sequelize.DATE,
        allowNull:false
      },
      scheduleTime: {
        type: Sequelize.TIME,
        allowNull:false
      },
      scheduleEnd: {
        type: Sequelize.TIME,
      },
      eventId: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      isSyncWithGoogleCalendar: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Schedules');
  }
};