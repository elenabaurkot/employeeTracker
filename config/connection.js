var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sejc2828",
    database: "employeeTrackerDB"
  });

  connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
      }
      console.log("connected as id " + connection.threadId);
  });

module.exports = connection;