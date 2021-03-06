var connection = require("./connection.js");

var orm = {
    selectAll: function(table){
        var queryString = "SELECT * FROM ??";
        connection.query(queryString, [table], function(err, res) {
            console.table(res);
        });
    }, 
    add: function(table, col, answer){
        var queryString = "INSERT INTO ?? (??) VALUES (?)";
        connection.query(queryString, [table, col, answer.charAt(0).toUpperCase() + answer.slice(1)], function(err, res) {
            if (err) throw err; 
        })
    },
    addRoleIn: function(table, col, col1, col2, role, salary, departmentID){
        var queryString = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
        connection.query(queryString, [table, col, col1, col2, role.charAt(0).toUpperCase() + role.slice(1), salary, departmentID], function(err, res) {
            if (err) throw err; 
        })
    }
};

module.exports = orm;