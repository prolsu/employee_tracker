DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role_info (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,2) NULL,
    department_id INT(10) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT(10) NULL,
    manager_id INT(10) NULL,
    PRIMARY KEY (id)
);

-- SELECT * FROM department;
-- SELECT * FROM role_info;
-- SELECT * FROM employee;

-- SELECT first_name, last_name, title, salary, department_id, dept_name, manager_id FROM employee
-- INNER JOIN role_info ON employee.role_id = role_info.id
-- INNER JOIN department ON role_info.department_id = department.id;