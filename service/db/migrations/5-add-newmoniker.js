'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "NewMonikers", deps: []
 *
 **/

var info = {
    "revision": 5,
    "name": "add-newmoniker",
    "created": "2021-06-18T20:32:46.571Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
        fn: "createTable",
        params: [
            "NewMonikers",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "requester": {
                    "type": Sequelize.STRING,
                    "field": "requester"
                },
                "moniker": {
                    "type": Sequelize.STRING,
                    "field": "moniker"
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
    }];
};
var rollbackCommands = function(transaction) {
    return [{
        fn: "dropTable",
        params: ["NewMonikers", {
            transaction: transaction
        }]
    }];
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
