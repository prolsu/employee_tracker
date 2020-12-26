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

-- INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Pedro", "Alburqueque", 100, 50);

-- SELECT * FROM department;
-- SELECT * FROM employee;