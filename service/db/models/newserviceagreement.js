'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewServiceAgreement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  NewServiceAgreement.init({
    keyHash: DataTypes.STRING,
    fee: DataTypes.BIGINT,
    providerAddress: DataTypes.STRING,
    publicKey: DataTypes.STRING,
    blockNumber: DataTypes.INTEGER,
    blockHash: DataTypes.STRING,
    txHash: DataTypes.STRING,
    txIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'NewServiceAgreement',
  });
  return NewServiceAgreement;
};