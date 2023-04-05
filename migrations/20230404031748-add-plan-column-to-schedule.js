'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Schedules', 'plan', {
      type: Sequelize.TEXT,
      allowNull : false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Schedules', 'plan', {});
  }
};
