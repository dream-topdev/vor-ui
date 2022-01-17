'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChangeFees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keyHash: {
        type: Sequelize.STRING
      },
      fee: {
        type: Sequelize.BIGINT
      },
      blockNumber: {
        type: Sequelize.INTEGER
      },
      blockHash: {
        type: Sequelize.STRING
      },
      txHash: {
        type: Sequelize.STRING
      },
      txIndex: {
        type: Sequelize.INTEGER
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChangeFees');
  }
};