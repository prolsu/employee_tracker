const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password & database
  password: "123Pensql#!&",
  database: "employee_trackerDB"
});

console.log(`------------
Welcome to your company's employee tracker
------------`);

function startEmployeeTracker() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Add', 'View', 'Update EE Roles', 'Exit'],
      },
    ]).then((chosen) => {
      // console.log(chosen);
      switch (chosen.action) {
        case 'Add':
          addingActions();
          break
        case 'View':
          viewActions();
          break
        case 'Update EE Roles':
          updateRoles();
          break
        case 'Exit':
          exitApplication();
          break
      }
    })
};

function addingActions() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'toAdd',
        message: 'What would you like to add?',
        choices: ['Departments', 'Employees', 'Roles', 'Restart App', 'Exit'],
      }
    ]).then((chosen) => {
      // console.log(chosen);

      switch (chosen.toAdd) {
        case 'Departments':
          addDepartments();
          break
        case 'Employees':
          addEmployees();
          break
        case 'Roles':
          addRoles();
          break
        case 'Restart App':
          startEmployeeTracker();
          break
        case 'Exit':
          exitApplication();
          break
      }
    })
};

function viewActions() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'toView',
        message: 'What would you like to review?',
        choices: ['Departments', 'Employees', 'Roles', 'Restart App', 'Exit']
      }
    ]).then((chosen) => {
      //console.log(chosen);

      switch (chosen.toView) {
        case 'Departments':
          viewDepartments();
          break
        case 'Employees':
          viewEmployees();
          break
        case 'Roles':
          viewRoles();
          break
        case 'Restart App':
          startEmployeeTracker();
          break
        case 'Exit':
          exitApplication();
          break
      }
    })
};

function addDepartments() {
  console.log("Adding Departments");
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What department are you adding?',
        validate: function(department) {
          const valid = department.length != 0 && department != null;
          return valid || 'Please enter a Department name';
        }
      },
    ]).then((chosen) => {
      console.log(chosen);
      // const department = JSON.stringify(chosen.department);

      let query = connection.query("INSERT INTO department SET ?", {
        dept_name: chosen.department
      },
        (err, chosen) => {
          if (err) throw err;
          console.table(`${chosen.department} Added`);
        });
      startEmployeeTracker();
    });
};

function addEmployees() {
  console.log("Adding Employees");
};

function addRoles() {
  console.log("Adding Roles");
};

function viewDepartments() {
  let query = connection.query(`SELECT * FROM department`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startEmployeeTracker();
    })
};

function viewEmployees() {
  console.log("Review Employees");
};

function viewRoles() {
  console.log("Review Roles");
};

function updateRoles() {
  console.log("Update Roles");
}

function exitApplication() {
  console.log(`Thanks for visiting the 'Employee Tracker App'`);
  connection.end();
};
startEmployeeTracker();