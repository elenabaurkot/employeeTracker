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
            console.log(res);
            console.log(queryString);
        })
    }
};


// for the add role 



//     selectWhere: function(tableInput, colToSearch, valOfCol) {
//       var queryString = "SELECT * FROM ?? WHERE ?? = ?";
//       connection.query(queryString, [tableInput, colToSearch, valOfCol], function(err, result) {
//         if (err) throw err;
//         console.table(result);
//       });
//     },
//     selectAndOrder: function(whatToSelect, table, orderCol) {
//       var queryString = "SELECT ?? FROM ?? ORDER BY ?? DESC";
//       console.log(queryString);
//       connection.query(queryString, [whatToSelect, table, orderCol], function(err, result) {
//         if (err) throw err;
//         console.table(result);
//       });
//     },
//     findWhoHasMost: function(tableOneCol, tableTwoForeignKey, tableOne, tableTwo) {
//       var queryString =
//         "SELECT ??, COUNT(??) AS count FROM ?? LEFT JOIN ?? ON ??.??= ??.id GROUP BY ?? ORDER BY count DESC LIMIT 1";
  
//       connection.query(
//         queryString,
//         [tableOneCol, tableOneCol, tableOne, tableTwo, tableTwo, tableTwoForeignKey, tableOne, tableOneCol],
//         function(err, result) {
//           if (err) throw err;
//           console.table(result);
//         }
//       );
//     }
//   };



module.exports = orm;