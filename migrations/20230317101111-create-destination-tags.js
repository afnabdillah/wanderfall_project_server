'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DestinationTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DestinationId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Destinations',
          key:'id'
        }
      },
      TagId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Tags',
          key:'id'
        }
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
    await queryInterface.dropTable('DestinationTags');
  }
};