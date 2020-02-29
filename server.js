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
function viewEmployees(){
    orm.selectAll('employee');
    employeeTracker();
}
// view all departments
function viewDepartments(){
  orm.selectAll('department');
  employeeTracker();
}
// view all employee roles 
function viewRoles(){
  orm.selectAll('role');
  employeeTracker();
}

function addDepartment(){
  inquirer
  .prompt({
    name: "department",
    type: "input",
    message: "What department would you like to add?"
   })
   .then(function(answer) {
      orm.add('department', 'name', answer.department);
      employeeTracker();
   });
  }


function addEmployee(){
  // query the database for all items in the role table and make array of all roles
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;
    var roleArray = [];
    if (err) throw err;
      for (var i = 0; i < results.length; i++) {
        roleArray.push(results[i].title);
      }

  // query the database for all items in the employee table and make array of all managers
  // for loop to show the managers
  // something along the lines of if role is like "%manager%" show name 
  var managerArray = [];
  connection.query("SELECT * FROM employee", function(err, resultsManager) {
      for (var i = 0; i < resultsManager.length; i++) {
        managerArray.push(resultsManager[i].first_name + ' ' + resultsManager[i].last_name);
      }
      return managerArray;
  });
  
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
  //   // orm.add('employee', 'first_name', answer.first);
  //   // // orm.add('employee', 'last_name', answer.last);
  //   // // shouldn't be answer.role, should be the id that corresponds with the role
  //   // orm.add('employee', 'role_id', answer.role);
  //   // // shouldn't be answer.role, should be the id that corresponds with the role
  //   // orm.add('employee', 'manager_id', answer.manager);
    console.log(answer.first + ' ' + answer.last);
    console.log(answer.role);
    console.log(answer.manager);

    employeeTracker();
   });
});
}