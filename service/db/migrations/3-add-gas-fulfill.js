'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "gasPrice" to table "RandomnessRequestFulfilleds"
 * addColumn "gasUsed" to table "RandomnessRequestFulfilleds"
 *
 **/

var info = {
    "revision": 3,
    "name": "add-gas-fulfill",
    "created": "2021-06-05T01:02:21.957Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "addColumn",
            params: [
                "RandomnessRequestFulfilleds",
                "gasPrice",
                {
                    "type": Sequelize.BIGINT,
                    "field": "gasPrice"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "RandomnessRequestFulfilleds",
                "gasUsed",
                {
                    "type": Sequelize.BIGINT,
                    "field": "gasUsed"
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "RandomnessRequestFulfilleds",
                "gasPrice",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "RandomnessRequestFulfilleds",
                "gasUsed",
                {
                    transaction: transaction
                }
            ]
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
