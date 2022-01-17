'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StartingDistribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  StartingDistribute.init({
    distID: DataTypes.STRING,
    ipfs: DataTypes.STRING,
    sourceCount: DataTypes.BIGINT,
    destCount: DataTypes.BIGINT,
    dataType: DataTypes.INTEGER,
    requestID: DataTypes.STRING,
    keyHash: DataTypes.STRING,
    seed: DataTypes.STRING,
    sender: DataTypes.STRING,
    fee: DataTypes.BIGINT,
    blockNumber: DataTypes.INTEGER,
    blockHash: DataTypes.STRING,
    txHash: DataTypes.STRING,
    txIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StartingDistribute',
  });
  return StartingDistribute;
};