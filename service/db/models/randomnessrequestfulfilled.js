'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RandomnessRequestFulfilled extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.RandomnessRequest.belongsTo(RandomnessRequestFulfilled, { targetKey: 'requestID', foreignKey: 'requestID' })
    }
  };
  RandomnessRequestFulfilled.init({
    requestID: DataTypes.STRING,
    output: DataTypes.STRING,
    blockNumber: DataTypes.INTEGER,
    blockHash: DataTypes.STRING,
    txHash: DataTypes.STRING,
    txIndex: DataTypes.INTEGER,
    gasUsed: DataTypes.BIGINT,
    gasPrice: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'RandomnessRequestFulfilled',
  });
  return RandomnessRequestFulfilled;
};