'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "ChangeFees", deps: []
 * createTable "ChangeGranularFees", deps: []
 * createTable "NewServiceAgreements", deps: []
 * createTable "RandomnessRequests", deps: []
 * createTable "RandomnessRequestFulfilleds", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "mega-migrations",
    "created": "2021-06-01T05:10:11.173Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "ChangeFees",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "keyHash": {
                        "type": Sequelize.STRING,
                        "field": "keyHash"
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
        },
        {
            fn: "createTable",
            params: [
                "ChangeGranularFees",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "keyHash": {
                        "type": Sequelize.STRING,
                        "field": "keyHash"
                    },
                    "consumer": {
                        "type": Sequelize.STRING,
                        "field": "consumer"
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
        },
        {
            fn: "createTable",
            params: [
                "NewServiceAgreements",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "keyHash": {
                        "type": Sequelize.STRING,
                        "field": "keyHash"
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
        },
        {
            fn: "createTable",
            params: [
                "RandomnessRequests",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
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
                    "requestID": {
                        "type": Sequelize.STRING,
                        "field": "requestID"
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
                "RandomnessRequestFulfilleds",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "requestID": {
                        "type": Sequelize.STRING,
                        "field": "requestID"
                    },
                    "output": {
                        "type": Sequelize.STRING,
                        "field": "output"
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
            params: ["ChangeFees", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["ChangeGranularFees", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["NewServiceAgreements", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["RandomnessRequests", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["RandomnessRequestFulfilleds", {
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
