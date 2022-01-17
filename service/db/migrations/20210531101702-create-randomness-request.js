'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RandomnessRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keyHash: {
        type: Sequelize.STRING
      },
      seed: {
        type: Sequelize.STRING
      },
      sender: {
        type: Sequelize.STRING
      },
      fee: {
        type: Sequelize.BIGINT
      },
      requestID: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('RandomnessRequests');
  }
};