'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChangeGranularFee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChangeGranularFee.init({
    keyHash: DataTypes.STRING,
    consumer: DataTypes.STRING,
    fee: DataTypes.BIGINT,
    blockNumber: DataTypes.INTEGER,
    blockHash: DataTypes.STRING,
    txHash: DataTypes.STRING,
    txIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChangeGranularFee',
  });
  return ChangeGranularFee;
};