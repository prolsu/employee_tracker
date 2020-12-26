const mysql = require('mysql');
const inquirer = require('inquirer');
// const table = require('console.table');

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
        choices: ['Company Overview','Add', 'View', 'Delete', 'Update EE Roles', 'Exit'],
      },
    ]).then((chosen) => {
      // console.log(chosen);
      switch (chosen.action) {
        case 'Company Overview':
          displayCompany()
          break
        case 'Add':
          addingActions();
          break
        case 'View':
          viewActions();
          break
        case 'Delete':
          deleteActions();
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

function displayCompany() {
  connection.query(`SELECT first_name, last_name, title, salary, department_id, dept_name FROM employee
  INNER JOIN role_info ON employee.role_id = role_info.id
  INNER JOIN department ON role_info.department_id = department.id;`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("Company information is not readily available..\nPlease make the necessary entries for 'Departments', 'Employees', and 'Roles'\n");
        startEmployeeTracker();
      } else {
        console.table(res);
        startEmployeeTracker();
      }
    })
}

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

function addDepartments() {
  console.log("** Adding Departments **\n");
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What department are you adding?',
        validate: function (department) {
          const valid = department.length > 1 && isNaN(department); 
          return valid || 'Please enter a valid Department name';
        }
      },
    ]).then((chosen) => {
      // console.log(chosen);
      connection.query("INSERT INTO department SET ?", {
        dept_name: chosen.department
      },
        (err, res) => {
          if (err) throw err;
          console.log(`'${chosen.department}' Department Added\n`);
          startEmployeeTracker();
        });
    });
};

function addEmployees() {
  console.log("** Adding Employees **\n");
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: `Employee's first name: `,
        validate: function (firstName) {
          const valid = firstName.length > 2 && isNaN(firstName);
          return valid || 'Please enter a valid Employee name';
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: `Last name: `,
        validate: function (lastName) {
          const valid = lastName.length > 2 && isNaN(lastName);
          return valid || 'Please enter a valid Employee name'
        }
      },
      {
        type: 'input',
        name: 'roleId',
        message: `Please enter the employee's Role Id: `,
        validate: function (roleId) {
          const valid = roleId.length > 0;
          return valid || 'Please enter a valid Role ID'
        }
      },
      {
        type: 'input',
        name: 'mgrId',
        message: `Please enter the employee's Manager Id: `,
        validate: function (mgrId) {
          const valid = mgrId.length > 0;
          return valid || 'Please enter a valid Role ID'
        }
      }
    ]).then((employee) => {
      connection.query("INSERT INTO employee SET ?", {
        first_name: employee.firstName,
        last_name: employee.lastName,
        role_id: employee.roleId,
        manager_id: employee.mgrId
      }, (err, res) => {
        if (err) throw err;
        console.log(`'${employee.lastName}, ${employee.firstName} ' Added to 'Employees Table'\n`);
        startEmployeeTracker();
      });
    })
};

function addRoles() {
  // console.log("Adding Roles");
  console.log("** Adding Roles **\n");
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What Title are you adding?',
        validate: function (title) {
          const valid = title.length > 1 && isNaN(title); 
          return valid || 'Please enter a valid Title name';
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: `What's the starting salary for this position?`,
        validate: function (salary) {
          const valid = salary > 0 && !isNaN(salary);
          return valid || 'Please enter a valid Salary\n(Greater than 0 and only Numbers)'
        }
      },
      {
        type: 'input',
        name: 'department',
        message: `What department is this Role related to?`,
        validate: function (dept) {
          const valid = dept.length > 0 && !isNaN(dept);
          return valid || 'Please enter its corresponding Department ID'
        }
      }
    ]).then((info) => {
      // console.log(info);
      connection.query("INSERT INTO role_info SET ?", {
        title: info.title,
        salary: info.salary,
        department_id: info.department
      },
        (err, res) => {
          if (err) throw err;
          console.log(`'${info.title}' Succesfully Added\n`);
          startEmployeeTracker();
        });
    });
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

function viewDepartments() {
  connection.query(`SELECT * FROM department`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Departments to show yet..\n");
        startEmployeeTracker();
      } else {
        console.table(res);
        startEmployeeTracker();
      }
    })
};

function viewEmployees() {
  connection.query(`SELECT * FROM employee`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Employees to show yet..\n");
        startEmployeeTracker();
      } else {
        //TODO => USE JOIN TO SHOW ALL INFO RELATED TO THE EMPLOYEES
        console.table(res);
        startEmployeeTracker();
      }
    })  
};

function viewRoles() {
  // console.log("Review Roles");
  connection.query(`SELECT * FROM role_info`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Roles to show yet..\n");
        startEmployeeTracker();
      } else {
        console.table(res);
        startEmployeeTracker();
      }
    })
};

function deleteActions() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'toDelete',
        message: 'What would you like to delete?',
        choices: ['Departments', 'Employees', 'Roles', 'Restart App', 'Exit'],
      }
    ]).then((chosen) => {
      // console.log(chosen);

      switch (chosen.toDelete) {
        case 'Departments':
          deleteDepartments();
          break
        case 'Employees':
          deleteEmployees();
          break
        case 'Roles':
          deleteRoles();
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

function deleteDepartments() {
  connection.query(`SELECT * FROM department`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Departments available to delete yet..\n");
        startEmployeeTracker();
      } else {
        //TODO => USE JOIN TO SHOW ALL INFO RELATED TO THE EMPLOYEES
        console.log("** Deleting a Department **\n");
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'deptToDelete',
              message: 'What Department would you like to delete?',
              // validate: function() {

              //   return
              // }
            }
          ]).then((dept) => {
            connection.query("DELETE FROM department WHERE ?", {
              dept_name: dept.deptToDelete
            },
              function (err, res) {
                if (err) throw err;
                console.log(`Succesfully deleted ${dept.deptToDelete}\n`)
                startEmployeeTracker();
              });
          });
      }
    })
};

function deleteEmployees() {
  connection.query(`SELECT * FROM employee`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Employees available to remove yet..\n");
        startEmployeeTracker();
      } else {
        console.log("** Removing an Employee **\n");
        console.table(res);
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'employeeId',
              message: 'Which Employee would you like to remove?\n(Please enter Employee ID): ',
              validate: function (id) {
                for(let i = 0; i < res.length; i++){
                  const valid = id > 0 && !isNaN(id) && id == res[i].id;
                  return valid || 'Please enter a valid Employee ID'
                }
              }
            }
          ]).then((eeId) => {
            connection.query("DELETE FROM employee WHERE ?", {
              id: eeId.employeeId
            },
              function (err, res) {
                if (err) throw err;
                console.log(`Succesfully removed Employee with ID: '${eeId.employeeId}'\n`)
                startEmployeeTracker();
              });
          });
      }
    });
};  

function deleteRoles() {
  // console.log("Delete ROLES")
  connection.query(`SELECT * FROM role_info`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Roles available to delete yet..\n");
        startEmployeeTracker();
      } else {
        console.log("** Deleting a Role **\n");
        console.table(res);
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'roleId',
              message: 'Which Role would you like to delete?\n(Please enter Role ID): ',
              validate: function (id) {
                for(let i = 0; i < res.length; i++){
                  const valid = id > 0 && !isNaN(id) && id == res[i].id;
                  return valid || 'Please enter a valid Role ID'
                }
              }
            }
          ]).then((role) => {
            connection.query("DELETE FROM role_info WHERE ?", {
              id: role.roleId
            },
              function (err, res) {
                if (err) throw err;
                console.log(`Succesfully removed Role with ID: '${role.roleId}'\n`)
                startEmployeeTracker();
              });
          });
      }
    });
};

function updateRoles() {
  console.log("Update Roles");
};

function exitApplication() {
  console.log(`Thanks for visiting the 'Employee Tracker App'`);
  connection.end();
};

startEmployeeTracker();