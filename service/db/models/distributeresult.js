'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DistributeResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.StartingDistribute.belongsTo(DistributeResult, { targetKey: 'distID', foreignKey: 'distID' })
    }
  };
  DistributeResult.init({
    distID: DataTypes.STRING,
    beginIndex: DataTypes.BIGINT,
    sourceCount: DataTypes.BIGINT,
    destCount: DataTypes.BIGINT,
    dataType: DataTypes.INTEGER,
    requestID: DataTypes.STRING,
    sender: DataTypes.STRING,
    blockNumber: DataTypes.INTEGER,
    blockHash: DataTypes.STRING,
    txHash: DataTypes.STRING,
    txIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DistributeResult',
  });
  return DistributeResult;
};