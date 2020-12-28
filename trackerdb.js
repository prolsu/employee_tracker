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
        choices: ['Company Overview', 'Add', 'View', 'Delete', 'Update Info', 'Exit'],
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
        case 'Update Info':
          updateActions();
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
      if (res[0] == null || res[0] == undefined) {
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
        choices: ['Departments', 'Roles', 'Employees', 'Restart App', 'Exit'],
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
  connection.query("SELECT * FROM role_info",
    function (err, res) {
      if (err) throw err;
      if (res[0] == null) {
        console.log("Please create a Role first.")
        addRoles();
      } else {
        connection.query("SELECT * FROM employee",
          function (err, resManagers) {
            if (err) throw err;
            console.log("** Adding Employees **\n");
            
            let managers = ["0: Employee is a Manager or Manager will be added later"]
            resManagers.forEach(manager => managers.push(`${manager.id}:${manager.last_name}`))

            let roles = ["0: Role will be added later"];
            res.forEach(role => roles.push(`${role.id}:${role.title}`))

            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'roleId',
                  message: `Please select the employee's Role: `,
                  choices: roles
                },
                {
                  type: 'list',
                  name: 'mgrId',
                  message: `Please select the employee's Manager: `,
                  choices: managers
                },
                {
                  type: 'input',
                  name: 'firstName',
                  message: `Employee's first name: `,
                  validate: function (firstName) {
                    const valid = firstName.length > 1 && isNaN(firstName);
                    return valid || 'Please enter a valid Employee name';
                  }
                },
                {
                  type: 'input',
                  name: 'lastName',
                  message: `Last name: `,
                  validate: function (lastName) {
                    const valid = lastName.length > 1 && isNaN(lastName);
                    return valid || 'Please enter a valid Employee name'
                  }
                }
              ]).then((employee) => {
                const roleId = employee.roleId[0];
                const mgrId = employee.mgrId[0];

                connection.query("INSERT INTO employee SET ?", {
                  first_name: employee.firstName,
                  last_name: employee.lastName,
                  role_id: roleId,
                  manager_id: mgrId
                }, (err, res) => {
                  if (err) throw err;
                  console.log(`'${employee.lastName}, ${employee.firstName} ' Added to 'Employees Table'\n`);
                  startEmployeeTracker();
                });
              })
          })
      }
    })

};

function addRoles() {
  connection.query("SELECT * FROM department",
    function (err, res) {
      if (err) throw err;
      if (res[0] == null) {
        console.log("Please create a Department first.")
        addDepartments();
      } else {
        console.log("** Adding Roles **\n");

        let departments = ["0: Department will be added later"];
        res.forEach(department => departments.push(`${department.id}:${department.dept_name}`))
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'department',
              message: `What department is this Role/Title related to?`,
              choices: departments
            },
            {
              type: 'input',
              name: 'title',
              message: 'What Role/Title are you adding?',
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
            }
          ]).then((info) => {
            const department = info.department[0];
            connection.query("INSERT INTO role_info SET ?", {
              title: info.title,
              salary: info.salary,
              department_id: department
            },
              (err, res) => {
                if (err) throw err;
                console.log(`'${info.title}' Succesfully Added\n`);
                startEmployeeTracker();
              });
          });
      };
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
        console.log("** Deleting a Department **\n");
        const departments = [];
        res.forEach(department => departments.push(`${department.id}:${department.dept_name}`));
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'deptToDelete',
              message: 'What Department would you like to delete?',
              choices: departments
            }
          ]).then((dept) => {
            connection.query("DELETE FROM department WHERE ?", {
              id: dept.deptToDelete[0]
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
        const employees = [];
        res.forEach(employee => employees.push(`${employee.id}:${employee.last_name}`));

        inquirer
          .prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Which Employee would you like to remove?',
              choices: employees
            }
          ]).then((eeId) => {
            connection.query("DELETE FROM employee WHERE ?", {
              id: eeId.employeeId[0]
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
        const availableChoices = [];
        res.forEach(role => availableChoices.push(role.id));

        inquirer
          .prompt([
            {
              type: 'list',
              name: 'roleId',
              message: 'Which Role would you like to delete?\n(Please enter Role ID): ',
              choices: availableChoices
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

function updateActions() {
  // console.log("Update Roles");
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'toUpdate',
        message: 'What would you like to update?',
        choices: ['EE Name', 'EE Role', 'Title', 'Salary', 'Department', 'Restart App']
      }
    ]).then((data) => {
      switch (data.toUpdate) {
        case 'EE Name':
          updateName();
          break
        case 'EE Role':
          updateRole();
          break
        case 'Title':
          updateTitle();
          break
        case 'Salary':
          updateSalary();
          break
        case 'Department':
          updateDepartment();
          break
        case 'Restart App':
          startEmployeeTracker();
          break
      }
    })
};

function updateName() {
  connection.query(`SELECT * FROM employee`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Employees available to update yet..\n");
        startEmployeeTracker();
      } else {
        console.table(res);
        const employees = [];
        res.forEach(employee => employees.push(`${employee.id}:${employee.last_name}`));
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Which employee are you updating?',
              choices: employees
            },
            {
              type: 'input',
              name: 'newFirstName',
              message: 'Please enter the updated first name: ',
              validate: function (name) {
                const valid = name.length > 2 && isNaN(name);
                return valid || 'Please enter a valid Name';
              }
            },
            {
              type: 'input',
              name: 'newLastName',
              message: 'Please enter the updated last name now ',
              validate: function (name) {
                const valid = name.length > 2 && isNaN(name);
                return valid || 'Please enter a valid Name';
              }
            }
          ]).then((data) => {
            connection.query("UPDATE employee SET ? WHERE ?",
              [
                {
                  first_name: data.newFirstName
                },
                {
                  id: data.employeeId[0]
                }
              ], function (err, res) {
                if (err) throw err;
              })
            connection.query("UPDATE employee SET ? WHERE ?",
              [
                {
                  last_name: data.newLastName
                },
                {
                  id: data.employeeId[0]
                }
              ], function (err, res) {
                if (err) throw err;
                console.log(`Succesfully updated data for employee '${data.newLastName}'`)
                startEmployeeTracker();
              })
          })
      }
    })
};

function updateRole() {
  connection.query(`SELECT * FROM employee`,
    (err, res) => {
      if (err) throw err;
      if (res[0] == null) {
        console.log("No Employees available to update yet..\n");
        startEmployeeTracker();
      } else {
        console.table(res);
        if (err) throw err;
        connection.query("SELECT * FROM role_info", (err, response) => {
          if (err) throw err;

          const employees = [];
          res.forEach(employee => employees.push(`${employee.id}:${employee.last_name}`));
          let roles = ["0:Role not available and will be added later"];
          response.forEach(role => roles.push(`${role.id}:${role.title}`));
          inquirer
            .prompt([
              {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee are you updating?',
                choices: employees
              },
              {
                type: 'list',
                name: 'roleId',
                message: 'Please select the new Role ID: ',
                choices: roles
              }
            ]).then((data) => {
              connection.query("UPDATE employee SET ? WHERE ?",
                [
                  {
                    role_id: data.roleId[0]
                  },
                  {
                    id: data.employeeId[0]
                  }
                ], function (err, res) {
                  if (err) throw err;
                  console.log(`Succesfully updated '${data.employeeId}'`)
                  startEmployeeTracker();
                })
            })

        })
      }
    })
}

function exitApplication() {
  console.log(`Thanks for visiting the 'Employee Tracker App'`);
  connection.end();
};

startEmployeeTracker();