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
        "View All Departments",
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

        case "View All Departments":
          viewDepartments();
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
function viewDepartments() {
  orm.selectAll("department");
  employeeTracker();
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

        connection.query(
          "SELECT id FROM employee WHERE first_name= ?",
          [first, last],
          function(err, resultManagerID) {
            if (err) throw err;
            var managerID = resultManagerID[0].id;
            console.log(managerID);

            connection.query(
              "SELECT id FROM role WHERE title= ?",
              answer.role,
              function(err, resultRoleId) {
                if (err) throw err;
                var roleID = resultRoleId[0].id;
                console.log(roleID);

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
        // need to add in department id
        connection.query(
          "SELECT id FROM department WHERE name = ?",
          answer.roleDepartmentID,
          function(err, resultDepartmentID) {
            if (err) throw err;
            var roleDepartmentID = resultDepartmentID[0].id;
            console.log(roleDepartmentID);

            orm.addRoleIn("role", "title", "salary", "department_id", answer.roleTitle, parseInt(answer.roleSalary), roleDepartmentID)
            employeeTracker();
          }
        );
      });
  });
}
