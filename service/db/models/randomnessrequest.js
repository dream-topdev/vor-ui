'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RandomnessRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.RandomnessRequestFulfilled.belongsTo(RandomnessRequest, { targetKey: 'requestID', foreignKey: 'requestID' })
    }
  };
  RandomnessRequest.init({
    keyHash: DataTypes.STRING,
    seed: DataTypes.STRING,
    sender: DataTypes.STRING,
    fee: DataTypes.BIGINT,
    requestID: DataTypes.STRING,
    blockNumber: DataTypes.INTEGER,
    blockHash: DataTypes.STRING,
    txHash: DataTypes.STRING,
    txIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RandomnessRequest',
  });
  return RandomnessRequest;
};