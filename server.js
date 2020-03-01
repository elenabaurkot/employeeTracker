var inquirer = require("inquirer");
var orm = require("./config/orm.js");
var connection = require("./config/connection");

employeeTracker();

function employeeTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employee Roles",
        "Add Department",
        "Add Employee",
        "Add Role",
        "Update Employee Role",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;
        
        case "View All Employees by Department":
          viewEmployeesByDepartment();
          break;

        case "View All Employee Roles":
          viewRoles();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}
// view all employees
function viewEmployees() {
  orm.selectAll("employee");
  employeeTracker();
}

// view all departments
// function viewDepartments() {
//   orm.selectAll("department");
//   employeeTracker();
// }

function viewEmployeesByDepartment() {
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
    var departmentArray = [];
    // if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      departmentArray.push(results[i].name);
    }
  inquirer
    .prompt({
      name: "departmentSelect",
      type: "list",
      message: "Select the department you would like to view the employees of",
      choices: departmentArray
    })
    .then(function(answer){
      connection.query(
        "SELECT id FROM department WHERE name= ?",
        answer.departmentSelect,
        function(err, departmentSelectID) {
          if (err) throw err;
          var departmentID = departmentSelectID[0].id;
          console.log(departmentID);

      connection.query("SELECT first_name, last_name, title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE role.department_id = ? AND department.id= ?", [departmentID, departmentID], function(err, res){
        if (err) throw err;
        console.table(res);
      });

      employeeTracker();
    })
    });
});
}

// view all employee roles
function viewRoles() {
  orm.selectAll("role");
  employeeTracker();
}

// Add Department
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What department would you like to add?"
    })
    .then(function(answer) {
      orm.add("department", "name", answer.department);
      employeeTracker();
    });
}

// Add new employee
function addEmployee() {
  // query the database for all items in the role table and make array of all roles
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;
    var roleArray = [];
    // if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      roleArray.push(results[i].title);
    }
    // query the database for all items in the employee table and make array of all managers
    var managerArray = [];
    connection.query(
      "SELECT first_name, last_name, title FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE title LIKE '%Manager%'",
      function(err, resultsManager) {
        if (err) throw err;
        for (var i = 0; i < resultsManager.length; i++) {
          managerArray.push(
            resultsManager[i].first_name + " " + resultsManager[i].last_name
          );
        }
        return managerArray;
      }
    );
    inquirer
      .prompt([
        {
          name: "first",
          type: "input",
          message: "What is the employee's first name?"
        },
        {
          name: "last",
          type: "input",
          message: "What is the employee's last name?"
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's role?",
          choices: roleArray
        },
        {
          name: "manager",
          type: "list",
          message: "Who is the employee's manager?",
          choices: managerArray
        }
      ])
      .then(function(answer) {
        var first = answer.manager.split(" ")[0];
        var last = answer.manager.split(" ")[1];

        // get employee id from first and last name
        connection.query(
          "SELECT id FROM employee WHERE first_name= ? AND last_name= ?",
          [first, last],
          function(err, resultManagerID) {
            if (err) throw err;
            var managerID = resultManagerID[0].id;
            console.log(managerID);

            // get role ID from role name
            connection.query(
              "SELECT id FROM role WHERE title= ?",
              answer.role,
              function(err, resultRoleId) {
                if (err) throw err;
                var roleID = resultRoleId[0].id;
                console.log(roleID);

                // add employee first and last name, role id and manager id to the employee table
                connection.query(
                  "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                  [answer.first, answer.last, roleID, managerID],
                  function(err, data) {
                    if (err) throw err;

                    employeeTracker();
                  }
                );
              }
            );
          }
        );
      });
  });
}

// Add Role
function addRole() {
  // query the database for all items in the department table and make array of all department names

  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
    var departmentArray = [];
    for (var i = 0; i < results.length; i++) {
      departmentArray.push(results[i].name);
    }
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What role would you like to add?"
        },
        {
          name: "roleSalary",
          type: "input",
          message: "What is the salary for this role?"
        },
        {
          name: "roleDepartmentID",
          type: "list",
          message: "What is the salary for this role?",
          choices: departmentArray
        }
      ])
      .then(function(answer) {
        // get department ID from the department name
        connection.query(
          "SELECT id FROM department WHERE name = ?",
          answer.roleDepartmentID,
          function(err, resultDepartmentID) {
            if (err) throw err;
            var roleDepartmentID = resultDepartmentID[0].id;
            console.log(roleDepartmentID);

            // Add role name, salary, and department id to role table
            orm.addRoleIn(
              "role",
              "title",
              "salary",
              "department_id",
              answer.roleTitle,
              parseInt(answer.roleSalary),
              roleDepartmentID
            );
            employeeTracker();
          }
        );
      });
  });
}

function updateEmployee() {
  connection.query("SELECT first_name, last_name FROM employee", function(
    err,
    resultsEmployees
  ) {
    if (err) throw err;
    var employeeArray = [];
    for (var i = 0; i < resultsEmployees.length; i++) {
      employeeArray.push(
        resultsEmployees[i].first_name + " " + resultsEmployees[i].last_name
      );
    }
    // query the database for all items in the role table and make array of all roles
    var roleArray = [];
    connection.query("SELECT * FROM role", function(err, results) {
      if (err) throw err;
      // if (err) throw err;
      for (var i = 0; i < results.length; i++) {
        roleArray.push(results[i].title);
      }
      return roleArray;
    });
    inquirer
      .prompt([
        {
          name: "employeeUpdate",
          type: "list",
          message: "Which employee would you like to update?",
          choices: employeeArray
        },
        {
          name: "roleUpdate",
          type: "list",
          message: "What would you like to update their role to?",
          choices: roleArray
        }
      ])
      .then(function(answer) {
        // break up employee name into first and last 
        var first = answer.employeeUpdate.split(" ")[0];
        var last = answer.employeeUpdate.split(" ")[1];
        // get selected employee's id
        connection.query(
          "SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
          [first, last],
          function(err, getEmployeeID) {
            if (err) throw err;
            var employeeID = getEmployeeID[0].id;
            console.log(employeeID);
            // get id of updated role 
            connection.query(
              "SELECT id FROM role WHERE title = ?",
              answer.roleUpdate,
              function(err, getRoleID) {
                if (err) throw err;
                var roleID = getRoleID[0].id;
                console.log(roleID);
                // set employees role id equal to the id of the role where the id is equal to that employee's id
                connection.query(
                  "UPDATE employee SET role_id = ? WHERE id=?",
                  [roleID, employeeID],
                  function(err, results) {
                    if (err) throw err;
                    console.table("SELECT * FROM employee");
                  }
                );
                employeeTracker();
              }
            );
          }
        );
      });
  });
}
