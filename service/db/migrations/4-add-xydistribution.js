'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "DistributeResults", deps: []
 * createTable "StartingDistributes", deps: []
 *
 **/

var info = {
    "revision": 4,
    "name": "add-xydistribution",
    "created": "2021-06-17T06:31:25.902Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "DistributeResults",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "distID": {
                        "type": Sequelize.STRING,
                        "field": "distID"
                    },
                    "beginIndex": {
                        "type": Sequelize.BIGINT,
                        "field": "beginIndex"
                    },
                    "sourceCount": {
                        "type": Sequelize.BIGINT,
                        "field": "sourceCount"
                    },
                    "destCount": {
                        "type": Sequelize.BIGINT,
                        "field": "destCount"
                    },
                    "dataType": {
                        "type": Sequelize.INTEGER,
                        "field": "dataType"
                    },
                    "requestID": {
                        "type": Sequelize.STRING,
                        "field": "requestID"
                    },
                    "sender": {
                        "type": Sequelize.STRING,
                        "field": "sender"
                    },
                    "blockNumber": {
                        "type": Sequelize.INTEGER,
                        "field": "blockNumber"
                    },
                    "blockHash": {
                        "type": Sequelize.STRING,
                        "field": "blockHash"
                    },
                    "txHash": {
                        "type": Sequelize.STRING,
                        "field": "txHash"
                    },
                    "txIndex": {
                        "type": Sequelize.INTEGER,
                        "field": "txIndex"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "StartingDistributes",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "distID": {
                        "type": Sequelize.STRING,
                        "field": "distID"
                    },
                    "ipfs": {
                        "type": Sequelize.STRING,
                        "field": "ipfs"
                    },
                    "sourceCount": {
                        "type": Sequelize.BIGINT,
                        "field": "sourceCount"
                    },
                    "destCount": {
                        "type": Sequelize.BIGINT,
                        "field": "destCount"
                    },
                    "dataType": {
                        "type": Sequelize.INTEGER,
                        "field": "dataType"
                    },
                    "requestID": {
                        "type": Sequelize.STRING,
                        "field": "requestID"
                    },
                    "keyHash": {
                        "type": Sequelize.STRING,
                        "field": "keyHash"
                    },
                    "seed": {
                        "type": Sequelize.STRING,
                        "field": "seed"
                    },
                    "sender": {
                        "type": Sequelize.STRING,
                        "field": "sender"
                    },
                    "fee": {
                        "type": Sequelize.BIGINT,
                        "field": "fee"
                    },
                    "blockNumber": {
                        "type": Sequelize.INTEGER,
                        "field": "blockNumber"
                    },
                    "blockHash": {
                        "type": Sequelize.STRING,
                        "field": "blockHash"
                    },
                    "txHash": {
                        "type": Sequelize.STRING,
                        "field": "txHash"
                    },
                    "txIndex": {
                        "type": Sequelize.INTEGER,
                        "field": "txIndex"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "dropTable",
            params: ["DistributeResults", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["StartingDistributes", {
                transaction: transaction
            }]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
